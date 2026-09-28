import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getTourBySlug } from '@/lib/services';
import RegistrationWizard from '@/components/forms/RegistrationWizard';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, ShieldCheck, Clock } from 'lucide-react';

export const dynamic = "force-dynamic";

export const metadata = {
  title: 'Reiseanmeldung — Beth-Shalom Israelreisen',
  description: 'Melden Sie sich jetzt online für Ihre geführte Israelreise an. Einfache, sichere on-site Buchung.',
};

export default async function TourAnmeldungPage({ params }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour || tour.availabilityState === 'CLOSED') {
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
          {/* Breadcrumb Back link */}
          <div className="flex items-center gap-2 text-xs font-sans font-semibold text-ink/50">
            <Link href={`/reisen/${tour.slug}`} className="hover:text-terracotta flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Zurück zur Reisebeschreibung
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left box: Quick Tour Facts */}
            <div className="md:col-span-4 bg-paper-dark border border-stone-light/60 p-5 rounded-xl space-y-4 font-sans text-sm text-ink/75 leading-relaxed font-medium">
              <span className="uppercase tracking-widest text-terracotta bg-olive/10 text-olive px-2 py-0.5 rounded text-[10px] font-bold inline-block">
                Online-Anmeldung
              </span>
              <h1 className="text-lg sm:text-xl font-serif font-bold text-olive leading-tight">
                {tour.title}
              </h1>
              <p className="text-xs text-ink/55">
                {tour.subtitle}
              </p>

              <div className="space-y-3 pt-3 border-t border-stone-light/50 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-terracotta flex-shrink-0" />
                  <span>
                    {formatDate(tour.startDate)} – {formatDate(tour.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-terracotta flex-shrink-0" />
                  <span>{tour.durationDays} Tage Rundreise</span>
                </div>
              </div>

              <div className="p-3 bg-paper border border-stone-light/60 text-[11px] leading-relaxed text-ink/65 rounded-md mt-4">
                <span className="font-bold text-olive block mb-0.5">Sichere Verbindung</span>
                Ihre Registrierungsdaten werden verschlüsselt übertragen und ausschliesslich für die Reiseabwicklung im Beth-Shalom Büro verarbeitet.
              </div>
            </div>

            {/* Right box: The Wizard */}
            <div className="md:col-span-8">
              <RegistrationWizard tour={tour} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
