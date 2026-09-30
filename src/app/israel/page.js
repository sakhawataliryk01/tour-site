import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { MapPin, Landmark, Waves, Mountain } from 'lucide-react';
import { site } from '@/lib/site';

export const metadata = {
  title: 'Über Israel',
  description:
    'Einführung ins Heilige Land: Regionen, biblische Schauplätze und was Sie auf einer Israelreise mit Kaiser Tours erwartet.',
};

export default function IsraelPage() {
  return (
    <>
      <Header />
      <main className="flex-grow bg-paper">
        <section className="bg-olive text-paper py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">
              Über Israel
            </h1>
            <p className="text-base sm:text-lg text-paper-dark font-sans font-medium leading-relaxed">
              Das Land der Bibel — kompakt erklärt für Ihre Reise mit {site.name}.
            </p>
          </div>
        </section>

        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 font-sans font-medium text-ink/80 leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-olive">
              Ein Land voller Geschichte
            </h2>
            <p>
              Israel verbindet auf kleinem Raum Mittelmeer, Wüste, See Genezareth und Jerusalem.
              Viele Orte, die in der Bibel beschrieben werden, lassen sich heute besuchen —
              von Galiläa über den Jordan bis hin zum Toten Meer und der Negev-Wüste.
            </p>
            <p>
              Auf unseren Reisen erleben Sie diese Schauplätze nicht nur als Sightseeing,
              sondern im Zusammenhang mit biblischen Berichten, Archäologie und dem heutigen Leben im Land.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-paper-dark p-6 rounded-lg border border-stone-light/50 space-y-3">
              <Landmark className="w-6 h-6 text-terracotta" />
              <h3 className="font-serif font-bold text-lg text-olive">Jerusalem & Judäa</h3>
              <p className="text-sm text-ink/75 leading-relaxed font-normal">
                Tempelberg, Ölberg, Davidsstadt und die Altstadt — das geistliche und historische Zentrum vieler unserer Programme.
              </p>
            </div>
            <div className="bg-paper-dark p-6 rounded-lg border border-stone-light/50 space-y-3">
              <Waves className="w-6 h-6 text-terracotta" />
              <h3 className="font-serif font-bold text-lg text-olive">Galiläa & See Genezareth</h3>
              <p className="text-sm text-ink/75 leading-relaxed font-normal">
                Orte des Wirkens Jesu, Bootfahrten und ruhige Landschaften am See — oft der emotionale Höhepunkt einer Reise.
              </p>
            </div>
            <div className="bg-paper-dark p-6 rounded-lg border border-stone-light/50 space-y-3">
              <Mountain className="w-6 h-6 text-terracotta" />
              <h3 className="font-serif font-bold text-lg text-olive">Karmel & Küste</h3>
              <p className="text-sm text-ink/75 leading-relaxed font-normal">
                Haifa, der Karmel und die Mittelmeerküste bieten Erholung und beeindruckende Ausblicke zwischen den Programmtagen.
              </p>
            </div>
            <div className="bg-paper-dark p-6 rounded-lg border border-stone-light/50 space-y-3">
              <MapPin className="w-6 h-6 text-terracotta" />
              <h3 className="font-serif font-bold text-lg text-olive">Wüste & Totes Meer</h3>
              <p className="text-sm text-ink/75 leading-relaxed font-normal">
                Qumran, Masada und das Tote Meer zeigen die Kontraste des Landes — von Schriftrollen bis zu einzigartiger Natur.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-light flex flex-wrap gap-4">
            <Link href="/reisen" className="btn-primary py-3 px-6 text-sm font-semibold">
              Aktuelle Reisen ansehen
            </Link>
            <Link href="/reiseinformationen" className="btn-secondary py-3 px-6 text-sm font-semibold">
              Praktische Reiseinfos
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
