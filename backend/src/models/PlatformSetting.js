import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    key: String,
    label: String,
    path: String,
    description: String,
    featureFlag: String,
    audience: { type: String, enum: ['buyer', 'seller', 'admin'] }
  },
  { _id: false }
);

const platformSettingSchema = new mongoose.Schema(
  {
    branding: {
      brandName: { type: String, default: 'Fluxstore' },
      logo: { type: String, default: '/assets/logo.png' },
      primaryColor: { type: String, default: '#1f6feb' },
      accentColor: { type: String, default: '#f97316' },
      themeMode: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
      heroCopy: {
        headline: { type: String, default: 'Mercado universal com Mpesa' },
        subheadline: {
          type: String,
          default: 'Entrega inteligente, fidelidade, disputas e monetização completa.'
        },
        cta: { type: String, default: 'Explorar agora' }
      }
    },
    menus: {
      buyer: [menuItemSchema],
      seller: [menuItemSchema],
      admin: [menuItemSchema]
    },
    featureToggles: {
      loyalty: { type: Boolean, default: true },
      referrals: { type: Boolean, default: false },
      mpesaEscrow: { type: Boolean, default: true },
      scheduledPayouts: { type: Boolean, default: true },
      storefrontEditor: { type: Boolean, default: true }
    },
    personalization: {
      announcementBar: String,
      supportChannels: [String],
      homeSections: [mongoose.Schema.Types.Mixed],
      trustPerks: [String],
      seo: {
        title: String,
        description: String,
        keywords: [String]
      }
    },
    commerce: {
      marketplaceFee: { type: Number, default: 0.12 },
      disputeBufferDays: { type: Number, default: 7 },
      sellerCommissionHold: { type: Number, default: 0.15 },
      withdrawalMinimum: { type: Number, default: 500 }
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const PlatformSetting = mongoose.model('PlatformSetting', platformSettingSchema);
