import prisma from './prisma';

/**
 * Get all published tours, optionally filtered by year
 */
export async function getTours({ year, category, status = 'PUBLISHED' } = {}) {
  const where = { status };
  
  if (year) {
    where.year = parseInt(year, 10);
  }
  
  if (category) {
    where.category = category;
  }

  const tours = await prisma.tour.findMany({
    where,
    include: {
      prices: {
        where: { active: true },
        orderBy: { sortOrder: 'asc' },
      },
      capacity: true,
      heroMedia: true,
      registrations: {
        where: {
          status: {
            in: ['CONFIRMED', 'NEW', 'REVIEWING'],
          },
        },
        select: {
          roomType: true,
          priceOption: {
            select: {
              includesFlight: true,
              departureAirport: true,
            },
          },
        },
      },
    },
    orderBy: {
      startDate: 'asc',
    },
  });

  // Map tours to include computed availability and from-prices
  return tours.map((tour) => {
    // 1. Calculate "From" price (minimum active land or flight option)
    const baseLandPrices = tour.prices.filter(p => !p.isSurcharge);
    const minPriceOption = baseLandPrices.reduce((min, p) => {
      if (!min || Number(p.amount) < Number(min.amount)) return p;
      return min;
    }, null);

    // 2. Compute registrations count
    const confirmedCount = tour.registrations.length;

    // 3. Determine availability state
    let availabilityState = 'AVAILABLE';
    const doubleRoomsCap = tour.capacity?.doubleRooms || 15;
    const singleRoomsCap = tour.capacity?.singleRooms || 5;

    const confirmedSingles = tour.registrations.filter(r => r.roomType === 'SINGLE').length;
    const confirmedDoubles = tour.registrations.filter(r => r.roomType === 'DOUBLE' || r.roomType === 'SHARED_DOUBLE').length;
    const estimatedDoubleRoomsUsed = Math.ceil(confirmedDoubles / 2);

    if (tour.registrationMode === 'CLOSED') {
      availabilityState = 'CLOSED';
    } else if (tour.registrationMode === 'INTEREST') {
      availabilityState = 'WAITLIST'; // Represented as "In Planung / Interessenliste"
    } else if (confirmedSingles >= singleRoomsCap && estimatedDoubleRoomsUsed >= doubleRoomsCap) {
      availabilityState = 'SOLD_OUT';
    } else if (confirmedSingles >= singleRoomsCap - 1 || estimatedDoubleRoomsUsed >= doubleRoomsCap - 2) {
      availabilityState = 'LIMITED';
    } else if (tour.registrationMode === 'WAITLIST') {
      availabilityState = 'WAITLIST';
    }

    return {
      ...tour,
      prices: tour.prices.map((p) => ({ ...p, amount: Number(p.amount) })),
      minPrice: minPriceOption ? { amount: Number(minPriceOption.amount), currency: minPriceOption.currency } : null,
      confirmedCount,
      availabilityState,
    };
  });
}

/**
 * Get a single tour by slug with full details
 */
export async function getTourBySlug(slug, status = 'PUBLISHED') {
  const tour = await prisma.tour.findFirst({
    where: { slug, status },
    include: {
      prices: {
        where: { active: true },
        orderBy: { sortOrder: 'asc' },
      },
      capacity: true,
      heroMedia: true,
      days: {
        orderBy: { dayNumber: 'asc' },
      },
      inclusions: {
        orderBy: { sortOrder: 'asc' },
      },
      exclusions: {
        orderBy: { sortOrder: 'asc' },
      },
      documents: {
        where: { published: true },
        include: { media: true },
      },
      people: {
        include: {
          person: true,
        },
        orderBy: {
          person: {
            sortOrder: 'asc',
          },
        },
      },
      registrations: {
        where: {
          status: {
            in: ['CONFIRMED', 'NEW', 'REVIEWING'],
          },
        },
        select: {
          roomType: true,
        },
      },
    },
  });

  if (!tour) return null;

  // Compute availability state
  const confirmedSingles = tour.registrations.filter(r => r.roomType === 'SINGLE').length;
  const confirmedDoubles = tour.registrations.filter(r => r.roomType === 'DOUBLE' || r.roomType === 'SHARED_DOUBLE').length;
  const estimatedDoubleRoomsUsed = Math.ceil(confirmedDoubles / 2);
  
  const doubleRoomsCap = tour.capacity?.doubleRooms || 15;
  const singleRoomsCap = tour.capacity?.singleRooms || 5;

  let availabilityState = 'AVAILABLE';
  if (tour.registrationMode === 'CLOSED') {
    availabilityState = 'CLOSED';
  } else if (tour.registrationMode === 'INTEREST') {
    availabilityState = 'WAITLIST';
  } else if (confirmedSingles >= singleRoomsCap && estimatedDoubleRoomsUsed >= doubleRoomsCap) {
    availabilityState = 'SOLD_OUT';
  } else if (confirmedSingles >= singleRoomsCap - 1 || estimatedDoubleRoomsUsed >= doubleRoomsCap - 2) {
    availabilityState = 'LIMITED';
  } else if (tour.registrationMode === 'WAITLIST') {
    availabilityState = 'WAITLIST';
  }

  const baseLandPrices = tour.prices.filter(p => !p.isSurcharge);
  const minPriceOption = baseLandPrices.reduce((min, p) => {
    if (!min || Number(p.amount) < Number(min.amount)) return p;
    return min;
  }, null);

  return {
    ...tour,
    prices: tour.prices.map((p) => ({ ...p, amount: Number(p.amount) })),
    availabilityState,
    minPrice: minPriceOption ? { amount: Number(minPriceOption.amount), currency: minPriceOption.currency } : null,
  };
}

/**
 * Get a static page by slug
 */
export async function getStaticPage(slug) {
  return prisma.page.findUnique({
    where: { slug, published: true },
  });
}

/**
 * Get all published people (guides, companions, staff)
 */
export async function getPeople() {
  return prisma.person.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
  });
}

/**
 * Get all published articles/blog posts
 */
export async function getArticles() {
  return prisma.article.findMany({
    orderBy: { publishedAt: 'desc' },
  });
}

/**
 * Get an article by slug
 */
export async function getArticleBySlug(slug) {
  return prisma.article.findUnique({
    where: { slug },
  });
}
