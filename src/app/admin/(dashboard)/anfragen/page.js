import prisma from "@/lib/prisma";
import InquiryListManager from "@/components/admin/InquiryListManager";

export const dynamic = "force-dynamic";

export default async function AdminAnfragenPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-olive">Kontakt- & Gruppenanfragen</h1>
        <p className="text-sm text-ink/65 font-semibold uppercase tracking-wider">Nachrichten von Website-Besuchern bearbeiten</p>
      </div>

      <InquiryListManager inquiries={inquiries} />
    </div>
  );
}
