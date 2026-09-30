"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { deleteUploadedImage, uploadTourImage } from "@/lib/uploads";
import { sanitizeRichText } from "@/lib/sanitize-html";

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Resolve a valid User.id from the current session.
 * After DB reseed / switching Neon→local, JWT may still hold an old UUID.
 */
async function resolveActorId(session) {
  const candidateId = session?.user?.id;
  const email = session?.user?.email;

  if (candidateId) {
    const byId = await prisma.user.findUnique({
      where: { id: candidateId },
      select: { id: true },
    });
    if (byId) return byId.id;
  }

  if (email) {
    const byEmail = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (byEmail) return byEmail.id;
  }

  return null;
}

async function requireActorId(session) {
  const actorId = await resolveActorId(session);
  if (!actorId) {
    return {
      ok: false,
      response: {
        success: false,
        message:
          "Ihre Sitzung ist veraltet (z. B. nach Datenbank-Wechsel). Bitte abmelden und erneut anmelden.",
      },
    };
  }
  return { ok: true, actorId };
}

function daysBetween(start, end) {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

const createTourSchema = z.object({
  title: z.string().min(3, "Titel ist erforderlich."),
  subtitle: z.string().optional(),
  year: z.coerce.number().int().min(2024).max(2040),
  startDate: z.string().min(1, "Startdatum ist erforderlich."),
  endDate: z.string().min(1, "Enddatum ist erforderlich."),
  category: z.enum(["STANDARD", "RELAXED", "BUDGET", "YOUTH", "SPECIAL", "PRIVATE"]),
  excerpt: z.string().optional(),
  overview: z.string().optional(),
  minParticipants: z.coerce.number().int().positive().default(22),
  targetGroupSize: z.coerce.number().int().positive().default(27),
  doubleRooms: z.coerce.number().int().min(0).default(15),
  singleRooms: z.coerce.number().int().min(0).default(5),
  priceLabel: z.string().min(2, "Preisbezeichnung ist erforderlich."),
  priceAmount: z.coerce.number().positive("Preis muss positiv sein."),
  priceCurrency: z.enum(["EUR", "CHF"]),
  registrationMode: z.enum(["CLOSED", "INTEREST", "OPEN", "WAITLIST"]).default("CLOSED"),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

async function persistUploadedHero({ file, alt, userId }) {
  if (!file || typeof file === "string" || file.size === 0) {
    return null;
  }

  const uploaded = await uploadTourImage(file, { alt });

  return prisma.media.create({
    data: {
      storageKey: uploaded.storageKey,
      url: uploaded.url,
      mime: uploaded.mime,
      width: uploaded.width,
      height: uploaded.height,
      alt: alt || null,
      createdById: userId || null,
    },
  });
}

/**
 * Create a new tour from admin form (optional hero image → local disk + Sharp)
 */
export async function createTour(prevState, formData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Nicht autorisiert." };
    }

    const actor = await requireActorId(session);
    if (!actor.ok) return actor.response;
    const { actorId } = actor;

    const heroFile = formData.get("heroImage");
    formData.delete("heroImage");

    const raw = Object.fromEntries(formData.entries());
    const validated = createTourSchema.parse(raw);

    const startDate = new Date(validated.startDate);
    const endDate = new Date(validated.endDate);

    if (endDate < startDate) {
      return {
        success: false,
        message: "Das Enddatum darf nicht vor dem Startdatum liegen.",
      };
    }

    const durationDays = daysBetween(startDate, endDate);
    let slug = `${slugify(validated.title)}-${validated.year}`;

    const existing = await prisma.tour.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    let heroMedia = null;
    try {
      heroMedia = await persistUploadedHero({
        file: heroFile,
        alt: validated.title,
        userId: actorId,
      });
    } catch (uploadError) {
      console.error("Hero upload failed:", uploadError);
      return {
        success: false,
        message: uploadError.message || "Bild-Upload fehlgeschlagen.",
      };
    }

    const tour = await prisma.tour.create({
      data: {
        title: validated.title,
        slug,
        subtitle: validated.subtitle || null,
        year: validated.year,
        startDate,
        endDate,
        durationDays,
        category: validated.category,
        excerpt: validated.excerpt || null,
        overview: sanitizeRichText(validated.overview),
        minParticipants: validated.minParticipants,
        targetGroupSize: validated.targetGroupSize,
        registrationMode: validated.registrationMode,
        status: validated.status,
        createdById: actorId,
        heroMediaId: heroMedia?.id || null,
        capacity: {
          create: {
            doubleRooms: validated.doubleRooms,
            singleRooms: validated.singleRooms,
          },
        },
        prices: {
          create: [
            {
              code: "LAND",
              label: validated.priceLabel,
              currency: validated.priceCurrency,
              amount: validated.priceAmount,
              includesFlight: false,
              roomType: "DOUBLE",
              sortOrder: 0,
            },
          ],
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId,
        action: "CREATE",
        entityType: "Tour",
        entityId: tour.id,
        metadata: JSON.stringify({
          slug: tour.slug,
          title: tour.title,
          heroMediaId: heroMedia?.id || null,
        }),
      },
    });

    revalidatePath("/admin/reisen");
    revalidatePath("/reisen");
    revalidatePath("/");

    return {
      success: true,
      message: `Reise „${tour.title}“ wurde als ${validated.status === "PUBLISHED" ? "veröffentlichte" : "Entwurfs"}-Tour angelegt.`,
      tourId: tour.id,
      slug: tour.slug,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
        message: "Bitte prüfen Sie die markierten Felder.",
      };
    }
    console.error("Error creating tour:", error);
    return { success: false, message: "Fehler beim Anlegen der Reise." };
  }
}

/**
 * Update core tour fields (title, dates, capacity, primary price, texts).
 */
export async function updateTour(tourId, prevState, formData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Nicht autorisiert." };
    }

    const actor = await requireActorId(session);
    if (!actor.ok) return actor.response;
    const { actorId } = actor;

    if (!tourId) {
      return { success: false, message: "Reise-ID fehlt." };
    }

    const heroFile = formData.get("heroImage");
    formData.delete("heroImage");

    const raw = Object.fromEntries(formData.entries());
    const validated = createTourSchema.parse(raw);

    const existing = await prisma.tour.findUnique({
      where: { id: tourId },
      include: {
        prices: { orderBy: { sortOrder: "asc" }, take: 1 },
        capacity: true,
      },
    });

    if (!existing) {
      return { success: false, message: "Reise nicht gefunden." };
    }

    const startDate = new Date(validated.startDate);
    const endDate = new Date(validated.endDate);

    if (endDate < startDate) {
      return {
        success: false,
        message: "Das Enddatum darf nicht vor dem Startdatum liegen.",
      };
    }

    const durationDays = daysBetween(startDate, endDate);

    let heroMediaId = existing.heroMediaId;
    if (heroFile && typeof heroFile !== "string" && heroFile.size > 0) {
      try {
        const heroMedia = await persistUploadedHero({
          file: heroFile,
          alt: validated.title,
          userId: actorId,
        });
        if (heroMedia) {
          heroMediaId = heroMedia.id;
          if (existing.heroMediaId) {
            const old = await prisma.media.findUnique({
              where: { id: existing.heroMediaId },
            });
            if (old?.storageKey) {
              await deleteUploadedImage(old.storageKey);
            }
          }
        }
      } catch (uploadError) {
        console.error("Hero upload failed:", uploadError);
        return {
          success: false,
          message: uploadError.message || "Bild-Upload fehlgeschlagen.",
        };
      }
    }

    const tour = await prisma.tour.update({
      where: { id: tourId },
      data: {
        title: validated.title,
        subtitle: validated.subtitle || null,
        year: validated.year,
        startDate,
        endDate,
        durationDays,
        category: validated.category,
        excerpt: validated.excerpt || null,
        overview: sanitizeRichText(validated.overview),
        minParticipants: validated.minParticipants,
        targetGroupSize: validated.targetGroupSize,
        registrationMode: validated.registrationMode,
        status: validated.status,
        heroMediaId,
        capacity: existing.capacity
          ? {
              update: {
                doubleRooms: validated.doubleRooms,
                singleRooms: validated.singleRooms,
              },
            }
          : {
              create: {
                doubleRooms: validated.doubleRooms,
                singleRooms: validated.singleRooms,
              },
            },
      },
    });

    if (existing.prices?.[0]) {
      await prisma.tourPriceOption.update({
        where: { id: existing.prices[0].id },
        data: {
          label: validated.priceLabel,
          amount: validated.priceAmount,
          currency: validated.priceCurrency,
        },
      });
    } else {
      await prisma.tourPriceOption.create({
        data: {
          tourId,
          code: "LAND",
          label: validated.priceLabel,
          currency: validated.priceCurrency,
          amount: validated.priceAmount,
          includesFlight: false,
          roomType: "DOUBLE",
          sortOrder: 0,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        actorId,
        action: "UPDATE",
        entityType: "Tour",
        entityId: tour.id,
        metadata: JSON.stringify({ slug: tour.slug, title: tour.title }),
      },
    });

    revalidatePath("/admin/reisen");
    revalidatePath("/reisen");
    revalidatePath(`/reisen/${tour.slug}`);
    revalidatePath("/");

    return {
      success: true,
      message: `Reise „${tour.title}“ wurde aktualisiert.`,
      tourId: tour.id,
      slug: tour.slug,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
        message: "Bitte prüfen Sie die markierten Felder.",
      };
    }
    console.error("Error updating tour:", error);
    return { success: false, message: "Fehler beim Aktualisieren der Reise." };
  }
}

