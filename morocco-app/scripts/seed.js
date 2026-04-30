/**
 * One-shot seed: creates default admin + tours + gallery + site settings.
 * Run with: npm run seed
 * Safe to re-run — uses upserts.
 */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@moroccoskys.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env.local');
  process.exit(1);
}

// Inline schemas (CommonJS for the script)
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Admin' },
}, { timestamps: true });

const TourSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: String, shortTitle: String, eyebrow: String, subtitle: String,
  cardDescription: String, cardTag: String, cardLocation: String,
  storyTitle: String, storyParagraphs: [String],
  price: Number, priceDisplay: String, priceUnit: String, currency: String,
  duration: String, heroImage: String, cardImage: String,
  galleryImages: [String], bookingFeatures: [String],
  itinerary: [{ time: String, title: String, description: String, _id: false }],
  active: Boolean, order: Number,
}, { timestamps: true });

const GalleryImageSchema = new mongoose.Schema({
  url: String, publicId: String, category: String, caption: String, order: Number,
}, { timestamps: true });

const SiteSettingsSchema = new mongoose.Schema({
  singleton: { type: String, default: 'main', unique: true },
  brandLine1: String, brandLine2: String,
  phone: String, phoneTel: String, whatsappNumber: String, location: String, email: String,
  rating: String, reviewCount: String,
  heroEyebrow: String, heroTitleLine1: String, heroTitleLine2: String, heroTitleLine3: String,
  heroSubtitle: String,
  storyTitle: String, storyParagraph1: String, storyParagraph2: String, storyImage: String,
  ctaTitle: String, ctaText: String,
  footerTagline: String, hours1: String, hours2: String, hours3: String,
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
const Tour = mongoose.models.Tour || mongoose.model('Tour', TourSchema);
const GalleryImage = mongoose.models.GalleryImage || mongoose.model('GalleryImage', GalleryImageSchema);
const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

const TOURS = [
  {
    slug: 'balloon',
    title: 'Atlas Sunrise Balloon Experience',
    shortTitle: 'Sunrise Balloon Flight',
    eyebrow: 'Signature Flight · 4 Hours · Sunrise',
    subtitle: 'The Atlas mountains, the rose-pink desert, and the silent rise of the sun — all witnessed from a single wicker basket, 1,200 metres above the world.',
    cardDescription: "Float above the Atlas at first light. Champagne breakfast in a Berber tent, silver-rimmed dunes glowing pink — a flight that rewrites your morning.",
    cardTag: 'Sunrise · 4 hrs',
    cardLocation: 'Atlas Mountains',
    storyTitle: 'A flight written in silence, gold, and altitude.',
    storyParagraphs: [
      'You are collected from your riad before dawn. By the time you reach the launch field, the burners are already glowing — and the world is still asleep.',
      'For roughly an hour, you drift. There is no engine, no schedule, no sound but the occasional hiss of flame. Below, a Berber village wakes. A donkey crosses a dry riverbed. A shepherd looks up and waves.',
      "When you land — usually in a field of olive trees — a Berber tent is waiting. Inside: hot mint tea, fresh msemen pancakes, jam from the village, and a glass of cold champagne to mark the morning. You'll be back at your hotel by eleven, and you'll talk about it for years."
    ],
    price: 1200, priceDisplay: '1,200 MAD', priceUnit: 'per person', currency: 'MAD',
    duration: '4 hours',
    heroImage: '1tUotOk25J_x1psWxHw4ztrVfu8veomzw',
    cardImage: '1tUotOk25J_x1psWxHw4ztrVfu8veomzw',
    galleryImages: [
      '1LIAwgR25D16AT20nlCfUJ4Mi9S9TG_84',
      '1QN2x8wJw03X-uWzrNrZjBI4Wzwfw46zm',
      '1HqjsQEztzH5_RoT9ABLbE8mIIXZXuOYf',
      '14E0HQAZRfvsFou1UDEUmwMrFsbOitEkf',
      '1FoWxFZyWxEQk8pV-TIkfSbRPLXsEWl_W',
      '1G-Ax05T_TJnv0W2R2n6JoX5GU3M_hxED',
      '1E-rGa6wNHTdMg5upv1mrWrRBOw1luaRW',
    ],
    bookingFeatures: [
      'Hotel pickup & drop-off in Marrakech',
      '~1 hour balloon flight at sunrise',
      'Champagne Berber tent breakfast',
      'Certificate of flight',
      'Free cancellation up to 48h',
      'Instant confirmation by WhatsApp',
    ],
    itinerary: [
      { time: '04:30', title: 'Hotel Pickup', description: 'Air-conditioned 4×4 collects you from your riad or hotel in Marrakech. Coffee and a pastry on board.' },
      { time: '05:30', title: 'Launch Field & Briefing', description: 'Watch the balloons inflate as the desert turns from black to navy to gold. Safety briefing with your captain.' },
      { time: '06:15', title: 'Liftoff at Sunrise', description: 'A roughly one-hour flight, drifting up to 1,200 metres above Berber villages, palm groves, and the foothills of the Atlas.' },
      { time: '07:30', title: 'Champagne Berber Breakfast', description: 'A traditional tent breakfast — msemen, baghrir, fresh fruit, mountain honey, mint tea, and a flute of champagne.' },
      { time: '10:30', title: 'Return to Marrakech', description: "Flight certificate in hand, you're dropped back at your hotel — ideally in time for a long swim, or a long nap." },
    ],
    active: true, order: 1,
  },
  {
    slug: 'waterfall',
    title: 'Ouzoud Waterfall Escape',
    shortTitle: 'Ouzoud Waterfall',
    eyebrow: 'Day Trip · 8 Hours · Year-Round',
    subtitle: '110 metres of thundering water through a red-rock canyon, three hours from Marrakech. Wild macaques, olive groves, and lunch on a cliffside terrace.',
    cardDescription: '110 metres of thundering water through a red-rock canyon. Resident Barbary macaques, olive groves, lunch on a cliffside terrace.',
    cardTag: 'Day Trip · 8 hrs',
    cardLocation: 'Ouzoud Falls',
    storyTitle: "Morocco's tallest cascade, from a cliffside lunch table.",
    storyParagraphs: [
      'A leisurely morning drive through the Atlas takes you to Ouzoud, where 110 metres of water plunge into a red-rock pool circled by olive groves.',
      'You hike down a shaded path past Berber women weaving rugs and pressing argan oil. Wild Barbary macaques watch from the trees — and occasionally try to steal your camera strap.',
      'Lunch is on a cliffside terrace overlooking the falls. Tagine, mint tea, the soundtrack of falling water. A small wooden boat ride to the base of the falls if you wish, then a slow climb back through almond blossoms in spring.',
    ],
    price: 600, priceDisplay: '600 MAD', priceUnit: 'per person', currency: 'MAD',
    duration: '8 hours',
    heroImage: '1XaSBnl3KUM7trBEdCY_my0zukDNnHwUL',
    cardImage: '1XaSBnl3KUM7trBEdCY_my0zukDNnHwUL',
    galleryImages: [
      '1ZRL-L_o455qevM_ooTeo4z621mas4Ezy',
      '13S1qGbp5OKxn32K4QPBpGl_JrHBUcgVW',
      '1ZckGP53wKH-zz0vM8oldVmzHSgQxmfws',
      '1-hgknXwN3MT87HKkk9h_hVtQRK8y0khP',
      '1NUvjLPJft1kZ63KQUO3Wl-qfW9_5qk24',
      '1Cspoqt0QvCAyj46qvyfh1-Vddq6jlhmK',
      '1dWjOKdK5EwFnkXrbOsvexHFHjs_Qkk6u',
    ],
    bookingFeatures: [
      'Hotel pickup & drop-off in Marrakech',
      'Air-conditioned 4×4 transport',
      'English-speaking driver',
      'Lunch at a cliffside terrace',
      'Free cancellation up to 48h',
      'Instant confirmation by WhatsApp',
    ],
    itinerary: [
      { time: '08:00', title: 'Hotel Pickup', description: 'Air-conditioned 4×4 from your riad. Bottled water and Wi-Fi onboard.' },
      { time: '10:00', title: 'Berber Village Stop', description: 'Coffee in a charming market town — fresh pastries, mint tea.' },
      { time: '11:30', title: 'Arrival at Ouzoud', description: 'A guided walk down to the falls, past argan presses and macaque troops.' },
      { time: '13:00', title: 'Cliffside Lunch', description: 'Tagine and salads on a panoramic terrace overlooking the falls.' },
      { time: '14:30', title: 'Boat to the Base', description: 'Optional wooden boat ride into the rainbow mist at the foot of the cascade.' },
      { time: '16:00', title: 'Return Journey', description: 'Scenic drive back via the High Atlas foothills.' },
      { time: '19:00', title: 'Drop-off in Marrakech', description: 'Back at your hotel by sundown.' },
    ],
    active: true, order: 2,
  },
  {
    slug: 'tour',
    title: 'Private SUV Journeys',
    shortTitle: 'Private Tours',
    eyebrow: 'Private SUV · Fully Custom · 1–14 Days',
    subtitle: 'Your route, your pace, your Morocco. Sahara, Chefchaouen, Fes, Essaouira — anywhere your curiosity leads. Air-conditioned 4×4, English-speaking driver-guide.',
    cardDescription: 'Sahara, Chefchaouen, Fes, Essaouira — your route, your pace. Air-conditioned 4×4, English-speaking driver, complimentary water and Wi-Fi onboard.',
    cardTag: 'Private SUV · Custom',
    cardLocation: 'Anywhere in Morocco',
    storyTitle: 'A custom route, designed around what you actually want to see.',
    storyParagraphs: [
      "Tell us what you've dreamed of — the Sahara at sunset, the blue alleys of Chefchaouen, the medina of Fes, the wind-blown ramparts of Essaouira — and we'll build a journey around it.",
      'Your driver is a Marrakech native who speaks English (often French and Spanish too), knows where to stop for the best mint tea between cities, and has a friend or cousin in nearly every riad along the way.',
      "We don't shuffle you in and out of busloads. It's just you, the open road, an air-conditioned 4×4, and a guide who treats your trip as something personal — because it is.",
    ],
    price: 800, priceDisplay: '800 MAD', priceUnit: 'per day · from', currency: 'MAD',
    duration: '1–14 days',
    heroImage: '1yUQJV3mYvpTji1fvU54siH61PD6McMBd',
    cardImage: '1yUQJV3mYvpTji1fvU54siH61PD6McMBd',
    galleryImages: [
      '1wH8uwL3nXh2bj0mBnELNxjDSSmqbl5pQ',
      '1lxlTagtgUFiMpi5pcZNY4lai7UoygGl4',
      '1BghgzrKWW0ZFZ5Ej8faC5Agy3HI81Kdg',
      '1BTwuxnCfeqzabxm-ZMpJHsl6SWwpRrfC',
      '1ooRoY-zipA5PzKuzQmJcu2BXdmOj2tOH',
    ],
    bookingFeatures: [
      'Air-conditioned 4×4 SUV',
      'English-speaking driver-guide',
      'Hotel/riad pickup & drop-off',
      'Custom itinerary, your pace',
      'Bottled water & Wi-Fi onboard',
      'Free cancellation up to 7 days',
    ],
    itinerary: [
      { time: 'Day 1', title: 'Marrakech → Aït Ben Haddou', description: 'Cross the High Atlas via Tizi n\'Tichka. Lunch at Telouet kasbah. Sleep facing the UNESCO ksar.' },
      { time: 'Day 2', title: 'Dades & Sahara', description: 'Through the Dades Gorge and Valley of Roses. Sunset on Erg Chebbi dunes; dinner under stars.' },
      { time: 'Day 3', title: 'Fes via Cedar Forest', description: 'Cross the Middle Atlas through cedar groves. Arrive in Fes for an evening rooftop dinner.' },
      { time: 'Day 4', title: 'Fes Medina', description: 'A full day with a local guide through 9,000 lanes — tanneries, leather, ceramics, and a cooking class.' },
      { time: 'Day 5', title: 'Return to Marrakech', description: 'Optional Chefchaouen detour or scenic Volubilis route home.' },
    ],
    active: true, order: 3,
  },
];

const HERO_SLIDES = [
  '1s0b555ufQnW63naq736FRruLzIuJpTIY',
  '1V66u1sjJYct8mZAXVda4dReNc4O3kbdA',
  '1ZJBTYBcxWZvzKu0Zjy1CrX2hGD-uBaFQ',
  '1Li2YXG_-La94f8nY1HykeOmLAsECFrwc',
  '1JBscoO2xbhW6J2Tvhq0H26ltk7Bmvho5',
  '1tC4QwTm22PY1eaeiDYafdhwy2MlgS5fv',
  '1Dkf4PlGZMzOCoBHUUSP6iHtVHB2SVFiH',
  '1ZsOzVdwnR0A_ZLSeeVcdQE9zlQy3D5ux',
];

const PREVIEW_GALLERY = [
  '18rpXXfgwEd5T5OI_kyEfbCRk0jl13vhM',
  '1hc9qSZH4DTtXgNHo00OsO1sqegflX3GZ',
  '1xSNCdlYDDYvmoZLDZX_K8wXhughKlt7F',
  '1KPMKQCtcUsQ2AS1QC6dOy3Fkb3GJ56wC',
  '1PICxQttdPRIh526Z7Hng5Q-b3uy29dJb',
  '16yn5Cl8M7kE5VDQklavkCPnco3YtnjwI',
  '19MCopZBnKXkOHS1-qmbysfRbjWUo2MuQ',
];

const GALLERY = {
  desert: [
    '18rpXXfgwEd5T5OI_kyEfbCRk0jl13vhM',
    '1KPMKQCtcUsQ2AS1QC6dOy3Fkb3GJ56wC',
    '19MCopZBnKXkOHS1-qmbysfRbjWUo2MuQ',
    '1zqdMYOlzCNYASNYos605A0spgXgqOou6',
    '1A6bCqk7bmTd5u_Ir0Eos-KWp4tma7jho',
    '1T7p5SY9dO1f_VysJDJQKUDZxY61a4n7n',
    '1tgTEex0cesKzvPTjfAQdO1zf475sk5lh',
  ],
  riad: [
    '1hc9qSZH4DTtXgNHo00OsO1sqegflX3GZ',
    '1PICxQttdPRIh526Z7Hng5Q-b3uy29dJb',
    '1U3m7LtbCtS3r3AkPMswC4lX5c8RmYcRf',
    '1pxPWqLmZQbzgCWUt-4HmGjakC4skd3eD',
    '1f7uQQEG-T7dkjpZ9CqjCefI4g3vaHz1F',
    '15Dv4qErVFuFr2XyTaKbBuiqtDF1sSi3M',
    '19-DahHUCXuJ-piW94UzIdKfhQrTAJoj4',
    '1UQ8DH2MwSbJafH6j00iEyElMLGVRk0la',
  ],
  culture: [
    '1xSNCdlYDDYvmoZLDZX_K8wXhughKlt7F',
    '16yn5Cl8M7kE5VDQklavkCPnco3YtnjwI',
    '1UIHp7BQ7raUDBWfZYPeeZMR0xCjDCHIB',
    '1DqlMRt0Xgc2eDy_tPU6rKyuXJGNSjjF_',
    '13Q54s2VUyX9pb43IcHOOvTwKht5UTKH_',
    '1fBnwOsXO2LX4L9f4E5r98GLDDQ80Ckdo',
    '10j2v710fWcCTQWlEMn7ZtxJAe7T4W3sl',
    '16rrPV50iHe3FjUW3UeZmlHAqYLa_WX2v',
    '1vBRZLvSOvzKm6sAm2h8LtvdE1H4Q65qx',
    '1XUbg-CDV97rLEKrigydn_6vuEXC7nDX6',
  ],
};

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('✓ Connected to MongoDB');

  // Admin
  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await Admin.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase() },
    { email: ADMIN_EMAIL.toLowerCase(), password: hashed, name: 'Admin' },
    { upsert: true, new: true }
  );
  console.log(`✓ Admin: ${ADMIN_EMAIL}`);

  // Tours
  for (const tour of TOURS) {
    await Tour.findOneAndUpdate({ slug: tour.slug }, tour, { upsert: true, new: true });
    console.log(`✓ Tour: ${tour.slug} — ${tour.title}`);
  }

  // Site settings
  await SiteSettings.findOneAndUpdate(
    { singleton: 'main' },
    { singleton: 'main' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log('✓ Site settings');

  // Gallery — only seed if empty (don't overwrite admin's uploads)
  const existing = await GalleryImage.countDocuments();
  if (existing === 0) {
    const docs = [];
    for (const id of HERO_SLIDES) docs.push({ url: id, category: 'hero', order: docs.length });
    HERO_SLIDES.forEach((id, i) => {});
    let order = 0;
    for (const id of PREVIEW_GALLERY) docs.push({ url: id, category: 'preview', order: order++ });
    for (const cat of ['desert', 'riad', 'culture']) {
      let o = 0;
      for (const id of GALLERY[cat]) docs.push({ url: id, category: cat, order: o++ });
    }
    await GalleryImage.insertMany(docs);
    console.log(`✓ Gallery: ${docs.length} images seeded`);
  } else {
    console.log(`• Gallery: ${existing} images already present, skipping`);
  }

  console.log('\n✅ Seed complete.\n');
  console.log(`Login at /admin/login with: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}\n`);
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
