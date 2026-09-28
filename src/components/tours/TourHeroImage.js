'use client';

import Image from 'next/image';
import { getOptimizedImageUrl, isCloudinaryPublicId } from '@/lib/cloudinary-url';

/**
 * Resolve a media record into an optimized delivery URL.
 */
export function resolveMediaUrl(media, { width = 1200, height = 675 } = {}) {
  if (!media) return null;

  if (typeof media === 'string') {
    return getOptimizedImageUrl(media, { width, height });
  }

  if (media.storageKey && isCloudinaryPublicId(media.storageKey)) {
    const optimized = getOptimizedImageUrl(media.storageKey, { width, height });
    if (optimized) return optimized;
  }

  if (media.url && isCloudinaryPublicId(media.url)) {
    return getOptimizedImageUrl(media.url, { width, height }) || media.url;
  }

  return null;
}

/**
 * Full-bleed 16:9 tour image with Next.js Image optimization.
 */
export default function TourHeroImage({
  media,
  alt,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  className = '',
  fillContainer = true,
}) {
  const src = resolveMediaUrl(media, { width: 1600, height: 900 });

  if (!src) {
    return (
      <div
        className={`bg-stone-light flex items-center justify-center text-ink/40 text-sm font-medium ${
          fillContainer ? 'w-full h-full' : ''
        } ${className}`}
      >
        Kein Bild verfügbar
      </div>
    );
  }

  const isRemote = src.startsWith('https://') || src.startsWith('http://');

  return (
    <div className={`relative overflow-hidden ${fillContainer ? 'w-full h-full' : ''} ${className}`}>
      <Image
        src={src}
        alt={alt || media?.alt || 'Israelreise'}
        fill
        priority={priority}
        className="object-cover object-center"
        sizes={sizes}
        unoptimized={!isRemote}
      />
    </div>
  );
}
