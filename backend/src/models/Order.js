import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    method: { type: String, enum: ['mpesa'], default: 'mpesa' },
    transactionId: String,
    reference: String,
    promotion: String,
    amount: Number,
    status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    split: {
      sellerShare: Number,
      platformShare: Number,
      pendingRelease: Number
    }
  },
  { _id: false }
);

const shipmentSchema = new mongoose.Schema(
  {
    address: String,
    region: String,
    city: String,
    etaDays: Number,
    status: { type: String, enum: ['awaiting_dispatch', 'in_transit', 'delivered', 'returned'], default: 'awaiting_dispatch' },
    trackingCode: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        unitPrice: Number
      }
    ],
    total: Number,
    currency: { type: String, default: 'MZN' },
    payment: paymentSchema,
    shipment: shipmentSchema,
    escrow: {
      holdId: String,
      status: { type: String, enum: ['pending', 'held', 'released'], default: 'held' }
    },
    dispute: {
      opened: { type: Boolean, default: false },
      reason: String,
      status: { type: String, enum: ['none', 'open', 'under_review', 'resolved', 'refunded'], default: 'none' },
      resolution: String
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
