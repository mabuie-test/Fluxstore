import { Order } from '../models/Order.js';
import { paymentService } from '../services/paymentService.js';
import { notificationService } from '../services/notificationService.js';
import { auditService } from '../services/auditService.js';

export const openDispute = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id, buyer: req.user.id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.dispute = { opened: true, status: 'open', reason: req.body.reason };
  await order.save();
  await notificationService.notify({
    userId: order.seller,
    type: 'dispute',
    title: 'Nova disputa',
    message: `O pedido #${order.id} entrou em disputa. Revise imediatamente.`,
    actionUrl: `/seller/disputes/${order.id}`,
    meta: { orderId: order.id, reason: req.body.reason }
  });
  await auditService.log({
    actor: req.user.id,
    role: req.user.role,
    action: 'dispute_opened',
    targetType: 'order',
    targetId: order.id,
    description: 'Cliente abriu disputa',
    metadata: { reason: req.body.reason }
  });
  res.json(order);
};

export const resolveDispute = async (req, res) => {
  const { id } = req.params;
  const { resolution, refund } = req.body;
  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.dispute.status = 'resolved';
  order.dispute.resolution = resolution;
  if (refund) {
    await paymentService.refundBuyer(order);
    order.payment.status = 'refunded';
  }
  await order.save();
  await notificationService.notify({
    userId: order.buyer,
    type: 'dispute',
    title: 'Disputa resolvida',
    message: `A disputa do pedido #${order.id} foi resolvida (${resolution}).`,
    actionUrl: `/orders/${order.id}`,
    meta: { resolution }
  });
  await auditService.log({
    actor: req.user.id,
    role: req.user.role,
    action: 'dispute_resolved',
    targetType: 'order',
    targetId: order.id,
    description: 'Disputa resolvida com possível reembolso',
    metadata: { refund }
  });
  res.json(order);
};
