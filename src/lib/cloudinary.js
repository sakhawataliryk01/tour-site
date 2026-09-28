import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

/** Recommended hero image: 16:9 landscape, 1920×1080 */
export const HERO_IMAGE = {
  aspectRatio: '16 / 9',
  width: 1920,
  height: 1080,
  maxBytes: 5 * 1024 * 1024,
  accept: 'image/jpeg,image/png,image/webp',
  folder: 'beth-shalom/tours',
};

function trimEnv(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function configureCloudinary() {
  const cloud_name = trimEnv(process.env.CLOUDINARY_CLOUD_NAME);
  const api_key = trimEnv(process.env.CLOUDINARY_API_KEY);
  const api_secret = trimEnv(process.env.CLOUDINARY_API_SECRET);

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });

  return { cloud_name, api_key, api_secret };
}

export function isCloudinaryConfigured() {
  const { cloud_name, api_key, api_secret } = configureCloudinary();
  return Boolean(cloud_name && api_key && api_secret);
}

/**
 * Seed / local keys that are not real Cloudinary public_ids.
 */
export function isCloudinaryPublicId(value) {
  if (!value || typeof value !== 'string') return false;
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value.includes('res.cloudinary.com');
  }
  // Real uploads live under our folder; bare filenames like "placeholder-israel.jpg" are seed stubs
  if (value.includes('/')) return true;
  if (/\.(jpe?g|png|webp|gif|svg)$/i.test(value)) return false;
  return true;
}

/**
 * Upload a File/Blob to Cloudinary via binary stream (more reliable than data-URI).
 * Delivery-time transforms (f_auto, q_auto, c_fill) are applied in getOptimizedImageUrl.
 */
export async function uploadTourImage(file) {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary ist nicht konfiguriert. Bitte CLOUDINARY_CLOUD_NAME, API_KEY und API_SECRET setzen und den Dev-Server neu starten.'
    );
  }

  if (!file || typeof file === 'string') {
    throw new Error('Keine Bilddatei übermittelt.');
  }

  const mime = file.type || 'image/jpeg';
  if (!mime.startsWith('image/')) {
    throw new Error('Nur Bilddateien (JPEG, PNG, WebP) sind erlaubt.');
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length === 0) {
    throw new Error('Die Bilddatei ist leer.');
  }
  if (bytes.length > HERO_IMAGE.maxBytes) {
    throw new Error('Bild ist zu gross. Maximal 5 MB erlaubt.');
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: HERO_IMAGE.folder,
          resource_type: 'image',
          overwrite: false,
          unique_filename: true,
          use_filename: true,
        },
        (error, uploaded) => {
          if (error) reject(error);
          else resolve(uploaded);
        }
      );

      Readable.from(bytes).pipe(stream);
    });

    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      mime: result.format ? `image/${result.format}` : mime,
      bytes: result.bytes,
    };
  } catch (error) {
    const code = error?.http_code || error?.statusCode;
    const detail = error?.message || String(error);

    if (/missing permissions|actions=\["create"\]/i.test(detail)) {
      throw new Error(
        'Cloudinary-API-Schlüssel hat keine Upload-Berechtigung (create). Erstellen Sie unter Cloudinary → Settings → API Keys einen neuen Schlüssel mit Upload/Create-Rechten und tragen Sie ihn in .env ein.'
      );
    }

    if (code === 401 || code === 403) {
      throw new Error(
        `Cloudinary-Zugang abgelehnt (${code}). Prüfen Sie CLOUDINARY_CLOUD_NAME, API_KEY und API_SECRET und starten Sie den Server neu. Details: ${detail}`
      );
    }

    throw new Error(`Cloudinary-Upload fehlgeschlagen: ${detail}`);
  }
}

/**
 * Delete a Cloudinary asset by public_id (server-only).
 */
export async function deleteCloudinaryImage(publicId) {
  if (!publicId || !isCloudinaryConfigured()) return { result: 'skipped' };
  if (!isCloudinaryPublicId(publicId)) return { result: 'skipped' };

  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true,
    });
  } catch (error) {
    console.error('Cloudinary destroy failed:', publicId, error);
    return { result: 'error', error: String(error) };
  }
}

export { cloudinary };
