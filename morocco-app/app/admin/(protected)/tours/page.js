'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { showToast, ToastHost } from '@/components/Toast';
import SmartImage from '@/components/SmartImage';

export default function ToursList() {
  const [tours, setTours] = useState(null);

  async function load() {
    const res = await fetch('/api/tours?all=1');
    const data = await res.json();
    setTours(data.tours);
  }
  useEffect(() => { load(); }, []);

  async function toggleActive(slug, active) {
    const res = await fetch(`/api/tours/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    if (res.ok) {
      showToast(`Tour ${!active ? 'enabled' : 'disabled'}.`);
      load();
    } else {
      showToast('Update failed.', 'error');
    }
  }

  if (!tours) return <div className="p-10 text-muted">Loading…</div>;

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl mb-1">Tours & Pricing</h1>
        <p className="text-muted text-sm">Edit content, prices, images and availability. Changes are live immediately.</p>
      </div>

      <div className="space-y-4">
        {tours.map(t => (
          <div key={t.slug} className="bg-white border border-line rounded-sm overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-48 flex-none aspect-[4/3] md:aspect-auto bg-ivory">
              <SmartImage src={t.cardImage || t.heroImage} alt={t.title} size={600}
                className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-1 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-display text-xl">{t.title}</h3>
                  {!t.active && (
                    <span className="text-[10px] uppercase tracking-wide-2 bg-charcoal/10 text-muted px-2 py-0.5">disabled</span>
                  )}
                </div>
                <p className="text-sm text-muted line-clamp-2 max-w-xl">{t.subtitle || t.cardDescription}</p>
                <div className="text-sm text-terracotta font-display mt-2">
                  {t.priceDisplay || `${t.price.toLocaleString()} ${t.currency}`} <span className="text-xs text-muted">{t.priceUnit}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 flex-none">
                <button onClick={() => toggleActive(t.slug, t.active)}
                  className="px-3 py-2 text-xs font-semibold uppercase tracking-wide-1 border border-line text-charcoal hover:bg-ivory rounded-sm">
                  {t.active ? 'Disable' : 'Enable'}
                </button>
                <Link href={`/${t.slug}`} target="_blank"
                  className="px-3 py-2 text-xs font-semibold uppercase tracking-wide-1 border border-line text-charcoal hover:bg-ivory rounded-sm">
                  View ↗
                </Link>
                <Link href={`/admin/tours/${t.slug}`}
                  className="px-3 py-2 text-xs font-semibold uppercase tracking-wide-1 bg-terracotta text-white hover:bg-terracotta-dark rounded-sm">
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastHost />
    </div>
  );
}
