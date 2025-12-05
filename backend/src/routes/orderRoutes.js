import express from 'express';
import { createOrder, updateShipment, listOrders } from '../controllers/orderController.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/', createOrder);
router.get('/', listOrders);
router.put('/:id/shipment', updateShipment);

export default router;
