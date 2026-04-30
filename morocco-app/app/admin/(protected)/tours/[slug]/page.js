'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';
import { showToast, ToastHost } from '@/components/Toast';

export default function TourEditor() {
  const { slug } = useParams();
  const router = useRouter();
  const [tour, setTour] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch(`/api/tours/${slug}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setTour(data.tour))
      .catch(() => showToast('Could not load tour.', 'error'));
  }, [slug]);

  function update(field, value) {
    setTour(t => ({ ...t, [field]: value }));
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    const payload = { ...tour };
    delete payload._id;
    const res = await fetch(`/api/tours/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      showToast('Saved. Changes are live.');
      setDirty(false);
    } else {
      const data = await res.json();
      showToast(data.error || 'Save failed.', 'error');
    }
  }

  if (!tour) return <div className="p-10 text-muted">Loading…</div>;

  return (
    <div className="p-6 md:p-10 max-w-4xl pb-32">
      {/* Top bar */}
      <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
        <div>
          <Link href="/admin/tours" className="text-xs text-muted hover:text-terracotta uppercase tracking-wide-2">
            ← All tours
          </Link>
          <h1 className="font-display text-3xl md:text-4xl mt-2">{tour.title}</h1>
          <p className="text-muted text-sm">/{tour.slug}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${tour.slug}`} target="_blank"
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wide-1 border border-line text-charcoal hover:bg-ivory rounded-sm">
            View live ↗
          </Link>
          <button onClick={save} disabled={saving || !dirty}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wide-1 bg-terracotta text-white hover:bg-terracotta-dark rounded-sm disabled:opacity-50">
            {saving ? 'Saving…' : dirty ? 'Save Changes' : 'Saved'}
          </button>
        </div>
      </div>

      {/* Sections */}
      <Section title="Page Hero" desc="Top of the tour page.">
        <Field label="Hero image (large)">
          <ImageUploader value={tour.heroImage} onChange={v => update('heroImage', v)} folder={`tours/${slug}`} />
        </Field>
        <Field label="Eyebrow">
          <input type="text" value={tour.eyebrow || ''} onChange={e => update('eyebrow', e.target.value)} className="field-input" />
        </Field>
        <Field label="Title">
          <input type="text" value={tour.title || ''} onChange={e => update('title', e.target.value)} className="field-input" />
        </Field>
        <Field label="Subtitle (under title)">
          <textarea value={tour.subtitle || ''} onChange={e => update('subtitle', e.target.value)} rows={2} className="field-input resize-none" />
        </Field>
      </Section>

      <Section title="Pricing" desc="Used in the booking form total calculation.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Price (number, MAD)">
            <input type="number" value={tour.price || 0} onChange={e => update('price', Number(e.target.value))} className="field-input" />
          </Field>
          <Field label="Display price">
            <input type="text" value={tour.priceDisplay || ''} onChange={e => update('priceDisplay', e.target.value)} className="field-input" placeholder="1,200 MAD" />
          </Field>
          <Field label="Per (unit)">
            <input type="text" value={tour.priceUnit || ''} onChange={e => update('priceUnit', e.target.value)} className="field-input" placeholder="per person" />
          </Field>
        </div>
      </Section>

      <Section title="Card on homepage" desc="The card shown in the homepage activities grid.">
        <Field label="Card image">
          <ImageUploader value={tour.cardImage} onChange={v => update('cardImage', v)} folder={`tours/${slug}`} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Tag (top of card)">
            <input type="text" value={tour.cardTag || ''} onChange={e => update('cardTag', e.target.value)} className="field-input" placeholder="Sunrise · 4 hrs" />
          </Field>
          <Field label="Location label">
            <input type="text" value={tour.cardLocation || ''} onChange={e => update('cardLocation', e.target.value)} className="field-input" />
          </Field>
        </div>
        <Field label="Short title (used on card)">
          <input type="text" value={tour.shortTitle || ''} onChange={e => update('shortTitle', e.target.value)} className="field-input" />
        </Field>
        <Field label="Card description (homepage)">
          <textarea value={tour.cardDescription || ''} onChange={e => update('cardDescription', e.target.value)} rows={3} className="field-input resize-none" />
        </Field>
      </Section>

      <Section title="Story / Description" desc="The longform text on the tour page.">
        <Field label="Story title">
          <input type="text" value={tour.storyTitle || ''} onChange={e => update('storyTitle', e.target.value)} className="field-input" />
        </Field>
        <Field label="Paragraphs">
          <ParagraphList values={tour.storyParagraphs || []} onChange={v => update('storyParagraphs', v)} />
        </Field>
      </Section>

      <Section title="What's Included" desc="Bullet list shown beneath the booking form.">
        <ItemList values={tour.bookingFeatures || []} onChange={v => update('bookingFeatures', v)} placeholder="e.g. Hotel pickup" />
      </Section>

      {tour.itinerary && (
        <Section title="Itinerary" desc="Time-by-time breakdown of the experience.">
          <ItineraryList values={tour.itinerary} onChange={v => update('itinerary', v)} />
        </Section>
      )}

      <Section title="Detail Gallery" desc="Image grid lower on the page.">
        <ImageList values={tour.galleryImages || []} onChange={v => update('galleryImages', v)} folder={`tours/${slug}/gallery`} />
      </Section>

      {/* Sticky save bar */}
      {dirty && (
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-charcoal text-ivory px-6 py-4 flex items-center justify-between z-40 shadow-2xl">
          <span className="text-sm">You have unsaved changes.</span>
          <button onClick={save} disabled={saving}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wide-1 bg-terracotta text-white hover:bg-terracotta-dark rounded-sm disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      )}
      <ToastHost />
    </div>
  );
}

function Section({ title, desc, children }) {
  return (
    <section className="bg-white border border-line rounded-sm p-6 mb-5">
      <div className="mb-5 pb-4 border-b border-line">
        <h2 className="font-display text-lg">{title}</h2>
        {desc && <p className="text-xs text-muted mt-1">{desc}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="field-label">{label}</div>
      {children}
    </div>
  );
}

function ParagraphList({ values, onChange }) {
  return (
    <div className="space-y-3">
      {values.map((p, i) => (
        <div key={i} className="bg-cream border border-line p-3 rounded-sm relative">
          <div className="text-[10px] uppercase tracking-wide-2 text-muted mb-1.5">Paragraph {i + 1}</div>
          <textarea value={p} rows={3}
            onChange={e => { const next = [...values]; next[i] = e.target.value; onChange(next); }}
            className="field-input resize-none !bg-white" />
          <button onClick={() => onChange(values.filter((_, j) => j !== i))}
            className="absolute top-2 right-2 w-6 h-6 text-xs hover:bg-terracotta hover:text-white rounded-full text-muted">×</button>
        </div>
      ))}
      <button onClick={() => onChange([...values, ''])}
        className="w-full px-4 py-3 text-xs font-semibold uppercase tracking-wide-1 border border-dashed border-line text-muted hover:text-terracotta hover:border-terracotta rounded-sm">
        + Add paragraph
      </button>
    </div>
  );
}

function ItemList({ values, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex items-center gap-2 bg-cream border border-line p-2 rounded-sm">
          <span className="text-xs text-muted px-2">{i + 1}</span>
          <input type="text" value={v} placeholder={placeholder}
            onChange={e => { const next = [...values]; next[i] = e.target.value; onChange(next); }}
            className="field-input flex-1 !bg-white" />
          <button onClick={() => onChange(values.filter((_, j) => j !== i))}
            className="w-7 h-7 text-xs hover:bg-terracotta hover:text-white rounded-full text-muted">×</button>
        </div>
      ))}
      <button onClick={() => onChange([...values, ''])}
        className="w-full px-4 py-2.5 text-xs font-semibold uppercase tracking-wide-1 border border-dashed border-line text-muted hover:text-terracotta hover:border-terracotta rounded-sm">
        + Add item
      </button>
    </div>
  );
}

function ItineraryList({ values, onChange }) {
  function setStep(i, key, val) {
    const next = [...values];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  }
  return (
    <div className="space-y-3">
      {values.map((step, i) => (
        <div key={i} className="bg-cream border border-line p-4 rounded-sm relative">
          <div className="text-[10px] uppercase tracking-wide-2 text-muted mb-2">Step {i + 1}</div>
          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-3">
            <input type="text" value={step.time || ''} placeholder="06:15"
              onChange={e => setStep(i, 'time', e.target.value)}
              className="field-input !bg-white" />
            <div className="space-y-2">
              <input type="text" value={step.title || ''} placeholder="Step title"
                onChange={e => setStep(i, 'title', e.target.value)}
                className="field-input !bg-white" />
              <textarea value={step.description || ''} placeholder="Description" rows={2}
                onChange={e => setStep(i, 'description', e.target.value)}
                className="field-input resize-none !bg-white" />
            </div>
          </div>
          <div className="flex gap-1 absolute top-2 right-2">
            <button onClick={() => { if (i === 0) return; const next = [...values]; [next[i-1], next[i]] = [next[i], next[i-1]]; onChange(next); }}
              disabled={i === 0}
              className="w-6 h-6 text-xs border border-line bg-white hover:bg-charcoal hover:text-white rounded disabled:opacity-30">↑</button>
            <button onClick={() => { if (i === values.length - 1) return; const next = [...values]; [next[i+1], next[i]] = [next[i], next[i+1]]; onChange(next); }}
              disabled={i === values.length - 1}
              className="w-6 h-6 text-xs border border-line bg-white hover:bg-charcoal hover:text-white rounded disabled:opacity-30">↓</button>
            <button onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="w-6 h-6 text-xs hover:bg-terracotta hover:text-white rounded-full text-muted">×</button>
          </div>
        </div>
      ))}
      <button onClick={() => onChange([...values, { time: '', title: '', description: '' }])}
        className="w-full px-4 py-3 text-xs font-semibold uppercase tracking-wide-1 border border-dashed border-line text-muted hover:text-terracotta hover:border-terracotta rounded-sm">
        + Add step
      </button>
    </div>
  );
}

function ImageList({ values, onChange, folder }) {
  return (
    <div className="space-y-3">
      {values.map((v, i) => (
        <div key={i} className="bg-cream border border-line p-3 rounded-sm relative">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] uppercase tracking-wide-2 text-muted">Image {i + 1}</div>
            <div className="flex gap-1">
              <button onClick={() => { if (i === 0) return; const next = [...values]; [next[i-1], next[i]] = [next[i], next[i-1]]; onChange(next); }}
                disabled={i === 0}
                className="w-6 h-6 text-xs border border-line bg-white hover:bg-charcoal hover:text-white rounded disabled:opacity-30">↑</button>
              <button onClick={() => { if (i === values.length - 1) return; const next = [...values]; [next[i+1], next[i]] = [next[i], next[i+1]]; onChange(next); }}
                disabled={i === values.length - 1}
                className="w-6 h-6 text-xs border border-line bg-white hover:bg-charcoal hover:text-white rounded disabled:opacity-30">↓</button>
              <button onClick={() => onChange(values.filter((_, j) => j !== i))}
                className="w-6 h-6 text-xs hover:bg-terracotta hover:text-white rounded-full text-muted">×</button>
            </div>
          </div>
          <ImageUploader compact value={v}
            onChange={val => { const next = [...values]; next[i] = val; onChange(next); }}
            folder={folder} />
        </div>
      ))}
      <button onClick={() => onChange([...values, ''])}
        className="w-full px-4 py-3 text-xs font-semibold uppercase tracking-wide-1 border border-dashed border-line text-muted hover:text-terracotta hover:border-terracotta rounded-sm">
        + Add image
      </button>
    </div>
  );
}
