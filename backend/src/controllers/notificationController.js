import { Notification } from '../models/Notification.js';
import { notificationService } from '../services/notificationService.js';
import { assertAuthenticated, requireRole } from '../utils/authMiddleware.js';

export const listNotifications = [assertAuthenticated, async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(notifications);
}];

export const markNotificationRead = [assertAuthenticated, async (req, res) => {
  const updated = await notificationService.markAsRead(req.params.id, req.user.id);
  if (!updated) return res.status(404).json({ message: 'Notification not found' });
  res.json(updated);
}];

export const broadcastNotification = [requireRole('admin'), async (req, res) => {
  const { role = 'buyer', title, message, actionUrl, type = 'marketing', sendEmail } = req.body;
  const count = await notificationService.broadcastRole(role, {
    title,
    message,
    actionUrl,
    type,
    sendEmail,
    meta: { scope: 'broadcast', audience: role }
  });
  res.json({ delivered: count });
}];
