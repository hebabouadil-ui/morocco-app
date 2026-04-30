'use client';
import { useEffect, useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { showToast, ToastHost } from '@/components/Toast';

export default function SettingsPage() {
  const [s, setS] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => setS(d.settings));
  }, []);

  function update(field, value) {
    setS(prev => ({ ...prev, [field]: value }));
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s),
    });
    setSaving(false);
    if (res.ok) {
      showToast('Settings saved.');
      setDirty(false);
    } else {
      showToast('Save failed.', 'error');
    }
  }

  if (!s) return <div className="p-10 text-muted">Loading…</div>;

  return (
    <div className="p-6 md:p-10 max-w-4xl pb-32">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl md:text-4xl mb-1">Site & Contact</h1>
          <p className="text-muted text-sm">Phone, brand, hero text — applied across the entire site.</p>
        </div>
        <button onClick={save} disabled={saving || !dirty}
          className="px-5 py-2 text-xs font-semibold uppercase tracking-wide-1 bg-terracotta text-white hover:bg-terracotta-dark rounded-sm disabled:opacity-50">
          {saving ? 'Saving…' : dirty ? 'Save Changes' : 'Saved'}
        </button>
      </div>

      <Section title="Contact & WhatsApp">
        <Row>
          <Field label="Display phone">
            <input className="field-input" value={s.phone || ''} onChange={e => update('phone', e.target.value)} />
          </Field>
          <Field label="Tel: link (digits)">
            <input className="field-input" value={s.phoneTel || ''} onChange={e => update('phoneTel', e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="WhatsApp number (no spaces, no +)">
            <input className="field-input" value={s.whatsappNumber || ''} onChange={e => update('whatsappNumber', e.target.value)} placeholder="212695504949" />
          </Field>
          <Field label="Location">
            <input className="field-input" value={s.location || ''} onChange={e => update('location', e.target.value)} />
          </Field>
        </Row>
        <Field label="Email (optional)">
          <input className="field-input" type="email" value={s.email || ''} onChange={e => update('email', e.target.value)} />
        </Field>
      </Section>

      <Section title="Brand">
        <Row>
          <Field label="Brand line 1"><input className="field-input" value={s.brandLine1 || ''} onChange={e => update('brandLine1', e.target.value)} /></Field>
          <Field label="Brand line 2"><input className="field-input" value={s.brandLine2 || ''} onChange={e => update('brandLine2', e.target.value)} /></Field>
        </Row>
        <Row>
          <Field label="Rating"><input className="field-input" value={s.rating || ''} onChange={e => update('rating', e.target.value)} /></Field>
          <Field label="Review count label"><input className="field-input" value={s.reviewCount || ''} onChange={e => update('reviewCount', e.target.value)} /></Field>
        </Row>
      </Section>

      <Section title="Hero (homepage)" desc="The big banner at the top of the home page.">
        <Field label="Eyebrow"><input className="field-input" value={s.heroEyebrow || ''} onChange={e => update('heroEyebrow', e.target.value)} /></Field>
        <Field label="Title line 1"><input className="field-input" value={s.heroTitleLine1 || ''} onChange={e => update('heroTitleLine1', e.target.value)} /></Field>
        <Field label="Title line 2"><input className="field-input" value={s.heroTitleLine2 || ''} onChange={e => update('heroTitleLine2', e.target.value)} /></Field>
        <Field label="Title line 3 (gold accent)"><input className="field-input" value={s.heroTitleLine3 || ''} onChange={e => update('heroTitleLine3', e.target.value)} /></Field>
        <Field label="Subtitle"><textarea className="field-input resize-none" rows={3} value={s.heroSubtitle || ''} onChange={e => update('heroSubtitle', e.target.value)} /></Field>
        <p className="text-xs text-muted">↪ Manage hero <strong>images</strong> in the Gallery section under "Hero Slider".</p>
      </Section>

      <Section title="Our Story (homepage)">
        <Field label="Story image">
          <ImageUploader value={s.storyImage} onChange={v => update('storyImage', v)} folder="settings" />
        </Field>
        <Field label="Story title"><input className="field-input" value={s.storyTitle || ''} onChange={e => update('storyTitle', e.target.value)} /></Field>
        <Field label="Paragraph 1"><textarea className="field-input resize-none" rows={3} value={s.storyParagraph1 || ''} onChange={e => update('storyParagraph1', e.target.value)} /></Field>
        <Field label="Paragraph 2"><textarea className="field-input resize-none" rows={3} value={s.storyParagraph2 || ''} onChange={e => update('storyParagraph2', e.target.value)} /></Field>
      </Section>

      <Section title="CTA & Footer">
        <Field label="CTA title"><input className="field-input" value={s.ctaTitle || ''} onChange={e => update('ctaTitle', e.target.value)} /></Field>
        <Field label="CTA text"><textarea className="field-input resize-none" rows={2} value={s.ctaText || ''} onChange={e => update('ctaText', e.target.value)} /></Field>
        <Field label="Footer tagline"><textarea className="field-input resize-none" rows={2} value={s.footerTagline || ''} onChange={e => update('footerTagline', e.target.value)} /></Field>
        <Row3>
          <Field label="Hours line 1"><input className="field-input" value={s.hours1 || ''} onChange={e => update('hours1', e.target.value)} /></Field>
          <Field label="Hours line 2"><input className="field-input" value={s.hours2 || ''} onChange={e => update('hours2', e.target.value)} /></Field>
          <Field label="Hours line 3 (highlight)"><input className="field-input" value={s.hours3 || ''} onChange={e => update('hours3', e.target.value)} /></Field>
        </Row3>
      </Section>

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
function Field({ label, children }) { return (<div><div className="field-label">{label}</div>{children}</div>); }
function Row({ children }) { return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>; }
function Row3({ children }) { return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>; }
