import { AsYouType, getCountryCallingCode } from "libphonenumber-js";

export const PHONE_COUNTRIES = [
  { iso2: "CH", label: "CH", callingCode: "41" },
  { iso2: "DE", label: "DE", callingCode: "49" },
  { iso2: "AT", label: "AT", callingCode: "43" },
  { iso2: "FR", label: "FR", callingCode: "33" },
  { iso2: "IT", label: "IT", callingCode: "39" },
];

/** Max national significant digits (no trunk 0, no country code). */
const MAX_NATIONAL = {
  CH: 9,
  DE: 11,
  AT: 11,
  FR: 9,
  IT: 10,
};

export const PHONE_PLACEHOLDERS = {
  CH: "+41 79 123 45 67",
  DE: "+49 170 1234567",
  AT: "+43 664 1234567",
  FR: "+33 6 12 34 56 78",
  IT: "+39 312 345 6789",
};

export function callingCodeFor(country) {
  try {
    return getCountryCallingCode(country || "CH");
  } catch {
    return "41";
  }
}

export function significantChars(value) {
  return String(value || "").replace(/[^\d+]/g, "");
}

export function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function maxNational(country) {
  return MAX_NATIONAL[country] || 12;
}

/**
 * National significant digits for `country` (no trunk 0 / no matching CC).
 */
export function nationalDigits(value, country = "CH") {
  const chars = significantChars(value);
  const cc = callingCodeFor(country);
  const cap = maxNational(country);

  if (chars.startsWith("+")) {
    const rest = digitsOnly(chars.slice(1));
    if (rest.startsWith(cc)) return rest.slice(cc.length).slice(0, cap);
    return rest.slice(0, 15);
  }

  let d = digitsOnly(chars);
  if (d.startsWith("00")) {
    d = d.slice(2);
    if (d.startsWith(cc)) d = d.slice(cc.length);
    return d.slice(0, cap);
  }
  if (d.startsWith("0")) d = d.slice(1);
  return d.slice(0, cap);
}

/**
 * Always show international format for the selected Land: +41 79 123 45 67.
 * If the user types a different +country code, format that internationally instead.
 */
export function formatPhoneAsYouType(raw, country = "CH") {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return "";

  const chars = significantChars(trimmed);
  const cc = callingCodeFor(country);

  // Explicit other-country international (+49… while Land is CH, etc.)
  if (chars.startsWith("+")) {
    const rest = digitsOnly(chars.slice(1));
    if (!rest) return "+";
    const looksLikeSelected =
      rest.startsWith(cc) || cc.startsWith(rest) || rest.length < cc.length;
    if (!looksLikeSelected) {
      return new AsYouType().input(`+${rest.slice(0, 15)}`);
    }
  }

  if (chars.startsWith("00")) {
    const rest = digitsOnly(chars.slice(2));
    if (!rest) return "+";
    if (!rest.startsWith(cc) && !cc.startsWith(rest)) {
      return new AsYouType().input(`+${rest.slice(0, 15)}`);
    }
  }

  const national = nationalDigits(trimmed, country);
  if (!national) return `+${cc}`;

  return new AsYouType(country).input(`+${cc}${national}`);
}

export function reformatPhoneForCountry(value, country) {
  if (!value) return "";
  const chars = significantChars(value);
  if (!chars) return "";

  const parser = new AsYouType();
  parser.input(chars.startsWith("+") ? chars : `+${digitsOnly(chars)}`);
  const parsed = parser.getNumber();
  const national = parsed?.nationalNumber || nationalDigits(value, country);
  if (!national) return "";
  return formatPhoneAsYouType(national, country);
}

export function countDigitsBefore(value, caret) {
  return digitsOnly(String(value || "").slice(0, caret)).length;
}

export function caretAfterDigitCount(formatted, digitCount) {
  if (digitCount <= 0) {
    return formatted.startsWith("+") ? 1 : 0;
  }
  let seen = 0;
  for (let i = 0; i < formatted.length; i += 1) {
    if (/\d/.test(formatted[i])) {
      seen += 1;
      if (seen === digitCount) return i + 1;
    }
  }
  return formatted.length;
}

/**
 * Map caret from pre-format value → formatted international value.
 * When the field only had national digits, account for injected country code digits.
 */
export function mapCaretToFormatted(raw, sel, formatted, country) {
  const digitsBefore = countDigitsBefore(raw, sel);
  const atEnd = sel >= String(raw || "").length;
  if (atEnd) return formatted.length;

  const chars = significantChars(raw);
  const cc = callingCodeFor(country);
  const rawIsIntl = chars.startsWith("+") || chars.startsWith("00");

  const adjusted = rawIsIntl ? digitsBefore : digitsBefore + cc.length;
  return caretAfterDigitCount(formatted, adjusted);
}

/** @deprecated */
export const formatPhoneMask = formatPhoneAsYouType;
export const countSignificantBefore = (value, caret) =>
  significantChars(String(value || "").slice(0, caret)).length;
export const caretAfterSignificant = caretAfterDigitCount;
export const caretAfterDigits = caretAfterDigitCount;
