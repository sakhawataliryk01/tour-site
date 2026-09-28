import { Check, Flight } from 'lucide-react';

export default function PriceTable({ prices, singleRoomSurcharge }) {
  const eurPrices = prices.filter(p => p.currency === 'EUR' && !p.isSurcharge);
  const chfPrices = prices.filter(p => p.currency === 'CHF' && !p.isSurcharge);

  const formatPrice = (amount, currency) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderPriceSection = (list, title, currency) => {
    if (list.length === 0) return null;

    return (
      <div className="space-y-3 font-sans">
        <h4 className="font-serif text-lg font-bold text-olive border-b border-stone pb-1.5">
          Preise in {currency}
        </h4>
        <div className="space-y-2.5">
          {list.map((price) => (
            <div
              key={price.id}
              className="flex justify-between items-center bg-paper p-3.5 border border-stone-light/60 rounded-md hover:border-stone transition-all"
            >
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-ink/95 block leading-tight">
                  {price.label}
                </span>
                <span className="text-xs text-ink/50 font-medium">
                  {price.includesFlight 
                    ? `Inklusive EL-AL Linienflug ab ${price.departureAirport}`
                    : 'Landprogramm ab/bis Flughafen Tel Aviv (ohne Langstreckenflug)'}
                </span>
              </div>
              <span className="text-lg font-serif font-extrabold text-olive">
                {formatPrice(price.amount, price.currency)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderPriceSection(eurPrices, 'Preise in EUR', 'EUR')}
        {renderPriceSection(chfPrices, 'Preise in CHF', 'CHF')}
      </div>

      {/* Surcharges & Room Notes */}
      {singleRoomSurcharge && (
        <div className="bg-paper-dark p-4 rounded-md border border-stone-light/70 space-y-2 font-sans text-sm text-ink/80">
          <div className="flex justify-between items-center font-semibold text-olive border-b border-stone-light/50 pb-1.5">
            <span>Einzelzimmer-Zuschlag</span>
            <span className="font-serif font-bold">
              {singleRoomSurcharge.currency === 'EUR' ? 'EUR ' : 'CHF '}
              {Number(singleRoomSurcharge.amount)}
            </span>
          </div>
          <p className="text-xs text-ink/60 leading-relaxed font-medium">
            Unterbringung standardmässig im geteilten Doppelzimmer (Zweierbelegung). Einzelzimmer stehen nur in begrenzter Anzahl zur Verfügung. Einbettung als Einzelteilnehmer im Doppelzimmer auf Anfrage möglich.
          </p>
        </div>
      )}
    </div>
  );
}
