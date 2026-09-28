import prisma from "@/lib/prisma";
import ToursListManager from "@/components/admin/ToursListManager";

export const dynamic = "force-dynamic";

export default async function AdminReisenPage() {
  const tours = await prisma.tour.findMany({
    orderBy: { startDate: "asc" },
    include: {
      capacity: true,
      prices: {
        where: { active: true },
      },
      registrations: {
        select: {
          id: true,
        },
      },
    },
  });

  const serializedTours = tours.map((tour) => ({
    ...tour,
    prices: tour.prices.map((price) => ({
      ...price,
      amount: Number(price.amount),
    })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-olive">Touren & Israelreisen</h1>
        <p className="text-sm text-ink/65 font-semibold uppercase tracking-wider">Reiseprogramme verwalten und duplizieren</p>
      </div>

      <ToursListManager tours={serializedTours} />
    </div>
  );
}
