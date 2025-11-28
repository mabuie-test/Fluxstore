import { Wishlist } from '../models/Wishlist.js';
import { Product } from '../models/Product.js';

const ensureWishlist = async (userId) => {
  const existing = await Wishlist.findOne({ user: userId });
  if (existing) return existing;
  return Wishlist.create({ user: userId, items: [] });
};

export const getWishlist = async (req, res) => {
  const wishlist = await ensureWishlist(req.user.id);
  await wishlist.populate('items.product');
  res.json(wishlist);
};

export const addWishlistItem = async (req, res) => {
  const { productId, variantSku, note, tags = [], priority = 'medium' } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const wishlist = await ensureWishlist(req.user.id);
  const exists = wishlist.items.find(
    (item) => item.product.equals(productId) && item.variantSku === variantSku
  );
  if (!exists) {
    wishlist.items.push({ product: productId, variantSku, note, tags, priority });
  }

  await wishlist.save();
  await wishlist.populate('items.product');
  res.status(201).json(wishlist);
};

export const updateWishlistItem = async (req, res) => {
  const { itemId } = req.params;
  const wishlist = await ensureWishlist(req.user.id);
  const item = wishlist.items.id(itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  if (req.body.note !== undefined) item.note = req.body.note;
  if (req.body.priority) item.priority = req.body.priority;
  if (Array.isArray(req.body.tags)) item.tags = req.body.tags;

  await wishlist.save();
  await wishlist.populate('items.product');
  res.json(wishlist);
};

export const removeWishlistItem = async (req, res) => {
  const { itemId } = req.params;
  const wishlist = await ensureWishlist(req.user.id);
  wishlist.items.id(itemId)?.remove();
  await wishlist.save();
  await wishlist.populate('items.product');
  res.json(wishlist);
};

export const updateMoodboard = async (req, res) => {
  const wishlist = await ensureWishlist(req.user.id);
  if (req.body.moodboard) wishlist.moodboard = req.body.moodboard;
  await wishlist.save();
  res.json({ moodboard: wishlist.moodboard });
};
