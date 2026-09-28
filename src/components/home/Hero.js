import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-paper-dark border-b border-stone-light overflow-hidden py-20 md:py-28">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#3c4a3e_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-8">
        {/* Subtle Badge Lockup */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-olive/5 border border-olive/10 rounded-full text-xs text-olive font-semibold tracking-widest uppercase font-sans">
          <span>Christliche Israelreisen</span>
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
          <span>Seit 1970</span>
        </div>

        {/* Hero Headings */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-olive leading-[1.1] tracking-tight">
            Bibel – Land – Volk
          </h1>
          <p className="text-xl sm:text-2xl font-serif text-terracotta font-medium italic">
            Mit Beth-Shalom Israel erleben: einmalig und unvergesslich.
          </p>
        </div>

        {/* Descriptive intro paragraph */}
        <p className="max-w-2xl text-base sm:text-lg text-ink/75 leading-relaxed font-sans font-medium">
          Die von Beth-Shalom organisierten Israelreisen sind christlich geprägt und werden persönlich begleitet von unseren lizenzierten Reiseleitern Fredi Winkler oder seinem Sohn Ariel. Wir verbinden historische Ausgrabungen und archäologische Fakten lebendig mit den Verheissungen der Bibel.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-4">
          <Link href="/reisen" className="btn-secondary px-8 py-3.5 text-base w-full sm:w-auto font-semibold shadow-md">
            Unsere Reisen ansehen
          </Link>
          <Link href="/reiseinformationen" className="btn-outline px-8 py-3.5 text-base w-full sm:w-auto font-semibold">
            Wichtige Reiseinfos
          </Link>
        </div>
      </div>
    </section>
  );
}
