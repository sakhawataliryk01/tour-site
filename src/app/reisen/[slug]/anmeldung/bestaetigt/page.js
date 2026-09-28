import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getTourBySlug } from '@/lib/services';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Calendar, ArrowRight, Printer, MailOpen, FileText } from 'lucide-react';

export const dynamic = "force-dynamic";

export const metadata = {
  title: 'Anmeldung erfolgreich eingegangen — Beth-Shalom',
  description: 'Vielen Dank für Ihre Buchung! Wir haben Ihre Anmeldung erhalten.',
};

export default async function ConfirmationPage({ params, searchParams }) {
  const { slug } = await params;
  const { id: publicId } = await searchParams;

  const tour = await getTourBySlug(slug);
  if (!tour) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-grow bg-paper py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Circular Check Icon */}
          <div className="w-20 h-20 bg-olive/10 border border-olive/30 text-olive rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse">
            <CheckCircle className="w-10 h-10" />
          </div>

          {/* Core confirmation banner */}
          <div className="space-y-3 font-sans font-medium text-ink/80">
            <span className="text-xs font-bold text-terracotta uppercase tracking-widest font-mono">
              Registrierung erfolgreich
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-olive leading-tight">
              Vielen Dank für Ihre Anmeldung!
            </h1>
            <p className="text-sm sm:text-base leading-relaxed">
              Wir haben Ihre Buchungsanfrage für die Israelreise <strong className="text-olive font-serif">„{tour.title}“</strong> erhalten.
            </p>
          </div>

          {/* Booking serial number panel */}
          <div className="bg-paper-dark border border-stone p-6 rounded-xl space-y-2 max-w-sm mx-auto shadow-inner">
            <span className="text-xs text-ink/50 uppercase font-sans font-semibold tracking-wide">
              Ihre persönliche Buchungsnummer:
            </span>
            <div className="text-2xl font-serif font-black text-olive tracking-widest font-mono">
              {publicId || 'BS-2026-XXXX'}
            </div>
            <p className="text-[11px] text-ink/45 font-sans font-medium">
              Bitte bewahren Sie diese Nummer für eventuelle Rückfragen an unser Büro auf.
            </p>
          </div>

          {/* Next Steps walkthrough */}
          <div className="text-left bg-paper border border-stone-light/60 p-6 rounded-lg space-y-4 font-sans text-sm text-ink/85 leading-relaxed font-medium">
            <h3 className="font-serif font-bold text-lg text-olive border-b border-stone-light/50 pb-2 flex items-center gap-2">
              <MailOpen className="w-5 h-5 text-terracotta" /> Wie geht es nun weiter?
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-2.5 items-start">
                <span className="text-olive font-extrabold flex-shrink-0">1.</span>
                <span>
                  <strong>E-Mail-Eingangsbestätigung:</strong> Wir senden Ihnen in Kürze eine automatische Eingangsbestätigung per E-Mail mit den zusammengefassten Anmeldedaten.
                </span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="text-olive font-extrabold flex-shrink-0">2.</span>
                <span>
                  <strong>Prüfung & Reisebestätigung:</strong> Unser Team prüft Ihre Unterkunftsbelegung und Flugseats. Sie erhalten Ihre offizielle <strong>Reisebestätigung / Rechnung</strong> innert weniger Arbeitstage per Post oder E-Mail.
                </span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="text-olive font-extrabold flex-shrink-0">3.</span>
                <span>
                  <strong>Anzahlung & Restzahlung:</strong> Eine Anzahlung wird erst fällig, sobald Sie die schriftliche Rechnung in den Händen halten. Die Restzahlung leisten Sie bequem offline bis 30 Tage vor Reiseantritt.
                </span>
              </li>
            </ul>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 font-sans text-sm font-semibold">
            <Link href="/" className="btn-primary py-3 px-6 text-center shadow-md">
              Zur Startseite zurück
            </Link>
            <Link href="/reisen" className="btn-secondary py-3 px-6 text-center flex justify-center items-center gap-1">
              Weitere Reisen entdecken <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
