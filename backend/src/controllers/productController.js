import { Product } from '../models/Product.js';

export const listProducts = async (req, res) => {
  const products = await Product.find().populate('seller', 'name');
  res.json(products);
};

export const createProduct = async (req, res) => {
  const seller = req.user.id;
  const payload = { ...req.body, seller };
  const product = await Product.create(payload);
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOneAndUpdate({ _id: id, seller: req.user.id }, req.body, {
    new: true
  });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};
