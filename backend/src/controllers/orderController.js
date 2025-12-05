import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { paymentService } from '../services/paymentService.js';
import { shippingService } from '../services/shippingService.js';
import { pricingService } from '../services/pricingService.js';
import { promotionService } from '../services/promotionService.js';
import { User } from '../models/User.js';
import { Cart } from '../models/Cart.js';
import { notificationService } from '../services/notificationService.js';
import { auditService } from '../services/auditService.js';

export const createOrder = async (req, res) => {
  const { items, address, region, city, promoCode, redeemLoyalty, cartId } = req.body;
  const products = await Product.find({ _id: { $in: items.map((i) => i.product) } }).populate('seller');
  if (!products.length) return res.status(400).json({ message: 'No products found' });

  const seller = products[0].seller; // simple single-seller cart
  const baseQuote = pricingService.buildQuote({ products, items, region, promoCode, loyaltyPoints: redeemLoyalty });
  const validatedPromo = await promotionService.validateAndCompute({ code: promoCode, amount: baseQuote.subtotal });
  const quote = pricingService.buildQuote({
    products,
    items,
    region,
    promoCode,
    loyaltyPoints: redeemLoyalty,
    promotionDiscount: validatedPromo.discount
  });
  const etaDays = shippingService.resolveTemplateEta(products, region);
  const shipment = { address, region, city, etaDays };

  const split = paymentService.calculateSplit(quote.total);
  const { transactionId, reference } = await paymentService.chargeBuyer({ amount: quote.total, buyerId: req.user.id });
  const order = await Order.create({
    buyer: req.user.id,
    seller: seller.id,
    items: quote.lines.map((line) => ({ product: line.product, quantity: line.quantity, unitPrice: line.unitPrice })),
    total: quote.total,
    currency: products[0].currency,
    payment: { amount: quote.total, split, transactionId, status: 'paid', reference, promotion: validatedPromo.code },
    shipment
  });

  const escrow = await paymentService.holdEscrow(order);
  order.escrow = { holdId: escrow.holdId, status: 'held' };
  await order.save();

  await Promise.all(
    quote.lines.map((line) =>
      Product.updateOne({ _id: line.product }, { $inc: { stock: -line.quantity, 'analytics.purchases': 1 } })
    )
  );

  if (cartId) await Cart.deleteOne({ _id: cartId, user: req.user.id });
  if (redeemLoyalty) await User.updateOne({ _id: req.user.id }, { $inc: { loyaltyPoints: -redeemLoyalty } });
  const loyaltyEarned = Math.round(quote.total * 0.02);
  await User.updateOne({ _id: req.user.id }, { $inc: { loyaltyPoints: loyaltyEarned } });

  await notificationService.notify({
    userId: req.user.id,
    type: 'order',
    title: 'Pedido confirmado',
    message: `Pedido ${order.id} recebido com entrega estimada em ${etaDays} dias.`,
    actionUrl: `/orders/${order.id}`,
    meta: { orderId: order.id, etaDays }
  });

  if (seller) {
    await notificationService.notify({
      userId: seller.id,
      type: 'order',
      title: 'Novo pedido',
      message: `Você recebeu um novo pedido #${order.id} para preparar e enviar.`,
      actionUrl: `/seller/orders/${order.id}`,
      meta: { orderId: order.id, total: quote.total }
    });
  }

  await auditService.log({
    actor: req.user.id,
    role: req.user.role,
    action: 'order_created',
    targetType: 'order',
    targetId: order.id,
    description: 'Pedido criado com Mpesa escrow e split dinâmico',
    metadata: { total: quote.total, promo: validatedPromo.code, loyaltyEarned }
  });

  res.status(201).json({ order, quote, promo: validatedPromo, loyaltyEarned });
};

export const updateShipment = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByIdAndUpdate(id, { shipment: req.body }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

export const listOrders = async (req, res) => {
  const orders = await Order.find({ buyer: req.user.id }).populate('items.product');
  res.json(orders);
};
