"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  createRegistrationCheckoutSession,
  isStripeConfigured,
} from "@/lib/stripe";
import { headers } from "next/headers";

const registrationSchema = z.object({
  tourId: z.string().uuid("Ungültige Reise-ID."),
  priceOptionId: z.string().uuid("Bitte wählen Sie eine Preisoption."),
  salutation: z.enum(["MR", "MS"], { errorMap: () => ({ message: "Bitte wählen Sie eine Anrede." }) }),
  firstName: z.string().min(2, "Vorname ist erforderlich."),
  lastName: z.string().min(2, "Nachname ist erforderlich."),
  firstNamePassport: z.string().min(2, "Vorname laut Reisepass ist erforderlich."),
  lastNamePassport: z.string().min(2, "Nachname laut Reisepass ist erforderlich."),
  street: z.string().min(2, "Strasse und Hausnummer sind erforderlich."),
  zip: z.string().min(4, "PLZ ist erforderlich."),
  city: z.string().min(2, "Ort ist erforderlich."),
  country: z.string().min(2, "Land ist erforderlich."),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  phoneMobile: z.string().optional(),
  phonePrivate: z.string().optional(),
  passportDob: z.string().transform((val) => new Date(val)),
  passportNation: z.string().min(2, "Staatsangehörigkeit ist erforderlich."),
  passportNo: z.string().optional(),
  passportExpiry: z.string().optional().transform((val) => (val ? new Date(val) : null)),
  roomType: z.enum(["DOUBLE", "SINGLE", "SHARED_DOUBLE"], {
    errorMap: () => ({ message: "Bitte wählen Sie eine Zimmerbelegung." }),
  }),
  roommateName: z.string().optional(),
  roommateRelation: z.enum(["MARRIED", "RELATED", "FRIENDS", "ASSIGN"]).optional(),
  allergies: z.string().optional(),
  congregation: z.string().optional(),
  notes: z.string().optional(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Sie müssen den Allgemeinen Reisebedingungen zustimmen." }),
  }),
});

async function resolveOrigin() {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    const proto = h.get("x-forwarded-proto") || "http";
    if (host) return `${proto}://${host}`;
  } catch {
    /* headers() unavailable outside request */
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";
}

export async function submitRegistration(payload) {
  try {
    if (!isStripeConfigured()) {
      return {
        success: false,
        message:
          "Online-Zahlung ist noch nicht konfiguriert (Stripe-Testschlüssel fehlen). Bitte den Administrator kontaktieren.",
      };
    }

    const validated = registrationSchema.parse(payload);

    const tour = await prisma.tour.findUnique({
      where: { id: validated.tourId },
      include: { prices: true },
    });

    if (!tour) {
      return {
        success: false,
        message: "Die ausgewählte Reise wurde nicht im System gefunden.",
      };
    }

    const priceOption = tour.prices.find((p) => p.id === validated.priceOptionId);
    if (!priceOption || priceOption.isSurcharge || !priceOption.active) {
      return {
        success: false,
        message: "Die gewählte Preisoption ist ungültig.",
        errors: { priceOptionId: ["Bitte wählen Sie eine gültige Preisoption."] },
      };
    }

    const tourYear = tour.year;
    const yearCount = await prisma.registration.count({
      where: { tour: { year: tourYear } },
    });

    const nextSerial = 10001 + yearCount;
    const publicId = `KT-${tourYear}-${nextSerial}`;

    const registration = await prisma.registration.create({
      data: {
        publicId,
        tourId: validated.tourId,
        priceOptionId: validated.priceOptionId,
        salutation: validated.salutation,
        firstName: validated.firstName,
        lastName: validated.lastName,
        firstNamePassport: validated.firstNamePassport,
        lastNamePassport: validated.lastNamePassport,
        street: validated.street,
        zip: validated.zip,
        city: validated.city,
        country: validated.country,
        email: validated.email,
        phoneMobile: validated.phoneMobile || null,
        phonePrivate: validated.phonePrivate || null,
        passportDob: validated.passportDob,
        passportNation: validated.passportNation,
        passportNo: validated.passportNo || null,
        passportExpiry: validated.passportExpiry,
        roomType: validated.roomType,
        roommateName: validated.roommateName || null,
        roommateRelation: validated.roommateRelation || null,
        allergies: validated.allergies || null,
        congregation: validated.congregation || null,
        notes: validated.notes || null,
        termsAcceptedAt: new Date(),
        paymentStatus: "NONE",
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entityType: "Registration",
        entityId: registration.id,
        metadata: JSON.stringify({
          publicId,
          clientName: `${validated.firstName} ${validated.lastName}`,
        }),
      },
    });

    const origin = await resolveOrigin();
    let session;
    try {
      session = await createRegistrationCheckoutSession({
        registration,
        tour,
        priceOption,
        allPrices: tour.prices,
        origin,
      });
    } catch (stripeError) {
      console.error("Stripe Checkout session failed:", stripeError);
      return {
        success: false,
        message:
          stripeError.message ||
          "Die Zahlungssitzung konnte nicht erstellt werden. Bitte versuchen Sie es erneut.",
        publicId,
      };
    }

    await prisma.registration.update({
      where: { id: registration.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    return {
      success: true,
      publicId,
      checkoutUrl: session.url,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
      };
    }
    console.error("Error creating tour registration:", error);
    return {
      success: false,
      message:
        "Ein interner Fehler ist aufgetreten. Bitte laden Sie die Seite neu oder versuchen Sie es später noch einmal.",
    };
  }
}

/**
 * Recreate a Checkout Session for an unpaid registration (cancel / resume).
 */
export async function resumeRegistrationCheckout(publicId) {
  try {
    if (!isStripeConfigured()) {
      return {
        success: false,
        message: "Online-Zahlung ist nicht konfiguriert.",
      };
    }

    if (!publicId || typeof publicId !== "string") {
      return { success: false, message: "Ungültige Buchungsnummer." };
    }

    const registration = await prisma.registration.findUnique({
      where: { publicId },
      include: {
        tour: { include: { prices: true } },
        priceOption: true,
      },
    });

    if (!registration) {
      return { success: false, message: "Buchung nicht gefunden." };
    }

    if (registration.paymentStatus === "FINAL_PAID") {
      return {
        success: false,
        message: "Diese Buchung ist bereits bezahlt.",
        alreadyPaid: true,
        slug: registration.tour.slug,
      };
    }

    const origin = await resolveOrigin();
    const session = await createRegistrationCheckoutSession({
      registration,
      tour: registration.tour,
      priceOption: registration.priceOption,
      allPrices: registration.tour.prices,
      origin,
    });

    await prisma.registration.update({
      where: { id: registration.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    return {
      success: true,
      checkoutUrl: session.url,
      publicId: registration.publicId,
    };
  } catch (error) {
    console.error("resumeRegistrationCheckout failed:", error);
    return {
      success: false,
      message: error.message || "Zahlung konnte nicht fortgesetzt werden.",
    };
  }
}
