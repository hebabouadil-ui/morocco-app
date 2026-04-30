'use client';
import { useEffect, useState } from 'react';
import { showToast, ToastHost } from '@/components/Toast';

const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

export default function BookingsPage() {
  const [bookings, setBookings] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  async function load() {
    const res = await fetch('/api/bookings');
    if (!res.ok) return;
    const data = await res.json();
    setBookings(data.bookings);
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      showToast(`Booking marked ${status}.`);
      load();
    } else {
      showToast('Update failed.', 'error');
    }
  }

  async function remove(id) {
    if (!confirm('Permanently delete this booking?')) return;
    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Booking deleted.');
      setSelected(null);
      load();
    } else {
      showToast('Delete failed.', 'error');
    }
  }

  if (bookings === null) {
    return <div className="p-10 text-muted">Loading bookings…</div>;
  }

  const filtered = bookings
    .filter(b => filter === 'all' ? true : b.status === filter)
    .filter(b => {
      if (!search) return true;
      const q = search.toLowerCase();
      return b.name.toLowerCase().includes(q)
        || b.email.toLowerCase().includes(q)
        || b.phone.includes(q)
        || b.reference.toLowerCase().includes(q);
    });

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl mb-1">Bookings</h1>
          <p className="text-muted text-sm">{bookings.length} total · {bookings.filter(b => b.status === 'pending').length} pending</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, ref…"
            className="field-input !py-2 !text-sm w-56" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 mb-5 bg-white border border-line rounded-sm p-1 inline-flex">
        {['all', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 text-xs uppercase tracking-wide-1 font-semibold rounded-sm transition-colors ${
              filter === s ? 'bg-charcoal text-ivory' : 'text-muted hover:text-charcoal'
            }`}>
            {s} {s !== 'all' && `(${bookings.filter(b => b.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-line p-12 text-center text-muted">
          No bookings match.
        </div>
      ) : (
        <div className="bg-white border border-line rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide-2 text-muted text-left">
                  <th className="p-4">Reference</th>
                  <th className="p-4">Guest</th>
                  <th className="p-4">Tour</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Guests</th>
                  <th className="p-4 text-right">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map(b => (
                  <tr key={b._id} className="hover:bg-cream/50 cursor-pointer" onClick={() => setSelected(b)}>
                    <td className="p-4 font-mono text-xs text-terracotta">{b.reference}</td>
                    <td className="p-4">
                      <div className="font-medium text-charcoal">{b.name}</div>
                      <div className="text-xs text-muted">{b.email}</div>
                    </td>
                    <td className="p-4 text-charcoal">{b.tourTitle}</td>
                    <td className="p-4 text-muted">{new Date(b.date).toLocaleDateString()}</td>
                    <td className="p-4 text-muted">{b.guests}</td>
                    <td className="p-4 text-right font-display text-charcoal">{b.totalPrice.toLocaleString()} {b.currency}</td>
                    <td className="p-4"><StatusPill status={b.status} /></td>
                    <td className="p-4 text-right text-muted">→</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 bg-charcoal/60 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="bg-cream w-full max-w-lg h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-line flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide-2 text-muted">Booking</div>
                <div className="font-display text-2xl text-terracotta">{selected.reference}</div>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 hover:bg-white rounded-full">×</button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <div className="text-xs uppercase tracking-wide-2 text-muted mb-1">Guest</div>
                <div className="font-medium text-lg">{selected.name}</div>
                <div className="text-sm text-muted">{selected.email}</div>
                <div className="text-sm">
                  <a href={`tel:${selected.phone}`} className="text-terracotta hover:underline">{selected.phone}</a>
                  {' · '}
                  <a href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-terracotta hover:underline">WhatsApp</a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide-2 text-muted mb-1">Tour</div>
                  <div>{selected.tourTitle}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide-2 text-muted mb-1">Date</div>
                  <div>{new Date(selected.date).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide-2 text-muted mb-1">Guests</div>
                  <div>{selected.guests}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide-2 text-muted mb-1">Total</div>
                  <div className="font-display text-xl text-terracotta">{selected.totalPrice.toLocaleString()} {selected.currency}</div>
                </div>
              </div>

              {selected.notes && (
                <div>
                  <div className="text-xs uppercase tracking-wide-2 text-muted mb-1">Notes</div>
                  <div className="text-sm bg-white border border-line p-3 whitespace-pre-line">{selected.notes}</div>
                </div>
              )}

              <div>
                <div className="text-xs uppercase tracking-wide-2 text-muted mb-2">Status</div>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(s => (
                    <button key={s}
                      onClick={() => updateStatus(selected._id, s).then(() => setSelected({ ...selected, status: s }))}
                      className={`px-3 py-2 text-xs uppercase tracking-wide-1 font-semibold rounded-sm border ${
                        selected.status === s
                          ? 'bg-charcoal text-ivory border-charcoal'
                          : 'bg-white text-charcoal border-line hover:border-charcoal'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-muted">
                Created {new Date(selected.createdAt).toLocaleString()}
              </div>

              <button onClick={() => remove(selected._id)} className="text-xs text-terracotta hover:underline">
                Delete this booking
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastHost />
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    pending: 'bg-gold/20 text-gold-dark',
    confirmed: 'bg-terracotta/15 text-terracotta',
    cancelled: 'bg-charcoal/10 text-muted',
    completed: 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wide-2 font-semibold rounded-full ${map[status] || ''}`}>
      {status}
    </span>
  );
}
