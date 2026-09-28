import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Allgemeine Reisebedingungen (AGB)',
  description: 'Vertragsbedingungen und Stornierungsrichtlinien für die Israelreisen mit Beth-Shalom.',
};

export default function AgbPage() {
  return (
    <>
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-olive mb-8">Allgemeine Reisebedingungen (AGB)</h1>
        
        <div className="prose prose-stone leading-relaxed space-y-6 font-sans text-ink/90">
          <p className="text-sm text-ink/70">Stand: 18. Juni 2026</p>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">1. Anmeldung & Vertragsabschluss</h2>
            <p>
              Die Anmeldung zu einer Beth-Shalom Israelreise erfolgt über das Online-Anmeldeformular der Webseite. Die Anmeldung ist für den Teilnehmer verbindlich. Jede Person (auch Ehepartner und Kinder) muss einzeln angemeldet werden. Nach der Online-Anmeldung senden wir Ihnen eine Anzahlungsrechnung zu.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">2. Zahlungsbedingungen</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Anzahlung:</strong> Nach Erhalt der Anmeldebestätigung ist eine Anzahlung von CHF 600.– bzw. EUR 600.– pro Person fällig, zahlbar innert 20 Tagen.</li>
              <li><strong>Restzahlung:</strong> Der verbleibende Betrag der Reisekosten ist spätestens 12 Wochen vor Reisebeginn zu entrichten. Bei kurzfristigen Anmeldungen (unter 4 Monaten vor Abflug) entfällt die Anzahlung und es wird direkt die Gesamtrechnung ausgestellt.</li>
              <li>Zahlungen können ausschliesslich per Banküberweisung getätigt werden. Kreditkartenzahlungen können nicht akzeptiert werden.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">3. Mindestteilnehmerzahl</h2>
            <p>
              Die Durchführung unserer Reisen steht unter dem Vorbehalt des Erreichens einer Mindestteilnehmerzahl von <strong>22 Personen</strong>. Wird diese Zahl bis 4 Wochen vor Reisebeginn nicht erreicht, kann die Reise unsererseits storniert werden. In diesem Fall erstatten wir alle bereits bezahlten Beträge vollständig zurück.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">4. Stornierung durch den Teilnehmer</h2>
            <p>
              Annulliert ein Teilnehmer seine Anmeldung, erheben wir grundsätzlich eine Bearbeitungsgebühr von <strong>CHF 100.– bzw. EUR 100.–</strong>. Bei kurzfristigen Absagen gelten folgende Stornierungskosten:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Ab 85 bis 15 Tage vor Reisebeginn:</strong> Bearbeitungsgebühr zuzüglich der vollständigen Flugkosten (sofern über uns gebucht).</li>
              <li><strong>Ab 14 bis 8 Tage vor Reisebeginn:</strong> 50% der Gesamtreisekosten.</li>
              <li><strong>Ab 7 bis 0 Tage vor Reisebeginn:</strong> 75% der Gesamtreisekosten.</li>
            </ul>
            <p>
              Wir empfehlen den Teilnehmern dringend den Abschluss einer Reiserücktritts- und Auslandskrankenversicherung, die den Ausfall bei plötzlicher Erkrankung deckt.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">5. Haftungsausschluss</h2>
            <p>
              Das Missionswerk Mitternachtsruf, Abteilung Beth-Shalom-Reisen, tritt lediglich als Vermittler der Einzelleistungen auf. Wir übernehmen keine Haftung für Unglücksfälle, Erkrankungen, Flugverspätungen, Sachschäden, Diebstahl, behördliche Beschlagnahmungen oder unvorhergesehene Umstände (höhere Gewalt wie Kriege, Unruhen oder Naturkatastrophen). Zusätzliche Kosten, die durch solche Ereignisse entstehen, gehen zu Lasten des Reiseteilnehmers.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
