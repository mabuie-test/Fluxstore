import express from 'express';
import cors from 'cors';
import { connectDb } from './utils/db.js';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import disputeRoutes from './routes/disputeRoutes.js';
import payoutRoutes from './routes/payoutRoutes.js';
import marketingRoutes from './routes/marketingRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/promotions', promotionRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

connectDb().then(() => {
  app.listen(env.port, () => console.log(`Fluxstore backend running on ${env.port}`));
});
