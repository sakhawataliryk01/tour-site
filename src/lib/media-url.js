/**
 * Resolve local media URLs for tour images.
 * Safe for client components (no Node APIs).
 */

export function toPublicMediaUrl(storageKeyOrUrl) {
  if (!storageKeyOrUrl || typeof storageKeyOrUrl !== 'string') return null;

  if (storageKeyOrUrl.startsWith('local:')) {
    return storageKeyOrUrl.slice('local:'.length);
  }

  if (storageKeyOrUrl.startsWith('/uploads/')) {
    return storageKeyOrUrl;
  }

  if (
    storageKeyOrUrl.startsWith('http://') ||
    storageKeyOrUrl.startsWith('https://')
  ) {
    return storageKeyOrUrl;
  }

  return null;
}

/**
 * Resolve a Media row (or string key) to a browser-ready src.
 */
export function resolveMediaUrl(media) {
  if (!media) return null;

  if (typeof media === 'string') {
    return toPublicMediaUrl(media);
  }

  if (media.url) {
    const fromUrl = toPublicMediaUrl(media.url);
    if (fromUrl) return fromUrl;
  }

  if (media.storageKey) {
    return toPublicMediaUrl(media.storageKey);
  }

  return null;
}
