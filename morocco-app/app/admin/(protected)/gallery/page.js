'use client';
import { useEffect, useState, useRef } from 'react';
import SmartImage from '@/components/SmartImage';
import { showToast, ToastHost } from '@/components/Toast';

const CATEGORIES = [
  { key: 'hero', label: 'Hero Slider', desc: 'Big rotating images on the home page hero.' },
  { key: 'preview', label: 'Home Gallery Preview', desc: 'The 7-image grid above the CTA on the home page.' },
  { key: 'desert', label: 'Desert', desc: 'Sahara, dunes, camels.' },
  { key: 'riad', label: 'Riad', desc: 'Architecture, courtyards, interiors.' },
  { key: 'culture', label: 'Culture & Souk', desc: 'Markets, crafts, daily life.' },
];

export default function GalleryAdmin() {
  const [grouped, setGrouped] = useState({});
  const [activeCat, setActiveCat] = useState('hero');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function load() {
    const res = await fetch('/api/gallery');
    const data = await res.json();
    setGrouped(data.grouped || {});
  }
  useEffect(() => { load(); }, []);

  async function handleFiles(files) {
    if (!files?.length) return;
    setUploading(true);
    let added = 0;
    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', `gallery/${activeCat}`);
        const upRes = await fetch('/api/upload', { method: 'POST', body: fd });
        if (!upRes.ok) continue;
        const up = await upRes.json();
        const galRes = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: up.url, publicId: up.publicId, category: activeCat }),
        });
        if (galRes.ok) added++;
      } catch (e) { /* keep going */ }
    }
    setUploading(false);
    if (added > 0) {
      showToast(`Uploaded ${added} image${added > 1 ? 's' : ''}.`);
      load();
    } else {
      showToast('Upload failed.', 'error');
    }
  }

  async function deleteImage(id) {
    if (!confirm('Delete this image?')) return;
    const res = await fetch('/api/gallery', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      showToast('Image deleted.');
      load();
    } else {
      showToast('Delete failed.', 'error');
    }
  }

  const images = grouped[activeCat] || [];

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl mb-1">Gallery & Images</h1>
        <p className="text-muted text-sm">Upload, organize, and remove site images.</p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 mb-6 bg-white border border-line rounded-sm p-1">
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setActiveCat(c.key)}
            className={`px-4 py-2 text-xs uppercase tracking-wide-1 font-semibold rounded-sm transition-colors ${
              activeCat === c.key ? 'bg-charcoal text-ivory' : 'text-muted hover:text-charcoal'
            }`}>
            {c.label} <span className="ml-1 opacity-60">({(grouped[c.key] || []).length})</span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-line rounded-sm p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <h2 className="font-display text-xl">
              {CATEGORIES.find(c => c.key === activeCat)?.label}
            </h2>
            <p className="text-sm text-muted">
              {CATEGORIES.find(c => c.key === activeCat)?.desc}
            </p>
          </div>
          <div>
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wide-1 bg-terracotta text-white hover:bg-terracotta-dark rounded-sm disabled:opacity-50">
              {uploading ? 'Uploading…' : '↑ Upload Images'}
            </button>
            <input type="file" ref={fileRef} multiple accept="image/*" hidden
              onChange={e => handleFiles(Array.from(e.target.files || []))} />
          </div>
        </div>

        {/* Drag drop zone */}
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleFiles(Array.from(e.dataTransfer.files)); }}
          className="border-2 border-dashed border-line rounded-sm py-12 text-center text-muted text-sm mb-6">
          Drop images here to upload to <strong className="text-charcoal">{activeCat}</strong>
        </div>

        {/* Image grid */}
        {images.length === 0 ? (
          <p className="text-center text-muted py-12 text-sm">No images yet in this category.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map(img => (
              <div key={img._id} className="group relative aspect-square overflow-hidden bg-ivory border border-line">
                <SmartImage src={img.url} alt={img.caption || ''} size={600}
                  className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-charcoal/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => deleteImage(img._id)}
                    className="px-3 py-2 bg-terracotta text-white text-xs font-semibold uppercase tracking-wide-1 rounded-sm hover:bg-terracotta-dark">
                    × Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-cream border border-line rounded-sm p-5 text-xs text-muted">
        <strong className="text-charcoal">Tip:</strong> Without Cloudinary configured, uploads save to <code className="bg-white px-1.5 py-0.5 rounded text-charcoal">/public/uploads/</code> on the server.
        For production, set <code className="bg-white px-1.5 py-0.5 rounded text-charcoal">CLOUDINARY_*</code> env vars in <code className="bg-white px-1.5 py-0.5 rounded text-charcoal">.env.local</code> — see README.
      </div>

      <ToastHost />
    </div>
  );
}
