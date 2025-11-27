import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: String,
    comment: String,
    status: { type: String, enum: ['pending', 'published', 'rejected'], default: 'pending' },
    isVerifiedPurchase: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Review = mongoose.model('Review', reviewSchema);
