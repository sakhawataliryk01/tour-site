"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";

/** Recommended: 1920×1080 (16:9), max 5 MB */
export const HERO_HINT =
  "Empfohlen: 1920 × 1080 px (16:9), max. 5 MB. Wird automatisch als WebP optimiert.";

export default function TourImageField({
  value,
  onChange,
  label = "Titelbild (Hero)",
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value?.previewUrl || null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const clear = () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setError(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Nur Bilddateien (JPEG, PNG, WebP) sind erlaubt.");
      clear();
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Bild ist zu gross (max. 5 MB).");
      clear();
      return;
    }

    setBusy(true);
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onChange?.(file);
    setBusy(false);
  };

  return (
    <div className="md:col-span-2 space-y-2 font-sans">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label className="block text-[10px] uppercase text-ink/55 font-bold">{label}</label>
        <p className="text-[11px] text-ink/50 font-medium">{HERO_HINT}</p>
      </div>

      {/* Compact 16:9 dropzone — capped so it never fills the viewport */}
      <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-dashed border-stone bg-paper">
        <div className="relative aspect-video w-full max-h-48">
          {preview ? (
            <>
              <Image
                src={preview}
                alt="Vorschau Titelbild"
                fill
                unoptimized={preview.startsWith("blob:")}
                className="object-cover"
                sizes="448px"
              />
              <button
                type="button"
                onClick={clear}
                className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-md bg-paper/95 px-2 py-1 text-[11px] font-bold text-terracotta border border-stone shadow-sm cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" /> Entfernen
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-4 text-ink/45 hover:text-olive hover:bg-olive/5 transition-colors cursor-pointer"
            >
              {busy ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <ImagePlus className="h-6 w-6" />
              )}
              <span className="text-xs font-semibold text-center">
                Bild auswählen oder hier ablegen
              </span>
              <span className="text-[10px] font-medium text-ink/40">
                16:9 · max. 5 MB
              </span>
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={onFile}
      />

      {preview ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs font-bold text-terracotta hover:underline cursor-pointer"
        >
          Anderes Bild wählen
        </button>
      ) : null}

      {error ? <p className="text-xs text-terracotta font-semibold">{error}</p> : null}
    </div>
  );
}
