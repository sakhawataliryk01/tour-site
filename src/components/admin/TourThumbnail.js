'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { resolveMediaUrl } from '@/lib/media-url';

/**
 * Small 16:9 thumbnail for admin tables.
 */
export default function TourThumbnail({ media, alt = 'Titelbild' }) {
  const src = resolveMediaUrl(media);

  return (
    <div className="relative h-9 w-16 shrink-0 overflow-hidden rounded border border-stone-light/70 bg-stone-light/40">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          sizes="64px"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-ink/30">
          <ImageIcon className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  );
}
