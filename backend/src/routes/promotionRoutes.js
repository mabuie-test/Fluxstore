import { Router } from 'express';
import { createPromotion, listPromotions } from '../controllers/promotionController.js';
import { assertAuthenticated, requireRole } from '../utils/authMiddleware.js';

const router = Router();

router.get('/', listPromotions);
router.post('/', assertAuthenticated, requireRole(['admin']), createPromotion);

export default router;
