import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Datenschutzerklärung',
  description: 'Informationen zum Schutz Ihrer persönlichen Daten bei der Nutzung von Beth-Shalom Reisen.',
};

export default function DatenschutzPage() {
  return (
    <>
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-olive mb-8">Datenschutzerklärung</h1>
        
        <div className="prose prose-stone leading-relaxed space-y-6 font-sans text-ink/90">
          <p className="text-sm text-ink/70">Stand: 28. September 2026</p>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">1. Datenschutz auf einen Blick</h2>
            <p>
              Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Datenschutzerklärung informiert Sie darüber, wie wir Ihre personenbezogenen Daten erheben, verarbeiten und speichern, wenn Sie unsere Website besuchen oder sich für eine unserer Israelreisen anmelden.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">2. Verantwortliche Stelle</h2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Webseite ist:<br />
              <strong>Missionswerk Mitternachtsruf</strong><br />
              Abteilung Beth-Shalom-Reisen<br />
              Ringwiesenstrasse 12a<br />
              CH-8600 Dübendorf, Schweiz<br />
              E-Mail: <a href="mailto:reisen@beth-shalom.ch" className="text-terracotta hover:underline">reisen@beth-shalom.ch</a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">3. Datenerfassung bei der Reiseanmeldung</h2>
            <p>
              Wenn Sie sich verbindlich zu einer Reise über unser Online-Formular anmelden, erfassen wir sensible personenbezogene Daten, die für die Organisation der Reise, Flüge (El-Al) und Hotelreservierungen zwingend erforderlich sind:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Vollständiger Name (inkl. Name laut Reisepass)</li>
              <li>Anschrift, Land, E-Mail-Adresse und Telefonnummern</li>
              <li>Geburtsdatum, Nationalität, Reisepass-Nummer und Ablaufdatum (da der Pass noch 6 Monate über den Rückreisetermin hinaus gültig sein muss)</li>
              <li>Unterbringungswünsche, Name des Zimmerpartners, Flugabflughafen</li>
              <li>Relevante Lebensmittel-Allergien und gesundheitliche Angaben für Flug und Hotels</li>
            </ul>
            <p>
              Diese Daten werden verschlüsselt an unsere Server übertragen und ausschliesslich zwecks Reisevorbereitung an unsere vertraglichen Kooperationspartner (z.B. die Fluggesellschaft El-Al und die lokale Reiseagentur Palex Tours in Haifa) weitergegeben. Eine Weitergabe zu Marketingzwecken erfolgt nicht.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">4. Datenerfassung beim Kontaktformular / Interessenliste</h2>
            <p>
              Wenn Sie uns eine Nachricht zukommen lassen oder sich auf eine unverbindliche Interessenliste für eine geplante Reise setzen lassen, verarbeiten wir Ihren Namen und Ihre E-Mail-Adresse, um Ihre Anfrage zu beantworten beziehungsweise Sie zu benachrichtigen, sobald die Buchungsphase für die entsprechende Reise geöffnet wird.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">5. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben ausserdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen, sofern dem keine gesetzlichen Aufbewahrungspflichten (z.B. buchhalterische Pflichten nach Schweizer Obligationenrecht) entgegenstehen.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
