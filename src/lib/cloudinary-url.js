/**
 * Client-safe Cloudinary URL helpers (no Node SDK).
 */

function cloudName() {
  return (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '').trim();
}

/**
 * Seed stubs like "placeholder-israel.jpg" are not Cloudinary assets.
 */
export function isCloudinaryPublicId(value) {
  if (!value || typeof value !== 'string') return false;
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value.includes('res.cloudinary.com');
  }
  if (value.includes('/')) return true;
  if (/\.(jpe?g|png|webp|gif|svg)$/i.test(value)) return false;
  return true;
}

/**
 * Optimized 16:9 delivery URL with f_auto / q_auto / c_fill.
 */
export function getOptimizedImageUrl(publicIdOrUrl, opts = {}) {
  if (!publicIdOrUrl) return null;
  if (!isCloudinaryPublicId(publicIdOrUrl)) return null;

  const width = opts.width || 1200;
  const height = opts.height || 675;
  const transform = `c_fill,g_auto,f_auto,q_auto,w_${width},h_${height}`;

  if (publicIdOrUrl.startsWith('http://') || publicIdOrUrl.startsWith('https://')) {
    if (publicIdOrUrl.includes('res.cloudinary.com') && publicIdOrUrl.includes('/upload/')) {
      if (/\/upload\/[^/]+,/.test(publicIdOrUrl) || /\/upload\/c_/.test(publicIdOrUrl)) {
        return publicIdOrUrl;
      }
      return publicIdOrUrl.replace('/upload/', `/upload/${transform}/`);
    }
    return publicIdOrUrl;
  }

  const name = cloudName();
  if (!name) return null;

  return `https://res.cloudinary.com/${name}/image/upload/${transform}/${publicIdOrUrl}`;
}
