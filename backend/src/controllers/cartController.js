import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';

const ensureCart = async (userId) => {
  const existing = await Cart.findOne({ user: userId });
  if (existing) return existing;
  return Cart.create({ user: userId, items: [] });
};

export const getCart = async (req, res) => {
  const cart = await ensureCart(req.user.id);
  await cart.populate('items.product');
  res.json(cart);
};

export const addItem = async (req, res) => {
  const { productId, quantity, variantSku } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const cart = await ensureCart(req.user.id);
  const existing = cart.items.find((i) => i.product.equals(productId) && i.variantSku === variantSku);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, variantSku, priceSnapshot: product.price });
  }

  cart.region = req.body.region || cart.region;
  cart.city = req.body.city || cart.city;
  await cart.save();
  await cart.populate('items.product');
  res.status(201).json(cart);
};

export const updateItem = async (req, res) => {
  const { itemId } = req.params;
  const cart = await ensureCart(req.user.id);
  const item = cart.items.id(itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  item.quantity = req.body.quantity;
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
};

export const removeItem = async (req, res) => {
  const { itemId } = req.params;
  const cart = await ensureCart(req.user.id);
  cart.items.id(itemId)?.remove();
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
};

export const clearCart = async (req, res) => {
  const cart = await ensureCart(req.user.id);
  cart.items = [];
  await cart.save();
  res.json(cart);
};
