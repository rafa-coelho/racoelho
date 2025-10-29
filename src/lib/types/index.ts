
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
}

export interface ContentItem extends ContentMeta {
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
}

export interface SetupItem {
  name: string;
  category: string;
  description: string;
  image: string;
  url?: string;
  price?: string;
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

