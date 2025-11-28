import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { mailer } from './mailer.js';

export const notificationService = {
  async notify({ userId, type = 'system', title, message, actionUrl, meta, sendEmail = false }) {
    const notification = await Notification.create({ user: userId, type, title, message, actionUrl, meta });

    if (sendEmail) {
      const user = await User.findById(userId);
      if (user?.email) {
        await mailer.sendNotification({
          to: user.email,
          subject: title,
          body: `${message}\n${actionUrl || ''}`
        });
      }
    }

    return notification;
  },

  async broadcastRole(role, payload) {
    const users = await User.find({ role }, '_id email');
    const notifications = await Promise.all(
      users.map((u) =>
        notificationService.notify({
          userId: u._id,
          ...payload,
          sendEmail: payload.sendEmail
        })
      )
    );
    return notifications.length;
  },

  async markAsRead(id, userId) {
    return Notification.findOneAndUpdate({ _id: id, user: userId }, { readAt: new Date() }, { new: true });
  }
};
