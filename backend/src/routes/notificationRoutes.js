import express from 'express';
import {
  broadcastNotification,
  listNotifications,
  markNotificationRead
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', ...listNotifications);
router.patch('/:id/read', ...markNotificationRead);
router.post('/broadcast', ...broadcastNotification);

export default router;
