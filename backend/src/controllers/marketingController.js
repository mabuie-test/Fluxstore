import {
  storefrontExperiences,
  subscribeToNewsletter,
  sendDigest,
  lookbookExperiences
} from '../services/marketingService.js';
import { assertAuthenticated } from '../utils/authMiddleware.js';

export const getStorefront = async (_req, res) => {
  const experience = await storefrontExperiences();
  res.json(experience);
};

export const getLookbook = async (req, res) => {
  const experience = await lookbookExperiences({ slug: req.query.slug });
  res.json(experience);
};

export const subscribe = async (req, res) => {
  const { email, name, categories, frequency, locale } = req.body;
  const subscriber = await subscribeToNewsletter({ email, name, categories, frequency, locale });
  res.status(201).json(subscriber);
};

export const broadcastDigest = [assertAuthenticated, async (req, res) => {
  const { subject, highlightProducts = [], announcements = [] } = req.body;
  const result = await sendDigest({ subject, highlightProducts, announcements });
  res.json(result);
}];
