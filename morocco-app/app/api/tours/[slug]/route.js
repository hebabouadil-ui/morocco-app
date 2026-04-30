import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Tour from '@/models/Tour';
import { requireAdmin } from '@/lib/auth';

export async function GET(request, { params }) {
  await dbConnect();
  const tour = await Tour.findOne({ slug: params.slug }).lean();
  if (!tour) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ tour });
}

export async function PATCH(request, { params }) {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const updates = await request.json();
    delete updates._id;
    delete updates.slug; // immutable
    delete updates.createdAt;
    delete updates.updatedAt;

    if (updates.price != null) updates.price = Number(updates.price);

    await dbConnect();
    const tour = await Tour.findOneAndUpdate(
      { slug: params.slug },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!tour) return NextResponse.json({ error: 'Tour not found.' }, { status: 404 });
    return NextResponse.json({ tour });
  } catch (err) {
    console.error('Tour update error:', err);
    return NextResponse.json({ error: err.message || 'Update failed.' }, { status: 500 });
  }
}
