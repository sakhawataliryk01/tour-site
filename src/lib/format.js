/**
 * German-friendly money formatting (e.g. EUR 12.423).
 */
export function formatMoney(amount, currency = 'EUR') {
  if (amount == null || Number.isNaN(Number(amount))) return null;

  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}
