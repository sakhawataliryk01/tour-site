"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateRegistration, syncRegistrationPaymentFromStripe } from "@/app/actions/admin";
import { formatMoney } from "@/lib/format";
import {
  registrationStatusConfig,
  paymentStatusConfig,
  roomLabels,
  roommateRelationLabels,
  countryLabels,
} from "@/lib/admin/registration-labels";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Utensils,
  Settings2,
  CheckCircle,
  XCircle,
  Save,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

const TABS = [
  { id: "kontakt", label: "Kontakt & Adresse", icon: MapPin },
  { id: "pass", label: "Reisepass", icon: FileText },
  { id: "buchung", label: "Buchung & Zahlung", icon: CreditCard },
  { id: "zusatz", label: "Zusatzangaben", icon: Utensils },
  { id: "verwaltung", label: "Verwaltung", icon: Settings2 },
];

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <dt className="text-[10px] font-bold uppercase tracking-wide text-ink/45 mb-1">{label}</dt>
      <dd className="text-sm font-semibold text-ink/90 break-words">{children ?? "—"}</dd>
    </div>
  );
}

function Panel({ title, children, description }) {
  return (
    <section className="bg-paper border border-stone-light/70 rounded-xl overflow-hidden shadow-sm">
      <header className="px-5 py-3.5 border-b border-stone-light/60 bg-paper-dark/40">
        <h2 className="font-serif font-bold text-olive text-base">{title}</h2>
        {description ? (
          <p className="text-[11px] text-ink/50 font-medium mt-0.5">{description}</p>
        ) : null}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export default function RegistrationDetailView({ registration: initial }) {
  const router = useRouter();
  const [reg, setReg] = useState(initial);
  const [tab, setTab] = useState("kontakt");
  const [editStatus, setEditStatus] = useState(initial.status);
  const [editPayment, setEditPayment] = useState(initial.paymentStatus);
  const [editNotes, setEditNotes] = useState(initial.adminNotes || "");
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState(null);

  const st = registrationStatusConfig[reg.status] || {
    label: reg.status,
    style: "bg-zinc-100 text-zinc-600",
  };
  const pay = paymentStatusConfig[reg.paymentStatus] || {
    label: reg.paymentStatus,
    style: "bg-zinc-100 text-zinc-600",
  };

  const salutation = reg.salutation === "MS" ? "Frau" : "Herr";
  const fullName = `${reg.firstName} ${reg.lastName}`;

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const res = await updateRegistration(reg.id, {
      status: editStatus,
      paymentStatus: editPayment,
      adminNotes: editNotes,
    });
    setSaving(false);
    if (res.success) {
      setReg((prev) => ({
        ...prev,
        status: editStatus,
        paymentStatus: editPayment,
        adminNotes: editNotes,
      }));
      setMessage({ success: true, text: res.message });
      router.refresh();
    } else {
      setMessage({ success: false, text: res.message });
    }
  };

  const handleSyncStripe = async () => {
    setSyncing(true);
    setMessage(null);
    const res = await syncRegistrationPaymentFromStripe(reg.id);
    setSyncing(false);
    if (res.success && res.paymentStatus === "FINAL_PAID") {
      setReg((prev) => ({ ...prev, paymentStatus: "FINAL_PAID" }));
      setEditPayment("FINAL_PAID");
      setMessage({ success: true, text: res.message });
      router.refresh();
    } else {
      setMessage({ success: res.success, text: res.message });
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header + Actions */}
      <div className="bg-paper border border-stone-light/70 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div className="space-y-3 min-w-0">
            <Link
              href="/admin/anmeldungen"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/50 hover:text-olive transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Alle Anmeldungen
            </Link>

            <div className="space-y-1.5">
              <p className="text-xs font-mono font-bold text-terracotta tracking-wide">
                {reg.publicId}
              </p>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-olive leading-tight">
                {salutation} {fullName}
              </h1>
              <p className="text-sm text-ink/60 font-medium">
                Reise:{" "}
                <Link
                  href={`/reisen/${reg.tour?.slug}`}
                  target="_blank"
                  className="text-olive font-semibold hover:underline inline-flex items-center gap-1"
                >
                  {reg.tour?.title || "—"}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${st.style}`}>
                Status: {st.label}
              </span>
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${pay.style}`}>
                Zahlung: {pay.label}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-paper-dark border border-stone-light text-ink/55">
                Eingang:{" "}
                {reg.createdAt ? new Date(reg.createdAt).toLocaleString("de-DE") : "—"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end shrink-0">
            <a
              href={`mailto:${reg.email}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-stone bg-paper text-xs font-bold text-olive hover:border-olive transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> E-Mail
            </a>
            {reg.phoneMobile ? (
              <a
                href={`tel:${reg.phoneMobile.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-stone bg-paper text-xs font-bold text-olive hover:border-olive transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Anrufen
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => setTab("verwaltung")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-olive text-paper text-xs font-bold hover:bg-olive-dark transition-colors cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5" /> Status bearbeiten
            </button>
            {reg.stripeCheckoutSessionId && reg.paymentStatus !== "FINAL_PAID" ? (
              <button
                type="button"
                onClick={handleSyncStripe}
                disabled={syncing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-terracotta/40 text-terracotta text-xs font-bold hover:bg-terracotta/10 transition-colors cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Sync…" : "Stripe Sync"}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-light">
        <nav className="flex gap-1 overflow-x-auto -mb-px" aria-label="Buchungsdetails">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                  active
                    ? "border-terracotta text-olive"
                    : "border-transparent text-ink/45 hover:text-olive hover:border-stone"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-xs font-bold flex gap-2 items-center ${
            message.success
              ? "bg-olive/10 text-olive border border-olive/20"
              : "bg-terracotta/10 text-terracotta border border-terracotta/20"
          }`}
        >
          {message.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {/* Tab panels */}
      <div className="space-y-5">
        {tab === "kontakt" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Panel title="Kontaktdaten" description="E-Mail und Telefonnummern aus dem Anmeldeformular">
              <dl className="grid grid-cols-1 gap-4">
                <Field label="E-Mail">
                  <a href={`mailto:${reg.email}`} className="text-terracotta hover:underline">
                    {reg.email || "—"}
                  </a>
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Mobiltelefon">{reg.phoneMobile || "—"}</Field>
                  <Field label="Festnetz">{reg.phonePrivate || "—"}</Field>
                </div>
              </dl>
            </Panel>

            <Panel title="Adressdaten" description="Anschrift für den Schriftverkehr">
              <dl className="grid grid-cols-1 gap-4">
                <Field label="Anrede & Name">
                  {salutation} {fullName}
                </Field>
                <Field label="Strasse / Hausnummer">{reg.street || "—"}</Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="PLZ">{reg.zip || "—"}</Field>
                  <Field label="Ort">{reg.city || "—"}</Field>
                </div>
                <Field label="Land">
                  {countryLabels[reg.country] || reg.country || "—"}
                  {reg.country ? (
                    <span className="text-ink/40 font-mono text-xs ml-1.5">({reg.country})</span>
                  ) : null}
                </Field>
              </dl>
            </Panel>
          </div>
        )}

        {tab === "pass" && (
          <Panel title="Reisepass-Daten" description="Angaben laut Reisepass für Flug & Kontrolle">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Vorname laut Pass">{reg.firstNamePassport || "—"}</Field>
              <Field label="Nachname laut Pass">{reg.lastNamePassport || "—"}</Field>
              <Field label="Geburtsdatum">
                {reg.passportDob ? new Date(reg.passportDob).toLocaleDateString("de-DE") : "—"}
              </Field>
              <Field label="Staatsangehörigkeit">{reg.passportNation || "—"}</Field>
              <Field label="Passnummer">{reg.passportNo || "—"}</Field>
              <Field label="Ablaufdatum">
                {reg.passportExpiry
                  ? new Date(reg.passportExpiry).toLocaleDateString("de-DE")
                  : "—"}
              </Field>
            </dl>
          </Panel>
        )}

        {tab === "buchung" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Panel title="Preispaket & Zimmer">
              <dl className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-start gap-3">
                  <Field label="Preispaket">{reg.priceOption?.label || "—"}</Field>
                  <span className="font-serif font-bold text-lg text-olive shrink-0">
                    {reg.priceOption
                      ? formatMoney(Number(reg.priceOption.amount), reg.priceOption.currency)
                      : "—"}
                  </span>
                </div>
                <Field label="Zimmerart">
                  {roomLabels[reg.roomType] || reg.roomType || "—"}
                </Field>
                <Field label="Zimmerpartner">{reg.roommateName || "—"}</Field>
                <Field label="Verhältnis">
                  {reg.roommateRelation
                    ? roommateRelationLabels[reg.roommateRelation] || reg.roommateRelation
                    : "—"}
                </Field>
              </dl>
            </Panel>

            <Panel title="Stripe / Zahlung" description="Online-Zahlungsreferenzen">
              <dl className="grid grid-cols-1 gap-4">
                <Field label="Zahlungsstatus">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${pay.style}`}>
                    {pay.label}
                  </span>
                </Field>
                <Field label="Checkout Session">
                  <span className="font-mono text-xs break-all">
                    {reg.stripeCheckoutSessionId || "—"}
                  </span>
                </Field>
                <Field label="Payment Intent">
                  <span className="font-mono text-xs break-all">
                    {reg.stripePaymentIntentId || "—"}
                  </span>
                </Field>
              </dl>
            </Panel>
          </div>
        )}

        {tab === "zusatz" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Panel title="Optionale Angaben">
              <dl className="grid grid-cols-1 gap-4">
                <Field label="Gemeindezugehörigkeit">{reg.congregation || "—"}</Field>
                <Field label="Allergien / Diät">{reg.allergies || "—"}</Field>
                <Field label="Sonderwünsche / Mitteilung">
                  {reg.notes ? <span className="italic">„{reg.notes}“</span> : "—"}
                </Field>
              </dl>
            </Panel>
            <Panel title="Einwilligung">
              <dl className="grid grid-cols-1 gap-4">
                <Field label="AGB akzeptiert am">
                  {reg.termsAcceptedAt
                    ? new Date(reg.termsAcceptedAt).toLocaleString("de-DE")
                    : "—"}
                </Field>
                <Field label="Zuletzt aktualisiert">
                  {reg.updatedAt ? new Date(reg.updatedAt).toLocaleString("de-DE") : "—"}
                </Field>
              </dl>
            </Panel>
          </div>
        )}

        {tab === "verwaltung" && (
          <Panel
            title="Status & interne Notizen"
            description="Änderungen werden im Audit-Log gespeichert"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-ink/55 uppercase">
                  Buchungsstatus
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-paper-dark p-2.5 border border-stone rounded-md focus:border-olive focus:outline-none text-sm font-semibold text-olive"
                >
                  {Object.entries(registrationStatusConfig).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-ink/55 uppercase">
                  Zahlungsstatus
                </label>
                <select
                  value={editPayment}
                  onChange={(e) => setEditPayment(e.target.value)}
                  className="w-full bg-paper-dark p-2.5 border border-stone rounded-md focus:border-olive focus:outline-none text-sm font-semibold text-olive"
                >
                  {Object.entries(paymentStatusConfig).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-[10px] font-bold text-ink/55 uppercase">
                  Interne Notizen (Büro)
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={5}
                  className="w-full bg-paper-dark p-3 border border-stone rounded-md focus:border-olive focus:outline-none text-sm font-medium"
                  placeholder="z.B. Rückruf am …, Rechnung versandt …"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 btn-primary py-2.5 px-5 text-sm font-bold cursor-pointer disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Speichern…" : "Änderungen speichern"}
                </button>
              </div>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
