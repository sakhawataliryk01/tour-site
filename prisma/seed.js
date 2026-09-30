const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean up existing data to prevent duplicates
  await prisma.auditLog.deleteMany({});
  await prisma.inquiry.deleteMany({});
  await prisma.interestSignup.deleteMany({});
  await prisma.registration.deleteMany({});
  await prisma.tourDocument.deleteMany({});
  await prisma.tourPerson.deleteMany({});
  await prisma.tourInclusion.deleteMany({});
  await prisma.tourExclusion.deleteMany({});
  await prisma.tourDay.deleteMany({});
  await prisma.tourPriceOption.deleteMany({});
  await prisma.tourCapacity.deleteMany({});
  await prisma.tour.deleteMany({});
  await prisma.person.deleteMany({});
  await prisma.media.deleteMany({});
  await prisma.page.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Admin User
  const adminEmail = (process.env.ADMIN_INITIAL_EMAIL || 'admin@kaiser-tours.de')
    .trim()
    .toLowerCase();
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'SecureAdminPassword123!';
  const adminPasswordHash = bcrypt.hashSync(adminPassword, 10);
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      name: 'Administrator',
      role: 'ADMIN',
    },
  });
  console.log('Admin user seeded:', admin.email);

  // 3. Create Media placeholders
  const mediaPlaceholder = await prisma.media.create({
    data: {
      storageKey: 'placeholder-israel.jpg',
      mime: 'image/jpeg',
      width: 1200,
      height: 800,
      alt: 'Blick über den See Genezareth im Abendlicht',
    },
  });

  const travelConditionsDoc = await prisma.media.create({
    data: {
      storageKey: 'reisebedingungen-2025.pdf',
      mime: 'application/pdf',
      alt: 'Allgemeine Reisebedingungen von Kaiser Tours',
    },
  });

  // 4. Create Guides & Companions (Person entities)
  const fredi = await prisma.person.create({
    data: {
      slug: 'fredi-winkler',
      name: 'Fredi Winkler',
      roleTitle: 'Dipl. Reiseleiter',
      kind: 'GUIDE',
      bio: 'Fredi Winkler lebt seit 1973 in Haifa, Israel. Er führt fachkundig deutschsprachige Reisegruppen durchs Land und schöpft dabei aus jahrzehntelanger archäologischer und biblischer Erfahrung.',
      published: true,
    },
  });

  const ariel = await prisma.person.create({
    data: {
      slug: 'ariel-winkler',
      name: 'Ariel Winkler',
      roleTitle: 'Dipl. Reiseleiter',
      kind: 'GUIDE',
      bio: 'Ariel Winkler wuchs in Israel auf, absolvierte dort seine theologische Ausbildung sowie die anerkannte staatliche Ausbildung zum lizenzierten Reiseleiter. Er führt mit Leidenschaft Gruppen durch das Land.',
      published: true,
    },
  });

  const govert = await prisma.person.create({
    data: {
      slug: 'govert-roos',
      name: 'Govert Roos',
      roleTitle: 'Reisebegleitung',
      kind: 'COMPANION',
      bio: 'Govert Roos begleitet Reisegruppen musikalisch und seelsorglich und bereichert die Abende mit Andachten und Gemeinschaft.',
      published: true,
    },
  });

  const hendrik = await prisma.person.create({
    data: {
      slug: 'hendrik-malgo',
      name: 'Hendrik Malgo',
      roleTitle: 'Reisebegleitung',
      kind: 'COMPANION',
      bio: 'Hendrik Malgo beschäftigt sich intensiv mit biblischen Themen und begleitet Israelreisen mit tiefgehenden Andachten.',
      published: true,
    },
  });

  console.log('Guides and Companions seeded');

  // 5. Create Tours
  // Tour A: Budgetreise 2027
  const budgetreise = await prisma.tour.create({
    data: {
      slug: 'budgetreise-2027',
      title: 'BUDGETREISE',
      subtitle: '8 Tage Israel Kompakt & Preiswert',
      year: 2027,
      startDate: new Date('2027-02-22T00:00:00Z'),
      endDate: new Date('2027-03-01T00:00:00Z'),
      durationDays: 8,
      category: 'BUDGET',
      excerpt: 'Kompakte und preisgünstige Rundreise durch Jerusalem und Galiläa mit Schwerpunkt auf den zentralen biblischen Schauplätzen.',
      overview: 'Diese preiswerte Rundreise ist ideal für alle, die das Heilige Land kompakt, aber intensiv kennenlernen möchten. Unter fachkundiger Leitung besuchen wir Jerusalem, die historische Davidsstadt, den Ölberg, das Tote Meer und die wunderschöne Region rund um den See Genezareth. Die Unterbringung erfolgt in bewährten Mittelklassehotels mit Halbpension.',
      audienceNote: 'Jedermann ist willkommen — ideal für Singles, Ehepaare und Familien.',
      heroMediaId: mediaPlaceholder.id,
      minParticipants: 22,
      targetGroupSize: 27,
      registrationMode: 'OPEN',
      status: 'PUBLISHED',
      seoTitle: 'Budgetreise Israel 2027 | Christliche Rundreise',
      seoDescription: 'Erleben Sie das Heilige Land kompakt & preiswert vom 22. Februar bis 1. März 2027. Geführte Rundreise ab € 1’520.– mit Kaiser Tours.',
      flightNotes: 'Flüge mit der israelischen El-Al. Flugzeiten: FRA: 11:00-16:00, ZRH: 12:40-17:30.',
    },
  });

  // Tour B: Jugendreise I 2027
  const jugendreise = await prisma.tour.create({
    data: {
      slug: 'jugendreise-i-2027',
      title: 'JUGENDREISE I',
      subtitle: 'Wandern, Abenteuer & Bibel im Heiligen Land',
      year: 2027,
      startDate: new Date('2027-06-20T00:00:00Z'),
      endDate: new Date('2027-06-30T00:00:00Z'),
      durationDays: 11,
      category: 'YOUTH',
      excerpt: 'Aktive Wanderreise für Jugendliche und junge Erwachsene zwischen 18 und 35 Jahren durch Wüsten, Canyons und biblische Stätten.',
      overview: 'Bist du bereit für das Abenteuer deines Lebens? Unsere Jugendreise führt uns von den Gipfeln des Golan über die Schluchten des Red Canyon bis hinunter ans Rote Meer in Eilat. Wir wandern mit der Bibel im Rucksack, erleben die Wüste hautnah, übernachten in landestypischen Herbergen und baden im Toten Meer. Eine unvergessliche Zeit des Glaubens und der Gemeinschaft.',
      audienceNote: 'Für junge Leute zwischen 18 und 35 Jahren (Singles und junge Ehepaare).',
      heroMediaId: mediaPlaceholder.id,
      minParticipants: 22,
      targetGroupSize: 27,
      registrationMode: 'OPEN',
      status: 'PUBLISHED',
      seoTitle: 'Jugendreise Israel 2027 | Aktiv- und Wanderreise',
      seoDescription: 'Israel hautnah erleben vom 20. bis 30. Juni 2027. Aktive Jugendreise für 18- bis 35-Jährige mit Wandern, Canyons und biblischen Entdeckungen.',
      flightNotes: 'Flüge ab Frankfurt (LY358) und Zürich (LY348).',
    },
  });

  // Tour C: Herbstreise 2026 (In Planung)
  const herbstreise = await prisma.tour.create({
    data: {
      slug: 'herbstreise-2026',
      title: 'HERBSTREISE',
      subtitle: 'Die klassische Rundreise durch das biblische Israel',
      year: 2026,
      startDate: new Date('2026-10-12T00:00:00Z'),
      endDate: new Date('2026-10-21T00:00:00Z'),
      durationDays: 10,
      category: 'STANDARD',
      excerpt: 'Unsere beliebte herbstliche Rundreise verbindet historische Archäologie mit lebendiger Bibelauslegung an den Originalschauplätzen.',
      overview: 'Erleben Sie das Land der Verheissung in seiner vollen Tiefe. Auf dieser klassischen 10-tägigen Rundreise führen wir Sie zu den bedeutendsten Stätten der Bibel. Wir schlagen eine Brücke von den Verheissungen des Alten Testaments über das Wirken Jesu Christi bis hin zu den prophetischen Ereignissen der Endzeit.',
      audienceNote: 'Jedermann ist herzlich willkommen. Erfordert normale Mobilität für die Besichtigungen.',
      heroMediaId: mediaPlaceholder.id,
      minParticipants: 22,
      targetGroupSize: 27,
      registrationMode: 'INTEREST', // Planning mode
      status: 'PUBLISHED',
      seoTitle: 'Klassische Israel-Herbstreise 2026 | Christliche Reise',
      seoDescription: 'Nehmen Sie teil an unserer klassischen Israel-Rundreise im Oktober 2026. Jetzt unverbindlich auf die Interessenliste setzen lassen.',
    },
  });

  console.log('Tours seeded');

  // 6. Connect Persons to Tours
  await prisma.tourPerson.createMany({
    data: [
      { tourId: budgetreise.id, personId: fredi.id, roleOnTour: 'GUIDE' },
      { tourId: budgetreise.id, personId: ariel.id, roleOnTour: 'GUIDE' },
      { tourId: budgetreise.id, personId: hendrik.id, roleOnTour: 'COMPANION' },

      { tourId: jugendreise.id, personId: ariel.id, roleOnTour: 'GUIDE' },
      { tourId: jugendreise.id, personId: govert.id, roleOnTour: 'COMPANION' },

      { tourId: herbstreise.id, personId: fredi.id, roleOnTour: 'GUIDE' },
    ],
  });

  // 7. Seed Capacity & Flight Quotas
  await prisma.tourCapacity.create({
    data: {
      tourId: budgetreise.id,
      doubleRooms: 19,
      singleRooms: 2,
      sharedDoubleMale: 1,
      sharedDoubleFemale: 1,
      flightSeatsJson: JSON.stringify({
        FRA: { total: 10, remaining: 8 },
        MUC: { total: 10, remaining: 10 },
        ZRH: { total: 10, remaining: 9 },
      }),
    },
  });

  await prisma.tourCapacity.create({
    data: {
      tourId: jugendreise.id,
      doubleRooms: 23,
      singleRooms: 1,
    },
  });

  await prisma.tourCapacity.create({
    data: {
      tourId: herbstreise.id,
      doubleRooms: 20,
      singleRooms: 4,
    },
  });

  // 8. Seed Pricing Options
  await prisma.tourPriceOption.createMany({
    data: [
      // Budgetreise Pricing
      {
        tourId: budgetreise.id,
        code: 'LAND_EUR',
        label: 'Rundreise ohne Flug (EUR)',
        currency: 'EUR',
        amount: 1520.0,
        includesFlight: false,
        roomType: 'DOUBLE',
        sortOrder: 1,
      },
      {
        tourId: budgetreise.id,
        code: 'LAND_CHF',
        label: 'Rundreise ohne Flug (CHF)',
        currency: 'CHF',
        amount: 1430.0,
        includesFlight: false,
        roomType: 'DOUBLE',
        sortOrder: 2,
      },
      {
        tourId: budgetreise.id,
        code: 'FLIGHT_FRA',
        label: 'Rundreise inkl. Flug ab Frankfurt',
        currency: 'EUR',
        amount: 2010.0,
        includesFlight: true,
        departureAirport: 'FRA',
        roomType: 'DOUBLE',
        sortOrder: 3,
      },
      {
        tourId: budgetreise.id,
        code: 'FLIGHT_MUC',
        label: 'Rundreise inkl. Flug ab München',
        currency: 'EUR',
        amount: 1930.0,
        includesFlight: true,
        departureAirport: 'MUC',
        roomType: 'DOUBLE',
        sortOrder: 4,
      },
      {
        tourId: budgetreise.id,
        code: 'FLIGHT_ZRH',
        label: 'Rundreise inkl. Flug ab Zürich',
        currency: 'CHF',
        amount: 1730.0,
        includesFlight: true,
        departureAirport: 'ZRH',
        roomType: 'DOUBLE',
        sortOrder: 5,
      },
      {
        tourId: budgetreise.id,
        code: 'SNG_SUR_EUR',
        label: 'Einzelzimmer-Zuschlag (EUR)',
        currency: 'EUR',
        amount: 425.0,
        includesFlight: false,
        roomType: 'SINGLE',
        isSurcharge: true,
        sortOrder: 6,
      },
      {
        tourId: budgetreise.id,
        code: 'SNG_SUR_CHF',
        label: 'Einzelzimmer-Zuschlag (CHF)',
        currency: 'CHF',
        amount: 405.0,
        includesFlight: false,
        roomType: 'SINGLE',
        isSurcharge: true,
        sortOrder: 7,
      },

      // Jugendreise Pricing
      {
        tourId: jugendreise.id,
        code: 'YOUTH_LAND_EUR',
        label: 'Rundreise ohne Flug (EUR)',
        currency: 'EUR',
        amount: 2100.0,
        includesFlight: false,
        roomType: 'DOUBLE',
        sortOrder: 1,
      },
      {
        tourId: jugendreise.id,
        code: 'YOUTH_LAND_CHF',
        label: 'Rundreise ohne Flug (CHF)',
        currency: 'CHF',
        amount: 1985.0,
        includesFlight: false,
        roomType: 'DOUBLE',
        sortOrder: 2,
      },
    ],
  });

  // 9. Seed Inclusions and Exclusions
  await prisma.tourInclusion.createMany({
    data: [
      { tourId: budgetreise.id, text: 'Transfer vom und zum Flughafen in Israel (gemäss Programm)', sortOrder: 1 },
      { tourId: budgetreise.id, text: 'Rundreise gemäss Programm mit modernem, klimatisiertem Reisebus', sortOrder: 2 },
      { tourId: budgetreise.id, text: 'Unterkunft in guten Hotels der Mittelklasse auf Basis von Doppelzimmer', sortOrder: 3 },
      { tourId: budgetreise.id, text: 'Halbpension: reichhaltiges israelisches Frühstücksbuffet und Abendessen (ohne Getränke)', sortOrder: 4 },
      { tourId: budgetreise.id, text: 'Lizenzierter diplomierter Reiseleiter (Fredi oder Ariel Winkler)', sortOrder: 5 },
      { tourId: budgetreise.id, text: 'Reisebegleitung durch Mitarbeiter des Missionswerks', sortOrder: 6 },
      { tourId: budgetreise.id, text: 'Sämtliche Eintrittsgelder laut Programm', sortOrder: 7 },
      { tourId: budgetreise.id, text: 'Trinkgelder für Busfahrer und Hotelpersonal', sortOrder: 8 },
    ],
  });

  await prisma.tourExclusion.createMany({
    data: [
      { tourId: budgetreise.id, text: 'Anreise/Zubringer zum Abflughafen im Heimatland', sortOrder: 1 },
      { tourId: budgetreise.id, text: 'Persönliche Ausgaben für Mittagessen, Getränke, Souvenirs etc.', sortOrder: 2 },
      { tourId: budgetreise.id, text: 'Reiseversicherung (dringend empfohlen)', sortOrder: 3 },
      { tourId: budgetreise.id, text: 'Einreisegenehmigung ETA-IL (ca. 7 EUR/CHF, ab 2025 obligatorisch)', sortOrder: 4 },
    ],
  });

  // 10. Seed Daily Itinerary Days (Budgetreise example)
  const budgetDays = [
    {
      dayNumber: 1,
      title: 'Anreise ins Verheissene Land',
      description: 'Linienflug nach Tel Aviv. Nach der Passkontrolle und Gepäckausgabe erwartet uns der Reiseleiter in der Ankunftshalle. Bustransfer hinauf nach Jerusalem. Bei einem ersten gemeinsamen Abendessen lernen wir uns kennen und stimmen uns auf die kommenden Tage ein. Übernachtung im Hotel Prima Park, Jerusalem.',
      accommodationLabel: 'Hotel Prima Park, Jerusalem',
      mealsBreakfast: false,
      mealsDinner: true,
    },
    {
      dayNumber: 2,
      title: 'Jerusalem vom Ölberg aus & die Altstadtmauer',
      description: 'Wir beginnen den Tag auf dem Ölberg mit einem atemberaubenden Panoramablick über das biblische Jerusalem. Zu Fuss gehen wir den Palmsonntagsweg hinab, vorbei an der Tränenkapelle zum Garten Gethsemane mit seinen uralten Olivenbäumen. Anschliessend betreten wir die Altstadt durch das Misttor und besuchen den Zionsberg mit dem historischen Abendmahlssaal. Nachmittags geniessen wir einen Spaziergang auf der historischen Stadtmauer und besuchen den pulsierenden Markt Machane Jehuda.',
      accommodationLabel: 'Hotel Prima Park, Jerusalem',
      mealsBreakfast: true,
      mealsDinner: true,
    },
    {
      dayNumber: 3,
      title: 'Die antike Davidsstadt, der Siloah-Teich & das Gartengrab',
      description: 'Heute tauchen wir tief in die Archäologie ein. Wir besuchen die Davidsstadt, das älteste besiedelte Viertel Jerusalems. Wer möchte, geht durch den wasserführenden Hiskia-Tunnel bis zum Teich Siloah, wo Jesus den Blindgeborenen heilte. Über den neu freigelegten antiken Pilgerweg steigen wir hinauf zum Tempelbergbereich an der Klagemauer. Am Nachmittag schliessen wir den Tag mit einer besinnlichen Abendmahlsfeier am Gartengrab ab, dem Ort der Erinnerung an Kreuzigung und Auferstehung unseres Herrn.',
      accommodationLabel: 'Hotel Prima Park, Jerusalem',
      mealsBreakfast: true,
      mealsDinner: true,
    },
    {
      dayNumber: 4,
      title: 'Wüste Juda, Totes Meer & Fahrt nach Galiläa',
      description: 'Wir verlassen Jerusalem und fahren hinab in die Wüste Juda. Unser erster Halt ist Qumran, der berühmte Fundort der 2000 Jahre alten Jesaja-Schriftrollen. Danach bietet sich die einzigartige Gelegenheit zu einem entspannenden Bad im salz- und mineralreichen Toten Meer. Anschliessend fahren wir nordwärts durch das landschaftlich reizvolle Jordantal. Vorbei an der antiken Dekapolis-Stadt Beth-Shean und dem Gilboa-Gebirge erreichen wir Haifa. Abendessen und Übernachtung in Haifa.',
      accommodationLabel: 'Hotel in Haifa',
      mealsBreakfast: true,
      mealsDinner: true,
    },
    {
      dayNumber: 5,
      title: 'Haifa, Karmelgebirge, Elia-Opferstätte & Caesarea',
      description: 'Morgens machen wir eine kleine Rundfahrt durch Haifa und spazieren an den wunderschönen Bahai-Gärten vorbei zur historischen deutschen Templer-Kolonie. Danach fahren wir hinauf auf den Karmel zur Elia-Opferstätte Muchraka, von wo aus wir einen weiten Blick über die geschichtsträchtige Jesreel-Ebene (Harmagedon) geniessen. Am Nachmittag besichtigen wir das antike Caesarea am Mittelmeer, Wirkungsort des Apostels Paulus und des Hauptmanns Kornelius, bevor wir die Möglichkeit zu einem Bad im Mittelmeer nutzen.',
      accommodationLabel: 'Hotel in Haifa',
      mealsBreakfast: true,
      mealsDinner: true,
    },
    {
      dayNumber: 6,
      title: 'Rund um den See Genezareth: Wirkungsstätten Jesu',
      description: 'Ein Tag ganz im Zeichen des Wirkens Jesu. Wir fahren zum Berg der Seligpreisungen und besichtigen die Kirche inmitten herrlicher Gärten. Danach geht es nach Tabgha (Ort der Brotvermehrung und der Wiederherstellung des Petrus am Seeufer) und weiter nach Kapernaum, der "Wohnstadt" Jesu. Ein emotionaler Höhepunkt ist eine stimmungsvolle Bootsfahrt auf dem ruhigen See Genezareth. Bevor wir nach Haifa zurückkehren, besuchen wir einen lokalen Kibbutzmarkt mit Datteln und israelischen Spezialitäten.',
      accommodationLabel: 'Hotel in Haifa',
      mealsBreakfast: true,
      mealsDinner: true,
    },
    {
      dayNumber: 7,
      title: 'Norden Israels: Jordanquellen, Dan & Caesarea Philippi',
      description: 'Wir fahren in den äussersten Norden Israels. Wir spazieren durch das wunderschöne Naturreservat der Dan-Quelle, der reichsten Jordanquelle, wo Jerobeam einst eines der goldenen Kälber aufstellte. Weiter geht es zur Baniasquelle, dem antiken Caesarea Philippi am Fusse des Hermongebirges. Hier stellte Jesus seinen Jüngern die Kernfrage: "Für wen haltet ihr mich?". Auf der Rückfahrt überqueren wir die Golanhöhen und werfen vom Berg Ben Tal einen Blick in das angrenzende Hulatal.',
      accommodationLabel: 'Hotel in Haifa',
      mealsBreakfast: true,
      mealsDinner: true,
    },
    {
      dayNumber: 8,
      title: 'Rückflug & Heimreise',
      description: 'Frühmorgendlicher Transfer zum Flughafen Ben Gurion bei Tel Aviv. Rückflug in die Heimat. Einmalig und unvergesslich verabschieden wir uns mit dem jüdischen Gruss "Schalom" und reich gesegneten Herzen.',
      accommodationLabel: 'Heimflug',
      mealsBreakfast: false,
      mealsDinner: false,
    },
  ];

  for (const day of budgetDays) {
    await prisma.tourDay.create({
      data: {
        tourId: budgetreise.id,
        dayNumber: day.dayNumber,
        date: new Date(budgetreise.startDate.getTime() + (day.dayNumber - 1) * 24 * 60 * 60 * 1000),
        title: day.title,
        description: day.description,
        mealsBreakfast: day.mealsBreakfast,
        mealsDinner: day.mealsDinner,
        accommodationLabel: day.accommodationLabel,
        sortOrder: day.dayNumber,
      },
    });
  }

  // 11. Seed Tour Documents
  await prisma.tourDocument.create({
    data: {
      tourId: budgetreise.id,
      type: 'PROGRAM',
      title: 'Tagesprogramm Budgetreise 2027 (PDF)',
      mediaId: travelConditionsDoc.id,
      visibility: 'PUBLIC',
      published: true,
    },
  });

  // Global travel conditions
  await prisma.tourDocument.create({
    data: {
      tourId: null, // Global
      type: 'CONDITIONS',
      title: 'Reisebedingungen & Haftungshinweise',
      mediaId: travelConditionsDoc.id,
      visibility: 'PUBLIC',
      published: true,
    },
  });

  // 12. Seed Static Pages
  await prisma.page.createMany({
    data: [
      {
        slug: 'reiseinformationen',
        title: 'Bedingungen & Reiseinformationen',
        body: '<h3>Zielgruppe</h3><p>Unsere Israelreisen werden gerne von Familien, Ehepaaren und Singles jeden Alters gebucht. Unsere Reisen sind christlich geprägt — wir reisen mit der Bibel durch das Land.</p><h3>Reisepass & Einreise</h3><p>Jeder Teilnehmer benötigt einen Reisepass, der am Rückreisetag noch mindestens 6 Monate gültig ist. Ab 2025 ist zwingend die Online-Einreisegenehmigung ETA-IL zu beantragen.</p>',
        seoTitle: 'Wichtige Reiseinformationen Israel | Kaiser Tours',
        seoDescription: 'Alle wichtigen Informationen zu Reisepass, Impfungen, ETA-IL, Bekleidung, Versicherungen und finanziellen Bedingungen für Ihre Israelreise.',
      },
      {
        slug: 'unsere-arbeit',
        title: 'Unsere Arbeit',
        body: '<p>Kaiser Tours organisiert biblisch orientierte Israelreisen für den deutschsprachigen Raum. Unsere Programme verbinden historische Schauplätze, fachkundige Führung und eine ruhige, geistlich offene Gruppenatmosphäre.</p>',
        seoTitle: 'Über Kaiser Tours | Israelreisen',
        seoDescription: 'Erfahren Sie mehr über Kaiser Tours und unsere christlich geprägten Israelreisen.',
      },
    ],
  });

  // 13. Seed Articles
  await prisma.article.createMany({
    data: [
      {
        slug: 'der-ueberlebenskampf-israels',
        title: 'Der Überlebenskampf Israels',
        excerpt: 'Ein theologisch-historischer Blick auf den fortwährenden Kampf des jüdischen Volkes um seine Existenz und Souveränität.',
        body: '<p>Der Überlebenskampf Israels ist nicht nur ein politisches Phänomen unserer Zeit. Um ihn wirklich zu verstehen, müssen wir die Seiten der Heiligen Schrift aufschlagen...</p>',
        publishedAt: new Date('2024-09-01T00:00:00Z'),
        seoTitle: 'Der Überlebenskampf Israels biblisch betrachtet',
        seoDescription: 'Eine fundierte theologische Analyse über die Geschichte und Zukunft des jüdischen Volkes und seine göttliche Bewahrung.',
      },
    ],
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
