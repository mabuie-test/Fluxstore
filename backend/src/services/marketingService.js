import { Newsletter } from '../models/Newsletter.js';
import { mailer } from './mailer.js';

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

export const storefrontExperiences = () => ({
  theme: {
    primary: '#1f6feb',
    accent: '#f97316',
    background: '#0f172a',
    hero: {
      headline: 'Mercado universal com pagamentos Mpesa',
      subheadline: 'Entrega inteligente, disputa protegida e cashback por fidelidade.',
      cta: 'Explorar ofertas'
    }
  },
  sections: [
    {
      title: 'Destaques para você',
      type: 'grid',
      badge: 'Selecionados',
      items: [
        { title: 'Smartphones', image: '/assets/hero-smartphones.png', tag: 'até -30%' },
        { title: 'Moda e Lifestyle', image: '/assets/hero-fashion.png', tag: 'novidades' },
        { title: 'Casa e Décor', image: '/assets/hero-home.png', tag: 'frete otimizado' }
      ]
    },
    {
      title: 'Ofertas relâmpago',
      type: 'carousel',
      badge: 'Tempo limitado',
      items: [
        { title: 'Headset gamer', price: 2500, currency: 'MZN', timerMinutes: 120 },
        { title: 'Kit fitness', price: 1800, currency: 'MZN', timerMinutes: 90 }
      ]
    },
    {
      title: 'Marcas parceiras',
      type: 'logo-wall',
      items: ['EcoModa', 'TechWave', 'CasaViva', 'KidsFun']
    }
  ],
  trust: {
    perks: [
      'Proteção de pagamento com retenção em disputa',
      'Entrega com SLA dinâmico por cidade/região',
      'Suporte 24/7 com chat e email',
      'Cashback por compra recorrente e newsletter'
    ]
  }
});
