import { Order } from '../models/Order.js';
import { paymentService } from '../services/paymentService.js';

export const openDispute = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id, buyer: req.user.id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.dispute = { opened: true, status: 'open', reason: req.body.reason };
  await order.save();
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
  res.json(order);
};
