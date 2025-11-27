import express from 'express';
import {
  login,
  register,
  socialLogin,
  requestPasswordReset,
  resetPassword,
  verifyEmail
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/social', socialLogin);
router.post('/password/request', requestPasswordReset);
router.post('/password/reset', resetPassword);
router.get('/verify', verifyEmail);

export default router;
