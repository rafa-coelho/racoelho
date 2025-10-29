export const EXAMPLE_PATH = 'blog-starter';
export const CMS_NAME = 'Markdown';
export const HOME_OG_IMAGE_URL = 'https://github.com/rafa-coelho.png';
export const BLOG_NAME = 'Rafael Coelho';
export const KEYWORDS = 'dev, blog, tech, tecnologia, programador, programação, developer, Racoelho, Rafael Coelho';
export const DESCRIPTION = 'Rafael Coelho, o Racoelho. Sou desenvolvedor Full-Stack, ou seja, atuo tanto em Backend como em Frontend. E este aqui é meu portifólio e blog pessoal sobre tecnologia e programação.';
export const AUTHOR = 'racoelho';
export const TWITTER_USERNAME = 'racoelhodev';
export const LANG = 'pt-BR';
export const GITHUB_REPO = 'https://github.com/rafa-coelho';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const ADS_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID;
export const ADS_AD_SLOT = process.env.NEXT_PUBLIC_GOOGLE_ADS_AD_SLOT;

export const convertKitConfig = {
  apiKey: process.env.CONVERTKIT_API_KEY,
  newsletter: {
    formId: process.env.CONVERTKIT_FORM_ID,
    tagId: process.env.CONVERTKIT_TAG_ID
  },
  ebook: {
    formId: process.env.CONVERTKIT_EBOOK_FORM_ID,
    tagId: process.env.CONVERTKIT_EBOOK_TAG_ID
  }
};

export const mailerConfig = {
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  user: process.env.MAILER_USER,
  pass: process.env.MAILER_PASS,
  secure: process.env.MAILER_SECURE,
  from: {
    name: process.env.MAILER_FROM_NAME,
    email: process.env.MAILER_FROM_EMAIL
  },
};

// Firebase removido do projeto

export const analyticsConfig = {
  trackingId: process.env.NEXT_PUBLIC_GA_ID || '',
  events: {
    pageview: 'pageview',
    linkClick: 'link_click',
  },
  categories: {
    navigation: 'navigation',
  },
} as const;

export const authorInfo = {
  name: 'Rafael Coelho',
  title: 'Fullstack Developer',
  bio: 'Compartilhando conhecimento sobre programação e desenvolvimento.',
  avatar: 'https://github.com/rafa-coelho.png',
  email: 'contato@racoelho.com.br',
  profileUrl: '/links',
  social: {
    github: 'https://github.com/rafa-coelho',
    twitter: 'https://twitter.com/racoelhodev',
    linkedin: 'https://linkedin.com/in/racoelhoo',
  }
} as const;

export const adsConfig = {
  mockPriority: 0.7, // 70% chance de usar mockado quando disponível
  googleAdsEnabled: true,
  positions: {
    post: ['sidebar-left', 'sidebar-right-1', 'content', 'sidebar-right-2'],
    challenge: ['sidebar-1', 'sidebar-2']
  }
} as const; 
