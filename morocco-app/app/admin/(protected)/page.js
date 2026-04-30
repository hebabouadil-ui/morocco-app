import Link from 'next/link';
import { dbConnect } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Tour from '@/models/Tour';
import GalleryImage from '@/models/GalleryImage';

export const dynamic = 'force-dynamic';

async function getStats() {
  await dbConnect();
  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    activeTours,
    galleryCount,
    revenue,
    recent,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
    Booking.countDocuments({ status: 'confirmed' }),
    Tour.countDocuments({ active: true }),
    GalleryImage.countDocuments(),
    Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Booking.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);
  return {
    totalBookings,
    pendingBookings,
    confirmedBookings,
    activeTours,
    galleryCount,
    revenue: revenue[0]?.total || 0,
    recent: JSON.parse(JSON.stringify(recent)),
  };
}

export default async function AdminHome() {
  const s = await getStats();

  const stats = [
    { label: 'Total Bookings', value: s.totalBookings, color: 'text-charcoal' },
    { label: 'Pending', value: s.pendingBookings, color: 'text-gold-dark' },
    { label: 'Confirmed', value: s.confirmedBookings, color: 'text-terracotta' },
    { label: 'Active Tours', value: s.activeTours, color: 'text-charcoal' },
    { label: 'Gallery Images', value: s.galleryCount, color: 'text-charcoal' },
    { label: 'Revenue (confirmed)', value: `${s.revenue.toLocaleString()} MAD`, color: 'text-terracotta' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl mb-2">Welcome back.</h1>
        <p className="text-muted">A quick view of your bookings and content.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-line p-6 rounded-sm">
            <div className="text-xs uppercase tracking-wide-2 text-muted mb-2">{s.label}</div>
            <div className={`font-display text-3xl md:text-4xl ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-line rounded-sm">
        <div className="p-6 border-b border-line flex items-center justify-between">
          <h2 className="font-display text-xl">Recent bookings</h2>
          <Link href="/admin/bookings" className="text-xs uppercase tracking-wide-2 text-terracotta hover:underline">
            View all →
          </Link>
        </div>
        {s.recent.length === 0 ? (
          <div className="p-10 text-center text-muted text-sm">No bookings yet.</div>
        ) : (
          <div className="divide-y divide-line">
            {s.recent.map(b => (
              <div key={b._id} className="p-5 flex items-center justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="font-medium text-charcoal">{b.name}</div>
                  <div className="text-xs text-muted truncate">{b.tourTitle} · {new Date(b.date).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={b.status} />
                  <div className="font-display text-charcoal whitespace-nowrap">
                    {b.totalPrice.toLocaleString()} {b.currency}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-10">
        <Link href="/admin/tours" className="bg-charcoal text-ivory p-7 rounded-sm hover:bg-charcoal-soft transition group">
          <div className="text-3xl mb-3">◉</div>
          <h3 className="font-display text-xl text-ivory mb-1">Edit tours & prices</h3>
          <p className="text-ivory/60 text-sm">Update pricing, descriptions, itineraries, images.</p>
        </Link>
        <Link href="/admin/gallery" className="bg-terracotta text-ivory p-7 rounded-sm hover:bg-terracotta-dark transition group">
          <div className="text-3xl mb-3">▦</div>
          <h3 className="font-display text-xl text-ivory mb-1">Manage gallery</h3>
          <p className="text-ivory/80 text-sm">Upload new photos, organize categories.</p>
        </Link>
        <Link href="/admin/bookings" className="bg-gold text-charcoal p-7 rounded-sm hover:bg-gold-dark hover:text-ivory transition group">
          <div className="text-3xl mb-3">📅</div>
          <h3 className="font-display text-xl mb-1">Confirm bookings</h3>
          <p className="text-charcoal/70 text-sm group-hover:text-ivory/80">Review pending requests, update status.</p>
        </Link>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    pending: 'bg-gold/20 text-gold-dark',
    confirmed: 'bg-terracotta/15 text-terracotta',
    cancelled: 'bg-charcoal/10 text-muted line-through',
    completed: 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wide-2 font-semibold rounded-full ${map[status] || ''}`}>
      {status}
    </span>
  );
}
