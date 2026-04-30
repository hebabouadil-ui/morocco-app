import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
  // Singleton — there will only ever be one document
  singleton: { type: String, default: 'main', unique: true },
  brandLine1: { type: String, default: 'Morocco Skys' },
  brandLine2: { type: String, default: '& Secrets' },
  phone: { type: String, default: '+212 695 504 949' },
  phoneTel: { type: String, default: '+212695504949' },
  whatsappNumber: { type: String, default: '212695504949' },
  location: { type: String, default: 'Marrakech, Morocco' },
  email: { type: String, default: '' },
  rating: { type: String, default: '4.9' },
  reviewCount: { type: String, default: '1,200+ reviews' },
  heroEyebrow: { type: String, default: 'A curated escape · Marrakech' },
  heroTitleLine1: { type: String, default: 'Discover Morocco' },
  heroTitleLine2: { type: String, default: 'from the Sky & beyond' },
  heroTitleLine3: { type: String, default: 'hidden paths' },
  heroSubtitle: { type: String, default: "Sunrise balloon flights above the Atlas. Cascading waterfalls of Ouzoud. Private SUV journeys through the Sahara's golden silence." },
  storyTitle: { type: String, default: 'Morocco, the way locals show their oldest friends.' },
  storyParagraph1: { type: String, default: "We don't sell tickets — we open doors. Every guide is a Marrakech native." },
  storyParagraph2: { type: String, default: "You won't find us on the package-tour rack. You'll find us through a friend of a friend." },
  storyImage: { type: String, default: '' },
  ctaTitle: { type: String, default: 'Your Morocco begins with a single message.' },
  ctaText: { type: String, default: "Tell us when you arrive and what you've always dreamed of seeing." },
  footerTagline: { type: String, default: 'A small, family-run agency in Marrakech crafting unhurried, original journeys.' },
  hours1: { type: String, default: 'Mon — Sun' },
  hours2: { type: String, default: '06:00 — 23:00' },
  hours3: { type: String, default: 'Replies in < 1 hour' },
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
