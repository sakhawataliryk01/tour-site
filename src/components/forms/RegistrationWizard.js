"use client";

import { useState } from "react";
import { submitRegistration } from "@/app/actions/registrations";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhoneInput from "@/components/forms/PhoneInput";
import { reformatPhoneForCountry } from "@/lib/phone-format";
import { computeRegistrationChargeTotal } from "@/lib/pricing";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  MapPin, 
  Plane, 
  CreditCard, 
  Info,
  ShieldAlert,
  ClipboardList
} from "lucide-react";

export default function RegistrationWizard({ tour }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Form Fields State
  const [formData, setFormData] = useState({
    priceOptionId: tour.prices?.[0]?.id || "",
    salutation: "MR",
    firstName: "",
    lastName: "",
    firstNamePassport: "",
    lastNamePassport: "",
    street: "",
    zip: "",
    city: "",
    country: "CH",
    email: "",
    phoneMobile: "",
    phonePrivate: "",
    passportDob: "",
    passportNation: "Schweiz",
    passportNo: "",
    passportExpiry: "",
    roomType: "DOUBLE",
    roommateName: "",
    roommateRelation: "MARRIED",
    allergies: "",
    congregation: "",
    notes: "",
    termsAccepted: false,
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateCountry = (country) => {
    setFormData((prev) => ({
      ...prev,
      country,
      phoneMobile: reformatPhoneForCountry(prev.phoneMobile, country),
      phonePrivate: reformatPhoneForCountry(prev.phonePrivate, country),
    }));
  };

  const handleNext = () => {
    // Basic validations for current steps
    const stepErrors = {};
    if (step === 1) {
      if (!formData.priceOptionId) stepErrors.priceOptionId = "Bitte wählen Sie eine Preiskategorie.";
    } else if (step === 2) {
      if (!formData.firstName) stepErrors.firstName = "Vorname ist erforderlich.";
      if (!formData.lastName) stepErrors.lastName = "Nachname ist erforderlich.";
      if (!formData.email) stepErrors.email = "E-Mail ist erforderlich.";
      if (!formData.street) stepErrors.street = "Strasse/Nr. ist erforderlich.";
      if (!formData.zip) stepErrors.zip = "PLZ ist erforderlich.";
      if (!formData.city) stepErrors.city = "Ort ist erforderlich.";
    } else if (step === 3) {
      if (!formData.firstNamePassport) stepErrors.firstNamePassport = "Vorname laut Pass ist erforderlich.";
      if (!formData.lastNamePassport) stepErrors.lastNamePassport = "Nachname laut Pass ist erforderlich.";
      if (!formData.passportDob) stepErrors.passportDob = "Geburtsdatum ist erforderlich.";
      if (!formData.passportNation) stepErrors.passportNation = "Staatsangehörigkeit ist erforderlich.";
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      setErrors({ termsAccepted: "Sie müssen den Allgemeinen Reisebedingungen zustimmen." });
      return;
    }

    setLoading(true);
    setStatus(null);
    setErrors({});

    const res = await submitRegistration({
      ...formData,
      tourId: tour.id,
    });

    setLoading(false);
    if (res.success && res.checkoutUrl) {
      window.location.href = res.checkoutUrl;
      return;
    }
    if (res.success && res.publicId) {
      router.push(`/reisen/${tour.slug}/anmeldung/bestaetigt?id=${res.publicId}`);
      return;
    }

    if (res.errors) {
      setErrors(res.errors);
      if (res.errors.priceOptionId) setStep(1);
      else if (res.errors.firstName || res.errors.lastName || res.errors.email) setStep(2);
      else if (res.errors.passportDob || res.errors.firstNamePassport) setStep(3);
    } else {
      setStatus({ success: false, message: res.message });
    }
  };

  // Find currently selected price details
  const selectedPriceOption = tour.prices?.find(p => p.id === formData.priceOptionId);
  const singleRoomSurcharge = tour.prices?.find(
    (p) =>
      p.isSurcharge &&
      p.roomType === "SINGLE" &&
      (!selectedPriceOption || p.currency === selectedPriceOption.currency),
  );
  const chargeTotal = computeRegistrationChargeTotal({
    priceOption: selectedPriceOption,
    roomType: formData.roomType,
    allPrices: tour.prices || [],
  });

  const formatPrice = (amount, currency) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-paper border border-stone-light/60 p-6 sm:p-8 rounded-xl shadow-sm space-y-6">
      {/* Step Indicator Headers */}
      <div className="grid grid-cols-4 gap-2 border-b border-stone-light pb-4 font-sans text-[10px] sm:text-xs font-bold text-center">
        {[
          { label: "Optionen", num: 1 },
          { label: "Personalien", num: 2 },
          { label: "Reisepass", num: 3 },
          { label: "Zusatz & AGB", num: 4 }
        ].map((s) => (
          <div
            key={s.num}
            className={`pb-2 border-b-2 transition-all ${
              step >= s.num
                ? "border-terracotta text-olive font-extrabold"
                : "border-transparent text-ink/35"
            }`}
          >
            <span className="block text-sm font-serif">{s.num}</span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {status && (
        <div className="p-4 bg-terracotta/10 text-terracotta border border-terracotta/30 rounded-lg text-sm font-sans font-semibold">
          {status.message}
        </div>
      )}

      {/* STEP 1: OPTIONS & PACKAGE SELECTOR */}
      {step === 1 && (
        <div className="space-y-6 font-sans text-sm font-semibold text-olive">
          <div className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-olive">1. Reiseoption & Unterkunft wählen</h2>
            <p className="text-xs text-ink/65 font-medium leading-relaxed">
              Wählen Sie bitte das gewünschte Buchungspaket (z.B. Landprogramm oder inklusive Linienflug) sowie Ihre Zimmerkategorie.
            </p>
          </div>

          {/* Pricing Options Cards */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-ink/65 uppercase">Verfügbare Preispakete</label>
            <div className="grid grid-cols-1 gap-3">
              {tour.prices?.filter(p => !p.isSurcharge).map((price) => (
                <label
                  key={price.id}
                  onClick={() => updateField("priceOptionId", price.id)}
                  className={`border rounded-lg p-4 flex justify-between items-center cursor-pointer transition-all ${
                    formData.priceOptionId === price.id
                      ? "border-olive bg-paper-dark shadow-sm"
                      : "border-stone-light/60 hover:border-stone bg-paper"
                  }`}
                >
                  <div className="flex gap-3 items-center">
                    <input
                      type="radio"
                      name="priceOption"
                      checked={formData.priceOptionId === price.id}
                      onChange={() => {}}
                      className="text-olive focus:ring-olive w-4 h-4 cursor-pointer"
                    />
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-ink block leading-none">{price.label}</span>
                      <span className="text-xs text-ink/50 font-medium">
                        {price.includesFlight ? `Inkl. Linienflug ab ${price.departureAirport}` : "Landprogramm ohne Flug"}
                      </span>
                    </div>
                  </div>
                  <span className="text-base font-serif font-extrabold text-olive">
                    {formatPrice(Number(price.amount), price.currency)}
                  </span>
                </label>
              ))}
              {errors.priceOptionId && <p className="text-xs text-terracotta">{errors.priceOptionId}</p>}
            </div>
          </div>

          {/* Room Type Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-ink/65 uppercase">Unterkunft & Zimmerbelegung</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { type: "DOUBLE", label: "Doppelzimmer", desc: "Zweierbelegung" },
                { type: "SINGLE", label: "Einzelzimmer", desc: "Einzelbelegung" },
                { type: "SHARED_DOUBLE", label: "Halbes Doppelzimmer", desc: "Zimmerpartner wird zugewiesen" },
              ].map((room) => (
                <label
                  key={room.type}
                  onClick={() => updateField("roomType", room.type)}
                  className={`border rounded-lg p-3.5 text-center cursor-pointer transition-all space-y-1 block ${
                    formData.roomType === room.type
                      ? "border-olive bg-paper-dark shadow-sm"
                      : "border-stone-light/60 hover:border-stone bg-paper"
                  }`}
                >
                  <input
                    type="radio"
                    name="roomType"
                    checked={formData.roomType === room.type}
                    onChange={() => {}}
                    className="sr-only"
                  />
                  <span className="text-sm font-bold block text-ink leading-tight">{room.label}</span>
                  <span className="text-xs text-ink/50 block font-medium">{room.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Conditional roommate inputs */}
          {formData.roomType === "DOUBLE" && (
            <div className="p-4 bg-paper-dark rounded-lg border border-stone-light/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink/65 uppercase">Name des Zimmerpartners</label>
                <input
                  type="text"
                  value={formData.roommateName}
                  onChange={(e) => updateField("roommateName", e.target.value)}
                  className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                  placeholder="z.B. Anna Muster"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink/65 uppercase">Verhältnis / Beziehung</label>
                <select
                  value={formData.roommateRelation}
                  onChange={(e) => updateField("roommateRelation", e.target.value)}
                  className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                >
                  <option value="MARRIED">Ehepartner (Ehepaar)</option>
                  <option value="RELATED">Verwandter (Geschwister etc.)</option>
                  <option value="FRIENDS">Kollege / Bekannter</option>
                </select>
              </div>
            </div>
          )}

          {formData.roomType === "SINGLE" && singleRoomSurcharge && (
            <div className="p-4 bg-terracotta/5 border border-terracotta/20 text-xs text-ink/80 rounded-lg flex gap-3 font-medium leading-relaxed">
              <Info className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-olive block mb-0.5">Hinweis zum Einzelzimmer:</span>
                Es fällt ein Einzelzimmer-Zuschlag von{" "}
                <strong>
                  {formatPrice(Number(singleRoomSurcharge.amount), singleRoomSurcharge.currency)}
                </strong>{" "}
                an. Dieser wird bei der Online-Zahlung (Stripe) zum Paketpreis hinzugerechnet.
              </div>
            </div>
          )}

          {formData.roomType === "SHARED_DOUBLE" && (
            <div className="p-4 bg-paper-dark border border-stone-light/60 text-xs text-ink/80 rounded-lg flex gap-3 font-medium leading-relaxed">
              <Info className="w-5 h-5 text-olive flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-olive block mb-0.5">Zuweisung eines Zimmerpartners:</span>
                Sie buchen ein halbes Doppelzimmer. Wir bemühen uns, Ihnen einen gleichgeschlechtlichen Zimmerpartner zuzuweisen. Sollte sich kein Partner finden, berechnen wir die Hälfte des Einzelzimmerzuschlags.
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: PERSONALIEN */}
      {step === 2 && (
        <div className="space-y-4 font-sans text-sm font-semibold text-olive">
          <div className="space-y-1.5 mb-2">
            <h2 className="text-xl font-serif font-bold text-olive">2. Ihre persönlichen Daten</h2>
            <p className="text-xs text-ink/65 font-medium">Geben Sie hier Ihre Adress- und Kontaktdaten für den Schriftverkehr ein.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink/65 uppercase">Anrede <span className="text-terracotta">*</span></label>
              <select
                value={formData.salutation}
                onChange={(e) => updateField("salutation", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              >
                <option value="MR">Herr</option>
                <option value="MS">Frau</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink/65 uppercase">Vorname <span className="text-terracotta">*</span></label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                required
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                placeholder="Hans"
              />
              {errors.firstName && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.firstName}</p>}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink/65 uppercase">Nachname <span className="text-terracotta">*</span></label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                required
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                placeholder="Muster"
              />
              {errors.lastName && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-ink/65 uppercase">E-Mail-Adresse <span className="text-terracotta">*</span></label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
              className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              placeholder="hans.muster@gmx.ch"
            />
            {errors.email && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-ink/65 uppercase">Land <span className="text-terracotta">*</span></label>
              <select
                value={formData.country}
                onChange={(e) => updateCountry(e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none max-w-md"
              >
                <option value="CH">Schweiz (+41)</option>
                <option value="DE">Deutschland (+49)</option>
                <option value="AT">Österreich (+43)</option>
                <option value="FR">Frankreich (+33)</option>
                <option value="IT">Italien (+39)</option>
              </select>
              <p className="text-[11px] text-ink/50 font-medium">
                Telefonnummern werden automatisch mit Ländervorwahl formatiert (z.&nbsp;B. +41 79 123 45 67).
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink/65 uppercase">Mobiltelefon <span className="text-ink/45">(Empfohlen)</span></label>
              <PhoneInput
                value={formData.phoneMobile}
                onChange={(v) => updateField("phoneMobile", v)}
                country={formData.country}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink/65 uppercase">Telefon Festnetz <span className="text-ink/45">(Optional)</span></label>
              <PhoneInput
                value={formData.phonePrivate}
                onChange={(v) => updateField("phonePrivate", v)}
                country={formData.country}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-ink/65 uppercase">Strasse, Hausnummer <span className="text-terracotta">*</span></label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => updateField("street", e.target.value)}
              required
              className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              placeholder="Ringstrasse 12"
            />
            {errors.street && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.street}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink/65 uppercase">PLZ <span className="text-terracotta">*</span></label>
              <input
                type="text"
                value={formData.zip}
                onChange={(e) => updateField("zip", e.target.value)}
                required
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                placeholder="8600"
              />
              {errors.zip && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.zip}</p>}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink/65 uppercase">Ort <span className="text-terracotta">*</span></label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                required
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                placeholder="Dübendorf"
              />
              {errors.city && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.city}</p>}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: REISEPASS DATEN */}
      {step === 3 && (
        <div className="space-y-4 font-sans text-sm font-semibold text-olive">
          <div className="space-y-1.5 mb-2">
            <h2 className="text-xl font-serif font-bold text-olive">3. Passdaten laut Reisepass</h2>
            <p className="text-xs text-ink/65 font-medium leading-relaxed">
              Für Sicherheitskontrollen und Flugbuchungen müssen Ihre Daten <strong>exakt buchstabengetreu</strong> mit Ihrem Reisepass übereinstimmen!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink/65 uppercase">Vorname laut Pass <span className="text-terracotta">*</span></label>
              <input
                type="text"
                value={formData.firstNamePassport}
                onChange={(e) => updateField("firstNamePassport", e.target.value)}
                required
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                placeholder="Hans Peter"
              />
              {errors.firstNamePassport && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.firstNamePassport}</p>}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink/65 uppercase">Nachname laut Pass <span className="text-terracotta">*</span></label>
              <input
                type="text"
                value={formData.lastNamePassport}
                onChange={(e) => updateField("lastNamePassport", e.target.value)}
                required
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                placeholder="Muster"
              />
              {errors.lastNamePassport && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.lastNamePassport}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink/65 uppercase">Geburtsdatum <span className="text-terracotta">*</span></label>
              <input
                type="date"
                value={formData.passportDob}
                onChange={(e) => updateField("passportDob", e.target.value)}
                required
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              />
              {errors.passportDob && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.passportDob}</p>}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink/65 uppercase">Staatsangehörigkeit <span className="text-terracotta">*</span></label>
              <input
                type="text"
                value={formData.passportNation}
                onChange={(e) => updateField("passportNation", e.target.value)}
                required
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                placeholder="z.B. Schweizerisch"
              />
              {errors.passportNation && <p className="text-xs text-terracotta font-medium mt-0.5">{errors.passportNation}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink/65 uppercase">Passnummer <span className="text-ink/45">(Optional nachreichbar)</span></label>
              <input
                type="text"
                value={formData.passportNo}
                onChange={(e) => updateField("passportNo", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                placeholder="z.B. X1234567"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink/65 uppercase">Ablaufdatum Pass <span className="text-ink/45">(Optional nachreichbar)</span></label>
              <input
                type="date"
                value={formData.passportExpiry}
                onChange={(e) => updateField("passportExpiry", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-terracotta/5 border border-terracotta/20 text-xs text-ink/85 rounded-lg flex gap-3 leading-relaxed font-medium">
            <ShieldAlert className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
            <div>
              <strong>Reisepass-Ablauffrist beachten:</strong> Ihr Reisepass muss am Tag der Einreise nach Israel noch <strong>mindestens 6 Monate gültig sein</strong>. Falls Sie diese Angaben nachreichen möchten, lassen Sie die Felder bitte einfach leer.
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: CLOSING & AGBS */}
      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-6 font-sans text-sm font-semibold text-olive">
          <div className="space-y-1.5">
            <h2 className="text-xl font-serif font-bold text-olive">4. Ergänzungen & AGB-Zustimmung</h2>
            <p className="text-xs text-ink/65 font-medium">Fast geschafft! Schliessen Sie Ihre Buchungsanmeldung hier ab.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink/65 uppercase">Gemeindezugehörigkeit <span className="text-ink/45">(Optional)</span></label>
              <input
                type="text"
                value={formData.congregation}
                onChange={(e) => updateField("congregation", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                placeholder="z.B. Freie Evangelische Gemeinde"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink/65 uppercase">Lebensmittel-Allergien <span className="text-ink/45">(Optional)</span></label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => updateField("allergies", e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                placeholder="z.B. Laktoseintoleranz, Glutenfrei"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-ink/65 uppercase">Sonderwünsche / Mitteilung an das Büro <span className="text-ink/45">(Optional)</span></label>
            <textarea
              value={formData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={3}
              className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none font-sans font-medium"
              placeholder="Geben Sie hier eventuelle Fragen oder Bemerkungen ein..."
            />
          </div>

          {/* Booking Summary block */}
          <div className="p-4 bg-paper-dark rounded-lg border border-stone-light/70 space-y-3">
            <h4 className="font-serif font-bold text-sm text-olive flex items-center gap-1.5 border-b border-stone-light/50 pb-1.5">
              <ClipboardList className="w-4 h-4 text-terracotta" /> Zusammenfassung Ihrer Buchung
            </h4>
            <div className="grid grid-cols-2 gap-y-2 text-xs font-medium text-ink/80">
              <span>Reise:</span>
              <span className="text-right font-bold text-olive truncate">{tour.title}</span>
              <span>Kategorie:</span>
              <span className="text-right font-bold text-olive">{selectedPriceOption?.label || "Ausgewähltes Paket"}</span>
              <span>Zimmer:</span>
              <span className="text-right font-bold text-olive">
                {formData.roomType === "DOUBLE" ? `Doppelzimmer (Partner: ${formData.roommateName || "Zuweisen"})` : formData.roomType === "SINGLE" ? "Einzelzimmer" : "Zuweisung Doppelzimmer"}
              </span>
              <span>Teilnehmer:</span>
              <span className="text-right font-bold text-olive">{formData.firstName} {formData.lastName}</span>
              {chargeTotal && (
                <>
                  <span>Zu zahlen (inkl. Zuschläge):</span>
                  <span className="text-right font-bold text-terracotta text-sm">
                    {formatPrice(chargeTotal.amount, chargeTotal.currency)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Legal Accept Checkboxes */}
          <div className="space-y-4 pt-2 border-t border-stone-light/60">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => updateField("termsAccepted", e.target.checked)}
                className="mt-1 text-olive focus:ring-olive w-4 h-4 rounded cursor-pointer"
              />
              <span className="text-xs text-ink/75 leading-relaxed font-medium">
                Ich stimme den <Link href="/agb" target="_blank" className="text-terracotta font-semibold hover:underline">Allgemeinen Reisebedingungen (AGB)</Link> zu und bestätige, dass ich die detaillierten Stornierungssätze und Passauflagen zur Kenntnis genommen habe. <span className="text-terracotta">*</span>
              </span>
            </label>
            {errors.termsAccepted && <p className="text-xs text-terracotta font-medium">{errors.termsAccepted}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3 px-6 font-semibold w-full text-center cursor-pointer shadow-md text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                "Weiterleitung zu Stripe…"
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Verbindlich anmelden &amp; zur Zahlung
                  {chargeTotal
                    ? ` (${formatPrice(chargeTotal.amount, chargeTotal.currency)})`
                    : ""}
                </>
              )}
            </button>
            <p className="text-[10px] text-ink/50 text-center mt-2 leading-tight">
              Nach dem Absenden werden Sie zur sicheren Stripe-Zahlung weitergeleitet. Betrag gemäss gewähltem Paket
              {formData.roomType === "SINGLE" && singleRoomSurcharge
                ? " inkl. Einzelzimmer-Zuschlag"
                : ""}
              .
            </p>
          </div>
        </form>
      )}

      {/* Button Controls */}
      <div className="flex justify-between items-center pt-4 border-t border-stone-light/60">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="btn-secondary py-2 px-4 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Zurück
          </button>
        ) : (
          <div />
        )}

        {step < 4 && (
          <button
            type="button"
            onClick={handleNext}
            className="btn-primary py-2 px-5 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            Weiter <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
