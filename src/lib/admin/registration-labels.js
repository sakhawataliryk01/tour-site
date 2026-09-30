export const registrationStatusConfig = {
  NEW: { label: "Neu", style: "bg-blue-100 text-blue-800" },
  REVIEWING: { label: "In Prüfung", style: "bg-amber-100 text-amber-800" },
  CONFIRMED: { label: "Bestätigt", style: "bg-emerald-100 text-emerald-800" },
  WAITLIST: { label: "Warteliste", style: "bg-purple-100 text-purple-800" },
  CANCELLED: { label: "Storniert", style: "bg-rose-100 text-rose-800" },
  COMPLETED: { label: "Abgeschlossen", style: "bg-zinc-100 text-zinc-800" },
};

export const paymentStatusConfig = {
  NONE: { label: "Keine", style: "bg-zinc-100 text-zinc-600" },
  DEPOSIT_DUE: { label: "Anzahlung offen", style: "bg-amber-100 text-amber-700" },
  DEPOSIT_PAID: { label: "Anzahlung bezahlt", style: "bg-blue-100 text-blue-800" },
  FINAL_DUE: { label: "Restzahlung offen", style: "bg-amber-100 text-amber-800" },
  FINAL_PAID: { label: "Vollständig bezahlt", style: "bg-emerald-100 text-emerald-800" },
  REFUNDED: { label: "Erstattet", style: "bg-purple-100 text-purple-800" },
  WAIVED: { label: "Erlassen", style: "bg-zinc-200 text-zinc-700" },
};

export const roomLabels = {
  DOUBLE: "Doppelzimmer",
  SINGLE: "Einzelzimmer",
  SHARED_DOUBLE: "Halbes Doppelzimmer",
};

export const roommateRelationLabels = {
  MARRIED: "Ehepartner",
  RELATED: "Verwandt",
  FRIENDS: "Bekannte / Freunde",
  ASSIGN: "Zuweisung durch Büro",
};

export const countryLabels = {
  CH: "Schweiz",
  DE: "Deutschland",
  AT: "Österreich",
  FR: "Frankreich",
  IT: "Italien",
};

export function serializeRegistration(reg) {
  return {
    ...reg,
    passportDob: reg.passportDob?.toISOString?.() ?? reg.passportDob,
    passportExpiry: reg.passportExpiry?.toISOString?.() ?? reg.passportExpiry,
    termsAcceptedAt: reg.termsAcceptedAt?.toISOString?.() ?? reg.termsAcceptedAt,
    createdAt: reg.createdAt?.toISOString?.() ?? reg.createdAt,
    updatedAt: reg.updatedAt?.toISOString?.() ?? reg.updatedAt,
    priceOption: reg.priceOption
      ? { ...reg.priceOption, amount: Number(reg.priceOption.amount) }
      : null,
  };
}
