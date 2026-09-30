import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TourCard from '@/components/tours/TourCard';
import { getTours, getTourBySlug } from '@/lib/services';
import { notFound } from 'next/navigation';
import AvailabilityBadge from '@/components/tours/AvailabilityBadge';
import ItineraryTimeline from '@/components/tours/ItineraryTimeline';
import PriceTable from '@/components/tours/PriceTable';
import TourHeroImage from '@/components/tours/TourHeroImage';
import SafeHtml from '@/components/ui/SafeHtml';
import Link from 'next/link';
import { formatMoney } from '@/lib/format';
import { 
  Calendar, 
  Clock, 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Info, 
  ArrowLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  // Year dynamic view
  if (/^\d{4}$/.test(slug)) {
    return {
      title: `Israelreisen im Jahr ${slug} — Kaiser Tours`,
      description: `Entdecken Sie unsere geführten christlichen Israelreisen für die Saison ${slug}. Erleben Sie das Heilige Land in Gemeinschaft.`,
    };
  }

  // Tour detail view
  const tour = await getTourBySlug(slug);
  if (!tour) return { title: 'Reise nicht gefunden — Kaiser Tours' };

  return {
    title: `${tour.title} — Christliche Israelreise ${tour.year}`,
    description: tour.excerpt || `${tour.title}: Geführte christliche Israel-Rundreise vom ${new Date(tour.startDate).toLocaleDateString('de-DE')} bis ${new Date(tour.endDate).toLocaleDateString('de-DE')}.`,
  };
}

