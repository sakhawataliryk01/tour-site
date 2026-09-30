"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import {
  registrationStatusConfig,
  paymentStatusConfig,
  roomLabels,
} from "@/lib/admin/registration-labels";

export default function RegistrationListManager({ registrations, tours }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTourId, setSelectedTourId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const filteredRegs = registrations.filter((reg) => {
    const q = searchTerm.toLowerCase();
    const fullName = `${reg.firstName} ${reg.lastName}`.toLowerCase();
    const matchesSearch =
      reg.publicId.toLowerCase().includes(q) ||
      fullName.includes(q) ||
      reg.email.toLowerCase().includes(q);
    const matchesTour = selectedTourId ? reg.tourId === selectedTourId : true;
    const matchesStatus = selectedStatus ? reg.status === selectedStatus : true;
    return matchesSearch && matchesTour && matchesStatus;
  });

  return (
    <div className="space-y-4 font-sans">
      <div className="bg-paper-dark border border-stone-light/60 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-ink/40">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Name, E-Mail oder Buchungsnummer…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-paper pl-10 pr-3 py-2 text-xs border border-stone rounded-md focus:border-olive focus:outline-none font-medium"
          />
        </div>

        <div className="flex gap-3 flex-wrap text-xs font-semibold">
          <select
            value={selectedTourId}
            onChange={(e) => setSelectedTourId(e.target.value)}
            className="bg-paper px-3 py-2 border border-stone rounded-md focus:border-olive focus:outline-none"
          >
            <option value="">Alle Reisen</option>
            {tours.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.year})
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-paper px-3 py-2 border border-stone rounded-md focus:border-olive focus:outline-none"
          >
            <option value="">Alle Status</option>
            {Object.entries(registrationStatusConfig).map(([st, cfg]) => (
              <option key={st} value={st}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-paper-dark border border-stone-light/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium text-ink/80 border-collapse">
            <thead>
              <tr className="bg-paper border-b border-stone-light text-ink/50 uppercase tracking-wider font-bold">
                <th className="p-4">Buchungs-ID</th>
                <th className="p-4">Reisender</th>
                <th className="p-4">Tour</th>
                <th className="p-4">Zimmer</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Zahlung</th>
                <th className="p-4 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-light/30">
              {filteredRegs.map((reg) => {
                const st =
                  registrationStatusConfig[reg.status] || {
                    label: reg.status,
                    style: "bg-zinc-100 text-zinc-600",
                  };
                const pay =
                  paymentStatusConfig[reg.paymentStatus] || {
                    label: reg.paymentStatus,
                    style: "bg-zinc-100 text-zinc-600",
                  };

                return (
                  <tr key={reg.id} className="hover:bg-paper transition-colors group">
                    <td className="p-4 font-mono font-bold text-olive">
                      <Link
                        href={`/admin/anmeldungen/${reg.id}`}
                        className="hover:text-terracotta hover:underline"
                      >
                        {reg.publicId}
                      </Link>
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/anmeldungen/${reg.id}`} className="block">
                        <div className="font-bold text-ink text-sm group-hover:text-olive">
                          {reg.firstName} {reg.lastName}
                        </div>
                        <div className="text-[10px] text-ink/40">{reg.email}</div>
                      </Link>
                    </td>
                    <td className="p-4 truncate max-w-[160px]" title={reg.tour?.title}>
                      {reg.tour?.title}
                    </td>
                    <td className="p-4">
                      <span className="block font-bold">
                        {roomLabels[reg.roomType] || reg.roomType}
                      </span>
                      {reg.roommateName && (
                        <span className="text-[9px] text-ink/50 truncate block">
                          P: {reg.roommateName}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${st.style}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pay.style}`}>
                        {pay.label}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/anmeldungen/${reg.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-stone text-olive hover:border-olive hover:bg-paper transition-colors"
                        title="Details öffnen"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {filteredRegs.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-ink/40 italic font-semibold">
                    Keine Anmeldungen für die ausgewählten Filterkriterien gefunden.
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
