import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { site } from '@/lib/site';

export const metadata = {
  title: 'Impressum',
  description: `Anbieterkennzeichnung und rechtliche Hinweise von ${site.name}.`,
};

export default function ImpressumPage() {
  const { address, email, phone, url, domain, name } = site;

  return (
    <>
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-olive mb-8">Impressum</h1>

        <div className="prose prose-stone leading-relaxed space-y-6 font-sans text-ink/90">
          <p className="text-sm bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3">
            Hinweis: Adresse, Telefon und Registerangaben unten sind Platzhalter. Bitte vor Go-Live durch die
            finalen Unternehmensdaten von {name} ersetzen ({domain}).
          </p>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">Verantwortlicher Dienstanbieter</h2>
            <p>
              <strong>{address.company}</strong><br />
              {address.street}<br />
              {address.zip} {address.city}<br />
              {address.country}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">Kontakt</h2>
            <p>
              Telefon: {phone.de}<br />
              E-Mail:{' '}
              <a href={`mailto:${email.info}`} className="text-terracotta hover:underline">
                {email.info}
              </a>
              <br />
              Webseite:{' '}
              <a href={url} className="text-terracotta hover:underline">
                www.{domain}
              </a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">Vertretungsberechtigte Person(en)</h2>
            <p>
              [Name der vertretungsberechtigten Person eintragen]
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-olive">Register & Steuern</h2>
            <p>
              Rechtsform: [z.&nbsp;B. Einzelunternehmen / GmbH]<br />
              Registergericht / HRB: [falls zutreffend]<br />
              USt-IdNr.: [falls zutreffend]
            </p>
          </section>

          <section className="space-y-3 border-t border-stone-light pt-6">
            <h2 className="text-2xl font-serif font-bold text-olive">Haftungshinweis</h2>
            <p>
              Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.
              Für den Inhalt der verlinkten Seiten sind ausschliesslich deren Betreiber verantwortlich.
              {name} vermittelt Reisedienstleistungen und arbeitet mit lokalen Partnern in Israel zusammen.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
