/**
 * Client-safe pricing helpers (no Stripe SDK).
 * Amounts mirror server Checkout line items.
 */

/** Sum major-unit total for UI (package + optional single surcharge). */
export function computeRegistrationChargeTotal({
  priceOption,
  roomType,
  allPrices = [],
}) {
  if (!priceOption) return null;
  let total = Number(priceOption.amount);
  if (roomType === "SINGLE") {
    const surcharge = allPrices.find(
      (p) =>
        p.isSurcharge &&
        p.roomType === "SINGLE" &&
        p.currency === priceOption.currency &&
        p.active !== false,
    );
    if (surcharge) total += Number(surcharge.amount);
  }
  return {
    amount: total,
    currency: priceOption.currency,
  };
}
