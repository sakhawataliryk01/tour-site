"use client";

import { useState } from "react";
import { submitInterestSignup } from "@/app/actions/inquiries";
import { CheckCircle, AlertCircle, ArrowLeft, ClipboardCheck } from "lucide-react";
import Link from "next/link";

export default function InterestForm({ tour }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setErrors({});

    const formData = new FormData(e.target);
    formData.append("tourId", tour.id);

    const res = await submitInterestSignup(null, formData);

    setLoading(false);
    if (res.success) {
      setStatus({ success: true, message: res.message });
      e.target.reset();
    } else {
      if (res.errors) {
        setErrors(res.errors);
      } else {
        setStatus({ success: false, message: res.message });
      }
    }
  };

  return (
    <div className="bg-paper border border-stone-light/50 rounded-xl p-6 sm:p-8 space-y-6">
      {status && (
        <div
          className={`p-4 rounded-lg flex gap-3 text-sm font-sans font-semibold items-start ${
            status.success
              ? "bg-olive/10 text-olive border border-olive/30"
              : "bg-terracotta/10 text-terracotta border border-terracotta/30"
          }`}
        >
          {status.success ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <p>{status.message}</p>
        </div>
      )}

      {status?.success ? (
        <div className="text-center py-6 font-sans space-y-4">
          <div className="w-16 h-16 bg-olive/10 rounded-full flex items-center justify-center mx-auto">
            <ClipboardCheck className="w-8 h-8 text-olive" />
          </div>
          <h2 className="text-xl font-serif font-bold text-olive">Erfolgreich eingetragen!</h2>
          <p className="text-sm text-ink/75 leading-relaxed font-medium max-w-sm mx-auto">
            Wir haben Ihre Kontaktdaten erfasst. Sobald die offizielle Anmeldung für die Reise startet, benachrichtigen wir Sie umgehend.
          </p>
          <div className="pt-4">
            <Link href={`/reisen/${tour.slug}`} className="btn-secondary py-2.5 px-6 text-xs font-semibold inline-block">
              Zurück zur Reisebeschreibung
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm font-semibold text-olive">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-xs font-bold text-ink/65 uppercase">
              Ihr Name <span className="text-terracotta">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              placeholder="z.B. Hans Muster"
            />
            {errors.name && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.name[0]}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-xs font-bold text-ink/65 uppercase">
              E-Mail-Adresse <span className="text-terracotta">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              placeholder="ihre.adresse@beispiel.ch"
            />
            {errors.email && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.email[0]}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="notes" className="block text-xs font-bold text-ink/65 uppercase">
              Bemerkungen / Sonderwünsche <span className="text-ink/45">(Optional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none font-sans font-medium"
              placeholder="z.B. Interesse an Einzelzimmer, Flughafen-Präferenz..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3 px-6 font-semibold w-full text-center cursor-pointer shadow-md"
            >
              {loading ? "Wird eingetragen..." : "Unverbindlich eintragen"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
