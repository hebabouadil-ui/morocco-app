import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  reference: { type: String, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  tourSlug: { type: String, required: true },
  tourTitle: String,
  date: { type: Date, required: true },
  guests: { type: Number, required: true, min: 1, max: 30 },
  pricePerPerson: Number,
  totalPrice: Number,
  currency: { type: String, default: 'MAD' },
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  source: { type: String, default: 'website' },
}, { timestamps: true });

BookingSchema.pre('validate', function(next) {
  if (!this.reference) {
    const stamp = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.reference = `MSS-${stamp.slice(-5)}-${rand}`;
  }
  next();
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
