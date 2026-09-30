import prisma from "@/lib/prisma";
import { notifyAdminAndVisitor, registrationEmailTemplates } from "@/lib/email";

/**
 * Mark registration paid from a Stripe Checkout Session (idempotent).
 * Used by the webhook and as a fallback on the success page when webhooks
 * are delayed or not forwarded locally.
 */
export async function fulfillPaidCheckoutSession(session) {
  if (!session?.id) return { ok: false, reason: "no_session" };

  const paid =
    session.payment_status === "paid" ||
    session.status === "complete";
  if (!paid) return { ok: false, reason: "not_paid" };

  const registrationId =
    session.metadata?.registrationId || session.client_reference_id;
  const publicId = session.metadata?.publicId;

  let registration = null;
  if (registrationId) {
    registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { tour: true },
    });
  }
  if (!registration) {
    registration = await prisma.registration.findUnique({
      where: { stripeCheckoutSessionId: session.id },
      include: { tour: true },
    });
  }
  if (!registration && publicId) {
    registration = await prisma.registration.findUnique({
      where: { publicId },
      include: { tour: true },
    });
  }

  if (!registration) {
    console.error("[stripe fulfill] Registration not found for session", session.id);
    return { ok: false, reason: "registration_not_found" };
  }

  if (registration.paymentStatus === "FINAL_PAID") {
    return { ok: true, alreadyPaid: true, registration };
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || null;

  const updated = await prisma.registration.update({
    where: { id: registration.id },
    data: {
      paymentStatus: "FINAL_PAID",
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
    },
    include: { tour: true },
  });

  await prisma.auditLog.create({
    data: {
      action: "UPDATE",
      entityType: "Registration",
      entityId: updated.id,
      metadata: JSON.stringify({
        publicId: updated.publicId,
        paymentStatus: "FINAL_PAID",
        stripeSessionId: session.id,
        paymentIntentId,
        source: "stripe_fulfill",
      }),
    },
  });

  const templates = registrationEmailTemplates({
    tour: updated.tour,
    registration: updated,
    publicId: updated.publicId,
  });
  await notifyAdminAndVisitor({
    ...templates,
    visitorEmail: updated.email,
    replyTo: updated.email,
  });

  return { ok: true, registration: updated };
}
