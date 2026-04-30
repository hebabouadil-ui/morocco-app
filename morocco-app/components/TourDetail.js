import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmartImage from '@/components/SmartImage';
import BookingForm from '@/components/BookingForm';
import { getTour, getSettings } from '@/lib/data';

export default async function TourDetail({ slug }) {
  const [tour, settings] = await Promise.all([getTour(slug), getSettings()]);
  if (!tour) notFound();

  return (
    <main>
      <Navbar phone={settings.phone} whatsapp={settings.whatsappNumber} />

      {/* HERO */}
      <section className="relative h-[68vh] min-h-[460px] overflow-hidden -mt-20">
        <div className="absolute inset-0 page-hero-img">
          <SmartImage src={tour.heroImage} alt={tour.title} size={2000} priority className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        <div className="relative h-full flex items-end pb-16 z-10">
          <div className="container-x">
            <nav className="text-ivory/70 text-xs mb-6 flex items-center gap-2">
              <Link href="/" className="hover:text-ivory">Home</Link>
              <span>/</span>
              <span className="text-ivory">{tour.shortTitle || tour.title}</span>
            </nav>
            <div className="text-gold uppercase tracking-wide-2 text-xs mb-4">— {tour.eyebrow}</div>
            <h1 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05] mb-6 max-w-3xl">
              {tour.title.split(' ').map((w, i) => (
                /balloon|waterfall|suv|sky|sunrise|hidden/i.test(w)
                  ? <em key={i} className="!text-gold italic">{w} </em>
                  : <span key={i}>{w} </span>
              ))}
            </h1>
            <p className="text-ivory/85 max-w-2xl leading-relaxed">{tour.subtitle}</p>
          </div>
        </div>
      </section>

      {/* EXPERIENCE + BOOKING */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="container-x grid lg:grid-cols-[1fr_400px] gap-12">
          <div>
            <h2 className="font-display text-3xl md:text-5xl mb-6">{tour.storyTitle}</h2>
            {tour.storyParagraphs.map((p, i) => (
              <p key={i} className={`text-muted leading-relaxed mb-5 ${i === 0 ? 'text-lg' : ''}`}>{p}</p>
            ))}

            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="mt-12 space-y-1">
                <div className="eyebrow">Itinerary</div>
                <h3 className="font-display text-2xl md:text-3xl mb-8">A day, hour by hour.</h3>
                <div className="space-y-6">
                  {tour.itinerary.map((step, i) => (
                    <div key={i} className="grid grid-cols-[100px_1fr] gap-6 pb-6 border-b border-line/50 last:border-b-0">
                      <div className="font-display text-xl text-terracotta">{step.time}</div>
                      <div>
                        <h4 className="font-display text-lg mb-1">{step.title}</h4>
                        <p className="text-sm text-muted leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-32 self-start">
            <BookingForm tour={tour} whatsapp={settings.whatsappNumber} />
          </aside>
        </div>
      </section>

      {/* INCLUDED */}
      {tour.bookingFeatures && tour.bookingFeatures.length > 0 && (
        <section className="py-20 bg-ivory">
          <div className="container-x">
            <div className="eyebrow text-center">What's Included</div>
            <h2 className="font-display text-3xl md:text-4xl text-center mb-12">Everything taken care of.</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {tour.bookingFeatures.map((f, i) => (
                <div key={i} className="bg-white border border-line p-5 flex items-start gap-3">
                  <svg className="w-5 h-5 text-terracotta flex-none mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {tour.galleryImages && tour.galleryImages.length > 0 && (
        <section className="py-20 bg-cream">
          <div className="container-x">
            <div className="text-center mb-12">
              <div className="eyebrow">In Pictures</div>
              <h2 className="font-display text-3xl md:text-5xl">A glimpse <em>of the journey</em>.</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {tour.galleryImages.map((img, i) => (
                <div key={i} className={`overflow-hidden ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}>
                  <SmartImage src={img} alt="" size={i === 0 ? 1400 : 800}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer settings={settings} />
    </main>
  );
}
