import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Admin' },
}, { timestamps: true });

AdminSchema.methods.comparePassword = function(plain) {
  return bcrypt.compare(plain, this.password);
};

AdminSchema.statics.hashPassword = function(plain) {
  return bcrypt.hash(plain, 10);
};

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
