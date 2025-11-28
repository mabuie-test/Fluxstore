import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['product', 'order', 'user', 'payout'], required: true },
    targetId: { type: String, required: true },
    reason: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    context: String,
    attachments: [String],
    status: { type: String, enum: ['open', 'investigating', 'resolved', 'rejected'], default: 'open' },
    resolutionNote: String,
    adminTags: [String],
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const Report = mongoose.model('Report', reportSchema);
