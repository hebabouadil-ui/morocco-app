# Morocco Skys & Secrets

A full-stack tourism booking platform for a Marrakech-based tour operator.

**Stack:** Next.js 14 (App Router) · MongoDB + Mongoose · JWT auth · Tailwind CSS · Cloudinary (optional) · Framer Motion

---

## Features

### Customer-facing site
- Editorial luxury homepage with auto-rotating hero slider
- Three tour pages (Balloon, Waterfall, Private SUV) with itineraries, image galleries, and live pricing
- **Working booking form** on each tour page — name, email, phone, date, guests, auto-calculated total
- Categorized photo gallery (Desert / Riad / Culture & Souk) with lightbox
- WhatsApp deep links pre-filled with booking details after submission
- Fully responsive

### Admin dashboard (`/admin`)
- Secure JWT login (bcrypt-hashed passwords, httpOnly cookies)
- **Bookings manager** — list, filter by status, update status (pending → confirmed/cancelled/completed), search, delete
- **Tour CMS** — edit price, title, descriptions, itinerary, hero & gallery images, enable/disable
- **Gallery manager** — upload, organize by category (hero / preview / desert / riad / culture), drag-and-drop, delete
- **Site settings** — phone, WhatsApp number, brand text, hero copy, story, CTA, hours
- Image uploads via Cloudinary (production) or local `/public/uploads/` (dev fallback)

---

## Quick Start

### 1. Prerequisites
- Node.js 18.17+ (`node -v`)
- MongoDB — either:
  - **Local:** install MongoDB Community Edition + run `mongod`
  - **Cloud (recommended):** free MongoDB Atlas cluster — https://www.mongodb.com/cloud/atlas/register

### 2. Install
```bash
cd morocco-app
npm install
```

### 3. Configure environment
```bash
cp .env.local.example .env.local
```
Open `.env.local` and set:

```bash
# REQUIRED
MONGODB_URI=mongodb://localhost:27017/morocco-skys
JWT_SECRET=run-this-and-paste-output:-node-e-console-log-require-crypto-randomBytes-64-toString-hex

# Default admin (only used by seed script)
ADMIN_EMAIL=admin@moroccoskys.com
ADMIN_PASSWORD=changeMeNow

# OPTIONAL — Cloudinary (else uploads go to /public/uploads/)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

To generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Seed the database
This creates the default admin user, all three tours, and gallery images:
```bash
npm run seed
```

### 5. Run the dev server
```bash
npm run dev
```
Visit:
- **Public site:** http://localhost:3000
- **Admin login:** http://localhost:3000/admin/login

Sign in with the email/password from `.env.local`.

---

## Project Structure

```
morocco-app/
├── app/
│   ├── page.js                    # Home
│   ├── balloon/                   # Tour pages — share TourDetail component
│   ├── waterfall/
│   ├── tour/
│   ├── gallery/                   # Gallery with category tabs + lightbox
│   ├── booking-success/           # Post-booking confirmation
│   ├── admin/
│   │   ├── login/
│   │   └── (protected)/           # All routes here require admin auth
│   │       ├── page.js            # Dashboard overview
│   │       ├── bookings/
│   │       ├── tours/[slug]/      # Tour editor
│   │       ├── gallery/
│   │       └── settings/
│   ├── api/
│   │   ├── auth/{login,logout,me}/
│   │   ├── bookings/[id]/
│   │   ├── tours/[slug]/
│   │   ├── upload/                # Cloudinary or local uploads
│   │   ├── gallery/
│   │   └── settings/
│   └── globals.css
├── components/
│   ├── Navbar, Footer, HeroSlider, SmartImage
│   ├── BookingForm, TourDetail
│   ├── AdminShell, ImageUploader
│   └── Toast, GalleryClient
├── lib/
│   ├── mongodb.js                 # Connection cache
│   ├── auth.js                    # JWT helpers + requireAdmin guard
│   ├── upload.js                  # Cloudinary / local fallback
│   ├── imageUrl.js                # Drive-ID + URL resolver
│   └── data.js                    # Server-side data fetchers
├── models/
│   ├── Tour.js, Booking.js
│   ├── Admin.js, GalleryImage.js
│   └── SiteSettings.js
├── scripts/
│   └── seed.js                    # `npm run seed`
└── public/uploads/                # Local image fallback (gitignored)
```

---

## How the booking flow works

1. Customer fills the form on `/balloon` (or `/waterfall`, `/tour`)
2. Frontend POSTs to `/api/bookings` with name, email, phone, date, guests, notes
3. Server validates input, looks up the tour by slug, calculates `totalPrice = tour.price × guests`
4. Booking is saved with a generated reference (e.g. `MSS-A8K3F-X9P2`) and `status: 'pending'`
5. Customer is redirected to `/booking-success?ref=...&wa=...`
6. Success page shows the reference and a **"Confirm via WhatsApp"** button with a pre-filled message containing all booking details
7. Admin sees the booking immediately in `/admin/bookings`, can update status to `confirmed`

---

## How the CMS works

All site content lives in MongoDB:
- **`tours` collection** — title, price, descriptions, itinerary steps, image arrays
- **`galleryimages` collection** — categorized images with order
- **`sitesettings` collection** — single document with brand, contact, hero text, etc.

Admin pages POST/PATCH to authenticated API routes. Public pages fetch on each request (`force-dynamic`) so changes appear instantly.

### Editing a tour's price
1. Login → `/admin/tours` → click "Edit" on any tour
2. Update the **Price (number)** field — this drives the booking form's auto-total
3. Update **Display price** if you want a custom format (e.g. "$120" or "1,200 MAD")
4. Click "Save Changes" — the new price is live for new bookings instantly

### Uploading images
1. `/admin/gallery` → pick a category (Hero, Preview, Desert, Riad, Culture)
2. Click "Upload Images" or drag files into the drop zone
3. Multiple files at once supported
4. Without Cloudinary configured, files save to `/public/uploads/` — fine for local dev
5. With Cloudinary configured, files go to your cloud — recommended for production

---

## Image hosting

The app accepts three image formats anywhere a URL is needed:
1. **Full URL** — `https://...` (Cloudinary, Imgur, your CDN)
2. **Local path** — `/uploads/abc123.jpg` (saved by the upload endpoint)
3. **Google Drive ID** — bare ID like `1abc...` (auto-resolved to thumbnail URL)

