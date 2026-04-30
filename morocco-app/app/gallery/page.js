import { getGalleryByCategory, getSettings } from '@/lib/data';
import GalleryClient from '@/components/GalleryClient';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const [grouped, settings] = await Promise.all([
    getGalleryByCategory(),
    getSettings(),
  ]);
  return <GalleryClient grouped={grouped} settings={settings} />;
}
