import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import SmartImage from '@/components/SmartImage';
import { getTours, getGalleryByCategory, getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic'; // always fetch fresh

export default async function HomePage() {
  const [tours, gallery, settings] = await Promise.all([
    getTours(),
    getGalleryByCategory(),
    getSettings(),
  ]);

  const heroImages = (gallery.hero || []).map(g => g.url);
  const previewImages = (gallery.preview || []).map(g => g.url);

  return (
    <main>
      <Navbar phone={settings.phone} whatsapp={settings.whatsappNumber} />

      {/* HERO */}
      <div className="relative -mt-20">
        {heroImages.length > 0 ? (
          <HeroSlider images={heroImages} />
        ) : (
          <div className="h-screen min-h-[640px] bg-charcoal" />
        )}
        <div className="absolute inset-0 z-20 flex items-end pb-32 pointer-events-none">
          <div className="container-x">
            <div className="max-w-3xl text-ivory pointer-events-auto">
              <div className="text-xs uppercase tracking-wide-3 text-gold mb-5">{settings.heroEyebrow}</div>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-ivory mb-6">
                {settings.heroTitleLine1}<br />
                {settings.heroTitleLine2}<br />
                <em className="!text-gold italic">{settings.heroTitleLine3}</em>
              </h1>
              <p className="text-base md:text-lg text-ivory/85 max-w-xl leading-relaxed mb-8">
                {settings.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#activities" className="btn btn-primary">
                  Check Availability <span>→</span>
                </a>
                <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer"
                  className="btn bg-ivory/10 text-ivory border-ivory/30 hover:bg-ivory hover:text-charcoal backdrop-blur-sm">
                  Book on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVITIES */}
      <section id="activities" className="py-24 md:py-32 bg-cream">
        <div className="container-x">
          <div className="text-center mb-16">
            <div className="text-gold mb-4">◇</div>
            <div className="eyebrow">Signature Experiences</div>
            <h2 className="font-display text-4xl md:text-5xl mb-6">
              Three ways to fall <em>in love</em><br />with Morocco.
            </h2>
            <p className="max-w-xl mx-auto text-muted">
              Each journey is hand-built by Marrakech locals — small groups, exceptional guides,
              no rushed itineraries. Just the magic.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {tours.map(t => (
              <Link href={`/${t.slug}`} key={t.slug} className="group bg-white border border-line rounded-sm overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <SmartImage src={t.cardImage} alt={t.title} size={1200}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute top-4 left-4 bg-cream/90 text-charcoal text-[10px] font-semibold uppercase tracking-wide-2 px-3 py-1.5 backdrop-blur-sm">
                    {t.cardTag}
                  </span>
                </div>
                <div className="p-7">
                  <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-wide-2 text-muted">
                    <span>{t.cardLocation}</span>
                    <span className="text-terracotta font-semibold">{t.priceDisplay || `${t.price} ${t.currency}`}</span>
                  </div>
                  <h3 className="font-display text-2xl mb-3">{t.shortTitle || t.title}</h3>
                  <p className="text-sm text-muted leading-relaxed mb-5">{t.cardDescription}</p>
                  <div className="text-sm font-semibold text-terracotta uppercase tracking-wide-1 inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    View Details <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-charcoal text-ivory py-16">
        <div className="container-x grid md:grid-cols-4 gap-8 items-center">
          <h3 className="font-display text-2xl md:text-3xl text-ivory md:col-span-1">
            A <em className="!text-gold">quietly trusted</em> name.
          </h3>
          <div className="text-center md:text-left">
            <div className="text-gold text-lg mb-1">★★★★★</div>
            <div className="font-display text-3xl text-ivory">{settings.rating}</div>
            <div className="text-xs uppercase tracking-wide-2 text-ivory/60">{settings.reviewCount}</div>
          </div>
          <div className="text-center md:text-left">
            <div className="font-display text-3xl text-ivory">24h</div>
            <div className="text-xs uppercase tracking-wide-2 text-ivory/60">Instant Confirmation</div>
          </div>
          <div className="text-center md:text-left">
            <div className="font-display text-3xl text-ivory">Free</div>
            <div className="text-xs uppercase tracking-wide-2 text-ivory/60">Cancellation</div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-24 md:py-32 bg-ivory">
        <div className="container-x grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/5] overflow-hidden order-2 md:order-1">
            {settings.storyImage && (
              <SmartImage src={settings.storyImage} alt="Morocco" size={1400}
                className="w-full h-full object-cover" />
            )}
          </div>
          <div className="order-1 md:order-2">
            <div className="font-display italic text-terracotta mb-3">— 01 / Our Story</div>
            <h2 className="font-display text-3xl md:text-5xl mb-6">{settings.storyTitle}</h2>
            <p className="text-muted leading-relaxed mb-5">{settings.storyParagraph1}</p>
            <p className="text-muted leading-relaxed mb-8">{settings.storyParagraph2}</p>
            <Link href="/tour" className="btn btn-outline">
              Plan a Private Journey <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      {previewImages.length > 0 && (
        <section className="py-24 bg-cream">
          <div className="container-x">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <div className="eyebrow">Through Our Lens</div>
                <h2 className="font-display text-4xl md:text-5xl">Postcards from <em>the road</em>.</h2>
              </div>
              <Link href="/gallery" className="btn btn-outline">View Full Gallery <span>→</span></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {previewImages.slice(0, 7).map((img, i) => (
                <Link href="/gallery" key={i}
                  className={`overflow-hidden ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}>
                  <SmartImage src={img} alt="" size={i === 0 ? 1400 : 800}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-charcoal text-ivory py-24">
        <div className="container-x text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl text-ivory mb-6">{settings.ctaTitle}</h2>
          <p className="text-ivory/70 mb-10 leading-relaxed">{settings.ctaText}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              Chat on WhatsApp <span>→</span>
            </a>
            <a href={`tel:${settings.phoneTel}`} className="btn bg-transparent text-ivory border-ivory/30 hover:bg-ivory hover:text-charcoal">
              {settings.phone}
            </a>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </main>
  );
}
