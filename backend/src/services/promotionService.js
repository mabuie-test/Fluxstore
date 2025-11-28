import { Promotion } from '../models/Promotion.js';

const isActive = (promo) => {
  const now = new Date();
  if (!promo.active) return false;
  if (promo.startsAt && promo.startsAt > now) return false;
  if (promo.endsAt && promo.endsAt < now) return false;
  return true;
};

export const promotionService = {
  async createPromo(payload) {
    return Promotion.create(payload);
  },

  async listPromos() {
    return Promotion.find().sort({ createdAt: -1 });
  },

  applyPromoCode({ code, amount }) {
    if (!code) return { discount: 0, code: null };
    const normalized = code.toUpperCase();
    // synchronous use for quote building; async validation lives in controllers
    const discount = 0;
    return { discount, code: normalized };
  },

  async validateAndCompute({ code, amount }) {
    if (!code) return { discount: 0, code: null };
    const promo = await Promotion.findOne({ code: code.toUpperCase() });
    if (!promo || !isActive(promo) || amount < promo.minimumOrderValue) return { discount: 0, code: null };
    const rawDiscount = (amount * (promo.percentage || 0)) / 100;
    const discount = Math.min(rawDiscount, promo.maxDiscount || rawDiscount);
    return { discount, code: promo.code };
  }
};
