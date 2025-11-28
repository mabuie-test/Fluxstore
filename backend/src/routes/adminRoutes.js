import express from 'express';
import { adminDashboard, getSettings, getUserMenu, patchSettings, updateUserStatus } from '../controllers/adminController.js';
import { assertAuthenticated, requireRole } from '../utils/authMiddleware.js';

const router = express.Router();

router.get('/menu', assertAuthenticated, getUserMenu);
router.get('/dashboard', requireRole('admin'), adminDashboard);
router.get('/settings', requireRole('admin'), getSettings);
router.patch('/settings', requireRole('admin'), patchSettings);
router.patch('/users/:id/status', requireRole('admin'), updateUserStatus);

export default router;