/**
 * Soft-delete: archive a tour so it leaves the public catalogue.
 */
export async function archiveTour(tourId) {
  return setTourStatus(tourId, "ARCHIVED");
}

/**
 * Replace tour hero image — Sharp-optimized WebP on local disk.
 */
export async function updateTourHeroImage(tourId, formData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Nicht autorisiert." };
    }

    const actor = await requireActorId(session);
    if (!actor.ok) return actor.response;
    const { actorId } = actor;

    const file = formData.get("heroImage");
    if (!file || file.size === 0) {
      return { success: false, message: "Bitte wählen Sie ein Bild aus." };
    }

    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      include: { heroMedia: true },
    });

    if (!tour) {
      return { success: false, message: "Reise nicht gefunden." };
    }

    let newMedia;
    try {
      newMedia = await persistUploadedHero({
        file,
        alt: tour.title,
        userId: actorId,
      });
    } catch (uploadError) {
      return {
        success: false,
        message: uploadError.message || "Bild-Upload fehlgeschlagen.",
      };
    }

    const oldMedia = tour.heroMedia;

    await prisma.tour.update({
      where: { id: tourId },
      data: { heroMediaId: newMedia.id },
    });

    // Delete previous file + Media row after successful swap
    if (oldMedia) {
      await deleteUploadedImage(oldMedia.storageKey);
      try {
        await prisma.media.delete({ where: { id: oldMedia.id } });
      } catch (err) {
        // Media may still be referenced as ogMedia elsewhere — ignore FK errors
        console.warn("Could not delete old Media row:", oldMedia.id, err?.code);
      }
    }

    await prisma.auditLog.create({
      data: {
        actorId,
        action: "UPDATE_HERO",
        entityType: "Tour",
        entityId: tour.id,
        metadata: JSON.stringify({
          oldMediaId: oldMedia?.id || null,
          newMediaId: newMedia.id,
        }),
      },
    });

    revalidatePath("/admin/reisen");
    revalidatePath("/reisen");
    revalidatePath(`/reisen/${tour.slug}`);
    revalidatePath("/");

    return {
      success: true,
      message: "Titelbild aktualisiert. Das vorherige Bild wurde gelöscht.",
      url: newMedia.url,
    };
  } catch (error) {
    console.error("Error updating tour hero:", error);
    return { success: false, message: "Titelbild konnte nicht aktualisiert werden." };
  }
}

