import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Tour from '@/models/Tour';
import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get('all') === '1';

  // Admin can see inactive too
  let filter = { active: true };
  if (includeInactive) {
    const auth = requireAdmin();
    if (auth.ok) filter = {};
  }

  const tours = await Tour.find(filter).sort({ order: 1, createdAt: 1 }).lean();
  return NextResponse.json({ tours });
}
