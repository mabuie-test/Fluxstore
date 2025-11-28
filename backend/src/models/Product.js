import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    brand: String,
    price: { type: Number, required: true },
    currency: { type: String, default: 'MZN' },
    images: [String],
    stock: { type: Number, default: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categories: [String],
    badges: [String],
    tags: [String],
    rating: { type: Number, default: 0 },
    analytics: {
      views: { type: Number, default: 0 },
      purchases: { type: Number, default: 0 },
      wishlistAdds: { type: Number, default: 0 }
    },
    minPurchaseQuantity: { type: Number, default: 1 },
    maxPurchaseQuantity: { type: Number, default: 10 },
    dimensions: {
      weightKg: Number,
      heightCm: Number,
      widthCm: Number,
      lengthCm: Number
    },
    shippingTemplates: [
      {
        region: String,
        etaDays: Number,
        cost: Number
      }
    ],
    variants: [
      {
        sku: String,
        attributes: Map,
        price: Number,
        stock: Number
      }
    ],
    seo: {
      slug: String,
      keywords: [String]
    }
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
