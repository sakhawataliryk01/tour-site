import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Seite nicht gefunden',
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-grow flex items-center justify-center py-24 px-4 bg-paper">
        <div className="max-w-lg text-center space-y-6">
          <p className="text-sm font-bold uppercase tracking-widest text-terracotta">404</p>
          <h1 className="text-4xl font-serif font-bold text-olive">Seite nicht gefunden</h1>
          <p className="text-ink/70 font-sans font-medium leading-relaxed">
            Die gewünschte Seite existiert nicht oder wurde verschoben. Nutzen Sie die Navigation
            oder kehren Sie zur Startseite zurück.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/" className="btn-primary px-6 py-3 font-semibold">
              Zur Startseite
            </Link>
            <Link href="/reisen" className="btn-secondary px-6 py-3 font-semibold">
              Alle Reisen
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
