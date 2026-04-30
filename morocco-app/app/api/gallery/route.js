import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import GalleryImage from '@/models/GalleryImage';
import { requireAdmin } from '@/lib/auth';
import { deleteImage } from '@/lib/upload';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const filter = category ? { category } : {};
  const images = await GalleryImage.find(filter).sort({ category: 1, order: 1 }).lean();
  // Group by category
  const grouped = {};
  for (const img of images) {
    if (!grouped[img.category]) grouped[img.category] = [];
    grouped[img.category].push(img);
  }
  return NextResponse.json({ images, grouped });
}

export async function POST(request) {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const { url, publicId, category, caption, order } = await request.json();
    if (!url || !category) return NextResponse.json({ error: 'url and category required.' }, { status: 400 });
    await dbConnect();
    const count = await GalleryImage.countDocuments({ category });
    const img = await GalleryImage.create({
      url, publicId, category, caption: caption || '',
      order: order != null ? order : count,
    });
    return NextResponse.json({ image: img });
  } catch (err) {
    return NextResponse.json({ error: 'Create failed.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const { id } = await request.json();
    await dbConnect();
    const img = await GalleryImage.findByIdAndDelete(id);
    if (img) await deleteImage({ url: img.url, publicId: img.publicId });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Delete failed.' }, { status: 500 });
  }
}
