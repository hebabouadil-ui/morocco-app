'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const NAV = [
  { href: '/admin', label: 'Overview', icon: '⌂' },
  { href: '/admin/bookings', label: 'Bookings', icon: '📅' },
  { href: '/admin/tours', label: 'Tours & Pricing', icon: '◉' },
  { href: '/admin/gallery', label: 'Gallery & Images', icon: '▦' },
  { href: '/admin/settings', label: 'Site & Contact', icon: '⚙' },
];

export default function AdminShell({ admin, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cream">
      {/* Mobile bar */}
      <div className="md:hidden flex items-center justify-between bg-charcoal text-ivory px-4 py-3">
        <div>
          <div className="text-[10px] tracking-wide-3 text-gold">M · S · S</div>
          <div className="font-display">Dashboard</div>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2" aria-label="Menu">
          <span className="block w-5 h-0.5 bg-ivory mb-1"></span>
          <span className="block w-5 h-0.5 bg-ivory mb-1"></span>
          <span className="block w-5 h-0.5 bg-ivory"></span>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`md:w-64 md:flex-none bg-charcoal text-ivory md:min-h-screen md:sticky md:top-0 md:h-screen md:overflow-y-auto ${open ? 'block' : 'hidden md:block'}`}>
        <div className="p-7 border-b border-ivory/10 hidden md:block">
          <div className="text-[10px] tracking-wide-3 text-gold mb-1">M · S · S</div>
          <div className="font-display text-xl">Dashboard</div>
          <div className="text-xs text-ivory/50 mt-1 truncate">{admin?.email}</div>
        </div>
        <nav className="py-4">
          {NAV.map(n => {
            const active = n.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-7 py-3 text-sm transition-colors border-l-2 ${
                  active
                    ? 'bg-terracotta/15 text-ivory border-terracotta font-semibold'
                    : 'text-ivory/65 border-transparent hover:text-ivory hover:bg-ivory/5'
                }`}>
                <span className="w-5 text-center text-base opacity-80">{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="md:absolute md:bottom-0 md:left-0 md:right-0 p-5 border-t border-ivory/10 space-y-2">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="block text-xs text-ivory/60 hover:text-gold">↗ View live site</a>
          <button onClick={logout}
            className="block text-xs text-ivory/60 hover:text-terracotta">→ Sign out</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
