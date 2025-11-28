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

const defaultAccentPresets = [
  {
    name: 'Solar',
    primary: '#ff7f50',
    accent: '#1f6feb',
    gradient: 'linear-gradient(135deg, #ffedd5, #ffe4e6)',
    pattern: 'radial-soft',
    preview: '/assets/presets/solar.png'
  },
  {
    name: 'Aurora',
    primary: '#22d3ee',
    accent: '#a855f7',
    gradient: 'linear-gradient(135deg, #ecfeff, #f3e8ff)',
    pattern: 'glassmorphic',
    preview: '/assets/presets/aurora.png'
  },
  {
    name: 'Pine',
    primary: '#10b981',
    accent: '#0f172a',
    gradient: 'linear-gradient(120deg, #ecfdf3, #dbeafe)',
    pattern: 'angled-shape',
    preview: '/assets/presets/pine.png'
  }
];

const defaultStyleGuide = {
  typography: {
    headingFont: 'Space Grotesk',
    bodyFont: 'Inter',
    heroScale: 'clamp(32px, 4vw, 56px)',
    bodyScale: '17px'
  },
  shapes: {
    radius: '18px',
    buttons: '14px',
    cards: '22px'
  },
  shadows: {
    card: '0 24px 64px rgba(0,0,0,0.08)',
    popover: '0 28px 72px rgba(0,0,0,0.16)'
  },
  imagery: {
    heroBackdrop: 'radial-gradient(circle at 20% 20%, #e0f2fe, #fff0f6)',
    badges: {
      palette: ['#d946ef', '#0ea5e9', '#22c55e', '#f59e0b'],
      shape: 'pill'
    }
  },
  layout: {
    grid: '12-col',
    spacing: '1.5rem',
    heroVariant: 'immersive'
  }
};

const defaultLookbooks = [
  {
    title: 'Tech & Lifestyle',
    slug: 'tech-lifestyle',
    palette: defaultAccentPresets[1],
    hero: {
      headline: 'Tech desejada com entrega inteligente',
      subheadline: 'Combos curados por ocasião e região de entrega',
      media: '/assets/lookbooks/tech-hero.png'
    },
    sections: [
      { type: 'masonry', tag: 'gadgets', items: 6 },
      { type: 'editorial', tag: 'home-office', badge: 'setup premium' },
      { type: 'duo-highlight', tags: ['smart-home', 'wearables'] }
    ]
  },
  {
    title: 'Moda & Casa',
    slug: 'fashion-home',
    palette: defaultAccentPresets[0],
    hero: {
      headline: 'Cápsulas prontas para cada clima',
      subheadline: 'Frete otimizado por cidade e devolução fácil',
      media: '/assets/lookbooks/fashion-hero.png'
    },
    sections: [
      { type: 'color-stacks', tag: 'verão', badge: 'tons solares' },
      { type: 'story', tag: 'decor', cta: 'Ver kits de sala' },
      { type: 'carousel', tag: 'novidades', badge: 'drops semanais' }
    ]
  }
];

const defaultMicrocopy = {
  emptyStates: {
    cart: 'Seu carrinho está vazio. Explore coleções e receba em poucos dias.',
    wishlist: 'Salve achados e receba alertas de reposição.',
    orders: 'Nenhum pedido ainda. Combine kits e ganhe cashback.'
  },
  upsells: ['Envio ecológico disponível', 'Proteção extra em Mpesa escrow', 'Cashback para próximos drops']
};

const defaultLayoutPresets = [
  {
    name: 'Hero duplo + Destaques',
    description: 'Layout com herói dividido e blocos de curadoria',
    heroVariant: 'split-visual',
    sections: defaultSections
  },
  {
    name: 'Editorial storytelling',
    description: 'Home com vitrine editorial, depoimentos e blocos de confiança',
    heroVariant: 'storyteller',
    sections: [
      {
        title: 'Trending agora',
        type: 'editorial',
        badge: 'curadoria',
        items: [
          { title: 'Looks cápsula', image: '/assets/editorial-capsule.png', tag: 'mix & match' },
          { title: 'Gadgets essenciais', image: '/assets/editorial-gadgets.png', tag: 'produtos verificados' }
        ]
      },
      {
        title: 'Confiança garantida',
        type: 'trust-blocks',
        items: ['Escrow Mpesa', 'Resolução de disputa guiada', 'Rastreamento em tempo real']
      }
    ]
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
      },
      accentPresets: defaultAccentPresets
    },
    styleGuide: defaultStyleGuide,
    layoutPresets: defaultLayoutPresets,
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
      microcopy: defaultMicrocopy,
      lookbooks: defaultLookbooks,
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
    styleGuide: settings.styleGuide || defaultStyleGuide,
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
    menus: settings.menus,
    microcopy: settings.personalization?.microcopy || defaultMicrocopy,
    lookbooks: settings.personalization?.lookbooks?.length
      ? settings.personalization.lookbooks
      : defaultLookbooks,
    layoutPresets: settings.layoutPresets?.length ? settings.layoutPresets : defaultLayoutPresets,
    accentPresets: settings.branding?.accentPresets?.length
      ? settings.branding.accentPresets
      : defaultAccentPresets
  };
};
