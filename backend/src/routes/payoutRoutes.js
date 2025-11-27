import express from 'express';
import { releasePayout } from '../controllers/payoutController.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/:id/release', authMiddleware, releasePayout);

export default router;
