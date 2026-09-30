"use client";

import { useRef } from "react";
import {
  PHONE_PLACEHOLDERS,
  formatPhoneAsYouType,
  mapCaretToFormatted,
  significantChars,
} from "@/lib/phone-format";

/**
 * International phone input (libphonenumber-js).
 * Formats as +41 79 123 45 67 based on form Land; caps length; caret-safe.
 */
export default function PhoneInput({
  value = "",
  onChange,
  country = "CH",
  className = "",
  placeholder,
  name,
  id,
  required,
  autoComplete = "tel",
}) {
  const inputRef = useRef(null);

  const applyFormat = (raw, sel) => {
    const formatted = formatPhoneAsYouType(raw, country);
    onChange?.(formatted);

    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      const pos = mapCaretToFormatted(raw, sel, formatted, country);
      el.setSelectionRange(pos, pos);
    });
  };

  const handleChange = (e) => {
    const el = e.target;
    const nextRaw = el.value;
    const sel = el.selectionStart ?? nextRaw.length;
    applyFormat(nextRaw, sel);
  };

  const handleKeyDown = (e) => {
    const el = e.target;
    const { selectionStart, selectionEnd, value: current } = el;
    if (selectionStart !== selectionEnd) return;

    const isMask = (ch) => ch && !/[\d+]/.test(ch);

    if (e.key === "Backspace" && selectionStart > 0) {
      const prev = current[selectionStart - 1];
      if (isMask(prev)) {
        e.preventDefault();
        // Delete the digit before the mask char
        let cut = selectionStart - 1;
        while (cut > 0 && isMask(current[cut])) cut -= 1;
        if (!/\d/.test(current[cut])) {
          el.setSelectionRange(cut, cut);
          return;
        }
        const next = current.slice(0, cut) + current.slice(cut + 1);
        applyFormat(significantChars(next), cut);
      }
      return;
    }

    if (e.key === "Delete" && selectionStart < current.length) {
      const nextCh = current[selectionStart];
      if (isMask(nextCh)) {
        e.preventDefault();
        let cut = selectionStart;
        while (cut < current.length && isMask(current[cut])) cut += 1;
        if (cut >= current.length || !/\d/.test(current[cut])) {
          el.setSelectionRange(cut, cut);
          return;
        }
        const next = current.slice(0, cut) + current.slice(cut + 1);
        applyFormat(significantChars(next), selectionStart);
      }
    }
  };

  const ph = placeholder || PHONE_PLACEHOLDERS[country] || PHONE_PLACEHOLDERS.CH;

  return (
    <input
      ref={inputRef}
      type="tel"
      inputMode="tel"
      autoComplete={autoComplete}
      name={name}
      id={id}
      required={required}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className={className}
      placeholder={ph}
      maxLength={20}
    />
  );
}
