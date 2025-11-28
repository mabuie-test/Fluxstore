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

const accentSchema = new mongoose.Schema(
  {
    name: String,
    primary: String,
    accent: String,
    gradient: String,
    pattern: String,
    preview: String
  },
  { _id: false }
);

const styleGuideSchema = new mongoose.Schema(
  {
    typography: {
      headingFont: { type: String, default: 'Inter' },
      bodyFont: { type: String, default: 'Inter' },
      heroScale: { type: String, default: 'clamp(28px, 4vw, 52px)' },
      bodyScale: { type: String, default: '16px' }
    },
    shapes: {
      radius: { type: String, default: '14px' },
      buttons: { type: String, default: '999px' },
      cards: { type: String, default: '18px' }
    },
    shadows: {
      card: { type: String, default: '0 18px 38px rgba(0,0,0,0.08)' },
      popover: { type: String, default: '0 32px 60px rgba(0,0,0,0.18)' }
    },
    imagery: {
      heroBackdrop: { type: String, default: 'radial-gradient(circle at 20% 20%, #e0f2fe, #fff)' },
      badges: {
        palette: { type: [String], default: ['#bef264', '#fef08a', '#fca5a5', '#a5b4fc'] },
        shape: { type: String, default: 'pill' }
      }
    },
    layout: {
      grid: { type: String, default: '12-col' },
      spacing: { type: String, default: '1.25rem' },
      heroVariant: { type: String, default: 'split-visual' }
    }
  },
  { _id: false }
);

const layoutPresetSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    heroVariant: String,
    sections: [mongoose.Schema.Types.Mixed]
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
      },
      accentPresets: [accentSchema]
    },
    styleGuide: styleGuideSchema,
    layoutPresets: [layoutPresetSchema],
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
      },
      microcopy: {
        emptyStates: mongoose.Schema.Types.Mixed,
        upsells: [String]
      },
      lookbooks: [
        {
          title: String,
          slug: String,
          palette: accentSchema,
          hero: mongoose.Schema.Types.Mixed,
          sections: [mongoose.Schema.Types.Mixed]
        }
      ]
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
