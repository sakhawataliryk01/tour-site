import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { 
  ShieldCheck, 
  MapPin, 
  Sun, 
  DollarSign, 
  HeartPulse, 
  FileText,
  ChevronRight,
  Info
} from 'lucide-react';

export const metadata = {
  title: 'Reiseinformationen & Vorbereitung — Israel',
  description: 'Wichtige Hinweise zur Einreise, Sicherheit, Bekleidung, Währung und Gesundheit für Ihre anstehende Israelreise mit Beth-Shalom.',
};

export default function ReiseinformationenPage() {
  return (
    <>
      <Header />
      <main className="flex-grow bg-paper py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-serif font-bold text-olive">
              Reiseinformationen & Hinweise
            </h1>
            <p className="text-base text-ink/75 font-sans leading-relaxed font-medium">
              Eine gute Vorbereitung trägt wesentlich zu einer gesegneten und entspannten Reise bei. Hier finden Sie die wichtigsten praktischen Hinweise für Ihren Aufenthalt im Heiligen Land.
            </p>
          </div>

          {/* Quick Notice Alert */}
          <div className="bg-paper-dark border border-stone p-5 rounded-lg flex gap-4 text-sm text-ink/80 font-sans leading-relaxed">
            <Info className="w-6 h-6 text-terracotta flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-olive block text-base">Neu ab 2026: ETA-IL Einreisegenehmigung</span>
              <p className="font-medium">
                Sämtliche ausländische Touristen (einschliesslich Schweizer, deutsche und österreichische Staatsbürger), die visumfrei nach Israel einreisen dürfen, müssen zwingend vor Abflug eine elektronische Einreisegenehmigung (<strong>ETA-IL</strong>) einholen. Diese ist 2 Jahre gültig und kostet derzeit ca. 25 ILS (ca. 7 CHF / EUR). Wir unterstützen Sie rechtzeitig vor der Abreise bei der Beantragung.
              </p>
            </div>
          </div>

          {/* Info Blocks Accordion/Grid */}
          <div className="space-y-8 font-sans font-medium text-ink/85 leading-relaxed text-sm sm:text-base">
            
            {/* 1. Einreisebestimmungen */}
            <div className="space-y-3">
              <h2 className="text-2xl font-serif font-bold text-olive flex items-center gap-2 border-b border-stone-light/60 pb-1.5">
                <ShieldCheck className="w-6 h-6 text-terracotta" /> 1. Pass- & Einreisebestimmungen
              </h2>
              <p>
                Für die Einreise nach Israel benötigen Bürger aus der Schweiz, Deutschland und Österreich einen Reisepass. Dieser muss bei Reiseende noch <strong>mindestens 6 Monate gültig sein</strong>. Vorläufige Reisepässe werden zwar meist akzeptiert, wir empfehlen jedoch dringend einen regulären, biometrischen Reisepass.
              </p>
              <p>
                Am Flughafen Ben Gurion (Tel Aviv) erhalten Sie bei der Passkontrolle eine kleine blaue Einreisekarte (Border Control Card) statt eines Stempels im Pass. Bewahren Sie diese Karte unbedingt bis zu Ihrer Ausreise sicher im Reisepass auf.
              </p>
            </div>

            {/* 2. Gesundheit & Fitness */}
            <div className="space-y-3">
              <h2 className="text-2xl font-serif font-bold text-olive flex items-center gap-2 border-b border-stone-light/60 pb-1.5">
                <HeartPulse className="w-6 h-6 text-terracotta" /> 2. Gesundheit & Körperliche Fitness
              </h2>
              <p>
                Unsere Rundreisen führen uns zu Fuss durch unebenes Gelände, antike Ausgrabungen und historische Stadtkerne (z.B. die Altstadt von Jerusalem mit ihren vielen Stufen). Eine normale, gute körperliche Grundkondition und Trittsicherheit sind daher für das problemlose Bewältigen des Tagesprogramms absolut erforderlich.
              </p>
              <p>
                Spezielle Impfungen sind für Israel derzeit nicht vorgeschrieben. Wir empfehlen jedoch dringend den Abschluss einer <strong>Auslands-Krankenversicherung</strong> mit Rücktransportgarantie.
              </p>
            </div>

            {/* 3. Bekleidung & Wetter */}
            <div className="space-y-3">
              <h2 className="text-2xl font-serif font-bold text-olive flex items-center gap-2 border-b border-stone-light/60 pb-1.5">
                <Sun className="w-6 h-6 text-terracotta" /> 3. Kleidung, Wetter & Benehmen
              </h2>
              <p>
                Israel hat ein sehr vielfältiges Klima. Am See Genezareth und am Toten Meer ist es meist deutlich wärmer als in den Bergen Jerusalems, wo es abends stark abkühlen kann. Packen Sie am besten Kleidung nach dem „Zwiebelprinzip“. 
              </p>
              <p>
                <strong>Sehr wichtig — Angemessene Kleidung für heilige Stätten:</strong> Beim Besuch religiöser Orte (z.B. Tempelberg, Klagemauer, Kirchen in Kapernaum oder Nazareth) müssen Schultern und Knie sowohl bei Frauen als auch bei Männern bedeckt sein. Packen Sie daher für diese Tage lange Hosen, Röcke oder ein grosses Tuch zum Überwerfen ein.
              </p>
              <p>
                Festes, gut eingelaufenes Schuhwerk mit Profilsohlen ist für die täglichen Exkursionen unverzichtbar.
              </p>
            </div>

            {/* 4. Währung, Trinkgelder & Nebenkosten */}
            <div className="space-y-3">
              <h2 className="text-2xl font-serif font-bold text-olive flex items-center gap-2 border-b border-stone-light/60 pb-1.5">
                <DollarSign className="w-6 h-6 text-terracotta" /> 4. Währung, Zahlungsverkehr & Trinkgeld
              </h2>
              <p>
                Die Landeswährung ist der Neue Israelische Schekel (ILS). In fast allen Geschäften, Hotels und Restaurants können Sie problemlos mit gängigen Kreditkarten (Visa, Mastercard) bezahlen. Bargeld kann am Flughafen oder an Bankautomaten vor Ort bezogen werden.
              </p>
              <p>
                <strong>Trinkgeldregelung:</strong> In Israel ist Trinkgeld ein fester, wichtiger Bestandteil des Einkommens im Dienstleistungssektor. Um Ihnen das Rechnen und den täglichen Aufwand zu ersparen, <strong>schliessen wir sämtliche Trinkgelder für die Hotelangestellten, den Busfahrer und den lokalen Guide bereits im Reisepreis ein</strong>. Es entstehen Ihnen diesbezüglich keine unerwarteten Pauschalgebühren vor Ort!
              </p>
            </div>

            {/* 5. Reiseversicherung */}
            <div className="space-y-3">
              <h2 className="text-2xl font-serif font-bold text-olive flex items-center gap-2 border-b border-stone-light/60 pb-1.5">
                <FileText className="w-6 h-6 text-terracotta" /> 5. Reiseversicherung & Schutz
              </h2>
              <p>
                Unvorhersehbare Ereignisse können dazu führen, dass Sie eine gebuchte Reise nicht antreten können oder vorzeitig abbrechen müssen. In diesen Fällen greifen unsere vertraglichen Stornierungsgebühren (gemäss unseren <Link href="/agb" className="text-terracotta hover:underline">AGB</Link>). 
              </p>
              <p>
                Wir empfehlen Ihnen daher dringend den Abschluss einer <strong>Reiseannullierungs-Versicherung</strong> sowie einer Reiseabbruch-Versicherung vor Antritt der Reise.
              </p>
            </div>

          </div>

          {/* CTA Bottom Box */}
          <div className="bg-olive text-paper p-8 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="space-y-2 max-w-lg text-center sm:text-left">
              <span className="text-2xl font-serif font-bold text-paper block">Bereit für die Reise?</span>
              <p className="text-xs sm:text-sm text-paper-dark font-sans font-medium">
                Entdecken Sie unsere anstehenden Reisen für 2026 & 2027 und sichern Sie sich Ihren Platz im Heiligen Land.
              </p>
            </div>
            <Link href="/reisen" className="btn-primary py-3 px-6 text-sm font-semibold w-full sm:w-auto text-center shadow-md">
              Reisen ansehen
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
