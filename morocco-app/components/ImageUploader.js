'use client';
import { useState, useRef } from 'react';
import SmartImage from './SmartImage';

/**
 * ImageUploader — supports both upload (file → server) and direct URL/Drive ID input.
 * Props:
 *   value: current image (URL, Drive ID, or /uploads/ path)
 *   onChange(value, meta?) called when image changes; meta has {publicId, provider}
 *   folder: cloudinary folder, default 'morocco-skys'
 *   compact: if true, smaller layout
 */
export default function ImageUploader({ value, onChange, folder = 'morocco-skys', compact = false, label = 'Image' }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const [textInput, setTextInput] = useState(value || '');
  const fileRef = useRef(null);

  async function uploadFile(file) {
    if (!file) return;
    setErr(''); setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || 'Upload failed');
        setUploading(false);
        return;
      }
      onChange(data.url, { publicId: data.publicId, provider: data.provider });
      setTextInput(data.url);
    } catch (e) {
      setErr('Network error.');
    }
    setUploading(false);
  }

  function onDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) uploadFile(e.dataTransfer.files[0]);
  }

  return (
    <div className={`grid gap-3 ${compact ? '' : 'md:grid-cols-[140px_1fr]'}`}>
      {/* Preview */}
      <div
        className={`relative border border-line rounded-sm bg-ivory overflow-hidden flex items-center justify-center
          ${compact ? 'h-24' : 'h-32 md:h-full md:min-h-[140px]'}`}
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}>
        {value ? (
          <SmartImage src={value} alt="" size={400} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-muted text-xs px-2">
            {uploading ? 'Uploading…' : 'No image'}
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center">
            <div className="text-ivory text-xs">Uploading…</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-2">
        <input type="text" value={textInput}
          onChange={e => { setTextInput(e.target.value); onChange(e.target.value); }}
          placeholder="Image URL, /uploads/file.jpg, or Drive ID"
          className="field-input text-xs" />
        <div className="flex flex-wrap gap-2">
          <button type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide-1 bg-terracotta text-white hover:bg-terracotta-dark rounded-sm disabled:opacity-50">
            {uploading ? 'Uploading…' : '↑ Upload'}
          </button>
          {value && (
            <button type="button"
              onClick={() => { onChange(''); setTextInput(''); }}
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide-1 border border-line text-muted hover:bg-ivory rounded-sm">
              × Clear
            </button>
          )}
        </div>
        {err && <div className="text-xs text-terracotta">{err}</div>}
        <input ref={fileRef} type="file" accept="image/*" hidden
          onChange={e => uploadFile(e.target.files?.[0])} />
      </div>
    </div>
  );
}
