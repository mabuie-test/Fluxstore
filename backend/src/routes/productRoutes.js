import express from 'express';
import { listProducts, createProduct, updateProduct } from '../controllers/productController.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

router.get('/', listProducts);
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);

export default router;
