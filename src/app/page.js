import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import TourCard from '@/components/tours/TourCard';
import { getTours } from '@/lib/services';
import Link from 'next/link';
import { BookOpen, Users, HelpCircle, ArrowRight } from 'lucide-react';

export const dynamic = "force-dynamic";

export default async function Home() {
  const tours2026 = await getTours({ year: 2026 });
  const tours2027 = await getTours({ year: 2027 });

  return (
    <>
      <Header />
      <Hero />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Intro Section */}
        <section className="py-16 bg-paper">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl font-serif font-bold text-olive">
              Mit Beth-Shalom Israel erleben: einmalig und unvergesslich.
            </h2>
            <p className="text-base sm:text-lg text-ink/80 leading-relaxed font-sans font-medium">
              Die Beth-Shalom-Israelreisen werden in enger Zusammenarbeit mit der Beth-Shalom Gästehaus-Leitung in Haifa und dem Missionswerk Mitternachtsruf in der Schweiz und Deutschland organisiert. Seit 1970 stehen wir für vertrauenswürdige, fachkundige Führungen im Heiligen Land.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left">
              <div className="bg-paper-dark p-6 rounded-lg border border-stone-light/50 space-y-2">
                <BookOpen className="w-6 h-6 text-terracotta" />
                <h3 className="font-serif font-bold text-lg text-olive">Die Bibel als Guide</h3>
                <p className="text-sm text-ink/75 font-sans leading-relaxed">
                  Wir erklären geschichtliche und archäologische Schauplätze lebendig im Licht der biblischen Berichte.
                </p>
              </div>
              <div className="bg-paper-dark p-6 rounded-lg border border-stone-light/50 space-y-2">
                <Users className="w-6 h-6 text-terracotta" />
                <h3 className="font-serif font-bold text-lg text-olive">Lizenzierte Führer</h3>
                <p className="text-sm text-ink/75 font-sans leading-relaxed">
                  Fredi Winkler und sein Sohn Ariel leben in Israel und begleiten die Reisen mit authentischem Wissen vor Ort.
                </p>
              </div>
              <div className="bg-paper-dark p-6 rounded-lg border border-stone-light/50 space-y-2">
                <HelpCircle className="w-6 h-6 text-terracotta" />
                <h3 className="font-serif font-bold text-lg text-olive">Familiäre Gruppen</h3>
                <p className="text-sm text-ink/75 font-sans leading-relaxed">
                  Wir reisen in angenehmen Gruppengrössen und schaffen Raum für seelsorgliche Gemeinschaft und Andachten.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2026 Tours Section */}
        <section className="py-16 bg-paper-dark border-t border-b border-stone-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2">
              <div>
                <h2 className="text-3xl font-serif font-bold text-olive">Israelreisen 2026</h2>
                <p className="text-sm text-ink/60 font-sans font-medium">Unsere geführten Rundreisen in der aktuellen Saison</p>
              </div>
              <Link href="/reisen/2026" className="text-sm font-semibold text-terracotta hover:text-terracotta-dark flex items-center gap-1 group font-sans">
                Alle Reisen 2026 ansehen
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {tours2026.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tours2026.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            ) : (
              <p className="text-center text-ink/60 font-medium font-sans py-8 bg-paper border border-stone-light/40 rounded-lg">
                Derzeit stehen keine Reisen für 2026 zur Verfügung.
              </p>
            )}
          </div>
        </section>

        {/* 2027 Tours Section */}
        <section className="py-16 bg-paper">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2">
              <div>
                <h2 className="text-3xl font-serif font-bold text-olive">Israelreisen 2027</h2>
                <p className="text-sm text-ink/60 font-sans font-medium">Vorschau und Buchung für das kommende Jahr</p>
              </div>
              <Link href="/reisen/2027" className="text-sm font-semibold text-terracotta hover:text-terracotta-dark flex items-center gap-1 group font-sans">
                Alle Reisen 2027 ansehen
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {tours2027.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tours2027.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            ) : (
              <p className="text-center text-ink/60 font-medium font-sans py-8 bg-paper-dark border border-stone-light/40 rounded-lg">
                Derzeit stehen keine geplanten Reisen für 2027 zur Verfügung.
              </p>
            )}
          </div>
        </section>

        {/* Private Group Cta Card */}
        <section className="py-12 bg-olive text-paper-dark">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-olive-dark/40 border border-stone/10 rounded-xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 shadow-inner">
              <div className="space-y-4 max-w-2xl text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-paper">
                  Private Gruppenreisen & Gemeindefreizeiten
                </h2>
                <p className="text-sm md:text-base text-paper-dark/85 leading-relaxed font-sans">
                  Planen Sie mit Ihrer eigenen Gruppe, Gemeinde, Vereinigung oder Bibelklasse einen Erholungsaufenthalt oder eine geführte Rundreise in Israel? Unser Team stellt Ihnen gerne ein massgeschneidertes Wunschprogramm nach Ihren Vorstellungen zusammen.
                </p>
              </div>
              <Link href="/kontakt?typ=gruppe" className="btn-primary py-3.5 px-8 font-semibold w-full md:w-auto shadow-md text-center">
                Gruppe Anfragen
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
