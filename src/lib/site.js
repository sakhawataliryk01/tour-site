export const site = {
  name: 'Kaiser Tours',
  shortName: 'Kaiser Tours',
  tagline: 'Israelreisen — Bibel, Land, Volk',
  description:
    'Erleben Sie christliche Israelreisen mit Kaiser Tours. Geführte, biblisch geprägte Rundreisen durch das Heilige Land.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kaiser-tours.de',
  domain: 'kaiser-tours.de',
  email: {
    info: 'info@kaiser-tours.de',
    bookings: 'reisen@kaiser-tours.de',
  },
  phone: {
    de: '+49 (0)000 0000000',
    deTel: '+490000000000',
  },
  /** Replace with real registered operator address before production launch */
  address: {
    company: 'Kaiser Tours',
    street: 'Musterstraße 1',
    zip: '10115',
    city: 'Berlin',
    country: 'Deutschland',
    countryCode: 'DE',
  },
  social: {
    facebook: '',
    instagram: '',
    youtube: '',
  },
  /** light = olive mark for paper backgrounds; dark = cream mark for olive/dark backgrounds */
  logos: {
    light: '/logos/light-theme-logo.png',
    dark: '/logos/dark-theme-logo.png',
  },
};

export function absoluteUrl(path = '/') {
  const base = site.url.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
