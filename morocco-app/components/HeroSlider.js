'use client';
import { useEffect, useState } from 'react';
import SmartImage from './SmartImage';

export default function HeroSlider({ images = [] }) {
  const [i, setI] = useState(0);
  const len = images.length;

  useEffect(() => {
    if (len <= 1) return;
    const t = setInterval(() => setI(prev => (prev + 1) % len), 6000);
    return () => clearInterval(t);
  }, [len]);

  if (len === 0) return null;

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden">
      {images.map((img, idx) => (
        <div key={idx} className={`hero-slide ${idx === i ? 'active' : ''}`}>
          <SmartImage src={img} alt={`Morocco ${idx + 1}`} size={2000} priority={idx === 0} className="" />
        </div>
      ))}
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60 z-10" />

      {/* Counter */}
      <div className="absolute top-32 right-8 md:right-12 text-ivory text-sm font-display tracking-wide-2 z-20">
        <span className="text-2xl">{String(i + 1).padStart(2, '0')}</span>
        <span className="text-ivory/60"> / {String(len).padStart(2, '0')}</span>
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-1 rounded-full transition-all ${idx === i ? 'w-10 bg-ivory' : 'w-5 bg-ivory/40 hover:bg-ivory/70'}`}
          />
        ))}
      </div>
    </section>
  );
}
