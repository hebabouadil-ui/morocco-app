import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const HAS_CLOUDINARY = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (HAS_CLOUDINARY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Save a File (from FormData) to either Cloudinary or /public/uploads.
 * Returns { url, publicId | null, provider }
 */
export async function saveImage(file, folder = 'morocco-skys') {
  if (!file || typeof file === 'string') {
    throw new Error('No file provided');
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (HAS_CLOUDINARY) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image', transformation: [{ quality: 'auto:good' }] },
        (err, result) => {
          if (err) return reject(err);
          resolve({ url: result.secure_url, publicId: result.public_id, provider: 'cloudinary' });
        }
      );
      stream.end(buffer);
    });
  }

  // Local fallback
  const ext = (file.name.match(/\.[a-z0-9]+$/i) || ['.jpg'])[0].toLowerCase();
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), buffer);
  return { url: `/uploads/${filename}`, publicId: null, provider: 'local' };
}

/** Delete an image by its provider+id (best-effort) */
export async function deleteImage({ url, publicId }) {
  if (publicId && HAS_CLOUDINARY) {
    try { await cloudinary.uploader.destroy(publicId); } catch (e) {}
    return;
  }
  if (url && url.startsWith('/uploads/')) {
    try {
      await fs.unlink(path.join(process.cwd(), 'public', url));
    } catch (e) {}
  }
}
