import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Youtube, Facebook, Instagram } from 'lucide-react';
import { site } from '@/lib/site';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { address, email, phone, social } = site;

  return (
    <footer className="bg-olive text-paper-dark border-t border-stone/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center">
              <Image
                src={site.logos.dark}
                alt={site.name}
                width={155}
                height={71}
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-sm text-paper-dark/75 leading-relaxed font-sans">
              Christliche Israelreisen mit persönlicher Begleitung. Bibelorientiert, historisch präzise und unvergesslich — geführt von lizenzierten Reiseleitern vor Ort.
            </p>
            {(social.facebook || social.instagram || social.youtube) && (
              <div className="flex space-x-4 pt-2">
                {social.facebook ? (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-paper-dark/60 hover:text-paper transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                ) : null}
                {social.instagram ? (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-paper-dark/60 hover:text-paper transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                ) : null}
                {social.youtube ? (
                  <a
                    href={social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-paper-dark/60 hover:text-paper transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                ) : null}
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-md font-bold text-paper tracking-wider uppercase">Kontakt</h4>
            <div className="space-y-2 text-sm text-paper-dark/80 font-sans">
              <div className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-terracotta mt-0.5 flex-shrink-0" />
                <span>
                  {address.company}<br />
                  {address.street}<br />
                  {address.zip} {address.city}<br />
                  {address.country}
                </span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Phone className="w-4 h-4 text-terracotta flex-shrink-0" />
                <a href={`tel:${phone.deTel}`} className="hover:underline hover:text-paper transition-colors">
                  {phone.de}
                </a>
              </div>
              <div className="flex gap-2.5 items-center">
                <Mail className="w-4 h-4 text-terracotta flex-shrink-0" />
                <a href={`mailto:${email.info}`} className="hover:underline hover:text-paper transition-colors">
                  {email.info}
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-md font-bold text-paper tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-2 text-sm text-paper-dark/80 font-sans">
              <li>
                <Link href="/reisen" className="hover:text-paper hover:underline transition-all">Israelreisen</Link>
              </li>
              <li>
                <Link href="/reiseinformationen" className="hover:text-paper hover:underline transition-all">Bedingungen & Infos</Link>
              </li>
              <li>
                <Link href="/ueber-uns" className="hover:text-paper hover:underline transition-all">Über uns</Link>
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

        <div className="border-t border-stone-light/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-paper-dark/60 font-sans gap-4">
          <p>
            &copy; {currentYear} {site.name}. Alle Rechte vorbehalten. · {site.domain}
          </p>
          <div className="flex space-x-6">
            <Link href="/impressum" className="hover:text-paper hover:underline transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-paper hover:underline transition-colors">Datenschutz</Link>
            <Link href="/agb" className="hover:text-paper hover:underline transition-colors">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
