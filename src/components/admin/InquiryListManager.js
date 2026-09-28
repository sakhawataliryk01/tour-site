"use client";

import { useState } from "react";
import { toggleInquiryHandled } from "@/app/actions/admin";
import { 
  CheckCircle, 
  HelpCircle, 
  Mail, 
  Phone, 
  Calendar, 
  Users, 
  Clock, 
  Square, 
  CheckSquare
} from "lucide-react";

export default function InquiryListManager({ inquiries: initialInquiries }) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [activeTab, setActiveTab] = useState("CONTACT"); // CONTACT or GROUP
  const [loadingId, setLoadingId] = useState(null);

  const filteredInquiries = inquiries.filter(i => i.type === activeTab);

  const handleToggleHandled = async (id) => {
    setLoadingId(id);
    const res = await toggleInquiryHandled(id);
    setLoadingId(null);

    if (res.success) {
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, handled: !i.handled } : i))
      );
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Tab Selectors */}
      <div className="flex border-b border-stone-light/60 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("CONTACT")}
          className={`flex items-center gap-2 pb-3 px-5 border-b-2 transition-all cursor-pointer ${
            activeTab === "CONTACT"
              ? "border-terracotta text-olive font-extrabold"
              : "border-transparent text-ink/45 hover:text-ink"
          }`}
        >
          <Mail className="w-4 h-4" /> Allgemeine Anfragen ({inquiries.filter(i => i.type === "CONTACT").length})
        </button>
        <button
          onClick={() => setActiveTab("GROUP")}
          className={`flex items-center gap-2 pb-3 px-5 border-b-2 transition-all cursor-pointer ${
            activeTab === "GROUP"
              ? "border-terracotta text-olive font-extrabold"
              : "border-transparent text-ink/45 hover:text-ink"
          }`}
        >
          <Users className="w-4 h-4" /> Gruppenreisen ({inquiries.filter(i => i.type === "GROUP").length})
        </button>
      </div>

      {/* Inquiry List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredInquiries.map((inq) => (
          <div
            key={inq.id}
            className={`border rounded-xl p-5 sm:p-6 transition-all ${
              inq.handled
                ? "bg-paper/40 border-stone-light/40 opacity-70"
                : "bg-paper-dark border-stone shadow-sm"
            }`}
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-light/40 pb-3 mb-4 text-xs font-semibold">
              <div className="space-y-1 text-olive">
                <h3 className="text-base font-serif font-bold text-olive">{inq.name}</h3>
                <div className="flex flex-wrap gap-4 font-sans text-xs text-ink/60 font-semibold items-center">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-terracotta" /> {inq.email}
                  </span>
                  {inq.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-terracotta" /> {inq.phone}
                    </span>
                  )}
                  {inq.participantsCount && (
                    <span className="bg-olive/10 text-olive px-2.5 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold">
                      <Users className="w-3 h-3" /> {inq.participantsCount} Teilnehmer
                    </span>
                  )}
                </div>
              </div>

              {/* Handled status button */}
              <button
                onClick={() => handleToggleHandled(inq.id)}
                disabled={loadingId === inq.id}
                className={`px-3 py-1.5 rounded border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  inq.handled
                    ? "bg-olive/10 text-olive border-olive/30 hover:bg-olive/20"
                    : "bg-paper hover:bg-paper-dark border-stone text-ink/75"
                }`}
              >
                {inq.handled ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5 text-olive" /> Erledigt
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5" /> Offen
                  </>
                )}
              </button>
            </div>

            {/* Message Body */}
            <div className="space-y-3 font-sans text-xs sm:text-sm font-semibold text-olive">
              {inq.subject && (
                <div className="text-olive font-bold">
                  Betreff: <span className="text-ink">{inq.subject}</span>
                </div>
              )}
              <div className="bg-paper p-4 rounded border border-stone-light/40 leading-relaxed font-sans font-medium text-ink/80 whitespace-pre-wrap">
                {inq.message}
              </div>
              <div className="text-[10px] text-ink/40 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Empfangen am {formatDate(inq.createdAt)}
              </div>
            </div>
          </div>
        ))}

        {filteredInquiries.length === 0 && (
          <div className="text-center py-16 px-4 bg-paper-dark border border-stone-light/50 rounded-lg max-w-lg mx-auto space-y-2">
            <p className="text-ink/50 italic font-semibold">Keine Anfragen in dieser Kategorie vorhanden.</p>
          </div>
        )}
      </div>
    </div>
  );
}
