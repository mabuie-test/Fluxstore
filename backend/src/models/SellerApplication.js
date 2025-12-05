import mongoose from 'mongoose';

const sellerApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    storeName: { type: String, required: true },
    category: String,
    description: String,
    mpesaNumber: { type: String, required: true },
    website: String,
    documents: {
      businessLicense: String,
      taxNumber: String,
      proofOfAddress: String
    },
    status: { type: String, enum: ['pending', 'under_review', 'approved', 'rejected'], default: 'pending' },
    feeDue: { type: Number, default: 50 },
    feeCurrency: { type: String, default: 'MZN' },
    feeStatus: { type: String, enum: ['pending', 'paid', 'waived'], default: 'pending' },
    paymentReference: String,
    notes: String,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    history: [
      {
        status: String,
        note: String,
        at: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export const SellerApplication = mongoose.model('SellerApplication', sellerApplicationSchema);
