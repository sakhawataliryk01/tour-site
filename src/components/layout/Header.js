'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Calendar, Info, Users, Phone } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toursDropdownOpen, setToursDropdownOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    {
      name: 'Israelreisen',
      href: '/reisen',
      dropdown: [
        { name: 'Saison 2026', href: '/reisen/2026', icon: Calendar },
        { name: 'Saison 2027', href: '/reisen/2027', icon: Calendar },
        { name: 'Alle Reisen', href: '/reisen', icon: Calendar },
      ],
    },
    { name: 'Reiseinfos', href: '/reiseinformationen', icon: Info },
    { name: 'Über Israel', href: '/israel', icon: Info },
    { name: 'Über uns', href: '/ueber-uns', icon: Users },
    { name: 'Unser Team', href: '/team', icon: Users },
    { name: 'Kontakt', href: '/kontakt', icon: Phone },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-md border-b border-stone-light shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Branding */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex items-center gap-3">
              <span className="font-serif text-2xl tracking-wide text-olive group-hover:text-olive-light transition-colors font-bold">
                BETH-SHALOM
              </span>
              <span className="hidden sm:inline border-l border-stone h-6"></span>
              <span className="hidden sm:inline font-sans text-xs tracking-widest text-ink/75 uppercase">
                Israelreisen
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1 items-center">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setToursDropdownOpen(!toursDropdownOpen)}
                      onMouseEnter={() => setToursDropdownOpen(true)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-1 ${
                        isActive(item.href)
                          ? 'text-olive bg-stone-light/40'
                          : 'text-ink/80 hover:text-olive hover:bg-stone-light/20'
                      }`}
                    >
                      {item.name}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toursDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {toursDropdownOpen && (
                      <div
                        onMouseLeave={() => setToursDropdownOpen(false)}
                        className="absolute left-0 mt-1 w-56 rounded-md bg-paper border border-stone-light shadow-lg py-2 focus:outline-none z-10 animate-fade-in"
                      >
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => setToursDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-ink/85 hover:bg-stone-light/30 hover:text-olive transition-all font-medium"
                          >
                            <subItem.icon className="w-4 h-4 text-olive/70" />
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      isActive(item.href)
                        ? 'text-olive bg-stone-light/40 font-bold'
                        : 'text-ink/80 hover:text-olive hover:bg-stone-light/20'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Section */}
          <div className="hidden lg:flex items-center">
            <Link href="/reisen" className="btn-secondary text-sm">
              Reisen Entdecken
            </Link>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-ink hover:text-olive p-2 rounded-md focus:outline-none"
              aria-label="Menü öffnen"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-stone bg-paper animate-fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <div key={item.name} className="space-y-1">
                {item.dropdown ? (
                  <>
                    <div className="px-3 py-2 text-base font-semibold text-olive border-b border-stone-light/50">
                      {item.name}
                    </div>
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 pl-6 pr-3 py-2.5 rounded-md text-sm font-medium ${
                          isActive(subItem.href)
                            ? 'bg-stone-light/40 text-olive font-bold'
                            : 'text-ink/80 hover:bg-stone-light/10 hover:text-olive'
                        }`}
                      >
                        <subItem.icon className="w-4 h-4 text-olive/70" />
                        {subItem.name}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                      isActive(item.href)
                        ? 'bg-stone-light/40 text-olive font-bold'
                        : 'text-ink/80 hover:bg-stone-light/10 hover:text-olive'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 px-3">
              <Link
                href="/reisen"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-secondary w-full text-center"
              >
                Reisen Entdecken
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
