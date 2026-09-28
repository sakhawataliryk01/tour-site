import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Award, Compass, Heart, Users } from 'lucide-react';

export const metadata = {
  title: 'Über Uns — Beth-Shalom Reisen & Mitternachtsruf',
  description: 'Erfahren Sie mehr über Beth-Shalom, unser Gästehaus in Haifa und unsere Partnerschaft mit dem Missionswerk Mitternachtsruf.',
};

export default function UeberUnsPage() {
  return (
    <>
      <Header />
      <main className="flex-grow bg-paper">
        {/* Editorial Header */}
        <section className="bg-olive text-paper py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-paper">
              Unsere Vision & Auftrag
            </h1>
            <p className="text-base sm:text-lg text-paper-dark font-sans font-medium leading-relaxed">
              Seit über 50 Jahren verbinden wir biblische Lehre mit lebendigen Erlebnissen und Begegnungen vor Ort im Heiligen Land Israel.
            </p>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 font-sans font-medium text-ink/80 leading-relaxed text-sm sm:text-base">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-olive">Die Partnerschaft hinter den Reisen</h2>
            <p>
              Die Beth-Shalom Israelreisen werden in enger Zusammenarbeit zwischen der <strong>Beth-Shalom Gästehaus-Leitung</strong> in Haifa und dem weltweiten <strong>Missionswerk Mitternachtsruf</strong> organisiert. Das Missionswerk Mitternachtsruf mit Sitz in Dübendorf (CH) und Waldachtal (DE) verkündigt seit Jahrzehnten das prophetische Wort der Bibel und pflegt eine tiefe, geistliche Verbundenheit mit dem Volk und Land Israel.
            </p>
            <p>
              Beth-Shalom – was übersetzt „Haus des Friedens“ bedeutet – wurde als Brücke des Glaubens und der Versöhnung gegründet. Unsere Reisen zeichnen sich durch ein geistliches Fundament, bibelorientierte Verkündigung und eine familiäre, seelsorgerliche Atmosphäre aus.
            </p>
          </div>

          {/* Key Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
            <div className="bg-paper-dark p-6 rounded-lg border border-stone-light/50 space-y-3">
              <Compass className="w-6 h-6 text-terracotta" />
              <h3 className="font-serif font-bold text-lg text-olive">Geistlicher Fokus</h3>
              <p className="text-sm text-ink/75 leading-relaxed font-normal">
                Andachten vor Ort, Zeiten der Anbetung, Bibelgespräche und gemeinsames Gebet prägen jede unserer Israelreisen.
              </p>
            </div>
            <div className="bg-paper-dark p-6 rounded-lg border border-stone-light/50 space-y-3">
              <Users className="w-6 h-6 text-terracotta" />
              <h3 className="font-serif font-bold text-lg text-olive">Authentische Begegnung</h3>
              <p className="text-sm text-ink/75 leading-relaxed font-normal">
                Wir besuchen Messianische Gemeinden, sprechen mit lokalen Christen und jüdischen Staatsbürgern und schätzen den tiefen Austausch.
              </p>
            </div>
            <div className="bg-paper-dark p-6 rounded-lg border border-stone-light/50 space-y-3">
              <Award className="w-6 h-6 text-terracotta" />
              <h3 className="font-serif font-bold text-lg text-olive">Kompetente Führung</h3>
              <p className="text-sm text-ink/75 leading-relaxed font-normal">
                Unsere lizenzierten Reiseleiter wohnen im Land, kennen die archäologischen Schauplätze im Detail und teilen reiches geschichtliches Hintergrundwissen.
              </p>
            </div>
            <div className="bg-paper-dark p-6 rounded-lg border border-stone-light/50 space-y-3">
              <Heart className="w-6 h-6 text-terracotta" />
              <h3 className="font-serif font-bold text-lg text-olive">Beth-Shalom Gästehaus</h3>
              <p className="text-sm text-ink/75 leading-relaxed font-normal">
                Unser weithin bekanntes Gästehaus auf dem Berg Karmel in Haifa dient seit 1970 als Oase der Ruhe und Ausgangspunkt für unvergessliche Tage.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-stone-light">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-olive">Unsere Geschichte</h2>
            <p>
              Gegründet von Dr. Wim Malgo (Gründer des Mitternachtsrufs), hat sich Beth-Shalom über Generationen hinweg zu einer festen Institution für christliche Israelreisen im deutschsprachigen Raum (Schweiz, Deutschland, Österreich) entwickelt. Fredi Winkler leitet die Reisen und die Aktivitäten im Heiligen Land bereits seit Jahrzehnten mit unermüdlichem Einsatz und visionärer Kraft. Gemeinsam mit seinem Sohn Ariel Winkler und engagierten Begleitern tragen sie diese Berufung weiter.
            </p>
            <p>
              Wir laden Sie herzlich ein, sich einer unserer Reisegruppen anzuschliessen und das Wort Gottes lebendig vor Ihren Augen entfalten zu sehen.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link href="/reisen" className="btn-primary py-3 px-6 text-sm font-semibold">
                Unsere aktuellen Reisen ansehen
              </Link>
              <Link href="/kontakt" className="btn-secondary py-3 px-6 text-sm font-semibold">
                Kontakt aufnehmen
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
