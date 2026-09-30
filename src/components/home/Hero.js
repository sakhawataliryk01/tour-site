import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/lib/site';

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[78vh] flex items-center justify-center overflow-hidden border-b border-stone-light">
      {/* Full-bleed hero: replace public/hero.svg with public/hero.jpg (1920×1080) when ready */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.svg')" }}
        role="img"
        aria-label="Landschaft im Heiligen Land"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-olive/55 via-olive/45 to-olive/70" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-8 py-20 md:py-28">
        <Image
          src={site.logos.dark}
          alt={site.name}
          width={280}
          height={128}
          className="h-20 sm:h-24 w-auto drop-shadow-md"
          priority
        />

        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-paper leading-[1.1] tracking-tight">
            Bibel – Land – Volk
          </h1>
          <p className="text-xl sm:text-2xl font-serif text-paper/90 font-medium italic">
            Mit {site.name} Israel erleben: einmalig und unvergesslich.
          </p>
        </div>

        <p className="max-w-2xl text-base sm:text-lg text-paper/85 leading-relaxed font-sans font-medium">
          Unsere Israelreisen sind christlich geprägt und werden persönlich von lizenzierten Reiseleitern begleitet.
          Historische Schauplätze und archäologische Funde verbinden wir lebendig mit den Verheissungen der Bibel.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
          <Link href="/reisen" className="btn-primary px-8 py-3.5 text-base w-full sm:w-auto font-semibold shadow-md">
            Unsere Reisen ansehen
          </Link>
          <Link
            href="/reiseinformationen"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base w-full sm:w-auto font-semibold rounded-md border-2 border-paper/80 text-paper hover:bg-paper/10 transition-colors"
          >
            Wichtige Reiseinfos
          </Link>
        </div>
      </div>
    </section>
  );
}
