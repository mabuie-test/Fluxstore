import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Report } from '../models/Report.js';
import { User } from '../models/User.js';
import { getMenuForRole, ensureSettings, updatePlatformSettings } from '../services/settingsService.js';

export const adminDashboard = async (_req, res) => {
  const [buyers, sellers, orders, products, reports] = await Promise.all([
    User.countDocuments({ role: 'buyer' }),
    User.countDocuments({ role: 'seller' }),
    Order.countDocuments(),
    Product.countDocuments(),
    Report.countDocuments({ status: { $in: ['open', 'investigating'] } })
  ]);

  const revenue = await Order.aggregate([
    { $group: { _id: null, gross: { $sum: '$total' }, orders: { $sum: 1 } } }
  ]);

  res.json({
    users: { buyers, sellers },
    catalog: { products },
    risk: { openReports: reports },
    commerce: {
      grossMerchandiseValue: revenue[0]?.gross || 0,
      orderCount: revenue[0]?.orders || 0
    }
  });
};

export const getUserMenu = async (req, res) => {
  const role = req.user?.role || 'buyer';
  const menu = await getMenuForRole(role);
  res.json(menu);
};

export const getSettings = async (_req, res) => {
  const settings = await ensureSettings();
  res.json(settings);
};

export const patchSettings = async (req, res) => {
  const updated = await updatePlatformSettings(req.body, req.user?.id);
  res.json(updated);
};

export const updateUserStatus = async (req, res) => {
  const { status, accountTags, sellerProfile, adminNotes } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status, accountTags, sellerProfile, adminNotes },
    { new: true }
  );
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};
