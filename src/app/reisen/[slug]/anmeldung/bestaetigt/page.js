import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getTourBySlug } from '@/lib/services';
import prisma from '@/lib/prisma';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { fulfillPaidCheckoutSession } from '@/lib/stripe-fulfillment';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle, MailOpen, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Anmeldung & Zahlung — Kaiser Tours',
  description: 'Status Ihrer Buchung und Online-Zahlung.',
};

async function resolvePaidRegistration({ sessionId, publicId }) {
  if (sessionId && isStripeConfigured()) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      // Fallback when webhook did not run (common in local/dev): sync DB if Stripe says paid
      if (session.payment_status === 'paid' || session.status === 'complete') {
        await fulfillPaidCheckoutSession(session);
      }

      const registrationId =
        session.metadata?.registrationId || session.client_reference_id;

      let registration = null;
      if (registrationId) {
        registration = await prisma.registration.findUnique({
          where: { id: registrationId },
        });
      }
      if (!registration) {
        registration = await prisma.registration.findUnique({
          where: { stripeCheckoutSessionId: sessionId },
        });
      }

      const paid =
        session.payment_status === 'paid' ||
        registration?.paymentStatus === 'FINAL_PAID';

      return {
        registration,
        paid,
        sessionPaymentStatus: session.payment_status,
        publicId: registration?.publicId || session.metadata?.publicId || publicId,
      };
    } catch (err) {
      console.error('Checkout session retrieve failed:', err);
    }
  }

  if (publicId) {
    const registration = await prisma.registration.findUnique({
      where: { publicId },
    });
    return {
      registration,
      paid: registration?.paymentStatus === 'FINAL_PAID',
      publicId: registration?.publicId || publicId,
    };
  }

  return { registration: null, paid: false, publicId: null };
}

export default async function ConfirmationPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const sessionId = sp.session_id || null;
  const publicIdParam = sp.id || null;

  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const { registration, paid, publicId } = await resolvePaidRegistration({
    sessionId,
    publicId: publicIdParam,
  });

  const displayId = publicId || registration?.publicId || publicIdParam;

  if (!paid) {
    return (
      <>
        <Header />
        <main className="flex-grow bg-paper py-16">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="w-20 h-20 bg-terracotta/10 border border-terracotta/30 text-terracotta rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10" />
            </div>
            <div className="space-y-3 font-sans font-medium text-ink/80">
              <span className="text-xs font-bold text-terracotta uppercase tracking-widest font-mono">
                Zahlung ausstehend
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-olive leading-tight">
                Ihre Zahlung ist noch nicht abgeschlossen
              </h1>
              <p className="text-sm sm:text-base leading-relaxed">
                Für die Reise <strong className="text-olive font-serif">„{tour.title}“</strong>
                {displayId ? (
                  <>
                    {' '}
                    (Buchung <span className="font-mono font-bold">{displayId}</span>)
                  </>
                ) : null}{' '}
                liegt noch keine bestätigte Online-Zahlung vor.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2 font-sans text-sm font-semibold">
              {displayId && (
                <Link
                  href={`/reisen/${slug}/anmeldung/abgebrochen?id=${encodeURIComponent(displayId)}`}
                  className="btn-primary py-3 px-6 text-center shadow-md"
                >
                  Zahlung fortsetzen
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

  return (
    <>
      <Header />
      <main className="flex-grow bg-paper py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="w-20 h-20 bg-olive/10 border border-olive/30 text-olive rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-3 font-sans font-medium text-ink/80">
            <span className="text-xs font-bold text-terracotta uppercase tracking-widest font-mono">
              Zahlung erfolgreich
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-olive leading-tight">
              Vielen Dank für Ihre Anmeldung!
            </h1>
            <p className="text-sm sm:text-base leading-relaxed">
              Wir haben Ihre Buchung und Online-Zahlung für die Israelreise{' '}
              <strong className="text-olive font-serif">„{tour.title}“</strong> erhalten.
            </p>
          </div>

          <div className="bg-paper-dark border border-stone p-6 rounded-xl space-y-2 max-w-sm mx-auto shadow-inner">
            <span className="text-xs text-ink/50 uppercase font-sans font-semibold tracking-wide">
              Ihre persönliche Buchungsnummer:
            </span>
            <div className="text-2xl font-serif font-black text-olive tracking-widest font-mono">
              {displayId || 'KT-XXXX-XXXXX'}
            </div>
            <p className="text-[11px] text-ink/45 font-sans font-medium">
              Bitte bewahren Sie diese Nummer für eventuelle Rückfragen an unser Büro auf.
            </p>
          </div>

          <div className="text-left bg-paper border border-stone-light/60 p-6 rounded-lg space-y-4 font-sans text-sm text-ink/85 leading-relaxed font-medium">
            <h3 className="font-serif font-bold text-lg text-olive border-b border-stone-light/50 pb-2 flex items-center gap-2">
              <MailOpen className="w-5 h-5 text-terracotta" /> Wie geht es nun weiter?
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-2.5 items-start">
                <span className="text-olive font-extrabold flex-shrink-0">1.</span>
                <span>
                  <strong>E-Mail-Bestätigung:</strong> Sie erhalten eine Bestätigung mit
                  Buchungsnummer und Zahlungsquittung.
                </span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="text-olive font-extrabold flex-shrink-0">2.</span>
                <span>
                  <strong>Prüfung &amp; Reisebestätigung:</strong> Unser Team prüft Unterkunft und
                  Flugsitze und sendet Ihnen die offizielle Reisebestätigung.
                </span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="text-olive font-extrabold flex-shrink-0">3.</span>
                <span>
                  <strong>Zahlung:</strong> Der Reisepreis wurde online über Stripe erfolgreich
                  bezahlt.
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 font-sans text-sm font-semibold">
            <Link href="/" className="btn-primary py-3 px-6 text-center shadow-md">
              Zur Startseite zurück
            </Link>
            <Link
              href="/reisen"
              className="btn-secondary py-3 px-6 text-center flex justify-center items-center gap-1"
            >
              Weitere Reisen entdecken <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
