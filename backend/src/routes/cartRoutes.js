import { Router } from 'express';
import { addItem, clearCart, getCart, removeItem, updateItem } from '../controllers/cartController.js';
import { assertAuthenticated } from '../utils/authMiddleware.js';

const router = Router();

router.get('/', assertAuthenticated, getCart);
router.post('/items', assertAuthenticated, addItem);
router.patch('/items/:itemId', assertAuthenticated, updateItem);
router.delete('/items/:itemId', assertAuthenticated, removeItem);
router.delete('/', assertAuthenticated, clearCart);

export default router;
