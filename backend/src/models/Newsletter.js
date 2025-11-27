import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, index: true },
    name: String,
    preferences: {
      categories: [String],
      frequency: { type: String, enum: ['weekly', 'biweekly', 'monthly'], default: 'weekly' }
    },
    consent: { type: Boolean, default: true },
    lastSentAt: Date,
    locale: { type: String, default: 'pt' }
  },
  { timestamps: true }
);

export const Newsletter = mongoose.model('Newsletter', newsletterSchema);