export default async function DynamicTourOrYearPage({ params }) {
  const { slug } = await params;

  // 1. RENDER YEAR CATALOG VIEW
  if (/^\d{4}$/.test(slug)) {
    const year = parseInt(slug, 10);
    const tours = await getTours({ year });

    return (
      <>
        <Header />
        <main className="flex-grow bg-paper py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-ink/50 font-sans font-semibold">
              <Link href="/reisen" className="hover:text-terracotta">Reisen</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-ink/80">Saison {year}</span>
            </div>

            {/* Year Heading */}
            <div className="space-y-3">
              <h1 className="text-4xl font-serif font-bold text-olive">
                Israelreisen {year}
              </h1>
              <p className="text-sm sm:text-base text-ink/70 font-sans font-medium max-w-2xl">
                Übersicht unserer geführten Studien-, Begegnungs- und Rundreisen durch das Heilige Land für die Reisesaison {year}.
              </p>
            </div>

            {tours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 bg-paper-dark border border-stone-light/50 rounded-lg max-w-lg mx-auto space-y-3 font-sans">
                <p className="text-ink/60 font-medium">Derzeit stehen keine aktiven Israelreisen für {year} im System.</p>
                <Link href="/reisen" className="text-sm font-semibold text-terracotta hover:underline">
                  Alle Saisons anzeigen
                </Link>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // 2. RENDER TOUR DETAIL VIEW
  const tour = await getTourBySlug(slug);
  if (!tour) {
    notFound();
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Find single room surcharge
  const singleRoomSurcharge = tour.prices.find(p => p.isSurcharge && p.roomType === 'SINGLE');

  // Categorize guide and companions
  const guides = tour.people.filter(p => p.roleOnTour === 'GUIDE' || p.person?.kind === 'GUIDE');
  const companions = tour.people.filter(p => p.roleOnTour === 'COMPANION' || p.person?.kind === 'COMPANION');

  // Registration CTA — never send CLOSED tours to /anmeldung (that was a 404)
  const isInterestMode =
    tour.availabilityState === 'WAITLIST' || tour.registrationMode === 'INTEREST';
  const isRegistrationClosed = tour.registrationMode === 'CLOSED';

  let actionButtonLabel = 'Online anmelden';
  let actionButtonUrl = `/reisen/${tour.slug}/anmeldung`;

  if (isInterestMode) {
    actionButtonLabel = 'Unverbindlich eintragen';
    actionButtonUrl = `/reisen/${tour.slug}/interesse`;
  } else if (isRegistrationClosed) {
    actionButtonLabel = 'Anmeldung anfragen';
    actionButtonUrl = `/kontakt?betreff=${encodeURIComponent(`Anmeldung: ${tour.title}`)}`;
  } else if (tour.availabilityState === 'SOLD_OUT') {
    actionButtonLabel = 'Auf Warteliste setzen';
    actionButtonUrl = `/reisen/${tour.slug}/anmeldung`;
  }

  return (
    <>
      <Header />
      <main className="flex-grow bg-paper pb-16">
        {/* Banner Hero — taller, lighter overlay so image stays visible */}
        <section className="relative min-h-[28rem] sm:min-h-[34rem] lg:min-h-[38rem] overflow-hidden border-b border-stone-light/10">
          {tour.heroMedia ? (
            <div className="absolute inset-0">
              <TourHeroImage
                media={tour.heroMedia}
                alt={tour.heroMedia.alt || tour.title}
                priority
                sizes="100vw"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-olive/35" />
              <div className="absolute inset-0 bg-gradient-to-t from-olive/80 via-olive/25 to-olive/10" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-olive" />
          )}

          <div className="relative z-10 text-paper py-20 sm:py-24 lg:py-28 flex items-end min-h-[28rem] sm:min-h-[34rem] lg:min-h-[38rem]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="space-y-6 max-w-4xl">
                <div className="flex flex-wrap items-center gap-3 text-xs font-sans font-semibold text-paper/80">
                  <Link href="/reisen" className="hover:text-paper flex items-center gap-1 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> Zurück zur Übersicht
                  </Link>
                  <span>•</span>
                  <span className="uppercase tracking-widest text-paper bg-paper/15 px-2 py-0.5 rounded text-[10px]">
                    {tour.category === 'YOUTH' ? 'Jugendreise' : tour.category === 'BUDGET' ? 'Budgetreise' : 'Standard-Studienreise'}
                  </span>
                </div>


                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight text-paper leading-tight drop-shadow-sm">
                    {tour.title}
                  </h1>
                  {tour.subtitle && (
                    <p className="text-lg sm:text-xl font-serif text-paper/90 font-medium">
                      {tour.subtitle}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 border-t border-paper/15">
                  <AvailabilityBadge state={tour.availabilityState} />
                  <div className="flex items-center gap-2 font-sans text-sm font-semibold text-paper">
                    <Calendar className="w-4 h-4 text-terracotta" />
                    <span>
                      {formatDate(tour.startDate)} – {formatDate(tour.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-sans text-sm font-semibold text-paper">
                    <Clock className="w-4 h-4 text-terracotta" />
                    <span>{tour.durationDays} Tage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left columns - Main Info (Overview, Itinerary, Prices, Team) */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview / Introduction */}
              <div className="bg-paper border border-stone-light/50 p-6 sm:p-8 rounded-xl space-y-4">
                <h2 className="text-2xl font-serif font-bold text-olive">Überblick der Reise</h2>
                <SafeHtml
                  html={tour.overview || tour.excerpt}
                  className="text-base text-ink/85 font-sans font-medium"
                />
                {tour.audienceNote && (
                  <div className="p-4 bg-paper-dark rounded border border-stone-light/50 flex gap-3 mt-4 text-xs sm:text-sm text-ink/75 font-sans leading-relaxed">
                    <Info className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-olive block mb-0.5">Wichtiger Zielgruppen-Hinweis:</span>
                      {tour.audienceNote}
                    </div>
                  </div>
                )}
              </div>

              {/* Daily Itinerary / Timeline Accordion */}
              <div className="space-y-6">
                <div className="border-b border-stone pb-2">
                  <h2 className="text-2xl font-serif font-bold text-olive">Tagesprogramm & Reiseroute</h2>
                </div>
                {tour.days && tour.days.length > 0 ? (
                  <ItineraryTimeline days={tour.days} />
                ) : (
                  <p className="text-sm text-ink/60 font-sans font-medium italic">Das detaillierte Tagesprogramm wird momentan überarbeitet.</p>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-6">
                <div className="border-b border-stone pb-2">
                  <h2 className="text-2xl font-serif font-bold text-olive">Preise & Buchungsoptionen</h2>
                </div>
                {tour.prices && tour.prices.length > 0 ? (
                  <PriceTable prices={tour.prices} singleRoomSurcharge={singleRoomSurcharge} />
                ) : (
                  <p className="text-sm text-ink/60 font-sans font-medium italic">Reisepreise stehen für diese Reise noch nicht endgültig fest.</p>
                )}
                {tour.flightNotes && (
                  <p className="text-xs text-ink/50 font-sans leading-relaxed font-medium mt-2">
                    * {tour.flightNotes}
                  </p>
                )}
              </div>

              {/* Inclusions & Exclusions list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                {/* Inclusions */}
                <div className="bg-paper-dark p-6 rounded-lg border border-stone-light space-y-4">
                  <h3 className="font-serif font-bold text-lg text-olive flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-olive" /> Inbegriffene Leistungen
                  </h3>
                  {tour.inclusions && tour.inclusions.length > 0 ? (
                    <ul className="space-y-2.5 text-sm text-ink/80 font-medium">
                      {tour.inclusions.map((inc) => (
                        <li key={inc.id} className="flex gap-2 items-start">
                          <span className="text-olive flex-shrink-0 mt-0.5">✓</span>
                          <span>{inc.text}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-2.5 text-sm text-ink/80 font-medium">
                      <li className="flex gap-2 items-start">
                        <span className="text-olive flex-shrink-0 mt-0.5">✓</span>
                        <span>Flug, Unterkunft, Halbpension (Frühstück & Abendessen)</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-olive flex-shrink-0 mt-0.5">✓</span>
                        <span>Alle Fahrten und Transfers im modernen, klimatisierten Reisebus</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-olive flex-shrink-0 mt-0.5">✓</span>
                        <span>Deutschsprachige, staatlich lizenzierte Führungen und Reiseleitung</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-olive flex-shrink-0 mt-0.5">✓</span>
                        <span>Sämtliche Eintrittsgelder laut Programm</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-olive flex-shrink-0 mt-0.5">✓</span>
                        <span>Trinkgelder für Guide, Busfahrer und Hotels</span>
                      </li>
                    </ul>
                  )}
                </div>

                {/* Exclusions */}
                <div className="bg-paper border border-stone-light p-6 rounded-lg space-y-4">
                  <h3 className="font-serif font-bold text-lg text-olive flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-terracotta" /> Nicht inbegriffen
                  </h3>
                  {tour.exclusions && tour.exclusions.length > 0 ? (
                    <ul className="space-y-2.5 text-sm text-ink/80 font-medium">
                      {tour.exclusions.map((exc) => (
                        <li key={exc.id} className="flex gap-2 items-start">
                          <span className="text-terracotta flex-shrink-0 mt-0.5">✗</span>
                          <span>{exc.text}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-2.5 text-sm text-ink/80 font-medium">
                      <li className="flex gap-2 items-start">
                        <span className="text-terracotta flex-shrink-0 mt-0.5">✗</span>
                        <span>Mittagessen sowie persönliche Ausgaben, Getränke</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-terracotta flex-shrink-0 mt-0.5">✗</span>
                        <span>Umfassendes Reiseversicherungspaket (Annullierung, Heilungskosten)</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-terracotta flex-shrink-0 mt-0.5">✗</span>
                        <span>Einreisegebühr (ETA-IL Registrierung, ca. USD 7,-)</span>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              {/* Bio spotlights / Team on Tour */}
              {tour.people && tour.people.length > 0 && (
                <div className="space-y-6">
                  <div className="border-b border-stone pb-2">
                    <h2 className="text-2xl font-serif font-bold text-olive">Ihre Reisebegleitung</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {tour.people.map(({ person, roleOnTour }) => (
                      <div
                        key={person.id}
                        className="bg-paper-dark p-6 rounded-xl border border-stone-light/60 flex items-start gap-4 font-sans"
                      >
                        <div className="w-14 h-14 rounded-full bg-stone flex-shrink-0 flex items-center justify-center font-serif text-lg text-paper font-bold shadow-inner">
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-serif font-bold text-olive text-base">{person.name}</h4>
                          <span className="text-xs font-bold text-terracotta uppercase font-sans tracking-wide">
                            {roleOnTour === 'GUIDE' ? 'Reiseleiter' : 'Begleiter / Seelsorger'}
                          </span>
                          <p className="text-xs text-ink/70 leading-relaxed font-medium line-clamp-3">
                            {person.bio}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Downloads — kept in main column so sticky sidebar cannot cover them */}
              {tour.documents && tour.documents.length > 0 && (
                <div className="bg-paper border border-stone-light/50 p-6 rounded-xl space-y-4">
                  <h3 className="font-serif font-bold text-lg text-olive flex items-center gap-2">
                    <FileText className="w-5 h-5 text-terracotta" /> Dokumente & Downloads
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tour.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={`/api/documents/${doc.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 border border-stone-light bg-paper-dark hover:bg-paper rounded-md text-xs font-semibold text-olive hover:text-terracotta transition-all"
                      >
                        <span className="truncate">{doc.title}</span>
                   <ExternalLink className="w-4 h-4 flex-shrink-0 text-ink/40" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Travel conditions — full width of main column, never under the sticky card */}
              <div className="bg-paper border border-stone-light/50 p-6 rounded-xl space-y-3 text-xs sm:text-sm leading-relaxed font-medium text-ink/75">
                <h4 className="font-serif font-bold text-base text-olive flex items-center gap-1.5 border-b border-stone-light/60 pb-2">
                  <ShieldCheck className="w-4 h-4 text-olive" /> Einreise & Reisebestimmungen
                </h4>
                <ul className="space-y-2.5 font-sans list-disc list-inside">
                  <li>
                    <strong>Reisepass:</strong> Für Schweizer und deutsche Staatsangehörige ist ein Reisepass erforderlich, der bei Einreise noch mindestens 6 Monate gültig sein muss.
                  </li>
                  <li>
                    <strong>ETA-IL Bewilligung:</strong> Alle visumfrei einreisenden Touristen müssen vor Abreise eine ETA-IL-Genehmigung beantragen.
                  </li>
                  <li>
                    <strong>Annullierung:</strong> Es gelten die allgemeinen Stornierungsbedingungen laut unseren{' '}
                    <Link href="/agb" className="text-terracotta hover:underline">AGB</Link>. Eine Reiseversicherung wird empfohlen.
                  </li>
                </ul>
              </div>
            </div>

            {/* Right column — sticky booking card (sticks while left column scrolls) */}
            <aside className="font-sans lg:sticky lg:top-24 lg:self-start lg:z-10">
              <div className="bg-paper-dark border border-stone p-6 rounded-xl space-y-6 shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-ink/50 uppercase tracking-wide block">Landprogramm ab</span>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-3xl font-serif font-extrabold text-olive tracking-tight">
                      {tour.minPrice
                        ? formatMoney(tour.minPrice.amount, tour.minPrice.currency)
                        : 'Auf Anfrage'}
                    </span>
                    {tour.minPrice && (
                      <span className="text-xs text-ink/60 font-medium">pro Person</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3.5">
                  <Link href={actionButtonUrl} className="btn-primary py-3 px-4 font-semibold text-center w-full block text-sm shadow-md">
                    {actionButtonLabel}
                  </Link>
                  {isRegistrationClosed && (
                    <p className="text-xs text-ink/65 text-center leading-relaxed font-medium">
                      Die Online-Anmeldung ist für diese Reise noch nicht freigeschaltet. Schreiben Sie uns — wir helfen gerne weiter.
                    </p>
                  )}
                  {isInterestMode && (
                    <p className="text-xs text-ink/65 text-center leading-relaxed font-medium">
                      Unverbindliche Vormerkung auf der Interessenliste. Wir kontaktieren Sie, sobald die Buchungsphase startet.
                    </p>
                  )}
                  {!isInterestMode && !isRegistrationClosed && tour.availabilityState === 'LIMITED' && (
                    <p className="text-xs text-terracotta text-center font-bold">
                      Achtung: Nur noch sehr wenige Plätze verfügbar!
                    </p>
                  )}
                  {!isRegistrationClosed && tour.availabilityState === 'SOLD_OUT' && (
                    <p className="text-xs text-ink/50 text-center font-medium">
                      Diese Reise ist ausgebucht. Registrierungen landen auf der Warteliste.
                    </p>
                  )}
                </div>

                <div className="border-t border-stone-light/60 pt-4 space-y-3">
                  <div className="flex justify-between text-xs font-medium border-b border-stone-light/30 pb-2">
                    <span className="text-ink/50">Dauer</span>
                    <span className="text-ink font-bold">{tour.durationDays} Tage</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium border-b border-stone-light/30 pb-2">
                    <span className="text-ink/50">Mindestteilnehmer</span>
                    <span className="text-ink font-bold">{tour.minParticipants} Personen</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium border-b border-stone-light/30 pb-2">
                    <span className="text-ink/50">Zielgrösse</span>
                    <span className="text-ink font-bold">{tour.targetGroupSize} Personen</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium pb-1">
                    <span className="text-ink/50">Reisesprache</span>
                    <span className="text-ink font-bold">Deutsch</span>
                  </div>
                </div>

                <div className="bg-paper border border-stone-light/50 p-4 rounded-md space-y-2 text-xs">
                  <span className="font-bold text-olive block">Haben Sie Fragen zur Reise?</span>
                  <p className="text-ink/75 leading-relaxed font-medium">
                    Gerne beraten wir Sie persönlich oder senden Ihnen das vollständige gedruckte Reiseprogramm zu.
                  </p>
                  <Link href="/kontakt" className="text-terracotta hover:underline font-semibold flex items-center gap-1 mt-1 font-sans">
                    Zum Kontaktformular <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
