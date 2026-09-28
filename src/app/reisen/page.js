import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TourCard from '@/components/tours/TourCard';
import { getTours } from '@/lib/services';

export const metadata = {
  title: 'Christliche Israelreisen — Übersicht alle Saisons',
  description: 'Durchsuchen Sie alle anstehenden christlichen Israelreisen von Beth-Shalom für die Saisons 2026 und 2027. Sichern Sie sich jetzt Ihren Platz.',
};

export const dynamic = "force-dynamic";

export default async function ReisenPage() {
  const tours = await getTours();

  const toursByYear = tours.reduce((groups, tour) => {
    const year = tour.year;
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(tour);
    return groups;
  }, {});

  const years = Object.keys(toursByYear).sort();

  return (
    <>
      <Header />
      <main className="flex-grow bg-paper py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Page Heading */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h1 className="text-4xl font-serif font-bold text-olive">
              Unsere christlichen Israelreisen
            </h1>
            <p className="text-base text-ink/75 font-sans leading-relaxed">
              Seit über 50 Jahren führen wir Menschen kompetent durch das Land der Verheissung. Wählen Sie aus unseren sorgsam geplanten Saisonprogrammen.
            </p>
          </div>

          {/* Grouped Years */}
          {years.length > 0 ? (
            years.map((year) => (
              <div key={year} className="space-y-6 border-t border-stone-light/50 pt-10 first:border-0 first:pt-0">
                <div className="border-b border-stone-light pb-2">
                  <h2 className="text-2xl font-serif font-bold text-olive">Saison {year}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {toursByYear[year].map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 px-4 bg-paper-dark border border-stone-light/50 rounded-lg max-w-lg mx-auto space-y-3 font-sans">
              <p className="text-ink/60 font-medium">Derzeit stehen keine aktiven Israelreisen im System.</p>
              <p className="text-xs text-ink/40">Bitte abonnieren Sie unsere Interessenliste oder kontaktieren Sie uns direkt.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
