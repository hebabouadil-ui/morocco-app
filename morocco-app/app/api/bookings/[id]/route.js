import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(request, { params }) {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { id } = params;
    const updates = await request.json();
    const allowed = ['status', 'notes'];
    const safeUpdates = {};
    for (const k of allowed) if (k in updates) safeUpdates[k] = updates[k];

    await dbConnect();
    const booking = await Booking.findByIdAndUpdate(id, safeUpdates, { new: true });
    if (!booking) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    return NextResponse.json({ booking });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    await dbConnect();
    await Booking.findByIdAndDelete(params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Delete failed.' }, { status: 500 });
  }
}
