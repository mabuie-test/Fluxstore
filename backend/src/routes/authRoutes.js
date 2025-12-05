import express from 'express';
import {
  login,
  register,
  socialLogin,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  updatePreferences
} from '../controllers/authController.js';
import { assertAuthenticated } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/social', socialLogin);
router.post('/password/request', requestPasswordReset);
router.post('/password/reset', resetPassword);
router.get('/verify', verifyEmail);
router.patch('/preferences', assertAuthenticated, updatePreferences);

export default router;
