import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const assertAuthenticated = (req, res, next) => {
  authMiddleware(req, res, next);
};

export const requireRole = (roles) => (req, res, next) => {
  authMiddleware(req, res, (err) => {
    if (err) return next(err);
    const allowed = Array.isArray(roles) ? roles : [roles];
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  });
};
