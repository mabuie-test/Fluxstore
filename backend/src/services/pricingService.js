import { promotionService } from './promotionService.js';
import { shippingService } from './shippingService.js';

export const pricingService = {
  buildQuote({ products, items, region, promoCode, loyaltyPoints, promotionDiscount = 0 }) {
    const lines = items.map((item) => {
      const product = products.find((p) => String(p.id) === String(item.product));
      const quantity = Math.max(item.quantity, product?.minPurchaseQuantity || 1);
      const cappedQty = Math.min(quantity, product?.maxPurchaseQuantity || quantity);
      const unitPrice = product?.price || 0;
      const lineTotal = cappedQty * unitPrice;
      return {
        product: item.product,
        quantity: cappedQty,
        unitPrice,
        lineTotal
      };
    });

    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    const shipping = shippingService.estimateShippingCost(products, region);
    const promotion = promotionService.applyPromoCode({ code: promoCode, amount: subtotal });
    const combinedDiscount = promotionDiscount || promotion.discount;
    const loyaltyRedeemed = Math.min(loyaltyPoints || 0, subtotal * 0.05);
    const total = Math.max(subtotal + shipping - combinedDiscount - loyaltyRedeemed, 0);

    return {
      lines,
      subtotal,
      shipping,
      promotion,
      loyaltyRedeemed,
      total
    };
  }
};
