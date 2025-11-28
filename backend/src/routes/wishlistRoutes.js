import { Router } from 'express';
import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
  updateMoodboard,
  updateWishlistItem
} from '../controllers/wishlistController.js';
import { assertAuthenticated } from '../utils/authMiddleware.js';

const router = Router();

router.get('/', assertAuthenticated, getWishlist);
router.post('/items', assertAuthenticated, addWishlistItem);
router.patch('/items/:itemId', assertAuthenticated, updateWishlistItem);
router.delete('/items/:itemId', assertAuthenticated, removeWishlistItem);
router.patch('/moodboard', assertAuthenticated, updateMoodboard);

export default router;
