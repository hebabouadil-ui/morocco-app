import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Tour from '@/models/Tour';
import { requireAdmin } from '@/lib/auth';

// Customer creates booking (public)
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, tourSlug, date, guests, notes } = body;

    if (!name || !email || !phone || !tourSlug || !date || !guests) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
    }
    const guestsNum = parseInt(guests, 10);
    if (isNaN(guestsNum) || guestsNum < 1 || guestsNum > 30) {
      return NextResponse.json({ error: 'Guests must be between 1 and 30.' }, { status: 400 });
    }
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json({ error: 'Invalid date.' }, { status: 400 });
    }
    if (dateObj < new Date(new Date().setHours(0, 0, 0, 0))) {
      return NextResponse.json({ error: 'Date must be today or later.' }, { status: 400 });
    }

    await dbConnect();
    const tour = await Tour.findOne({ slug: tourSlug, active: true });
    if (!tour) {
      return NextResponse.json({ error: 'Tour not found or unavailable.' }, { status: 404 });
    }

    const totalPrice = tour.price * guestsNum;
    const booking = await Booking.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      tourSlug,
      tourTitle: tour.title,
      date: dateObj,
      guests: guestsNum,
      pricePerPerson: tour.price,
      totalPrice,
      currency: tour.currency,
      notes: notes ? notes.trim().slice(0, 500) : '',
    });

    return NextResponse.json({
      ok: true,
      booking: {
        id: booking._id.toString(),
        reference: booking.reference,
        name: booking.name,
        tourTitle: booking.tourTitle,
        date: booking.date,
        guests: booking.guests,
        totalPrice: booking.totalPrice,
        currency: booking.currency,
      },
    });
  } catch (err) {
    console.error('Booking error:', err);
    return NextResponse.json({ error: 'Could not create booking.' }, { status: 500 });
  }
}

// Admin lists all bookings
export async function GET() {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;

  await dbConnect();
  const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ bookings });
}