This means seed data using Drive IDs works out of the box, and admins can replace any image with a Cloudinary upload later.

---

## Deployment notes

### Vercel (easiest)
1. Push to GitHub
2. Import the repo at https://vercel.com/new
3. Add environment variables from `.env.local` in Project Settings → Environment Variables
4. Deploy

**⚠️ Local uploads will NOT persist on Vercel** (filesystem is read-only at runtime). For production, **set the Cloudinary env vars** before deploying — uploads will then go to Cloudinary. Configure Cloudinary at https://cloudinary.com/users/register/free.

### Self-hosted (DigitalOcean, Railway, etc.)
- Standard `npm run build && npm start` flow
- Local uploads work if the host has persistent disk
- Use a process manager like PM2 or systemd

### MongoDB Atlas (free)
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Add your IP to the access list (or `0.0.0.0/0` for any IP — fine for dev)
- Get the connection string and paste into `MONGODB_URI`

---

## Adding more tours

Currently the routes `/balloon`, `/waterfall`, `/tour` are hard-coded files (each renders `<TourDetail slug="..." />`). To add a fourth tour:

**Option A — Quick:** Add a new file `app/yourslug/page.js`:
```js
import TourDetail from '@/components/TourDetail';
export const dynamic = 'force-dynamic';
export default function Page() { return <TourDetail slug="yourslug" />; }
```
Then add a tour with that slug in the database (via the seed script or directly in MongoDB).

**Option B — Dynamic:** Replace the three static folders with a single `app/[slug]/page.js` that calls `<TourDetail slug={params.slug} />`. Then any tour added via the admin works automatically. (Requires a small refactor of the activities link in `app/page.js`.)

---

## Security checklist before launch

- [ ] Replace `JWT_SECRET` with a real random 64-byte string
- [ ] Change the default admin password (re-run seed with new env vars, or update directly in MongoDB)
- [ ] Set `MONGODB_URI` to an Atlas cluster with restricted IP allowlist
- [ ] Set Cloudinary env vars (don't rely on local uploads in production)
- [ ] Restrict CORS if you add an external client (currently same-origin only)
- [ ] Add rate limiting on `/api/bookings` if you get spam (e.g. with Upstash + middleware)
- [ ] Optional: add email confirmations via Resend or SendGrid in `app/api/bookings/route.js` after `Booking.create`

---

## API reference (quick)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | — | Sign in admin |
| POST | `/api/auth/logout` | — | Clear cookie |
| GET | `/api/auth/me` | admin | Check session |
| POST | `/api/bookings` | — | Customer creates booking |
| GET | `/api/bookings` | admin | List all bookings |
| PATCH | `/api/bookings/:id` | admin | Update status/notes |
| DELETE | `/api/bookings/:id` | admin | Delete booking |
| GET | `/api/tours` | — | List active tours |
| GET | `/api/tours?all=1` | admin | Include disabled |
| GET | `/api/tours/:slug` | — | Get one tour |
| PATCH | `/api/tours/:slug` | admin | Update tour |
| GET | `/api/gallery` | — | List gallery, grouped by category |
| POST | `/api/gallery` | admin | Add image to category |
| DELETE | `/api/gallery` | admin | Delete image (also from storage) |
| POST | `/api/upload` | admin | Upload file (multipart) |
| DELETE | `/api/upload` | admin | Delete file |
| GET | `/api/settings` | — | Get site settings |
| PATCH | `/api/settings` | admin | Update site settings |

---

## License

Private project — Morocco Skys & Secrets, Marrakech.
