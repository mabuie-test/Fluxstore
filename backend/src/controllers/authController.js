import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { mailer } from '../services/mailer.js';

const signToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, env.jwtSecret, { expiresIn: '12h' });

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered' });
  const adminRoles = ['admin', 'staff', 'superadmin'];
  const requestedRole = role && adminRoles.includes(role) && env.allowAdminSelfSignup ? role : null;
  const user = await User.create({ name, email, password, role: requestedRole || 'buyer' });
  const token = signToken(user);
  try {
    await mailer.sendVerification(email, token);
  } catch (err) {
    console.warn('Email verification send failed; continuing registration', err.message);
  }
  res.status(201).json({ token, user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  const match = await user.comparePassword(password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken(user);
  res.json({ token, user });
};

export const socialLogin = async (req, res) => {
  const { provider, socialId, token: socialToken, email, name } = req.body;
  const resolvedId = socialId || socialToken || crypto.randomBytes(8).toString('hex');
  const idField = provider === 'google' ? 'googleId' : 'facebookId';
  let user = await User.findOne({ [idField]: resolvedId });
  if (!user) {
    user = await User.create({
      name: name || provider,
      email: email || `${resolvedId}@${provider}.placeholder`,
      password: crypto.randomBytes(8).toString('hex'),
      [idField]: resolvedId,
      verified: true
    });
  }
  const token = signToken(user);
  res.json({ token, user });
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.resetToken = crypto.randomBytes(20).toString('hex');
  user.resetExpires = Date.now() + 1000 * 60 * 30;
  await user.save();
  try {
    await mailer.sendPasswordReset(email, user.resetToken);
  } catch (err) {
    console.warn('Password reset email failed; token still created', err.message);
  }
  res.json({ message: 'Reset link sent' });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({ resetToken: token, resetExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
  user.password = newPassword;
  user.resetToken = undefined;
  user.resetExpires = undefined;
  await user.save();
  res.json({ message: 'Password updated' });
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    await User.updateOne({ _id: payload.sub }, { verified: true });
    res.json({ message: 'Email verified' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

export const updatePreferences = async (req, res) => {
  const updates = req.body.preferences || req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const currentPreferences =
    typeof user.preferences?.toObject === 'function'
      ? user.preferences.toObject()
      : user.preferences || {};

  user.preferences = { ...currentPreferences, ...updates };
  await user.save();

  res.json({ preferences: user.preferences });
};
