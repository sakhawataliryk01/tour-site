import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getPeople } from '@/lib/services';
import { User, Calendar, MapPin, Award } from 'lucide-react';

export const metadata = {
  title: 'Unser Team — Reiseleiter & Begleiter',
  description: 'Lernen Sie die Menschen kennen, die Ihre nächste Israelreise leiten und begleiten. Erfahrene, staatlich lizenzierte Guides und Seelsorger.',
};

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const people = await getPeople();

  const guides = people.filter((p) => p.kind === 'GUIDE');
  const companions = people.filter((p) => p.kind === 'COMPANION' || p.kind === 'STAFF');

  const renderPersonCard = (person) => {
    return (
      <div
        key={person.id}
        className="bg-paper-dark border border-stone-light/60 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 font-sans items-start"
      >
        {/* Avatar Placeholder */}
        <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg bg-stone flex-shrink-0 flex items-center justify-center font-serif text-2xl text-paper font-bold shadow-inner">
          {person.name.split(' ').map(n => n[0]).join('')}
        </div>

        {/* Content details */}
        <div className="space-y-3 flex-grow">
          <div className="space-y-0.5">
            <h3 className="text-xl font-serif font-bold text-olive">{person.name}</h3>
            <span className="text-xs font-bold text-terracotta uppercase font-sans tracking-wide block">
              {person.roleTitle || (person.kind === 'GUIDE' ? 'Reiseleiter (Lizenzierter Guide)' : 'Reisebegleiter & Seelsorger')}
            </span>
          </div>
          
          <p className="text-sm text-ink/75 leading-relaxed font-medium whitespace-pre-line">
            {person.bio || 'Langjähriger Begleiter unserer Gruppen mit grossem Herzen für das jüdische Volk und tiefer Verwurzelung im prophetischen Wort der Bibel.'}
          </p>

          <div className="flex gap-4 pt-1 text-xs text-ink/50 font-semibold">
            {person.kind === 'GUIDE' && (
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-olive/80" /> Lizenzierter Guide (Israel)
              </span>
            )}
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-olive/80" /> Beth-Shalom Haifa
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <main className="flex-grow bg-paper py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h1 className="text-4xl font-serif font-bold text-olive">
              Unser Team & Reiseleitung
            </h1>
            <p className="text-base text-ink/75 font-sans leading-relaxed font-medium">
              Die Menschen hinter Beth-Shalom. Mit fachkundigem Wissen, organisatorischer Sorgfalt und geistlicher Tiefe begleiten wir Sie auf Ihrer Reise durch das Land der Bibel.
            </p>
          </div>

          {/* Section: Reiseleiter */}
          {guides.length > 0 && (
            <div className="space-y-6">
              <div className="border-b border-stone pb-2">
                <h2 className="text-2xl font-serif font-bold text-olive">Staatlich lizenzierte Reiseleiter</h2>
              </div>
              <div className="space-y-6">
                {guides.map(renderPersonCard)}
              </div>
            </div>
          )}

          {/* Section: Begleiter */}
          {companions.length > 0 && (
            <div className="space-y-6 pt-6">
              <div className="border-b border-stone pb-2">
                <h2 className="text-2xl font-serif font-bold text-olive">Reisebegleitung & Seelsorge</h2>
              </div>
              <div className="space-y-6">
                {companions.map(renderPersonCard)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
