'use client';

import Image from 'next/image';
import { resolveMediaUrl } from '@/lib/media-url';

export { resolveMediaUrl };

/**
 * Full-bleed 16:9 tour image (local Sharp-optimized WebP).
 */
export default function TourHeroImage({
  media,
  alt,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  className = '',
  fillContainer = true,
}) {
  const src = resolveMediaUrl(media);

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

  return (
    <div className={`relative overflow-hidden ${fillContainer ? 'w-full h-full' : ''} ${className}`}>
      <Image
        src={src}
        alt={alt || media?.alt || 'Israelreise'}
        fill
        priority={priority}
        className="object-cover object-center"
        sizes={sizes}
      />
    </div>
  );
}
