import prisma from '@/lib/prisma';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

/**
 * Server-side tours query with pagination, search and filters.
 */
export async function queryAdminTours(searchParams = {}) {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(searchParams.pageSize || String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
  );
  const q = (searchParams.q || '').trim();
  const status = searchParams.status || '';
  const year = searchParams.year || '';
  const category = searchParams.category || '';

  const where = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { subtitle: { contains: q, mode: 'insensitive' } },
      { slug: { contains: q, mode: 'insensitive' } },
      { excerpt: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (status && ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
    where.status = status;
  }

  if (year) {
    const yearNum = parseInt(year, 10);
    if (!Number.isNaN(yearNum)) {
      where.year = yearNum;
    }
  }

  if (
    category &&
    ['STANDARD', 'RELAXED', 'BUDGET', 'YOUTH', 'SPECIAL', 'PRIVATE'].includes(category)
  ) {
    where.category = category;
  }

  const [total, tours, yearGroups] = await Promise.all([
    prisma.tour.count({ where }),
    prisma.tour.findMany({
      where,
      orderBy: [{ year: 'desc' }, { startDate: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        capacity: true,
        heroMedia: true,
        prices: {
          where: { active: true },
          orderBy: { sortOrder: 'asc' },
        },
        registrations: {
          select: { id: true },
        },
        _count: {
          select: { registrations: true },
        },
      },
    }),
    prisma.tour.groupBy({
      by: ['year'],
      orderBy: { year: 'desc' },
    }),
  ]);

  const rows = tours.map((tour) => ({
    ...tour,
    startDate: tour.startDate?.toISOString?.() || tour.startDate,
    endDate: tour.endDate?.toISOString?.() || tour.endDate,
    createdAt: tour.createdAt?.toISOString?.() || tour.createdAt,
    updatedAt: tour.updatedAt?.toISOString?.() || tour.updatedAt,
    registrationCount: tour._count?.registrations ?? tour.registrations?.length ?? 0,
    prices: (tour.prices || []).map((price) => ({
      ...price,
      amount: Number(price.amount),
    })),
    heroMedia: tour.heroMedia
      ? {
          id: tour.heroMedia.id,
          storageKey: tour.heroMedia.storageKey,
          url: tour.heroMedia.url,
          alt: tour.heroMedia.alt,
          width: tour.heroMedia.width,
          height: tour.heroMedia.height,
        }
      : null,
  }));

  return {
    rows,
    total,
    page,
    pageSize,
    q,
    status,
    year,
    category,
    yearOptions: yearGroups.map((g) => g.year),
  };
}
