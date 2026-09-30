import prisma from '@/lib/prisma';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const base = site.url.replace(/\/$/, '');

  const staticRoutes = [
    '',
    '/reisen',
    '/reiseinformationen',
    '/israel',
    '/ueber-uns',
    '/team',
    '/kontakt',
    '/impressum',
    '/datenschutz',
    '/agb',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/reisen' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));

  let tourRoutes = [];
  try {
    const tours = await prisma.tour.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true, year: true },
    });
    const years = [...new Set(tours.map((t) => t.year))];
    tourRoutes = [
      ...years.map((year) => ({
        url: `${base}/reisen/${year}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })),
      ...tours.map((tour) => ({
        url: `${base}/reisen/${tour.slug}`,
        lastModified: tour.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.9,
      })),
    ];
  } catch (error) {
    console.error('sitemap tours query failed:', error);
  }

  return [...staticRoutes, ...tourRoutes];
}
