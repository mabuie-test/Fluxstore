import { promotionService } from '../services/promotionService.js';

export const createPromotion = async (req, res) => {
  const promo = await promotionService.createPromo(req.body);
  res.status(201).json(promo);
};

export const listPromotions = async (_req, res) => {
  const promos = await promotionService.listPromos();
  res.json(promos);
};
