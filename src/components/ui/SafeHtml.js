import DOMPurify from 'isomorphic-dompurify';

/**
 * Safely render stored HTML from the TipTap editor.
 * Plain text (legacy) is shown as-is with preserved line breaks.
 */
export default function SafeHtml({ html, className = '' }) {
  if (!html) return null;

  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(html);

  if (!looksLikeHtml) {
    return (
      <div className={`whitespace-pre-wrap ${className}`.trim()}>{html}</div>
    );
  }

  const clean = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });

  return (
    <div
      className={`rich-text ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
