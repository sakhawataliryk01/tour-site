"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Bitte geben Sie Ihren vollständigen Namen ein."),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  phone: z.string().optional(),
  subject: z.string().min(3, "Bitte geben Sie einen Betreff an."),
  message: z.string().min(10, "Ihre Nachricht sollte mindestens 10 Zeichen lang sein."),
});

const groupSchema = z.object({
  name: z.string().min(2, "Bitte geben Sie Ihren Namen an."),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  phone: z.string().min(5, "Bitte geben Sie eine Telefonnummer für Rückfragen an."),
  participantsCount: z.number().int().positive("Bitte geben Sie die ungefähre Teilnehmerzahl an.").or(z.string().regex(/^\d+$/).transform(val => parseInt(val, 10))),
  message: z.string().min(10, "Bitte beschreiben Sie kurz Ihre Vorstellungen (Wunschtermin, Reisedauer, Route)."),
  tourSlug: z.string().optional(),
});

const interestSchema = z.object({
  tourId: z.string().uuid("Ungültige Reise-ID."),
  name: z.string().min(2, "Bitte geben Sie Ihren vollständigen Namen ein."),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  notes: z.string().optional(),
});

/**
 * Handle Standard Contact Inquiry Submission
 */
export async function submitContactInquiry(prevState, formData) {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    const validated = contactSchema.parse(rawData);

    const inquiry = await prisma.inquiry.create({
      data: {
        type: "CONTACT",
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        subject: validated.subject,
        message: validated.message,
      },
    });

    // Simulate developer email logging in dev
    console.log(`[EMAIL SIMULATION] Neue allgemeine Kontaktanfrage erhalten:`, inquiry);

    return {
      success: true,
      message: "Vielen Dank! Ihre Nachricht wurde erfolgreich übermittelt. Wir werden uns baldmöglichst mit Ihnen in Verbindung setzen.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
      };
    }
    console.error("Error submitting contact inquiry:", error);
    return {
      success: false,
      message: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie uns direkt per E-Mail.",
    };
  }
}

/**
 * Handle Custom Group Travel Inquiry Submission
 */
export async function submitGroupInquiry(prevState, formData) {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      participantsCount: formData.get("participantsCount"),
      message: formData.get("message"),
      tourSlug: formData.get("tourSlug") || undefined,
    };

    const validated = groupSchema.parse(rawData);

    const inquiry = await prisma.inquiry.create({
      data: {
        type: "GROUP",
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        participantsCount: validated.participantsCount,
        message: validated.message,
        tourSlug: validated.tourSlug,
        subject: "Anfrage für private Gruppenreise",
      },
    });

    console.log(`[EMAIL SIMULATION] Neue Gruppenanfrage erhalten:`, inquiry);

    return {
      success: true,
      message: "Vielen Dank! Ihre Anfrage für eine private Gruppenreise wurde registriert. Wir erstellen Ihnen gerne ein unverbindliches Angebot und rufen Sie zurück.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
      };
    }
    console.error("Error submitting group inquiry:", error);
    return {
      success: false,
      message: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal.",
    };
  }
}

/**
 * Handle Interest/Waitlist Signups (Unverbindliche Interessenliste)
 */
export async function submitInterestSignup(prevState, formData) {
  try {
    const rawData = {
      tourId: formData.get("tourId"),
      name: formData.get("name"),
      email: formData.get("email"),
      notes: formData.get("notes") || undefined,
    };

    const validated = interestSchema.parse(rawData);

    const signup = await prisma.interestSignup.create({
      data: {
        tourId: validated.tourId,
        name: validated.name,
        email: validated.email,
        notes: validated.notes,
      },
      include: {
        tour: true,
      },
    });

    console.log(`[EMAIL SIMULATION] Neue Vormerkung Interessenliste:`, signup);

    return {
      success: true,
      message: `Herzlichen Dank! Wir haben Sie erfolgreich auf der Interessenliste für „${signup.tour.title}“ vorgemerkt. Wir benachrichtigen Sie, sobald die reguläre Buchungsphase startet.`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
      };
    }
    console.error("Error submitting interest signup:", error);
    return {
      success: false,
      message: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    };
  }
}
