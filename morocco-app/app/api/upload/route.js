import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { saveImage, deleteImage } from '@/lib/upload';

export const runtime = 'nodejs'; // need fs

export async function POST(request) {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'morocco-skys';
    if (!file) return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    if (!file.type || !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 10MB.' }, { status: 400 });
    }
    const result = await saveImage(file, folder);
    return NextResponse.json(result);
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { url, publicId } = await request.json();
    await deleteImage({ url, publicId });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Delete failed.' }, { status: 500 });
  }
}
