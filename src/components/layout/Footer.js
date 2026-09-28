import Link from 'next/link';
import { Mail, Phone, MapPin, Youtube, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-olive text-paper-dark border-t border-stone/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <span className="font-serif text-2xl tracking-wide text-paper font-bold block">
              BETH-SHALOM
            </span>
            <p className="text-sm text-paper-dark/75 leading-relaxed font-sans">
              Christliche Israelreisen seit 1970. Bibelorientiert, historisch präzise und unvergesslich. Geführt durch staatlich lizenzierte Reiseleiter.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://facebook.com/bethshalomhotel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper-dark/60 hover:text-paper transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/beth_shalom_reisen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper-dark/60 hover:text-paper transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@beth_shalom_reisen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper-dark/60 hover:text-paper transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* CH Office */}
          <div className="space-y-3">
            <h4 className="font-serif text-md font-bold text-paper tracking-wider uppercase">Schweiz</h4>
            <div className="space-y-2 text-sm text-paper-dark/80 font-sans">
              <div className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-terracotta mt-0.5 flex-shrink-0" />
                <span>
                  Missionswerk Mitternachtsruf<br />
                  Abt. Beth-Shalom-Reisen<br />
                  Ringwiesenstrasse 12a<br />
                  CH-8600 Dübendorf
                </span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Phone className="w-4 h-4 text-terracotta flex-shrink-0" />
                <a href="tel:0041449521414" className="hover:underline hover:text-paper transition-colors">(0041) 44 952 14 14</a>
              </div>
              <div className="flex gap-2.5 items-center">
                <Mail className="w-4 h-4 text-terracotta flex-shrink-0" />
                <a href="mailto:reisen@beth-shalom.ch" className="hover:underline hover:text-paper transition-colors">reisen@beth-shalom.ch</a>
              </div>
            </div>
          </div>

          {/* DE Office */}
          <div className="space-y-3">
            <h4 className="font-serif text-md font-bold text-paper tracking-wider uppercase">Deutschland</h4>
            <div className="space-y-2 text-sm text-paper-dark/80 font-sans">
              <div className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-terracotta mt-0.5 flex-shrink-0" />
                <span>
                  Missionswerk Mitternachtsruf<br />
                  Abt. Beth-Shalom-Reisen<br />
                  Kaltenbrunnenstrasse 7<br />
                  DE-79807 Lottstetten
                </span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Phone className="w-4 h-4 text-terracotta flex-shrink-0" />
                <a href="tel:004977458001" className="hover:underline hover:text-paper transition-colors">(0049) 7745 8001</a>
              </div>
              <div className="flex gap-2.5 items-center">
                <Mail className="w-4 h-4 text-terracotta flex-shrink-0" />
                <a href="mailto:reisen@beth-shalom.ch" className="hover:underline hover:text-paper transition-colors">reisen@beth-shalom.ch</a>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-md font-bold text-paper tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-2 text-sm text-paper-dark/80 font-sans">
              <li>
                <Link href="/reisen" className="hover:text-paper hover:underline transition-all">Israelreisen 2026 / 2027</Link>
              </li>
              <li>
                <Link href="/reiseinformationen" className="hover:text-paper hover:underline transition-all">Bedingungen & Infos</Link>
              </li>
              <li>
                <Link href="/ueber-uns" className="hover:text-paper hover:underline transition-all">Über unsere Arbeit</Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-paper hover:underline transition-all">Unser Reise-Team</Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-paper hover:underline transition-all">Kontakt & Anfragen</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-light/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-paper-dark/60 font-sans gap-4">
          <p>
            &copy; {currentYear} Beth-Shalom Israelreisen. Alle Rechte vorbehalten. In Kooperation mit dem Missionswerk Mitternachtsruf.
          </p>
          <div className="flex space-x-6">
            <Link href="/impressum" className="hover:text-paper hover:underline transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-paper hover:underline transition-colors">Datenschutz</Link>
            <Link href="/agb" className="hover:text-paper hover:underline transition-colors">Allgemeine Reisebedingungen (AGB)</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
