import { dbConnect } from '@/lib/mongodb';
import Tour from '@/models/Tour';
import GalleryImage from '@/models/GalleryImage';
import SiteSettings from '@/models/SiteSettings';

export async function getTours(opts = {}) {
  await dbConnect();
  const filter = opts.includeInactive ? {} : { active: true };
  const tours = await Tour.find(filter).sort({ order: 1, createdAt: 1 }).lean();
  return JSON.parse(JSON.stringify(tours));
}

export async function getTour(slug) {
  await dbConnect();
  const tour = await Tour.findOne({ slug }).lean();
  return tour ? JSON.parse(JSON.stringify(tour)) : null;
}

export async function getGalleryByCategory() {
  await dbConnect();
  const images = await GalleryImage.find().sort({ category: 1, order: 1 }).lean();
  const grouped = {};
  for (const img of images) {
    if (!grouped[img.category]) grouped[img.category] = [];
    grouped[img.category].push(JSON.parse(JSON.stringify(img)));
  }
  return grouped;
}

export async function getSettings() {
  await dbConnect();
  let s = await SiteSettings.findOne({ singleton: 'main' }).lean();
  if (!s) {
    s = await SiteSettings.create({ singleton: 'main' });
    s = s.toObject();
  }
  return JSON.parse(JSON.stringify(s));
}
