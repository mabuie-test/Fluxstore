import { Router } from 'express';
import { createReview, listProductReviews } from '../controllers/reviewController.js';
import { assertAuthenticated } from '../utils/authMiddleware.js';

const router = Router({ mergeParams: true });

router.get('/:productId', listProductReviews);
router.post('/', assertAuthenticated, createReview);

export default router;
