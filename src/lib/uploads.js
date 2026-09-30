import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

/** Recommended hero image target: 16:9 landscape */
export const HERO_IMAGE = {
  aspectRatio: '16 / 9',
  width: 1920,
  height: 1080,
  maxBytes: 5 * 1024 * 1024,
  accept: 'image/jpeg,image/png,image/webp',
  folder: 'uploads/tours',
  quality: 82,
};

const LOCAL_PREFIX = 'local:';
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'tours');

/**
 * Optimize and store a tour hero on local disk (WebP, max 1920×1080 cover).
 */
export async function uploadTourImage(file) {
  if (!file || typeof file === 'string') {
    throw new Error('Keine Bilddatei übermittelt.');
  }

  const mime = file.type || 'image/jpeg';
  if (!mime.startsWith('image/')) {
    throw new Error('Nur Bilddateien (JPEG, PNG, WebP) sind erlaubt.');
  }

  const input = Buffer.from(await file.arrayBuffer());
  if (input.length === 0) {
    throw new Error('Die Bilddatei ist leer.');
  }
  if (input.length > HERO_IMAGE.maxBytes) {
    throw new Error('Bild ist zu gross. Maximal 5 MB erlaubt.');
  }

  let optimized;
  try {
    optimized = await sharp(input)
      .rotate() // honour EXIF orientation
      .resize(HERO_IMAGE.width, HERO_IMAGE.height, {
        fit: 'cover',
        position: 'attention',
        withoutEnlargement: true,
      })
      .webp({ quality: HERO_IMAGE.quality, effort: 4 })
      .toBuffer({ resolveWithObject: true });
  } catch (error) {
    console.error('Sharp optimize failed:', error);
    throw new Error(
      'Bild konnte nicht verarbeitet werden. Bitte ein gültiges JPEG, PNG oder WebP hochladen.'
    );
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.webp`;
  const absolute = path.join(UPLOAD_DIR, filename);
  await writeFile(absolute, optimized.data);

  const publicPath = `/uploads/tours/${filename}`;

  return {
    storageKey: `${LOCAL_PREFIX}${publicPath}`,
    url: publicPath,
    width: optimized.info.width,
    height: optimized.info.height,
    mime: 'image/webp',
    bytes: optimized.info.size,
  };
}

export function isLocalStorageKey(value) {
  return typeof value === 'string' && value.startsWith(LOCAL_PREFIX);
}

export function localPathFromStorageKey(storageKey) {
  if (!isLocalStorageKey(storageKey)) return null;
  const publicPath = storageKey.slice(LOCAL_PREFIX.length);
  if (!publicPath.startsWith('/uploads/')) return null;
  // Prevent path traversal
  const relative = publicPath.replace(/^\//, '');
  if (relative.includes('..')) return null;
  return path.join(process.cwd(), 'public', relative);
}

/**
 * Delete a locally stored upload.
 */
export async function deleteUploadedImage(storageKey) {
  if (!storageKey || !isLocalStorageKey(storageKey)) {
    return { result: 'skipped' };
  }

  const absolute = localPathFromStorageKey(storageKey);
  if (!absolute) return { result: 'skipped' };

  try {
    await unlink(absolute);
    return { result: 'ok' };
  } catch (error) {
    if (error?.code === 'ENOENT') return { result: 'not_found' };
    console.error('Local upload delete failed:', absolute, error);
    return { result: 'error', error: String(error) };
  }
}
