import express from 'express';
import { openDispute, resolveDispute } from '../controllers/disputeController.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/:id', openDispute);
router.post('/:id/resolve', resolveDispute);

export default router;
