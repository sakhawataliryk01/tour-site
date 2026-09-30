import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { site } from '@/lib/site';

export const metadata = {
  title: 'Datenschutzerklärung',
  description: `Informationen zum Schutz Ihrer persönlichen Daten bei der Nutzung von ${site.name}.`,
};

export default function DatenschutzPage() {
  const { address, email, name, domain } = site;

  return (
    <>
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-olive mb-8">Datenschutzerklärung</h1>

        <div className="prose prose-stone leading-relaxed space-y-6 font-sans text-ink/90">
          <p className="text-sm text-ink/70">Stand: 29. September 2026</p>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">1. Datenschutz auf einen Blick</h2>
            <p>
              Wir nehmen den Schutz Ihrer persönlichen Daten ernst. Diese Datenschutzerklärung informiert Sie darüber,
              wie wir Ihre personenbezogenen Daten erheben, verarbeiten und speichern, wenn Sie {domain} besuchen
              oder sich für eine Israelreise anmelden.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">2. Verantwortliche Stelle</h2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Webseite ist:<br />
              <strong>{address.company}</strong><br />
              {address.street}<br />
              {address.zip} {address.city}, {address.country}<br />
              E-Mail:{' '}
              <a href={`mailto:${email.info}`} className="text-terracotta hover:underline">
                {email.info}
              </a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">3. Datenerfassung bei der Reiseanmeldung</h2>
            <p>
              Wenn Sie sich verbindlich zu einer Reise über unser Online-Formular anmelden, erfassen wir
              personenbezogene Daten, die für die Organisation der Reise und Hotelreservierungen erforderlich sind:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Vollständiger Name (inkl. Name laut Reisepass)</li>
              <li>Anschrift, Land, E-Mail-Adresse und Telefonnummern</li>
              <li>Geburtsdatum, Nationalität, Reisepass-Nummer und Ablaufdatum</li>
              <li>Unterbringungswünsche, Flugabflughafen</li>
              <li>Relevante Allergien und gesundheitliche Hinweise für Flug und Hotels</li>
            </ul>
            <p>
              Diese Daten werden verschlüsselt übertragen und ausschliesslich zur Reisevorbereitung an vertragliche
              Kooperationspartner weitergegeben. Eine Weitergabe zu Marketingzwecken erfolgt nicht.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">4. Kontaktformular / Interessenliste</h2>
            <p>
              Bei Kontaktanfragen oder Einträgen auf der Interessenliste verarbeiten wir Ihren Namen und Ihre
              E-Mail-Adresse, um Ihre Anfrage zu beantworten oder Sie zu benachrichtigen, sobald die Buchung öffnet.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">5. Hosting & technische Daten</h2>
            <p>
              Die Website von {name} wird auf einem eigenen Server (VPS) betrieben. Beim Besuch fallen technisch
              notwendige Server-Logdaten an (z.&nbsp;B. IP-Adresse, Zeitpunkt, User-Agent), soweit dies für Betrieb
              und Sicherheit erforderlich ist.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">6. Ihre Rechte</h2>
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer gespeicherten personenbezogenen Daten,
              soweit dem keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Wenden Sie sich hierzu an{' '}
              <a href={`mailto:${email.info}`} className="text-terracotta hover:underline">
                {email.info}
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
