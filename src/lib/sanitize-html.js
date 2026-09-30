import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize TipTap / rich-text HTML before persisting.
 * Returns null for empty content.
 */
export function sanitizeRichText(html) {
  if (!html || typeof html !== "string") return null;
  const trimmed = html.trim();
  if (!trimmed || trimmed === "<p></p>") return null;

  const clean = DOMPurify.sanitize(trimmed, {
    USE_PROFILES: { html: true },
  }).trim();

  return clean || null;
}
