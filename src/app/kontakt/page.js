"use client";

import { use, useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { submitContactInquiry, submitGroupInquiry } from "@/app/actions/inquiries";
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, HelpCircle, Users, Info } from "lucide-react";
import { site } from "@/lib/site";

export default function KontaktPage({ searchParams: searchParamsPromise }) {
  // Support Next.js 15 searchParams resolution
  const searchParams = searchParamsPromise ? use(searchParamsPromise) : {};
  const initialType = searchParams?.typ === "gruppe" ? "group" : "contact";

  const [activeTab, setActiveType] = useState(initialType);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (searchParams?.typ === "gruppe") {
      setActiveType("group");
    } else {
      setActiveType("contact");
    }
  }, [searchParams?.typ]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setErrors({});

    const formData = new FormData(e.target);
    const res = await submitContactInquiry(null, formData);

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

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setErrors({});

    const formData = new FormData(e.target);
    const res = await submitGroupInquiry(null, formData);

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
    <>
      <Header />
      <main className="flex-grow bg-paper py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Page Heading */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h1 className="text-4xl font-serif font-bold text-olive">
              Kontakt & Beratung
            </h1>
            <p className="text-base text-ink/75 font-sans leading-relaxed font-medium">
              Haben Sie Fragen zu einer Israelreise, wünschen Sie eine Beratung oder möchten Sie ein individuelles Gruppenangebot anfordern? Wir sind gerne für Sie da.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left column - Office Info Cards */}
            <div className="lg:col-span-5 space-y-8 font-sans">
              <div className="bg-paper-dark border border-stone-light/60 p-6 rounded-xl space-y-5">
                <h2 className="text-xl font-serif font-bold text-olive border-b border-stone-light pb-2">
                  Büro Deutschland
                </h2>
                <div className="space-y-4 text-sm text-ink/80 font-medium">
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-terracotta flex-shrink-0" />
                    <div>
                      <p className="font-bold text-olive">{site.address.company}</p>
                      <p>{site.address.street}</p>
                      <p>
                        {site.address.zip} {site.address.city}
                      </p>
                      <p>{site.address.country}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="w-5 h-5 text-terracotta flex-shrink-0" />
                    <a href={`tel:${site.phone.deTel}`} className="hover:text-terracotta">
                      {site.phone.de}
                    </a>
                  </div>
                  <div className="flex gap-3">
                    <Mail className="w-5 h-5 text-terracotta flex-shrink-0" />
                    <a href={`mailto:${site.email.info}`} className="hover:text-terracotta">
                      {site.email.info}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-paper p-5 rounded-lg border border-stone-light flex gap-3 text-xs text-ink/70">
                <Info className="w-5 h-5 text-olive flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Unser Büro ist von Montag bis Freitag von 09:00 bis 17:00 Uhr erreichbar. Am Wochenende und an Feiertagen bleibt das Büro geschlossen. Für dringende Reiseanfragen nutzen Sie bitte das Kontaktformular.
                </p>
              </div>
            </div>

            {/* Right column - Interactive forms */}
            <div className="lg:col-span-7 bg-paper border border-stone-light/50 rounded-xl p-6 sm:p-8 space-y-6">
              {/* Tab Selector */}
              <div className="flex border-b border-stone-light font-sans font-semibold text-sm">
                <button
                  onClick={() => { setActiveType("contact"); setStatus(null); setErrors({}); }}
                  className={`flex items-center gap-2 pb-3 px-4 border-b-2 transition-all cursor-pointer ${
                    activeTab === "contact"
                      ? "border-terracotta text-olive font-bold"
                      : "border-transparent text-ink/50 hover:text-ink"
                  }`}
                >
                  <HelpCircle className="w-4 h-4" /> Allgemeine Anfrage
                </button>
                <button
                  onClick={() => { setActiveType("group"); setStatus(null); setErrors({}); }}
                  className={`flex items-center gap-2 pb-3 px-4 border-b-2 transition-all cursor-pointer ${
                    activeTab === "group"
                      ? "border-terracotta text-olive font-bold"
                      : "border-transparent text-ink/50 hover:text-ink"
                  }`}
                >
                  <Users className="w-4 h-4" /> Gruppen- & Gemeindereisen
                </button>
              </div>

              {/* Status Message */}
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

              {/* TAB 1: General Contact Form */}
              {activeTab === "contact" && (
                <form onSubmit={handleContactSubmit} className="space-y-4 font-sans text-sm font-semibold text-olive">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="name" className="block text-xs font-bold text-ink/65 uppercase">
                        Vollständiger Name <span className="text-terracotta">*</span>
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="phone" className="block text-xs font-bold text-ink/65 uppercase">
                        Telefonnummer <span className="text-ink/45">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                        placeholder="z.B. +41 44 801 80 00"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="subject" className="block text-xs font-bold text-ink/65 uppercase">
                        Betreff <span className="text-terracotta">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                        placeholder="z.B. Frage zur Herbstreise 2026"
                      />
                      {errors.subject && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.subject[0]}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="message" className="block text-xs font-bold text-ink/65 uppercase">
                      Ihre Nachricht <span className="text-terracotta">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none font-sans font-medium"
                      placeholder="Geben Sie hier Ihre Fragen oder Mitteilung ein..."
                    />
                    {errors.message && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.message[0]}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary py-3 px-6 font-semibold w-full sm:w-auto text-center cursor-pointer shadow-md"
                  >
                    {loading ? "Wird gesendet..." : "Nachricht senden"}
                  </button>
                </form>
              )}

              {/* TAB 2: Private Group Inquiry Form */}
              {activeTab === "group" && (
                <form onSubmit={handleGroupSubmit} className="space-y-4 font-sans text-sm font-semibold text-olive">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="groupName" className="block text-xs font-bold text-ink/65 uppercase">
                        Kontaktperson / Name <span className="text-terracotta">*</span>
                      </label>
                      <input
                        type="text"
                        id="groupName"
                        name="name"
                        required
                        className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                        placeholder="z.B. Pastor Peter Meier"
                      />
                      {errors.name && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.name[0]}</p>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="groupEmail" className="block text-xs font-bold text-ink/65 uppercase">
                        E-Mail-Adresse <span className="text-terracotta">*</span>
                      </label>
                      <input
                        type="email"
                        id="groupEmail"
                        name="email"
                        required
                        className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                        placeholder="kontakt@gemeinde.de"
                      />
                      {errors.email && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.email[0]}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="groupPhone" className="block text-xs font-bold text-ink/65 uppercase">
                        Telefonnummer (Rückfrage) <span className="text-terracotta">*</span>
                      </label>
                      <input
                        type="text"
                        id="groupPhone"
                        name="phone"
                        required
                        className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                        placeholder="z.B. +49 7445 85010"
                      />
                      {errors.phone && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.phone[0]}</p>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="participantsCount" className="block text-xs font-bold text-ink/65 uppercase">
                        Erwartete Teilnehmerzahl <span className="text-terracotta">*</span>
                      </label>
                      <input
                        type="number"
                        id="participantsCount"
                        name="participantsCount"
                        required
                        min="1"
                        className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                        placeholder="z.B. 25"
                      />
                      {errors.participantsCount && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.participantsCount[0]}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="groupMessage" className="block text-xs font-bold text-ink/65 uppercase">
                      Beschreibung der Gruppenreise <span className="text-terracotta">*</span>
                    </label>
                    <textarea
                      id="groupMessage"
                      name="message"
                      rows={5}
                      required
                      className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none font-sans font-medium"
                      placeholder="Bitte nennen Sie uns Ihren Wunschzeitraum, ungefähre Reisedauer, Route (z.B. Galiläa, Totes Meer, Jerusalem) und besondere Interessen Ihrer Gemeinde..."
                    />
                    {errors.message && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.message[0]}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary py-3 px-6 font-semibold w-full sm:w-auto text-center cursor-pointer shadow-md"
                  >
                    {loading ? "Wird übermittelt..." : "Gruppenreise anfragen"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
