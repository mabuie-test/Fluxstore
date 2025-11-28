import express from 'express';
import { broadcastDigest, getLookbook, getStorefront, subscribe } from '../controllers/marketingController.js';

const router = express.Router();

router.get('/storefront', getStorefront);
router.get('/lookbook', getLookbook);
router.post('/newsletter', subscribe);
router.post('/newsletter/broadcast', broadcastDigest);

export default router;
