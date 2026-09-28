"use client";

import { useEffect, useState } from "react";
import { createTour, duplicateTour, setTourStatus } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import {
  Copy,
  Calendar,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Plus,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

const emptyForm = {
  title: "",
  subtitle: "",
  year: new Date().getFullYear() + 1,
  startDate: "",
  endDate: "",
  category: "STANDARD",
  excerpt: "",
  overview: "",
  minParticipants: 22,
  targetGroupSize: 27,
  doubleRooms: 15,
  singleRooms: 5,
  priceLabel: "Landprogramm (ohne Flug)",
  priceAmount: "",
  priceCurrency: "EUR",
  registrationMode: "CLOSED",
  status: "DRAFT",
};

export default function ToursListManager({ tours: initialTours }) {
  const router = useRouter();
  const [tours, setTours] = useState(initialTours);
  const [loadingId, setLoadingId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setTours(initialTours);
  }, [initialTours]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setFeedback(null);
    setErrors({});

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""));
    });

    const res = await createTour(null, formData);
    setCreating(false);

    if (res.success) {
      setFeedback({ success: true, message: res.message });
      setShowForm(false);
      setForm(emptyForm);
      router.refresh();
    } else {
      setErrors(res.errors || {});
      setFeedback({ success: false, message: res.message || "Speichern fehlgeschlagen." });
    }
  };

  const handleDuplicate = async (tourId) => {
    setLoadingId(tourId);
    setFeedback(null);

    const res = await duplicateTour(tourId);
    setLoadingId(null);

    if (res.success) {
      setFeedback({ success: true, message: res.message });
      router.refresh();
    } else {
      setFeedback({ success: false, message: res.message });
    }
  };

  const handleTogglePublish = async (tour) => {
    setLoadingId(tour.id);
    setFeedback(null);
    const nextStatus = tour.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const res = await setTourStatus(tour.id, nextStatus);
    setLoadingId(null);

    if (res.success) {
      setTours((prev) =>
        prev.map((t) => (t.id === tour.id ? { ...t, status: nextStatus } : t))
      );
      setFeedback({ success: true, message: res.message });
      router.refresh();
    } else {
      setFeedback({ success: false, message: res.message });
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center bg-paper-dark border border-stone-light/60 p-4 rounded-xl">
        <span className="text-xs font-semibold text-ink/65">
          Insgesamt {tours.length} Reiseprogramme erfasst.
        </span>
        <button
          type="button"
          onClick={() => {
            setShowForm((v) => !v);
            setFeedback(null);
            setErrors({});
          }}
          className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span className="relative inline-flex h-4 w-4 shrink-0" aria-hidden>
            <Plus className={`absolute inset-0 h-4 w-4 ${showForm ? "invisible" : ""}`} />
            <X className={`absolute inset-0 h-4 w-4 ${showForm ? "" : "invisible"}`} />
          </span>
          {showForm ? "Formular schliessen" : "Neue Reise anlegen"}
        </button>
      </div>

      {feedback ? (
        <div
          className={`p-4 rounded-lg text-sm font-semibold flex gap-2.5 items-center ${
            feedback.success
              ? "bg-olive/10 text-olive border border-olive/30"
              : "bg-terracotta/10 text-terracotta border border-terracotta/30"
          }`}
        >
          <span className="relative inline-flex h-5 w-5 shrink-0" aria-hidden>
            <CheckCircle className={`absolute inset-0 h-5 w-5 ${feedback.success ? "" : "invisible"}`} />
            <AlertCircle className={`absolute inset-0 h-5 w-5 ${feedback.success ? "invisible" : ""}`} />
          </span>
          <p>{feedback.message}</p>
        </div>
      ) : null}

      <div className={showForm ? "block" : "hidden"}>
        <form
          onSubmit={handleCreate}
          className="bg-paper-dark border border-stone p-6 rounded-xl space-y-5 shadow-sm"
        >
          <div className="border-b border-stone-light pb-3">
            <h2 className="text-lg font-serif font-bold text-olive">Neue Israelreise anlegen</h2>
            <p className="text-xs text-ink/55 font-semibold mt-1">
              Basisdaten, Kapazität und ein Startpreis. Tagesprogramm können Sie später ergänzen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-olive">
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Titel *</label>
              <input
                required
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                placeholder="z.B. Frühjahrsreise 2028"
              />
              {errors.title && <p className="text-terracotta">{errors.title[0]}</p>}
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Untertitel</label>
              <input
                value={form.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                placeholder="Kurzer Zusatztext"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Jahr *</label>
              <input
                type="number"
                required
                value={form.year}
                onChange={(e) => updateField("year", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Kategorie *</label>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              >
                <option value="STANDARD">Standard-Studienreise</option>
                <option value="BUDGET">Budgetreise</option>
                <option value="YOUTH">Jugendreise</option>
                <option value="RELAXED">Erholungsreise</option>
                <option value="SPECIAL">Sonderreise</option>
                <option value="PRIVATE">Private Gruppe</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Startdatum *</label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Enddatum *</label>
              <input
                type="date"
                required
                value={form.endDate}
                onChange={(e) => updateField("endDate", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Doppelzimmer</label>
              <input
                type="number"
                min="0"
                value={form.doubleRooms}
                onChange={(e) => updateField("doubleRooms", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Einzelzimmer</label>
              <input
                type="number"
                min="0"
                value={form.singleRooms}
                onChange={(e) => updateField("singleRooms", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Preisbezeichnung *</label>
              <input
                required
                value={form.priceLabel}
                onChange={(e) => updateField("priceLabel", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase text-ink/55">Betrag *</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={form.priceAmount}
                  onChange={(e) => updateField("priceAmount", e.target.value)}
                  className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                  placeholder="1890"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase text-ink/55">Währung</label>
                <select
                  value={form.priceCurrency}
                  onChange={(e) => updateField("priceCurrency", e.target.value)}
                  className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                >
                  <option value="EUR">EUR</option>
                  <option value="CHF">CHF</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Anmeldungsmodus</label>
              <select
                value={form.registrationMode}
                onChange={(e) => updateField("registrationMode", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              >
                <option value="CLOSED">Geschlossen</option>
                <option value="INTEREST">Interessenliste</option>
                <option value="OPEN">Online-Anmeldung offen</option>
                <option value="WAITLIST">Warteliste</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              >
                <option value="DRAFT">Entwurf (nicht öffentlich)</option>
                <option value="PUBLISHED">Sofort veröffentlichen</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Kurzbeschreibung</label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none font-medium"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Überblick / Beschreibung</label>
              <textarea
                rows={4}
                value={form.overview}
                onChange={(e) => updateField("overview", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-stone-light">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-bold border border-stone rounded-md text-ink/60 hover:bg-paper cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={creating}
              className="btn-primary py-2 px-5 text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {creating ? "Wird angelegt..." : "Reise speichern"}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tours.map((tour) => {
          const regCount = tour.registrations.length;
          const doubleCap = tour.capacity?.doubleRooms || 15;
          const singleCap = tour.capacity?.singleRooms || 5;
          const totalCap = doubleCap * 2 + singleCap;

          return (
            <div
              key={tour.id}
              className={`bg-paper-dark border border-stone p-5 rounded-xl space-y-4 shadow-sm flex flex-col justify-between ${
                tour.status === "DRAFT" ? "border-dashed opacity-90" : ""
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-terracotta">
                        {tour.id.slice(0, 5).toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          tour.status === "PUBLISHED"
                            ? "bg-olive/10 text-olive"
                            : "bg-stone text-ink/60"
                        }`}
                      >
                        {tour.status === "PUBLISHED" ? "Veröffentlicht" : "Entwurf"}
                      </span>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-olive leading-tight">
                      {tour.title}
                    </h3>
                  </div>

                  {tour.status === "PUBLISHED" && (
                    <Link
                      href={`/reisen/${tour.slug}`}
                      target="_blank"
                      className="p-1.5 border border-stone-light/60 bg-paper hover:bg-paper-dark rounded hover:text-terracotta transition-all text-ink/50"
                      title="In neuem Tab ansehen"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>

                <p className="text-xs text-ink/60 leading-relaxed font-semibold">
                  {tour.subtitle || "Geführte christliche Israel-Studienreise"}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-light/40 text-xs font-semibold text-ink/75">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-terracotta" />
                    <span>
                      {formatDate(tour.startDate)} – {formatDate(tour.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-terracotta" />
                    <span>
                      {tour.durationDays} Tage • Saison {tour.year}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs font-semibold text-olive border-t border-stone-light/40">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-terracotta" />
                    <span>Auslastung: {regCount} gebucht</span>
                  </div>
                  <span className="text-[10px] text-ink/40">Zielkapazität: {totalCap} Pers.</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-light/40 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(tour)}
                  disabled={loadingId === tour.id}
                  className="px-3.5 py-1.5 bg-paper hover:bg-paper-dark border border-stone rounded font-bold text-xs text-olive hover:text-terracotta flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <span className="relative inline-flex h-3.5 w-3.5 shrink-0" aria-hidden>
                    <EyeOff
                      className={`absolute inset-0 h-3.5 w-3.5 ${
                        tour.status === "PUBLISHED" ? "" : "invisible"
                      }`}
                    />
                    <Eye
                      className={`absolute inset-0 h-3.5 w-3.5 ${
                        tour.status === "PUBLISHED" ? "invisible" : ""
                      }`}
                    />
                  </span>
                  {tour.status === "PUBLISHED" ? "Als Entwurf" : "Veröffentlichen"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDuplicate(tour.id)}
                  disabled={loadingId === tour.id}
                  className="px-3.5 py-1.5 bg-paper hover:bg-paper-dark border border-stone rounded font-bold text-xs text-olive hover:text-terracotta flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {loadingId === tour.id ? "Bitte warten..." : "Duplizieren"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
