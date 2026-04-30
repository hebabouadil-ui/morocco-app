'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/balloon', label: 'Balloon' },
  { href: '/waterfall', label: 'Waterfall' },
  { href: '/tour', label: 'Private Tours' },
  { href: '/gallery', label: 'Gallery' },
];

export default function Navbar({ phone = '+212 695 504 949', whatsapp = '212695504949' }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      {/* Top strip */}
      <div className="hidden md:block bg-charcoal text-ivory/80 text-xs">
        <div className="container-x py-2 flex items-center justify-between">
          <span>🇲🇦 Marrakech, Morocco · {phone}</span>
          <span>⭐ 4.9 · 1,200+ travelers · Free cancellation</span>
        </div>
      </div>

      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-cream/95 backdrop-blur-md border-b border-line shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="container-x flex items-center justify-between h-20">
          <Link href="/" className="font-display text-charcoal leading-none">
            <div className="text-lg md:text-xl font-medium">Morocco Skys</div>
            <div className="text-sm md:text-base text-terracotta italic">& Secrets</div>
          </Link>

          <ul className={`
            hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide-1
          `}>
            {LINKS.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`hover:text-terracotta transition-colors ${
                    pathname === l.href ? 'text-terracotta' : 'text-charcoal'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank" rel="noopener noreferrer"
            className="hidden lg:inline-flex btn btn-primary !py-3 !px-5 text-xs"
          >
            Book Now <span>→</span>
          </a>

          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <span className={`w-6 h-px bg-charcoal transition-all ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`w-6 h-px bg-charcoal transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-px bg-charcoal transition-all ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 bg-cream border-b border-line ${open ? 'max-h-96' : 'max-h-0'}`}>
          <ul className="container-x py-4 flex flex-col gap-1">
            {LINKS.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`block py-3 text-sm font-medium border-b border-line/50 ${
                    pathname === l.href ? 'text-terracotta' : 'text-charcoal'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-primary w-full justify-center"
              >
                Book Now <span>→</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
