import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { fulfillPaidCheckoutSession } from "@/lib/stripe-fulfillment";

export const runtime = "nodejs";

export async function POST(req) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || webhookSecret.includes("REPLACE_ME")) {
    console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET missing");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] Signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.payment_status === "paid" || session.status === "complete") {
          await fulfillPaidCheckoutSession(session);
        }
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        await fulfillPaidCheckoutSession(event.data.object);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe webhook] Handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
