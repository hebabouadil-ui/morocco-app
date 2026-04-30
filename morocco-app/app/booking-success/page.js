'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function SuccessContent() {
  const params = useSearchParams();
  const ref = params.get('ref') || '—';
  const waMsg = params.get('wa') || '';
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212695504949';
  const waUrl = `https://wa.me/${wa}${waMsg ? `?text=${waMsg}` : ''}`;

  return (
    <>
      <Navbar />
      <section className="min-h-[80vh] flex items-center bg-cream py-32">
        <div className="container-x max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-terracotta/10 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-terracotta" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="eyebrow">Booking Received</div>
          <h1 className="font-display text-4xl md:text-5xl mb-6">
            We've got your <em>request</em>.
          </h1>
          <div className="bg-white border border-line rounded-sm p-6 mb-8 inline-block">
            <div className="text-xs uppercase tracking-wide-2 text-muted mb-1">Reference Number</div>
            <div className="font-display text-2xl text-terracotta">{ref}</div>
          </div>
          <p className="text-muted leading-relaxed mb-10 max-w-lg mx-auto">
            Save this reference. To finalize your booking and confirm availability,
            send us a quick WhatsApp — we typically reply within an hour, often within minutes.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              Confirm via WhatsApp <span>→</span>
            </a>
            <Link href="/" className="btn btn-outline">Back to Home</Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
