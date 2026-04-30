import mongoose from 'mongoose';

const GalleryImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: String,
  category: {
    type: String,
    enum: ['desert', 'riad', 'culture', 'hero', 'preview'],
    required: true,
  },
  caption: String,
  order: { type: Number, default: 0 },
}, { timestamps: true });

GalleryImageSchema.index({ category: 1, order: 1 });

export default mongoose.models.GalleryImage || mongoose.model('GalleryImage', GalleryImageSchema);