/**
 * Remove tour hero image and delete the file on disk.
 */
export async function removeTourHeroImage(tourId) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Nicht autorisiert." };
    }

    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      include: { heroMedia: true },
    });

    if (!tour?.heroMedia) {
      return { success: true, message: "Kein Titelbild vorhanden." };
    }

    const oldMedia = tour.heroMedia;

    await prisma.tour.update({
      where: { id: tourId },
      data: { heroMediaId: null },
    });

    await deleteUploadedImage(oldMedia.storageKey);
    try {
      await prisma.media.delete({ where: { id: oldMedia.id } });
    } catch {
      /* ignore FK */
    }

    revalidatePath("/admin/reisen");
    revalidatePath(`/reisen/${tour.slug}`);
    revalidatePath("/");

    return { success: true, message: "Titelbild entfernt." };
  } catch (error) {
    console.error("Error removing tour hero:", error);
    return { success: false, message: "Titelbild konnte nicht entfernt werden." };
  }
}

/**
 * Publish or unpublish a tour
 */
export async function setTourStatus(tourId, status) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Nicht autorisiert." };
    }

    if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
      return { success: false, message: "Ungültiger Status." };
    }

    const tour = await prisma.tour.update({
      where: { id: tourId },
      data: { status },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "UPDATE_STATUS",
        entityType: "Tour",
        entityId: tour.id,
        metadata: JSON.stringify({ status, slug: tour.slug }),
      },
    });

    revalidatePath("/admin/reisen");
    revalidatePath("/reisen");
    revalidatePath(`/reisen/${tour.slug}`);
    revalidatePath("/");

    return {
      success: true,
      message:
        status === "PUBLISHED"
          ? "Reise veröffentlicht."
          : status === "ARCHIVED"
            ? "Reise archiviert."
            : "Reise als Entwurf gespeichert.",
    };
  } catch (error) {
    console.error("Error updating tour status:", error);
    return { success: false, message: "Status konnte nicht geändert werden." };
  }
}

