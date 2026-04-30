'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingForm({ tour, whatsapp = '212695504949' }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', date: '', guests: 2, notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const total = tour.price * (parseInt(form.guests) || 0);
  const today = new Date().toISOString().split('T')[0];

  function update(field, val) {
    setForm(f => ({ ...f, [field]: val }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tourSlug: tour.slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Booking failed.');
        setSubmitting(false);
        return;
      }
      // Build WhatsApp pre-filled message
      const msg = `Hi! I just booked the ${tour.title}.\n\n` +
        `Reference: ${data.booking.reference}\n` +
        `Name: ${form.name}\n` +
        `Date: ${form.date}\n` +
        `Guests: ${form.guests}\n` +
        `Total: ${data.booking.totalPrice.toLocaleString()} ${data.booking.currency}\n\n` +
        `Please confirm. Thanks!`;
      const params = new URLSearchParams({ ref: data.booking.reference });
      router.push(`/booking-success?${params.toString()}&wa=${encodeURIComponent(msg)}`);
    } catch (err) {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white border border-line rounded-sm p-7 shadow-sm">
      <div className="mb-6 pb-5 border-b border-line">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-display text-4xl font-medium text-charcoal">
            {tour.priceDisplay || `${tour.price.toLocaleString()}`}
          </span>
          {!tour.priceDisplay && <span className="font-display text-base text-muted">{tour.currency}</span>}
        </div>
        <div className="text-xs text-muted uppercase tracking-wide-2">{tour.priceUnit || 'per person'}</div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="field-label">Full Name</label>
          <input type="text" required value={form.name}
            onChange={e => update('name', e.target.value)}
            className="field-input" placeholder="Jane Doe" />
        </div>
        <div>
          <label className="field-label">Email</label>
          <input type="email" required value={form.email}
            onChange={e => update('email', e.target.value)}
            className="field-input" placeholder="jane@example.com" />
        </div>
        <div>
          <label className="field-label">Phone (with country code)</label>
          <input type="tel" required value={form.phone}
            onChange={e => update('phone', e.target.value)}
            className="field-input" placeholder="+1 555 123 4567" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">Date</label>
            <input type="date" required min={today} value={form.date}
              onChange={e => update('date', e.target.value)}
              className="field-input" />
          </div>
          <div>
            <label className="field-label">Guests</label>
            <input type="number" required min="1" max="30" value={form.guests}
              onChange={e => update('guests', e.target.value)}
              className="field-input" />
          </div>
        </div>
        <div>
          <label className="field-label">Notes (optional)</label>
          <textarea value={form.notes} rows={2}
            onChange={e => update('notes', e.target.value)}
            className="field-input resize-none"
            placeholder="Hotel, dietary needs, requests…" />
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-line flex items-center justify-between">
          <span className="text-sm uppercase tracking-wide-2 text-muted">Estimated Total</span>
          <span className="font-display text-2xl text-terracotta font-medium">
            {total.toLocaleString()} {tour.currency}
          </span>
        </div>

        {error && (
          <div className="text-sm text-terracotta bg-terracotta/5 border border-terracotta/20 px-3 py-2 rounded-sm">
            {error}
          </div>
        )}

        <button type="submit" disabled={submitting}
          className="btn btn-primary w-full justify-center">
          {submitting ? 'Booking…' : 'Confirm Booking'} {!submitting && <span>→</span>}
        </button>

        <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi! I'd like to book the ${tour.title}.`)}`}
          target="_blank" rel="noopener noreferrer"
          className="btn btn-whatsapp w-full justify-center">
          Or chat on WhatsApp
        </a>

        <p className="text-xs text-muted text-center">
          Free cancellation up to 48h. Instant confirmation.
        </p>
      </form>
    </div>
  );
}
