import express from 'express';
import {
  getMySellerApplication,
  listSellerApplications,
  reviewSellerApplication,
  submitSellerApplication
} from '../controllers/sellerController.js';
import { assertAuthenticated, requireRole } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/apply', assertAuthenticated, submitSellerApplication);
router.get('/my', assertAuthenticated, getMySellerApplication);

router.get('/applications', requireRole(['admin', 'staff', 'superadmin']), listSellerApplications);
router.patch('/applications/:id', requireRole(['admin', 'staff', 'superadmin']), reviewSellerApplication);

export default router;
