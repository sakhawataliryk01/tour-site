import prisma from "@/lib/prisma";
import Link from "next/link";
import { 
  Users, 
  HelpCircle, 
  Compass, 
  History, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Query statistical details in parallel
  const [
    regCount,
    inquiryCount,
    tourCount,
    recentRegistrations,
    recentAuditLogs,
    allTours
  ] = await Promise.all([
    prisma.registration.count(),
    prisma.inquiry.count(),
    prisma.tour.count({ where: { status: "PUBLISHED" } }),
    prisma.registration.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        tour: true,
        priceOption: true,
      },
    }),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.tour.findMany({
      where: { status: "PUBLISHED" },
      include: {
        capacity: true,
        registrations: {
          where: {
            status: { in: ["CONFIRMED", "NEW", "REVIEWING"] },
          },
          select: {
            roomType: true,
          },
        },
      },
    }),
  ]);

  // Compute capacity warnings
  const capacityWarnings = [];
  allTours.forEach((tour) => {
    const singleCap = tour.capacity?.singleRooms || 5;
    const doubleCap = tour.capacity?.doubleRooms || 15;

    const confirmedSingles = tour.registrations.filter(r => r.roomType === "SINGLE").length;
    const confirmedDoubles = tour.registrations.filter(r => r.roomType === "DOUBLE" || r.roomType === "SHARED_DOUBLE").length;
    const doubleRoomsUsed = Math.ceil(confirmedDoubles / 2);

    if (confirmedSingles >= singleCap) {
      capacityWarnings.push({
        id: tour.id,
        title: tour.title,
        msg: `Einzelzimmer-Kapazität erschöpft (${confirmedSingles}/${singleCap} gebucht)`,
        type: "danger",
      });
    } else if (confirmedSingles >= singleCap - 1) {
      capacityWarnings.push({
        id: tour.id,
        title: tour.title,
        msg: `Einzelzimmer-Kapazität fast voll (${confirmedSingles}/${singleCap} gebucht)`,
        type: "warning",
      });
    }

    if (doubleRoomsUsed >= doubleCap) {
      capacityWarnings.push({
        id: tour.id,
        title: tour.title,
        msg: `Doppelzimmer-Kapazität erschöpft (${doubleRoomsUsed}/${doubleCap} Zimmer belegt)`,
        type: "danger",
      });
    } else if (doubleRoomsUsed >= doubleCap - 2) {
      capacityWarnings.push({
        id: tour.id,
        title: tour.title,
        msg: `Doppelzimmer-Kapazität fast voll (${doubleRoomsUsed}/${doubleCap} Zimmer belegt)`,
        type: "warning",
      });
    }
  });

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-olive">Verwaltungs-Dashboard</h1>
        <p className="text-sm text-ink/60 font-semibold uppercase tracking-wider">Aktueller Status des Reiseportals</p>
      </div>

      {/* KPI Stats widgets grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-paper-dark border border-stone-light/60 p-6 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs text-ink/50 font-bold uppercase block">Buchungen gesamt</span>
            <span className="text-3xl font-serif font-black text-olive">{regCount}</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-olive/10 text-olive flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-paper-dark border border-stone-light/60 p-6 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs text-ink/50 font-bold uppercase block">Aktive Touren</span>
            <span className="text-3xl font-serif font-black text-olive">{tourCount}</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-olive/10 text-olive flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-paper-dark border border-stone-light/60 p-6 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs text-ink/50 font-bold uppercase block">Kontaktanfragen</span>
            <span className="text-3xl font-serif font-black text-olive">{inquiryCount}</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-olive/10 text-olive flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Capacity Alerts panel */}
      {capacityWarnings.length > 0 && (
        <div className="bg-paper border border-stone-light/60 p-6 rounded-xl space-y-4">
          <h2 className="text-lg font-serif font-bold text-olive flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-terracotta" /> Auslastungswarnungen
          </h2>
          <div className="space-y-2 text-xs font-semibold">
            {capacityWarnings.map((warn, i) => (
              <div
                key={i}
                className={`p-3 rounded-md flex justify-between items-center ${
                  warn.type === "danger"
                    ? "bg-terracotta/10 text-terracotta border border-terracotta/20"
                    : "bg-amber-500/10 text-amber-700 border border-amber-500/20"
                }`}
              >
                <span>{warn.title}: {warn.msg}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-white/40">
                  {warn.type === "danger" ? "Kritisch" : "Achtung"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Registrations Table */}
        <div className="bg-paper-dark border border-stone-light/60 p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-baseline border-b border-stone-light/60 pb-3">
            <h2 className="text-lg font-serif font-bold text-olive">Letzte Anmeldungen</h2>
            <Link href="/admin/anmeldungen" className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1">
              Alle Buchungen <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentRegistrations.length > 0 ? (
            <div className="space-y-3.5 text-xs font-semibold text-olive font-sans">
              {recentRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="bg-paper border border-stone-light/40 p-3.5 rounded-md flex justify-between items-center hover:border-stone transition-all"
                >
                  <div className="space-y-1 max-w-[200px] truncate">
                    <span className="text-sm font-bold text-ink block leading-tight">
                      {reg.firstName} {reg.lastName}
                    </span>
                    <span className="text-[10px] text-ink/50 truncate block font-mono">
                      ID: {reg.publicId} • {reg.tour.title}
                    </span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="block font-serif font-extrabold text-olive">
                      {reg.priceOption ? `${reg.priceOption.currency} ${Number(reg.priceOption.amount)}` : "—"}
                    </span>
                    <span className="text-[10px] text-ink/40 font-semibold block">
                      {formatDate(reg.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-ink/50 italic py-6 text-center font-medium">Bisher liegen noch keine Reiseanmeldungen vor.</p>
          )}
        </div>

        {/* Audit Logs list */}
        <div className="bg-paper-dark border border-stone-light/60 p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-baseline border-b border-stone-light/60 pb-3">
            <h2 className="text-lg font-serif font-bold text-olive">System-Aktivitäten</h2>
            <Link href="/admin/audit-logs" className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1">
              Gesamtes Log <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentAuditLogs.length > 0 ? (
            <div className="space-y-3 text-xs font-semibold text-ink/80 font-sans">
              {recentAuditLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-paper border border-stone-light/40 p-3 rounded-md flex justify-between gap-3 items-center"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-olive leading-tight flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-terracotta" />
                      {log.action} — {log.entityType}
                    </p>
                    {log.metadata && (
                      <p className="text-[10px] text-ink/50 font-semibold font-mono truncate max-w-[200px]">
                        {JSON.parse(log.metadata).clientName || JSON.parse(log.metadata).publicId || log.metadata}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-ink/40 font-semibold text-right flex-shrink-0">
                    {formatDate(log.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-ink/50 italic py-6 text-center font-medium">Bisher liegen keine Systemprotokolle vor.</p>
          )}
        </div>
      </div>
    </div>
  );
}
