import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getTourBySlug } from '@/lib/services';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import ResumeCheckoutButton from '@/components/forms/ResumeCheckoutButton';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Zahlung abgebrochen — Kaiser Tours',
  description: 'Die Stripe-Zahlung wurde abgebrochen.',
};

export default async function CheckoutCancelledPage({ params, searchParams }) {
  const { slug } = await params;
  const { id: publicId } = await searchParams;

  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  if (publicId) {
    const registration = await prisma.registration.findUnique({
      where: { publicId },
    });
    if (registration?.paymentStatus === 'FINAL_PAID') {
      redirect(`/reisen/${slug}/anmeldung/bestaetigt?id=${encodeURIComponent(publicId)}`);
    }
  }

  return (
    <>
      <Header />
      <main className="flex-grow bg-paper py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="w-20 h-20 bg-stone-light border border-stone text-ink/50 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10" />
          </div>

          <div className="space-y-3 font-sans font-medium text-ink/80">
            <span className="text-xs font-bold text-ink/45 uppercase tracking-widest font-mono">
              Zahlung abgebrochen
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-olive leading-tight">
              Keine Sorge — Ihre Anmeldung ist gespeichert
            </h1>
            <p className="text-sm sm:text-base leading-relaxed">
              Die Stripe-Zahlung für{' '}
              <strong className="text-olive font-serif">„{tour.title}“</strong> wurde nicht
              abgeschlossen. Ihre Daten bleiben erhalten
              {publicId ? (
                <>
                  {' '}
                  unter Buchungsnummer{' '}
                  <span className="font-mono font-bold text-olive">{publicId}</span>
                </>
              ) : null}
              . Sie können die Zahlung jederzeit fortsetzen.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 font-sans text-sm font-semibold">
            {publicId ? (
              <ResumeCheckoutButton publicId={publicId} slug={slug} />
            ) : (
              <Link href={`/reisen/${slug}/anmeldung`} className="btn-primary py-3 px-6 shadow-md">
                Erneut anmelden
              </Link>
            )}
            <Link href={`/reisen/${slug}`} className="btn-secondary py-3 px-6 text-center">
              Zurück zur Reise
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
