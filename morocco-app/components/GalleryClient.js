'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmartImage from '@/components/SmartImage';

export default function GalleryClient({ grouped, settings }) {
  const [tab, setTab] = useState('desert');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setLightbox(null); }
    if (lightbox) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  const tabs = [
    { key: 'desert', label: 'Desert' },
    { key: 'riad', label: 'Riad' },
    { key: 'culture', label: 'Culture & Souk' },
  ];
  const images = grouped[tab] || [];

  return (
    <main>
      <Navbar phone={settings.phone} whatsapp={settings.whatsappNumber} />

      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-cream text-center">
        <div className="container-x">
          <div className="eyebrow">A Visual Journal</div>
          <h1 className="font-display text-4xl md:text-6xl mb-6">
            Three rooms, three <em>colors</em>.
          </h1>
          <p className="text-muted max-w-2xl mx-auto">
            The amber of the desert, the indigo of the riads, the saffron of the souk.
            Click any image to enlarge.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-y border-line bg-cream sticky top-20 z-30">
        <div className="container-x flex items-center justify-center gap-2 md:gap-6 py-4 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 text-xs uppercase tracking-wide-2 font-semibold whitespace-nowrap transition-all
                ${tab === t.key ? 'text-terracotta border-b-2 border-terracotta' : 'text-muted hover:text-charcoal border-b-2 border-transparent'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry */}
      <section className="py-16 bg-cream">
        <div className="container-x">
          {images.length === 0 ? (
            <p className="text-center text-muted py-20">No images in this category yet.</p>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {images.map((img, i) => (
                <button key={img._id || i} onClick={() => setLightbox(img.url)}
                  className="block w-full overflow-hidden break-inside-avoid bg-ivory">
                  <SmartImage src={img.url} alt={img.caption || ''} size={1200}
                    className="w-full h-auto hover:scale-105 transition-transform duration-500" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-charcoal/95 z-[100] flex items-center justify-center p-4 md:p-8 cursor-pointer"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-ivory text-3xl w-10 h-10 flex items-center justify-center hover:text-gold"
            aria-label="Close" onClick={() => setLightbox(null)}>×</button>
          <div className="max-w-6xl max-h-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <SmartImage src={lightbox} alt="" size={2000} className="max-w-full max-h-[88vh] object-contain" />
          </div>
        </div>
      )}

      <Footer settings={settings} />
    </main>
  );
}
