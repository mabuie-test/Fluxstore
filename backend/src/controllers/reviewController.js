import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Review } from '../models/Review.js';

export const createReview = async (req, res) => {
  const { productId, rating, title, comment } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const order = await Order.findOne({ buyer: req.user.id, 'items.product': productId });
  const isVerifiedPurchase = Boolean(order);

  const review = await Review.create({
    product: productId,
    user: req.user.id,
    order: order?._id,
    rating,
    title,
    comment,
    status: 'published',
    isVerifiedPurchase
  });

  const aggregate = await Review.aggregate([
    { $match: { product: product._id, status: 'published' } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' } } }
  ]);

  await Product.updateOne({ _id: productId }, { rating: aggregate[0]?.avgRating || rating, $inc: { 'analytics.purchases': isVerifiedPurchase ? 1 : 0 } });

  res.status(201).json(review);
};

export const listProductReviews = async (req, res) => {
  const { productId } = req.params;
  const reviews = await Review.find({ product: productId, status: 'published' })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(reviews);
};
