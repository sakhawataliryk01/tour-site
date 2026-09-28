import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getTourBySlug } from '@/lib/services';
import InterestForm from '@/components/forms/InterestForm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Unverbindliche Interessenliste — Beth-Shalom',
  description: 'Tragen Sie sich unverbindlich auf der Interessenliste ein, um benachrichtigt zu werden, sobald die Buchungsphase startet.',
};

export default async function TourInterestPage({ params }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <>
      <Header />
      <main className="flex-grow bg-paper py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Back & Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-sans font-semibold text-ink/50">
            <Link href={`/reisen/${tour.slug}`} className="hover:text-terracotta flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Zurück zur Reisebeschreibung
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Box: Tour info */}
            <div className="md:col-span-5 bg-paper-dark border border-stone-light/60 p-6 rounded-xl space-y-4 font-sans text-sm text-ink/75 leading-relaxed font-medium">
              <span className="uppercase tracking-widest text-terracotta bg-olive/10 text-olive px-2.5 py-0.5 rounded text-[10px] font-bold inline-block">
                Interessenliste
              </span>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-olive leading-tight">
                {tour.title}
              </h1>
              <p className="text-xs text-ink/60 font-medium">
                {tour.subtitle}
              </p>

              <div className="space-y-3 pt-4 border-t border-stone-light/50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-terracotta" />
                  <span>
                    {formatDate(tour.startDate)} – {formatDate(tour.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-terracotta" />
                  <span>{tour.durationDays} Tage Rundreise</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-ink/55 leading-relaxed border-t border-stone-light/50 mt-4">
                <p>
                  Diese Reise befindet sich aktuell noch in Planung. Mit Ihrem Eintrag sichern Sie sich eine unverbindliche Priorität auf der Warteliste für die begrenzte Zimmerkapazität.
                </p>
              </div>
            </div>

            {/* Right Box: Interest Form */}
            <div className="md:col-span-7">
              <InterestForm tour={tour} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
