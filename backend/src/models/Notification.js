import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    type: {
      type: String,
      enum: ['order', 'dispute', 'payout', 'report', 'marketing', 'system'],
      default: 'system'
    },
    title: String,
    message: String,
    actionUrl: String,
    meta: mongoose.Schema.Types.Mixed,
    readAt: Date
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
