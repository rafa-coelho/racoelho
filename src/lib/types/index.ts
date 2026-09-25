
// Tipos compartilhados que podem ser usados sem depender de filesystem
// Separado de api.ts para evitar imports desnecessários

export interface ContentMeta {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  readingTime?: number;
  // posts (rebranding, opcionais)
  featured?: boolean;
  likes?: number;
  // challenges (rebranding, opcionais)
  number?: number;
  difficulty?: ChallengeDifficulty;
  estimatedHours?: number;
  stack?: string[];
  deliverables?: { text: string }[];
  criteria?: { text: string }[];
  comingSoon?: boolean;
}

export type ChallengeDifficulty = 'facil' | 'medio' | 'dificil';

export const DIFFICULTY_LABEL: Record<ChallengeDifficulty, string> = {
  facil: 'fácil',
  medio: 'médio',
  dificil: 'difícil',
};

export interface ContentItem extends ContentMeta {
  content: string;
}

export interface ProjectMeta {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
  role?: string;
  repoUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  order?: number;
  status?: 'draft' | 'published';
  // rebranding (opcionais)
  kind?: ProjectKind;
  icon?: string;
  accent?: 'blue' | 'green' | 'amber';
  stage?: ProjectStage;
  stack?: string[];
}

export type ProjectKind = 'saas' | 'open-source' | 'ferramenta' | 'experimento';
export type ProjectStage = 'live' | 'wip' | 'arquivado';

export const PROJECT_KIND_LABEL: Record<ProjectKind, string> = {
  saas: 'SaaS',
  'open-source': 'Open source',
  ferramenta: 'Ferramenta',
  experimento: 'Experimento',
};

export interface Project extends ProjectMeta {
  content: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface LinkTreeItem {
  title: string;
  url: string;
  description?: string;
  type: 'link' | 'highlight';
  icon?: string;
  image?: string;
  order?: number;
  visible?: boolean;
}

export interface SetupItem {
  name: string;
  category: string;
  description: string;
  image: string;
  url?: string;
  price?: string;
  // rebranding (opcionais)
  affiliate?: boolean;
  detail?: string;
  kind?: 'hardware' | 'software';
  order?: number;
}

// ── Collections novas do rebranding ──

export interface SiteStatus {
  id?: string;
  text: string;
  active: boolean;
  updatedAt?: string;
}

export type ChallengeSubmissionStatus = 'new' | 'reviewed' | 'featured' | 'rejected';

export interface ChallengeSubmission {
  id: string;
  challenge: string;
  challengeTitle?: string;
  challengeSlug?: string;
  name: string;
  email: string;
  repoUrl: string;
  demoUrl?: string;
  notes?: string;
  status: ChallengeSubmissionStatus;
  reviewNote?: string;
  created: string;
}

export interface MediaKitChannel { network: string; handle: string; url: string; followers?: number; note?: string }
export interface MediaKitFormat { tag: string; title: string; description: string; exampleLabel?: string; exampleUrl?: string }
export interface MediaKitFeatured { type: 'video' | 'post' | 'challenge' | 'talk'; title: string; url: string; coverImage?: string }
export interface MediaKitBrand { name: string; logo?: string; url?: string }
export interface MediaKitBlock { title: string; text: string }

export interface MediaKit {
  id?: string;
  headline: string;
  summary: string;
  channels: MediaKitChannel[];
  formats: MediaKitFormat[];
  featured: MediaKitFeatured[];
  brands: MediaKitBrand[];
  process: MediaKitBlock[];
  principles: MediaKitBlock[];
  contactEmail: string;
  pdf?: string;
  availability?: string;
  reviewed: boolean;
  updatedAt?: string;
}

export interface CommunityStats {
  members: number;
  online: number;
  channels: number;
  fetchedAt: string;
}

export interface SalesPageBlock {
  type: 'header' | 'text' | 'image' | 'pricing' | 'features' | 'testimonials' | 'cta' | 'faq' | 'form';
  title?: string;
  content?: string;
  image?: string;
  price?: string;
  items?: Array<{
    title: string;
    description: string;
  }>;
  apiUrl?: string;
  fields?: Array<{
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
  }>;
  submitText?: string;
  successMessage?: string;
}

export interface SalesPage {
  title: string;
  slug: string;
  blocks: SalesPageBlock[];
  ctaText: string;
  ctaUrl: string;
  paymentUrl: string;
  status?: 'draft' | 'published';
}

export interface Ebook {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  downloadUrl: string;
}

export interface YoutubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  link: string;
  published: string;
}

export interface AssetPack {
  id: string;
  slug: string;
  title: string;
  description?: string;
  files?: string[];
  metadata?: {
    type?: string;
    [key: string]: any;
  };
  status?: 'draft' | 'published';
}

