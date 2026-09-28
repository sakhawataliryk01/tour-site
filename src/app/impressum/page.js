import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Impressum',
  description: 'Anbieterkennzeichnung und rechtliche Hinweise von Beth-Shalom Reisen.',
};

export default function ImpressumPage() {
  return (
    <>
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-olive mb-8">Impressum</h1>
        
        <div className="prose prose-stone leading-relaxed space-y-6 font-sans text-ink/90">
          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">Verantwortlicher Dienstanbieter</h2>
            <p>
              <strong>Missionswerk Mitternachtsruf</strong><br />
              Abteilung Beth-Shalom-Reisen<br />
              Ringwiesenstrasse 12a<br />
              CH-8600 Dübendorf<br />
              Schweiz
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">Vertretungsberechtigte Personen</h2>
            <p>
              Geschäftsführung des Missionswerks Mitternachtsruf:<br />
              Nathanael Winkler, Peter Malgo, Thomas Lieth
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">Kontakt</h2>
            <p>
              Telefon Schweiz: +41 (0)44 952 14 14<br />
              Telefon Deutschland: +49 (0)7745 8001<br />
              E-Mail: <a href="mailto:reisen@beth-shalom.ch" className="text-terracotta hover:underline">reisen@beth-shalom.ch</a><br />
              Webseite: <a href="https://beth-shalom.reisen" className="text-terracotta hover:underline">www.beth-shalom.reisen</a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">Handelsregister & Steuern</h2>
            <p>
              Rechtsform: Verein nach Schweizerischem Recht (ZGB Art. 60 ff.)<br />
              Handelsregisteramt des Kantons Zürich: CH-020.6.001.234-5 (Beispiel)<br />
              Mehrwertsteuer-Nummer (Schweiz): CHE-123.456.789 MWST
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">Vertretung in Deutschland</h2>
            <p>
              Missionswerk Mitternachtsruf e.V.<br />
              Kaltenbrunnenstraße 7<br />
              DE-79807 Lottstetten<br />
              Eingetragen im Vereinsregister des Amtsgerichts Freiburg i. Br.<br />
              Registernummer: VR 123456
            </p>
          </section>

          <section className="space-y-3 border-t border-stone-light pt-6">
            <h2 className="text-2xl font-serif font-bold text-olive">Haftungshinweis</h2>
            <p>
              Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschliesslich deren Betreiber verantwortlich. Beth-Shalom Reisen fungiert als Vermittler von Reisedienstleistungen. Reiseverantwortlicher Partner in Israel ist Palex Tours Haifa.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
