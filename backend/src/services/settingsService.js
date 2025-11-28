import { PlatformSetting } from '../models/PlatformSetting.js';

const defaultSections = [
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
];

const defaultMenus = {
  buyer: [
    { key: 'home', label: 'Início', path: '/home', description: 'Explorar vitrines e destaques', featureFlag: 'storefront', audience: 'buyer' },
    { key: 'orders', label: 'Pedidos', path: '/orders', description: 'Consultar entregas e disputas', featureFlag: 'orders', audience: 'buyer' },
    {
      key: 'loyalty',
      label: 'Fidelidade',
      path: '/rewards',
      description: 'Cashback, pontos e newsletter',
      featureFlag: 'loyalty',
      audience: 'buyer'
    },
    { key: 'support', label: 'Suporte', path: '/support', description: 'Denúncias e atendimento', featureFlag: 'reports', audience: 'buyer' }
  ],
  seller: [
    { key: 'dashboard', label: 'Painel', path: '/seller/dashboard', description: 'KPIs e volume de vendas', featureFlag: 'analytics', audience: 'seller' },
    { key: 'catalog', label: 'Catálogo', path: '/seller/products', description: 'Gerir anúncios e estoque', featureFlag: 'catalog', audience: 'seller' },
    {
      key: 'payouts',
      label: 'Saques Mpesa',
      path: '/seller/payouts',
      description: 'Saldo disponível, retenção e escrow',
      featureFlag: 'mpesaEscrow',
      audience: 'seller'
    },
    {
      key: 'disputes',
      label: 'Disputas',
      path: '/seller/disputes',
      description: 'Responder clientes e evitar chargeback',
      featureFlag: 'disputes',
      audience: 'seller'
    }
  ],
  admin: [
    { key: 'overview', label: 'Visão Geral', path: '/admin/overview', description: 'GMV, conversão, falhas de pagamento', featureFlag: 'analytics', audience: 'admin' },
    { key: 'users', label: 'Usuários', path: '/admin/users', description: 'Compradores, vendedores, verificação', featureFlag: 'accounts', audience: 'admin' },
    { key: 'reports', label: 'Denúncias', path: '/admin/reports', description: 'Moderar denúncias e risco', featureFlag: 'reports', audience: 'admin' },
    {
      key: 'personalization',
      label: 'Personalização',
      path: '/admin/personalization',
      description: 'Menus, cores e anúncios sem deploy',
      featureFlag: 'storefrontEditor',
      audience: 'admin'
    },
    {
      key: 'newsletters',
      label: 'Newsletters',
      path: '/admin/newsletters',
      description: 'Campanhas periódicas e curadoria',
      featureFlag: 'newsletters',
      audience: 'admin'
    }
  ]
};

const deepMerge = (target, source) => {
  if (Array.isArray(source)) return source;
  if (source && typeof source === 'object') {
    const output = { ...target };
    Object.keys(source).forEach((key) => {
      output[key] = deepMerge(target ? target[key] : undefined, source[key]);
    });
    return output;
  }
  return source ?? target;
};

export const ensureSettings = async () => {
  const existing = await PlatformSetting.findOne().sort({ updatedAt: -1 });
  if (existing) return existing;
  return PlatformSetting.create({
    branding: {
      brandName: 'Fluxstore',
      logo: '/assets/logo.png',
      primaryColor: '#1f6feb',
      accentColor: '#f97316',
      heroCopy: {
        headline: 'Mercado universal com Mpesa',
        subheadline: 'Entrega inteligente, fidelidade, disputas e monetização completa.',
        cta: 'Explorar agora'
      }
    },
    personalization: {
      announcementBar: 'Pague por Mpesa com proteção de disputa e cashback!',
      supportChannels: ['email: suporte@fluxstore.test', 'chat 24/7', 'FAQ dinâmico'],
      trustPerks: [
        'Proteção de pagamento com retenção em disputa',
        'Entrega com SLA dinâmico por cidade/região',
        'Suporte 24/7 com chat e email',
        'Cashback por compra recorrente e newsletter'
      ],
      homeSections: defaultSections,
      seo: {
        title: 'Fluxstore Marketplace - B2C com Mpesa',
        description: 'Marketplace multi-vendedor com pagamentos Mpesa, prazos dinâmicos e monetização por venda.',
        keywords: ['mpesa', 'marketplace', 'b2c', 'moçambique', 'loja virtual']
      }
    },
    featureToggles: {
      loyalty: true,
      referrals: false,
      mpesaEscrow: true,
      scheduledPayouts: true,
      storefrontEditor: true
    },
    menus: defaultMenus
  });
};

export const updatePlatformSettings = async (payload, userId) => {
  const current = await ensureSettings();
  const merged = deepMerge(current.toObject(), payload);
  delete merged._id;
  delete merged.createdAt;
  delete merged.updatedAt;
  merged.updatedBy = userId;
  return PlatformSetting.findByIdAndUpdate(current._id, merged, { new: true });
};

export const getMenuForRole = async (role) => {
  const settings = await ensureSettings();
  const normalizedRole = ['buyer', 'seller', 'admin'].includes(role) ? role : 'buyer';
  return {
    role: normalizedRole,
    items: settings.menus?.[normalizedRole] || [],
    featureToggles: settings.featureToggles
  };
};

export const getStorefrontTemplate = async () => {
  const settings = await ensureSettings();
  const theme = {
    primary: settings.branding?.primaryColor || '#1f6feb',
    accent: settings.branding?.accentColor || '#f97316',
    background: settings.branding?.themeMode === 'dark' ? '#0f172a' : '#ffffff',
    hero: settings.branding?.heroCopy
  };

  return {
    theme,
    sections: settings.personalization?.homeSections?.length
      ? settings.personalization.homeSections
      : defaultSections,
    trust: {
      perks: settings.personalization?.trustPerks?.length
        ? settings.personalization.trustPerks
        : [
            'Proteção de pagamento com retenção em disputa',
            'Entrega com SLA dinâmico por cidade/região',
            'Suporte 24/7 com chat e email',
            'Cashback por compra recorrente e newsletter'
          ]
    },
    announcementBar: settings.personalization?.announcementBar,
    seo: settings.personalization?.seo,
    featureToggles: settings.featureToggles,
    menus: settings.menus
  };
};
