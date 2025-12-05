import { Order } from '../models/Order.js';
import { paymentService } from '../services/paymentService.js';
import { notificationService } from '../services/notificationService.js';
import { auditService } from '../services/auditService.js';

export const releasePayout = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.dispute.status !== 'none' && order.dispute.status !== 'resolved') {
    return res.status(400).json({ message: 'Pending dispute prevents payout' });
  }

  const result = await paymentService.releaseToSeller(order);
  order.payment.split.pendingRelease = 0;
  await order.save();
  await notificationService.notify({
    userId: order.seller,
    type: 'payout',
    title: 'Payout liberado',
    message: `Seu saque Mpesa do pedido #${order.id} foi liberado.`,
    actionUrl: `/seller/payouts`,
    meta: { orderId: order.id, amount: order.payment.split.vendorShare }
  });
  await auditService.log({
    actor: req.user.id,
    role: req.user.role,
    action: 'payout_released',
    targetType: 'order',
    targetId: order.id,
    description: 'Release automático após disputa resolvida ou entrega confirmada',
    metadata: { amount: order.payment.split.vendorShare }
  });
  res.json({ message: 'Payout queued', result });
};
