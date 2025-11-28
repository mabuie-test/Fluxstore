import { Newsletter } from '../models/Newsletter.js';
import { mailer } from './mailer.js';
import { getStorefrontTemplate } from './settingsService.js';

export const subscribeToNewsletter = async ({ email, name, categories, frequency, locale }) => {
  const preferences = {
    categories: categories || [],
    frequency: frequency || 'weekly'
  };

  const existing = await Newsletter.findOneAndUpdate(
    { email },
    { name, preferences, consent: true, locale },
    { new: true }
  );

  if (existing) return existing;
  return Newsletter.create({ email, name, preferences, locale });
};

export const sendDigest = async ({ subject, highlightProducts, announcements }) => {
  const subscribers = await Newsletter.find({ consent: true });
  const content = {
    subject,
    highlightProducts,
    announcements
  };

  await Promise.all(
    subscribers.map(async (subscriber) => {
      await mailer.sendNewsletter({
        to: subscriber.email,
        name: subscriber.name,
        locale: subscriber.locale,
        content
      });
      subscriber.lastSentAt = new Date();
      await subscriber.save();
    })
  );

  return { sent: subscribers.length };
};

export const storefrontExperiences = async () => getStorefrontTemplate();

export const lookbookExperiences = async ({ slug } = {}) => {
  const storefront = await getStorefrontTemplate();
  const lookbooks = storefront.lookbooks || [];
  const selected = slug
    ? lookbooks.find((entry) => entry.slug === slug) || lookbooks[0]
    : lookbooks[0];

  return {
    active: selected,
    palette: selected?.palette || storefront.accentPresets?.[0],
    styleGuide: storefront.styleGuide,
    accentPresets: storefront.accentPresets,
    catalog: lookbooks
  };
};
