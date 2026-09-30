import Stripe from "stripe";

let stripeClient = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes("REPLACE_ME") || key.endsWith("...")) {
    throw new Error(
      "Stripe ist nicht konfiguriert. Bitte STRIPE_SECRET_KEY (sk_test_…) in .env setzen.",
    );
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export function isStripeConfigured() {
  const key = process.env.STRIPE_SECRET_KEY;
  return Boolean(key && !key.includes("REPLACE_ME") && !key.endsWith("..."));
}

/** Convert Decimal/number major units → Stripe smallest currency unit (cents). */
export function toStripeUnitAmount(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error("Ungültiger Preisbetrag für Stripe.");
  }
  return Math.round(n * 100);
}

/**
 * Build Checkout line_items from DB price option (+ optional single-room surcharge).
 * Amounts come only from Prisma — never from the client.
 */
export function buildRegistrationLineItems({
  tour,
  priceOption,
  roomType,
  allPrices = [],
  publicId,
}) {
  const currency = String(priceOption.currency || "EUR").toLowerCase();
  const lineItems = [
    {
      quantity: 1,
      price_data: {
        currency,
        unit_amount: toStripeUnitAmount(priceOption.amount),
        product_data: {
          name: `${tour.title} — ${priceOption.label}`.slice(0, 120),
          description: `Buchung ${publicId}`.slice(0, 500),
        },
      },
    },
  ];

  if (roomType === "SINGLE") {
    const surcharge = allPrices.find(
      (p) =>
        p.isSurcharge &&
        p.roomType === "SINGLE" &&
        p.currency === priceOption.currency &&
        p.active !== false,
    );
    if (surcharge && Number(surcharge.amount) > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: String(surcharge.currency).toLowerCase(),
          unit_amount: toStripeUnitAmount(surcharge.amount),
          product_data: {
            name: `Einzelzimmer-Zuschlag — ${tour.title}`.slice(0, 120),
            description: `Buchung ${publicId}`.slice(0, 500),
          },
        },
      });
    }
  }

  return lineItems;
}

export async function createRegistrationCheckoutSession({
  registration,
  tour,
  priceOption,
  allPrices,
  origin,
}) {
  const stripe = getStripe();
  const base = (origin || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000").replace(
    /\/$/,
    "",
  );
  const slug = tour.slug;
  const publicId = registration.publicId;

  const line_items = buildRegistrationLineItems({
    tour,
    priceOption,
    roomType: registration.roomType,
    allPrices,
    publicId,
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: registration.email,
    line_items,
    success_url: `${base}/reisen/${slug}/anmeldung/bestaetigt?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/reisen/${slug}/anmeldung/abgebrochen?id=${encodeURIComponent(publicId)}`,
    metadata: {
      registrationId: registration.id,
      publicId,
      tourId: tour.id,
    },
    client_reference_id: registration.id,
    locale: "de",
  });

  return session;
}
