'use client';
import { useState } from 'react';
import { imageUrl, fallbackUrl } from '@/lib/imageUrl';

export default function SmartImage({ src, alt = '', size = 1400, className = '', priority = false }) {
  const primary = imageUrl(src, size);
  const backup = fallbackUrl(src);
  const [current, setCurrent] = useState(primary);
  const [triedBackup, setTriedBackup] = useState(false);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      onError={() => {
        if (!triedBackup && backup) {
          setCurrent(backup);
          setTriedBackup(true);
        }
      }}
    />
  );
}
