import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import AvailabilityBadge from './AvailabilityBadge';

export default function TourCard({ tour }) {
  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateStr));
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: tour.minPrice?.currency || 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const guideNames = tour.prices?.some(p => p.includesFlight) 
    ? 'Flug- & Rundreise' 
    : 'Landprogramm-Rundreise';

  return (
    <div className="bg-paper border border-stone-light hover:border-stone hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden flex flex-col h-full group">
      {/* Tour Image */}
      <div className="relative aspect-video bg-stone-light/50 overflow-hidden">
        {tour.heroMedia?.storageKey ? (
          <div className="w-full h-full relative">
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent z-10" />
            <div className="w-full h-full bg-stone-light" style={{ minHeight: '200px' }}>
              {/* Fallback layout for image visualization */}
              <div className="absolute inset-0 flex items-center justify-center text-olive text-sm font-medium z-10 bg-olive/5 text-paper">
                {tour.title}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-stone-light flex items-center justify-center text-ink/40">
            Kein Bild verfügbar
          </div>
        )}
        <div className="absolute top-4 left-4 z-20">
          <AvailabilityBadge state={tour.availabilityState} />
        </div>
        <div className="absolute bottom-4 right-4 z-20 bg-paper/90 backdrop-blur-sm border border-stone-light text-olive text-xs px-2 py-1 rounded font-semibold">
          {tour.category === 'YOUTH' ? 'Jugendreise (18-35)' : 'Rundreise'}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Dates & Duration */}
          <div className="flex items-center gap-4 text-xs text-ink/60 font-sans font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-olive/70" />
              {formatDate(tour.startDate)} – {formatDate(tour.endDate)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-olive/70" />
              {tour.durationDays} Tage
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-xl font-bold text-olive group-hover:text-terracotta transition-colors duration-200">
            <Link href={`/reisen/${tour.slug}`}>
              {tour.title}
            </Link>
          </h3>
          <p className="text-xs text-ink/50 font-sans italic font-medium">{tour.subtitle}</p>

          {/* Excerpt */}
          <p className="text-sm text-ink/80 font-sans leading-relaxed line-clamp-2 pt-1">
            {tour.excerpt}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="border-t border-stone-light/50 pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-wider uppercase text-ink/40 font-semibold font-sans">Ab</span>
            <span className="text-lg font-serif font-bold text-olive">
              {tour.minPrice ? formatPrice(tour.minPrice.amount) : 'Auf Anfrage'}
            </span>
          </div>

          <Link href={`/reisen/${tour.slug}`} className="btn-outline py-2 px-4 text-xs font-semibold">
            Details ansehen
          </Link>
        </div>
      </div>
    </div>
  );
}
