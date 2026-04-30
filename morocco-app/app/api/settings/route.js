import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  await dbConnect();
  let s = await SiteSettings.findOne({ singleton: 'main' });
  if (!s) s = await SiteSettings.create({ singleton: 'main' });
  return NextResponse.json({ settings: s });
}

export async function PATCH(request) {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json();
    delete body._id;
    delete body.singleton;
    delete body.createdAt;
    delete body.updatedAt;
    await dbConnect();
    const s = await SiteSettings.findOneAndUpdate(
      { singleton: 'main' },
      { $set: body },
      { upsert: true, new: true, runValidators: true }
    );
    return NextResponse.json({ settings: s });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}
