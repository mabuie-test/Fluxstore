import express from 'express';
import { broadcastDigest, getStorefront, subscribe } from '../controllers/marketingController.js';

const router = express.Router();

router.get('/storefront', getStorefront);
router.post('/newsletter', subscribe);
router.post('/newsletter/broadcast', broadcastDigest);

export default router;
