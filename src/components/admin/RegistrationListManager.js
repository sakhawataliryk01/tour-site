"use client";

import { useState } from "react";
import { updateRegistration } from "@/app/actions/admin";
import { 
  Search, 
  Filter, 
  User, 
  MapPin, 
  CreditCard, 
  Passport, 
  Calendar, 
  Utensils, 
  ShieldAlert, 
  Edit3,
  CheckCircle,
  XCircle,
  FileText
} from "lucide-react";

export default function RegistrationListManager({ registrations, tours }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTourId, setSelectedTourId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedReg, setSelectedReg] = useState(null);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editPayment, setEditPayment] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  // Status mapping to German labels and styling
  const statusConfig = {
    NEW: { label: "Neu", style: "bg-blue-100 text-blue-800" },
    REVIEWING: { label: "In Prüfung", style: "bg-amber-100 text-amber-800" },
    CONFIRMED: { label: "Bestätigt", style: "bg-emerald-100 text-emerald-800 animate-pulse-slow" },
    WAITLIST: { label: "Warteliste", style: "bg-purple-100 text-purple-800" },
    CANCELLED: { label: "Storniert", style: "bg-rose-100 text-rose-800" },
    COMPLETED: { label: "Abgeschlossen", style: "bg-zinc-100 text-zinc-800" },
  };

  const paymentConfig = {
    NONE: { label: "Keine", style: "bg-zinc-100 text-zinc-600" },
    DEPOSIT_DUE: { label: "Anzahlung offen", style: "bg-amber-100 text-amber-700" },
    DEPOSIT_PAID: { label: "Anzahlung bezahlt", style: "bg-blue-100 text-blue-800" },
    FINAL_DUE: { label: "Restzahlung offen", style: "bg-amber-100 text-amber-800" },
    FINAL_PAID: { label: "Vollständig bezahlt", style: "bg-emerald-100 text-emerald-800" },
    REFUNDED: { label: "Erstattet", style: "bg-purple-100 text-purple-800" },
    WAIVED: { label: "Erlassen", style: "bg-zinc-200 text-zinc-700" },
  };

  const roomLabels = {
    DOUBLE: "Doppelzimmer",
    SINGLE: "Einzelzimmer",
    SHARED_DOUBLE: "Halbes DZ",
  };

  // Filter logic
  const filteredRegs = registrations.filter((reg) => {
    const fullName = `${reg.firstName} ${reg.lastName}`.toLowerCase();
    const idMatches = reg.publicId.toLowerCase().includes(searchTerm.toLowerCase());
    const nameMatches = fullName.includes(searchTerm.toLowerCase());
    const emailMatches = reg.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSearch = idMatches || nameMatches || emailMatches;
    const matchesTour = selectedTourId ? reg.tourId === selectedTourId : true;
    const matchesStatus = selectedStatus ? reg.status === selectedStatus : true;

    return matchesSearch && matchesTour && matchesStatus;
  });

  const handleSelectReg = (reg) => {
    setSelectedReg(reg);
    setEditStatus(reg.status);
    setEditPayment(reg.paymentStatus);
    setEditNotes(reg.adminNotes || "");
    setIsEditing(false);
    setSaveMessage(null);
  };

  const handleSaveEdit = async () => {
    setSaveLoading(true);
    setSaveMessage(null);

    const res = await updateRegistration(selectedReg.id, {
      status: editStatus,
      paymentStatus: editPayment,
      adminNotes: editNotes,
    });

    setSaveLoading(false);
    if (res.success) {
      setSaveMessage({ success: true, text: res.message });
      // Update local state representation of selected passenger
      setSelectedReg((prev) => ({
        ...prev,
        status: editStatus,
        paymentStatus: editPayment,
        adminNotes: editNotes,
      }));
      // Also update the local array element so table stays in sync
      const match = registrations.find(r => r.id === selectedReg.id);
      if (match) {
        match.status = editStatus;
        match.paymentStatus = editPayment;
        match.adminNotes = editNotes;
      }
      setIsEditing(false);
    } else {
      setSaveMessage({ success: false, text: res.message });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
      
      {/* LEFT COLUMN: FILTER CONTROLS & TABLE VIEW */}
      <div className="lg:col-span-8 space-y-4">
        
        {/* Quick Filter card */}
        <div className="bg-paper-dark border border-stone-light/60 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-ink/40">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Name, E-Mail oder Buchungsnummer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-paper pl-10 pr-3 py-2 text-xs border border-stone rounded-md focus:border-olive focus:outline-none font-medium"
            />
          </div>

          <div className="flex gap-3 flex-wrap text-xs font-semibold">
            {/* Tour Filter */}
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

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-paper px-3 py-2 border border-stone rounded-md focus:border-olive focus:outline-none"
            >
              <option value="">Alle Status</option>
              {Object.keys(statusConfig).map((st) => (
                <option key={st} value={st}>
                  {statusConfig[st].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Passenger List Table wrapper */}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-light/30">
                {filteredRegs.map((reg) => {
                  const st = statusConfig[reg.status] || { label: reg.status, style: "bg-zinc-100 text-zinc-600" };
                  const pay = paymentConfig[reg.paymentStatus] || { label: reg.paymentStatus, style: "bg-zinc-100 text-zinc-600" };

                  return (
                    <tr
                      key={reg.id}
                      onClick={() => handleSelectReg(reg)}
                      className={`hover:bg-paper cursor-pointer transition-colors ${
                        selectedReg?.id === reg.id ? "bg-paper border-l-4 border-l-terracotta" : ""
                      }`}
                    >
                      <td className="p-4 font-mono font-bold text-olive">{reg.publicId}</td>
                      <td className="p-4">
                        <div className="font-bold text-ink text-sm">
                          {reg.firstName} {reg.lastName}
                        </div>
                        <div className="text-[10px] text-ink/40">{reg.email}</div>
                      </td>
                      <td className="p-4 truncate max-w-[150px]" title={reg.tour.title}>
                        {reg.tour.title}
                      </td>
                      <td className="p-4">
                        <span className="block font-bold">{roomLabels[reg.roomType]}</span>
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
                    </tr>
                  );
                })}

                {filteredRegs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-ink/40 italic font-semibold">
                      Keine Anmeldungen für die ausgewählten Filterkriterien gefunden.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: DETAIL WORKSPACE PANEL */}
      <div className="lg:col-span-4 bg-paper-dark border border-stone-light/60 p-6 rounded-xl space-y-6">
        {selectedReg ? (
          <div className="space-y-6 text-sm font-semibold text-olive">
            
            {/* Profile Header */}
            <div className="border-b border-stone-light pb-4 flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-terracotta">{selectedReg.publicId}</span>
                <h2 className="text-xl font-serif font-bold text-olive leading-tight">
                  {selectedReg.salutation === "MR" ? "Herr" : "Frau"} {selectedReg.firstName} {selectedReg.lastName}
                </h2>
                <p className="text-xs text-ink/50 font-medium">Reise: {selectedReg.tour.title}</p>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-1.5 border border-stone rounded hover:bg-paper transition-all cursor-pointer"
                title="Status bearbeiten"
              >
                <Edit3 className="w-4 h-4 text-olive" />
              </button>
            </div>

            {saveMessage && (
              <div
                className={`p-3 rounded-md text-xs font-bold flex gap-2 items-center ${
                  saveMessage.success
                    ? "bg-olive/10 text-olive border border-olive/20"
                    : "bg-terracotta/10 text-terracotta border border-terracotta/20"
                }`}
              >
                {saveMessage.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <p>{saveMessage.text}</p>
              </div>
            )}

            {/* EDIT VIEW OR DISPLAY VIEW */}
            {isEditing ? (
              <div className="space-y-4 p-4 bg-paper rounded-lg border border-stone space-y-4">
                <h3 className="font-bold font-serif text-sm text-olive border-b border-stone-light pb-1">
                  Status aktualisieren
                </h3>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-ink/60 uppercase">Buchungsstatus</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-paper-dark p-2 border border-stone rounded focus:outline-none text-xs"
                  >
                    {Object.keys(statusConfig).map((st) => (
                      <option key={st} value={st}>
                        {statusConfig[st].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-ink/60 uppercase">Zahlungsstatus</label>
                  <select
                    value={editPayment}
                    onChange={(e) => setEditPayment(e.target.value)}
                    className="w-full bg-paper-dark p-2 border border-stone rounded focus:outline-none text-xs"
                  >
                    {Object.keys(paymentConfig).map((pay) => (
                      <option key={pay} value={pay}>
                        {paymentConfig[pay].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-ink/60 uppercase">Interne Notizen (Büro)</label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={4}
                    className="w-full bg-paper-dark p-2 border border-stone rounded focus:outline-none text-xs font-sans font-medium"
                    placeholder="z.B. Rechnung am 25.10. per Post versandt..."
                  />
                </div>

                <div className="flex gap-2 justify-end pt-1">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-xs font-bold border border-stone hover:bg-paper-dark rounded cursor-pointer text-ink/60"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={saveLoading}
                    className="px-3.5 py-1.5 text-xs font-bold bg-olive hover:bg-olive-dark text-paper rounded cursor-pointer shadow-sm"
                  >
                    {saveLoading ? "Speichern..." : "Speichern"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5 text-xs font-medium">
                
                {/* 1. Address Section */}
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-olive border-b border-stone-light/50 pb-1 flex items-center gap-1.5 text-sm">
                    <MapPin className="w-4 h-4 text-terracotta" /> Adressdaten
                  </h4>
                  <div className="bg-paper p-3 rounded border border-stone-light/40 leading-relaxed font-semibold">
                    <p>{selectedReg.firstName} {selectedReg.lastName}</p>
                    <p>{selectedReg.street}</p>
                    <p>{selectedReg.zip} {selectedReg.city}</p>
                    <p className="text-[10px] text-ink/50 uppercase tracking-widest mt-1">
                      Landcode: {selectedReg.country}
                    </p>
                  </div>
                </div>

                {/* 2. Passport Details */}
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-olive border-b border-stone-light/50 pb-1 flex items-center gap-1.5 text-sm">
                    <FileText className="w-4 h-4 text-terracotta" /> Reisepass-Daten
                  </h4>
                  <div className="bg-paper p-3 rounded border border-stone-light/40 space-y-1.5 leading-relaxed font-semibold">
                    <div>
                      <span className="text-ink/40 block text-[9px] uppercase">Name laut Pass</span>
                      <span>{selectedReg.firstNamePassport} {selectedReg.lastNamePassport}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-t border-stone-light/30 pt-1.5">
                      <div>
                        <span className="text-ink/40 block text-[9px] uppercase">Geburtsdatum</span>
                        <span>{new Date(selectedReg.passportDob).toLocaleDateString("de-DE")}</span>
                      </div>
                      <div>
                        <span className="text-ink/40 block text-[9px] uppercase">Nationalität</span>
                        <span>{selectedReg.passportNation}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-t border-stone-light/30 pt-1.5">
                      <div>
                        <span className="text-ink/40 block text-[9px] uppercase">Passnummer</span>
                        <span>{selectedReg.passportNo || "—"}</span>
                      </div>
                      <div>
                        <span className="text-ink/40 block text-[9px] uppercase">Ablaufdatum</span>
                        <span>
                          {selectedReg.passportExpiry
                            ? new Date(selectedReg.passportExpiry).toLocaleDateString("de-DE")
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Package and roommate Details */}
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-olive border-b border-stone-light/50 pb-1 flex items-center gap-1.5 text-sm">
                    <CreditCard className="w-4 h-4 text-terracotta" /> Gebuchte Optionen
                  </h4>
                  <div className="bg-paper p-3 rounded border border-stone-light/40 space-y-1 leading-relaxed font-semibold">
                    <div className="flex justify-between items-baseline">
                      <span className="text-ink/65">{selectedReg.priceOption?.label}</span>
                      <span className="font-bold font-serif text-olive">
                        {selectedReg.priceOption ? formatPrice(Number(selectedReg.priceOption.amount), selectedReg.priceOption.currency) : "—"}
                      </span>
                    </div>
                    {selectedReg.roommateName && (
                      <div className="border-t border-stone-light/30 pt-1.5 mt-1 text-[10px] text-ink/75">
                        <span className="font-bold text-olive block mb-0.5">Zimmerpartner:</span>
                        {selectedReg.roommateName} (Verhältnis: {selectedReg.roommateRelation})
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Allergies & Congregation details */}
                {(selectedReg.allergies || selectedReg.congregation || selectedReg.notes) && (
                  <div className="space-y-2">
                    <h4 className="font-serif font-bold text-olive border-b border-stone-light/50 pb-1 flex items-center gap-1.5 text-sm">
                      <Utensils className="w-4 h-4 text-terracotta" /> Zusatzangaben
                    </h4>
                    <div className="bg-paper p-3 rounded border border-stone-light/40 space-y-1.5 leading-relaxed text-[11px] font-semibold">
                      {selectedReg.congregation && (
                        <div>
                          <span className="text-ink/50 block text-[9px] uppercase">Gemeinde</span>
                          <span>{selectedReg.congregation}</span>
                        </div>
                      )}
                      {selectedReg.allergies && (
                        <div className="border-t border-stone-light/20 pt-1.5">
                          <span className="text-ink/50 block text-[9px] uppercase">Allergien / Diät</span>
                          <span>{selectedReg.allergies}</span>
                        </div>
                      )}
                      {selectedReg.notes && (
                        <div className="border-t border-stone-light/20 pt-1.5">
                          <span className="text-ink/50 block text-[9px] uppercase">Kundenbemerkung</span>
                          <span className="italic">„{selectedReg.notes}“</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. Office Notes */}
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-olive border-b border-stone-light/50 pb-1 flex items-center gap-1.5 text-sm">
                    <Edit3 className="w-4 h-4 text-terracotta" /> Interne Notizen (Büro)
                  </h4>
                  <div className="bg-paper p-3 rounded border border-stone-light/40 text-[11px] font-semibold italic text-ink/70">
                    {selectedReg.adminNotes ? (
                      <p className="whitespace-pre-wrap">{selectedReg.adminNotes}</p>
                    ) : (
                      <p className="text-ink/40">Keine internen Anmerkungen hinterlegt.</p>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-20 font-sans space-y-2">
            <div className="w-12 h-12 bg-olive/5 border border-stone-light rounded-full flex items-center justify-center mx-auto text-olive/40 text-lg">
              📋
            </div>
            <h3 className="font-serif font-bold text-olive text-sm">Keine Buchung ausgewählt</h3>
            <p className="text-xs text-ink/50 max-w-[180px] mx-auto font-medium">
              Wählen Sie einen Reisenden aus der Tabelle aus, um Passdetails und Status zu verwalten.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
