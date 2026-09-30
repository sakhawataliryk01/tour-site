import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Award, Compass, Heart, Users } from 'lucide-react';
import { site } from '@/lib/site';

export const metadata = {
  title: 'Über uns',
  description: `Erfahren Sie mehr über ${site.name} und unsere christlich geprägten Israelreisen.`,
};

export default function UeberUnsPage() {
  return (
    <>
      <Header />
      <main className="flex-grow bg-paper">
        <section className="bg-olive text-paper py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-paper">
              Über {site.name}
            </h1>
            <p className="text-base sm:text-lg text-paper-dark font-sans font-medium leading-relaxed">
              Wir organisieren biblisch geprägte Israelreisen für Menschen aus dem deutschsprachigen Raum —
              mit klarer Organisation, persönlicher Begleitung und Respekt vor Land und Volk.
            </p>
          </div>
        </section>

        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 font-sans font-medium text-ink/80 leading-relaxed text-sm sm:text-base">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-olive">Unser Auftrag</h2>
            <p>
              <strong>{site.name}</strong> verbindet sorgfältige Reiseplanung mit einer geistlich offenen Atmosphäre.
              Unsere Programme führen zu zentralen biblischen Schauplätzen und lassen Raum für Andacht, Fragen und Begegnung.
            </p>
            <p>
              Ob Standard-Studienreise, Jugendgruppe oder private Gemeindereise — wir begleiten Sie von der ersten Anfrage
              bis zur Rückkehr und arbeiten mit erfahrenen Partnern vor Ort in Israel zusammen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
            <div className="bg-paper-dark p-6 rounded-lg border border-stone-light/50 space-y-3">
              <Compass className="w-6 h-6 text-terracotta" />
              <h3 className="font-serif font-bold text-lg text-olive">Geistlicher Fokus</h3>
              <p className="text-sm text-ink/75 leading-relaxed font-normal">
                Andachten vor Ort, Bibelgespräche und gemeinsame Zeiten prägen viele unserer Reisen — ohne aufdringlich zu sein.
              </p>
            </div>
            <div className="bg-paper-dark p-6 rounded-lg border border-stone-light/50 space-y-3">
              <Users className="w-6 h-6 text-terracotta" />
              <h3 className="font-serif font-bold text-lg text-olive">Authentische Begegnung</h3>
              <p className="text-sm text-ink/75 leading-relaxed font-normal">
                Wo es passt, öffnen wir den Blick für das heutige Israel: Gemeinden, Alltag und die Vielfalt des Landes.
              </p>
            </div>
            <div className="bg-paper-dark p-6 rounded-lg border border-stone-light/50 space-y-3">
              <Award className="w-6 h-6 text-terracotta" />
              <h3 className="font-serif font-bold text-lg text-olive">Kompetente Führung</h3>
              <p className="text-sm text-ink/75 leading-relaxed font-normal">
                Lizenzierte Reiseleiter kennen archäologische und geschichtliche Hintergründe und erklären sie verständlich.
              </p>
            </div>
            <div className="bg-paper-dark p-6 rounded-lg border border-stone-light/50 space-y-3">
              <Heart className="w-6 h-6 text-terracotta" />
              <h3 className="font-serif font-bold text-lg text-olive">Persönliche Betreuung</h3>
              <p className="text-sm text-ink/75 leading-relaxed font-normal">
                Kleine bis mittlere Gruppen, klare Kommunikation und ein Ansprechpartner für Ihre Fragen vor und während der Reise.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-stone-light">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-olive">Lernen Sie uns kennen</h2>
            <p>
              Auf {site.domain} finden Sie aktuelle Reiseprogramme, praktische Informationen und unser Kontaktformular.
              Wir freuen uns auf Ihre Anfrage.
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