/**
 * Update Registration Status, Payment status or administrative notes
 */
export async function updateRegistration(id, data) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, message: "Nicht autorisiert." };
    }

    const { status, paymentStatus, adminNotes } = data;

    const registration = await prisma.registration.update({
      where: { id },
      data: {
        status,
        paymentStatus,
        adminNotes,
      },
    });

    // Create Admin Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "UPDATE",
        entityType: "Registration",
        entityId: id,
        metadata: JSON.stringify({ publicId: registration.publicId, status, paymentStatus }),
      },
    });

    revalidatePath("/admin/anmeldungen");
    revalidatePath(`/admin/anmeldungen/${id}`);
    return { success: true, message: "Buchung erfolgreich aktualisiert!" };
  } catch (error) {
    console.error("Error updating registration:", error);
    return { success: false, message: "Fehler beim Aktualisieren der Buchung." };
  }
}

export async function syncRegistrationPaymentFromStripe(id) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, message: "Nicht autorisiert." };
    }

    const registration = await prisma.registration.findUnique({ where: { id } });
    if (!registration) {
      return { success: false, message: "Buchung nicht gefunden." };
    }

    if (registration.paymentStatus === "FINAL_PAID") {
      return { success: true, message: "Zahlung ist bereits als bezahlt markiert.", paymentStatus: "FINAL_PAID" };
    }

    if (!registration.stripeCheckoutSessionId) {
      return {
        success: false,
        message: "Keine Stripe-Session hinterlegt — Sync nicht möglich.",
      };
    }

    const { getStripe, isStripeConfigured } = await import("@/lib/stripe");
    const { fulfillPaidCheckoutSession } = await import("@/lib/stripe-fulfillment");

    if (!isStripeConfigured()) {
      return { success: false, message: "Stripe ist nicht konfiguriert." };
    }

    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.retrieve(
      registration.stripeCheckoutSessionId,
    );

    const result = await fulfillPaidCheckoutSession(checkoutSession);
    revalidatePath("/admin/anmeldungen");
    revalidatePath(`/admin/anmeldungen/${id}`);

    if (result.ok) {
      return {
        success: true,
        message: result.alreadyPaid
          ? "Bereits bezahlt."
          : "Zahlung von Stripe übernommen — Status: Vollständig bezahlt.",
        paymentStatus: "FINAL_PAID",
      };
    }

    return {
      success: false,
      message: `Stripe meldet diese Session noch nicht als bezahlt (${checkoutSession.payment_status}).`,
      paymentStatus: registration.paymentStatus,
    };
  } catch (error) {
    console.error("syncRegistrationPaymentFromStripe failed:", error);
    return {
      success: false,
      message: error.message || "Sync mit Stripe fehlgeschlagen.",
    };
  }
}

