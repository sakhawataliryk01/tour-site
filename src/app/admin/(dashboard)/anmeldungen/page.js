import prisma from "@/lib/prisma";
import RegistrationListManager from "@/components/admin/RegistrationListManager";

export const dynamic = "force-dynamic";

export default async function AdminAnmeldungenPage() {
  // Query all registrations with full details
  const [registrations, tours] = await Promise.all([
    prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        tour: true,
        priceOption: true,
      },
    }),
    prisma.tour.findMany({
      orderBy: { startDate: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        year: true,
      },
    }),
  ]);

  const serializedRegistrations = registrations.map((reg) => ({
    ...reg,
    priceOption: reg.priceOption
      ? { ...reg.priceOption, amount: Number(reg.priceOption.amount) }
      : null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-olive">Anmeldungen & Buchungen</h1>
        <p className="text-sm text-ink/65 font-semibold uppercase tracking-wider">Passagier-Registrierungen verwalten</p>
      </div>

      <RegistrationListManager registrations={serializedRegistrations} tours={tours} />
    </div>
  );
}
