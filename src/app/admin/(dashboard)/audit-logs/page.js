import prisma from "@/lib/prisma";
import { History, ShieldCheck, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      actor: true,
    },
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-3xl font-serif font-bold text-olive">Sicherheits- & System-Audit-Log</h1>
        <p className="text-sm text-ink/65 font-semibold uppercase tracking-wider">Chronologische Nachverfolgung aller Systemtransaktionen</p>
      </div>

      <div className="bg-paper-dark border border-stone-light/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium text-ink/80 border-collapse">
            <thead>
              <tr className="bg-paper border-b border-stone-light text-ink/50 uppercase tracking-wider font-bold">
                <th className="p-4">Zeitstempel</th>
                <th className="p-4">Administrator</th>
                <th className="p-4 text-center">Aktion</th>
                <th className="p-4">Ziel-Objekt</th>
                <th className="p-4">Details / Metadaten</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-light/30">
              {logs.map((log) => {
                let parsedMeta = null;
                try {
                  if (log.metadata) parsedMeta = JSON.parse(log.metadata);
                } catch (e) {}

                return (
                  <tr key={log.id} className="hover:bg-paper/40 transition-colors font-semibold">
                    <td className="p-4 text-ink/60 flex items-center gap-2 whitespace-nowrap">
                      <Clock className="w-4 h-4 text-terracotta flex-shrink-0" />
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="p-4 text-olive">
                      {log.actor?.name || log.actor?.email || "System (Online)"}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action === "CREATE"
                          ? "bg-blue-100 text-blue-800"
                          : log.action === "UPDATE"
                          ? "bg-amber-100 text-amber-800"
                          : log.action === "DUPLICATE"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-zinc-100 text-zinc-700"
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-olive font-serif">
                      {log.entityType} <span className="font-mono text-[10px] text-ink/40 font-semibold block">ID: {log.entityId.slice(0,8)}</span>
                    </td>
                    <td className="p-4 max-w-[250px] truncate font-mono text-[10px] text-ink/60" title={log.metadata}>
                      {parsedMeta 
                        ? (parsedMeta.clientName ? `Kunde: ${parsedMeta.clientName} (${parsedMeta.publicId})` : JSON.stringify(parsedMeta)) 
                        : log.metadata || "—"}
                    </td>
                  </tr>
                );
              })}

              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-ink/40 italic font-semibold">
                    Es wurden bisher keine Transaktionsprotokolle erfasst.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
