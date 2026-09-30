import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import RegistrationDetailView from "@/components/admin/RegistrationDetailView";
import { serializeRegistration } from "@/lib/admin/registration-labels";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const reg = await prisma.registration.findUnique({
    where: { id },
    select: { publicId: true, firstName: true, lastName: true },
  });
  if (!reg) return { title: "Buchung — Admin" };
  return {
    title: `${reg.publicId} · ${reg.firstName} ${reg.lastName} — Admin`,
  };
}

export default async function AdminRegistrationDetailPage({ params }) {
  const { id } = await params;

  const registration = await prisma.registration.findUnique({
    where: { id },
    include: {
      tour: true,
      priceOption: true,
    },
  });

  if (!registration) notFound();

  return (
    <RegistrationDetailView registration={serializeRegistration(registration)} />
  );
}
