import axios from 'axios';

const apiBase = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({
  baseURL: apiBase,
  withCredentials: false
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error', error?.response || error);
    throw error;
  }
);

const authHeaders = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const fetchMarketing = async () => {
  const [storefront, lookbook] = await Promise.all([
    client.get('/marketing/storefront'),
    client.get('/marketing/lookbook')
  ]);
  return { storefront: storefront.data, lookbook: lookbook.data };
};

export const fetchProducts = async () => {
  const res = await client.get('/products');
  return res.data;
};

export const fetchProductById = async (id) => {
  const res = await client.get(`/products`, { params: { id } });
  return Array.isArray(res.data) ? res.data.find((p) => p._id === id || p.id === id) : res.data;
};

export const register = async (payload) => {
  const res = await client.post('/auth/register', payload);
  return res.data;
};

export const login = async (payload) => {
  const res = await client.post('/auth/login', payload);
  return res.data;
};

export const socialLogin = async (payload) => {
  const res = await client.post('/auth/social', payload);
  return res.data;
};

export const requestPasswordReset = async (email) => {
  const res = await client.post('/auth/password/request', { email });
  return res.data;
};

export const resetPassword = async (payload) => {
  const res = await client.post('/auth/password/reset', payload);
  return res.data;
};

export const updatePreferences = async (token, preferences) => {
  const res = await client.patch('/auth/preferences', preferences, authHeaders(token));
  return res.data;
};

export const fetchCart = async (token) => {
  const res = await client.get('/cart', authHeaders(token));
  return res.data;
};

export const addCartItem = async (token, item) => {
  const res = await client.post('/cart/items', item, authHeaders(token));
  return res.data;
};

export const updateCartItem = async (token, id, patch) => {
  const res = await client.patch(`/cart/items/${id}`, patch, authHeaders(token));
  return res.data;
};

export const fetchWishlist = async (token) => {
  const res = await client.get('/wishlist', authHeaders(token));
  return res.data;
};

export const upsertWishlistItem = async (token, item) => {
  const res = await client.post('/wishlist/items', item, authHeaders(token));
  return res.data;
};

export const createOrder = async (token, payload) => {
  const res = await client.post('/orders', payload, authHeaders(token));
  return res.data;
};

export const fetchNotifications = async (token) => {
  const res = await client.get('/notifications', authHeaders(token));
  return res.data?.items || res.data;
};

export const markNotification = async (token, id) => {
  const res = await client.patch(`/notifications/${id}/read`, {}, authHeaders(token));
  return res.data;
};

export const subscribeNewsletter = async (payload) => {
  const res = await client.post('/marketing/newsletter', payload);
  return res.data;
};

export const applySeller = async (token, payload) => {
  const res = await client.post('/seller/apply', payload, authHeaders(token));
  return res.data;
};

export const fetchSellerApplication = async (token) => {
  const res = await client.get('/seller/my', authHeaders(token));
  return res.data;
};

export const adminSellerApplications = async (token) => {
  const res = await client.get('/seller/applications', authHeaders(token));
  return res.data;
};

export const adminReviewSellerApplication = async (token, id, payload) => {
  const res = await client.patch(`/seller/applications/${id}`, payload, authHeaders(token));
  return res.data;
};

export const adminSettings = async (token) => {
  const res = await client.get('/admin/settings', authHeaders(token));
  return res.data;
};

export const updateAdminSettings = async (token, payload) => {
  const res = await client.patch('/admin/settings', payload, authHeaders(token));
  return res.data;
};

export const adminDashboard = async (token) => {
  const res = await client.get('/admin/dashboard', authHeaders(token));
  return res.data;
};

export const adminMenu = async (token) => {
  const res = await client.get('/admin/menu', authHeaders(token));
  return res.data;
};

export const adminBroadcast = async (token, payload) => {
  const res = await client.post('/notifications/broadcast', payload, authHeaders(token));
  return res.data;
};

export const adminReports = async (token) => {
  const res = await client.get('/reports', authHeaders(token));
  return res.data;
};

export const adminResolveReport = async (token, id, payload) => {
  const res = await client.patch(`/reports/${id}`, payload, authHeaders(token));
  return res.data;
};

export const submitReport = async (token, payload) => {
  const res = await client.post('/reports', payload, authHeaders(token));
  return res.data;
};

export const submitReview = async (token, payload) => {
  const res = await client.post('/reviews', payload, authHeaders(token));
  return res.data;
};

export const fetchReviews = async (productId) => {
  const res = await client.get(`/reviews/${productId}`);
  return res.data;
};
