import { Order } from '../models/Order.js';
import { paymentService } from '../services/paymentService.js';

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
  res.json({ message: 'Payout queued', result });
};
