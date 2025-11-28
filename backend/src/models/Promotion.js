import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, uppercase: true },
    description: String,
    percentage: { type: Number, min: 0, max: 100 },
    maxDiscount: Number,
    startsAt: Date,
    endsAt: Date,
    active: { type: Boolean, default: true },
    minimumOrderValue: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Promotion = mongoose.model('Promotion', promotionSchema);
