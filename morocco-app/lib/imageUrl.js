/**
 * Build the URL to display an image. Accepts:
 *  - Full URL (https://...) — returned as-is
 *  - Drive file ID (e.g. "1abc...") — converted to thumbnail URL
 *  - Relative /uploads/ path — returned as-is
 */
export function imageUrl(value, size = 1400) {
  if (!value) return '/placeholder.svg';
  if (typeof value !== 'string') value = String(value);
  if (/^https?:\/\//.test(value)) return value;
  if (value.startsWith('/')) return value;
  // Otherwise assume Drive ID
  return `https://drive.google.com/thumbnail?id=${value}&sz=w${size}`;
}

export function fallbackUrl(value) {
  if (!value || typeof value !== 'string') return '';
  if (/^https?:\/\//.test(value) || value.startsWith('/')) return '';
  return `https://drive.google.com/uc?export=view&id=${value}`;
}
