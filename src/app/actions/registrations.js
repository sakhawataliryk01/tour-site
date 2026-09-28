"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { notifyAdminAndVisitor, registrationEmailTemplates } from "@/lib/email";

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
  passportExpiry: z.string().optional().transform((val) => val ? new Date(val) : null),
  roomType: z.enum(["DOUBLE", "SINGLE", "SHARED_DOUBLE"], { errorMap: () => ({ message: "Bitte wählen Sie eine Zimmerbelegung." }) }),
  roommateName: z.string().optional(),
  roommateRelation: z.enum(["MARRIED", "RELATED", "FRIENDS", "ASSIGN"]).optional(),
  allergies: z.string().optional(),
  congregation: z.string().optional(),
  notes: z.string().optional(),
  termsAccepted: z.literal(true, { errorMap: () => ({ message: "Sie müssen den Allgemeinen Reisebedingungen zustimmen." }) }),
});

export async function submitRegistration(payload) {
  try {
    // Standard server-side Zod validation
    const validated = registrationSchema.parse(payload);

    // 1. Fetch Tour to verify existence and get the year
    const tour = await prisma.tour.findUnique({
      where: { id: validated.tourId },
    });

    if (!tour) {
      return {
        success: false,
        message: "Die ausgewählte Reise wurde nicht im System gefunden.",
      };
    }

    // 2. Compute Unique Booking Number (publicId)
    // E.g., count current bookings in that calendar year and format as BS-YYYY-10001
    const tourYear = tour.year;
    const yearCount = await prisma.registration.count({
      where: {
        tour: {
          year: tourYear,
        },
      },
    });

    const nextSerial = 10001 + yearCount;
    const publicId = `BS-${tourYear}-${nextSerial}`;

    // 3. Save Registration in DB
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
      },
    });

    // 4. Create Administrative Audit Log
    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entityType: "Registration",
        entityId: registration.id,
        metadata: JSON.stringify({ publicId, clientName: `${validated.firstName} ${validated.lastName}` }),
      },
    });

    // 5. Resend emails (admin + visitor confirmation)
    const templates = registrationEmailTemplates({
      tour,
      registration: validated,
      publicId,
    });
    await notifyAdminAndVisitor({
      ...templates,
      visitorEmail: validated.email,
      replyTo: validated.email,
    });

    return {
      success: true,
      publicId,
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
      message: "Ein interner Datenbankfehler ist aufgetreten. Bitte laden Sie die Seite neu oder versuchen Sie es später noch einmal.",
    };
  }
}
