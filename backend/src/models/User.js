import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    status: { type: String, enum: ['active', 'suspended', 'blocked'], default: 'active' },
    verified: { type: Boolean, default: false },
    preferredCurrency: { type: String, default: 'MZN' },
    loyaltyPoints: { type: Number, default: 0 },
    accountTags: [String],
    addresses: [
      {
        label: String,
        address: String,
        city: String,
        region: String,
        phone: String,
        isDefault: Boolean
      }
    ],
    sellerProfile: {
      storeName: String,
      payoutMpesaNumber: String,
      rating: { type: Number, default: 0 },
      totalSales: { type: Number, default: 0 },
      catalogueSize: { type: Number, default: 0 },
      verificationStage: { type: String, enum: ['draft', 'pending', 'approved'], default: 'draft' }
    },
    googleId: String,
    facebookId: String,
    resetToken: String,
    resetExpires: Date,
    adminNotes: String
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);
