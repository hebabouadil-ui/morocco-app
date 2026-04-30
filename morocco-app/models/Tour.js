import mongoose from 'mongoose';

const ItineraryStepSchema = new mongoose.Schema({
  time: String,
  title: String,
  description: String,
}, { _id: false });

const TourSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  shortTitle: String,
  eyebrow: String,
  subtitle: String,
  cardDescription: String,
  cardTag: String,
  cardLocation: String,
  storyTitle: String,
  storyParagraphs: [String],
  price: { type: Number, required: true },
  priceDisplay: String,
  priceUnit: { type: String, default: 'per person' },
  currency: { type: String, default: 'MAD' },
  duration: String,
  heroImage: String,
  cardImage: String,
  galleryImages: [String],
  bookingFeatures: [String],
  itinerary: [ItineraryStepSchema],
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

TourSchema.virtual('formattedPrice').get(function() {
  return this.priceDisplay || `${this.price.toLocaleString()} ${this.currency}`;
});

export default mongoose.models.Tour || mongoose.model('Tour', TourSchema);
