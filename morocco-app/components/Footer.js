import Link from 'next/link';

export default function Footer({ settings = {} }) {
  const phone = settings.phone || '+212 695 504 949';
  const whatsapp = settings.whatsappNumber || '212695504949';
  const location = settings.location || 'Marrakech, Morocco';
  const tagline = settings.footerTagline || 'A small, family-run agency in Marrakech crafting unhurried, original journeys.';
  const hours1 = settings.hours1 || 'Mon — Sun';
  const hours2 = settings.hours2 || '06:00 — 23:00';
  const hours3 = settings.hours3 || 'Replies in < 1 hour';

  return (
    <>
      <footer className="bg-charcoal text-ivory/80 mt-20">
        <div className="container-x py-16 grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-display text-2xl text-ivory mb-1">Morocco Skys</div>
            <div className="font-display text-xl text-gold italic mb-5">& Secrets</div>
            <p className="text-sm leading-relaxed max-w-md">{tagline}</p>
          </div>

          <div>
            <h5 className="text-ivory text-xs uppercase tracking-wide-2 mb-4 font-semibold">Experiences</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/balloon" className="hover:text-gold">Sunrise Balloon</Link></li>
              <li><Link href="/waterfall" className="hover:text-gold">Ouzoud Waterfall</Link></li>
              <li><Link href="/tour" className="hover:text-gold">Private SUV Tours</Link></li>
              <li><Link href="/gallery" className="hover:text-gold">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-ivory text-xs uppercase tracking-wide-2 mb-4 font-semibold">Contact</h5>
            <div className="space-y-2 text-sm">
              <div>{phone}</div>
              <div>{location}</div>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">WhatsApp</a>
              <div className="pt-3 text-xs text-ivory/60">
                <div>{hours1}</div>
                <div>{hours2}</div>
                <div className="text-gold">{hours3}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-ivory/10">
          <div className="container-x py-5 flex flex-col md:flex-row justify-between gap-2 text-xs text-ivory/50">
            <span>© {new Date().getFullYear()} Morocco Skys & Secrets · Marrakech</span>
            <span>Crafted with مراكش love.</span>
          </div>
        </div>
      </footer>

      <a
        className="fab-whatsapp"
        href={`https://wa.me/${whatsapp}`}
        target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M17.6 6.31a7.85 7.85 0 0 0-11.1 0 7.84 7.84 0 0 0-1.6 8.91L4 20l4.85-1a7.85 7.85 0 0 0 8.85-13.65zM12 18.6a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.88.6.62-2.81-.16-.25a6.6 6.6 0 1 1 6.02 3.52zm3.6-4.94c-.2-.1-1.17-.58-1.35-.65-.18-.07-.31-.1-.45.1s-.51.65-.62.78c-.11.13-.23.15-.42.05a5.4 5.4 0 0 1-1.6-.99 6 6 0 0 1-1.1-1.37c-.12-.2 0-.31.09-.41.09-.1.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34h-.38a.74.74 0 0 0-.53.25 2.24 2.24 0 0 0-.7 1.66 3.9 3.9 0 0 0 .82 2.06 8.92 8.92 0 0 0 3.4 3c.48.2.85.32 1.14.41a2.74 2.74 0 0 0 1.26.08c.39-.06 1.17-.48 1.34-.94.16-.46.16-.85.11-.93s-.18-.13-.38-.23z"/>
        </svg>
      </a>
    </>
  );
}