/**
 * Toggle inquiry handled status
 */
export async function toggleInquiryHandled(id) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, message: "Nicht autorisiert." };
    }

    const current = await prisma.inquiry.findUnique({
      where: { id },
      select: { handled: true },
    });

    if (!current) {
      return { success: false, message: "Anfrage nicht gefunden." };
    }

    await prisma.inquiry.update({
      where: { id },
      data: {
        handled: !current.handled,
      },
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "TOGGLE_HANDLED",
        entityType: "Inquiry",
        entityId: id,
      },
    });

    revalidatePath("/admin/anfragen");
    return { success: true };
  } catch (error) {
    console.error("Error toggling inquiry status:", error);
    return { success: false, message: "Fehler beim Aktualisieren der Anfrage." };
  }
}

/**
 * Duplicate an existing Tour (useful for creating recurring seasonal schedules)
 */
export async function duplicateTour(tourId) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, message: "Nicht autorisiert." };
    }

    const source = await prisma.tour.findUnique({
      where: { id: tourId },
      include: {
        prices: true,
        capacity: true,
        days: true,
        inclusions: true,
        exclusions: true,
      },
    });

    if (!source) {
      return { success: false, message: "Quell-Reise nicht gefunden." };
    }

    const nextYear = source.year + 1;
    const nextSlug = `${source.slug}-duplikat-${Date.now()}`;
    const nextTitle = `${source.title} (${nextYear})`;

    // Recompute exact calendar dates for the next year (shift by 364 days to match day-of-week)
    const shiftDays = (date) => {
      const d = new Date(date);
      d.setDate(d.getDate() + 364);
      return d;
    };

    // Create deep duplicate
    const duplicated = await prisma.tour.create({
      data: {
        title: nextTitle,
        slug: nextSlug,
        subtitle: source.subtitle,
        year: nextYear,
        startDate: shiftDays(source.startDate),
        endDate: shiftDays(source.endDate),
        durationDays: source.durationDays,
        category: source.category,
        excerpt: source.excerpt,
        overview: source.overview,
        audienceNote: source.audienceNote,
        minParticipants: source.minParticipants,
        targetGroupSize: source.targetGroupSize,
        registrationMode: "CLOSED", // Starts closed/draft
        status: "DRAFT",
        createdById: session.user.id,
        capacity: source.capacity ? {
          create: {
            doubleRooms: source.capacity.doubleRooms,
            singleRooms: source.capacity.singleRooms,
          }
        } : undefined,
        prices: {
          create: source.prices.map((p) => ({
            code: `${p.code}-${Date.now()}`,
            label: p.label,
            currency: p.currency,
            amount: p.amount,
            includesFlight: p.includesFlight,
            departureAirport: p.departureAirport,
            roomType: p.roomType,
            isSurcharge: p.isSurcharge,
          }))
        },
        days: {
          create: source.days.map((d) => ({
            dayNumber: d.dayNumber,
            date: shiftDays(d.date),
            title: d.title,
            description: d.description,
            mealsBreakfast: d.mealsBreakfast,
            mealsDinner: d.mealsDinner,
            mealsLunch: d.mealsLunch,
            accommodationLabel: d.accommodationLabel,
            notes: d.notes,
          }))
        },
        inclusions: {
          create: source.inclusions.map((inc) => ({
            text: inc.text,
          }))
        },
        exclusions: {
          create: source.exclusions.map((exc) => ({
            text: exc.text,
          }))
        }
      }
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "DUPLICATE",
        entityType: "Tour",
        entityId: duplicated.id,
        metadata: JSON.stringify({ originalSlug: source.slug, newSlug: duplicated.slug }),
      },
    });

    revalidatePath("/admin/reisen");
    return { success: true, message: `Reise erfolgreich dupliziert als „${duplicated.title}“!` };
  } catch (error) {
    console.error("Error duplicating tour:", error);
    return { success: false, message: "Kritischer Fehler beim Duplizieren der Reise." };
  }
}
