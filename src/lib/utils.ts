
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { BLOG_NAME, DESCRIPTION } from "./config/constants";

// Ensina o tailwind-merge que text-rc-hero, text-rc-eyebrow… são tamanhos de fonte
// (senão ele os trata como cor e descarta ao combinar com text-rc-ink etc.).
const RC_FONT_SIZES = [
  'rc-hero', 'rc-h1', 'rc-h1-article', 'rc-h2-article', 'rc-h2-card', 'rc-h2', 'rc-card-title', 'rc-lead',
  'rc-article', 'rc-body', 'rc-small', 'rc-meta', 'rc-eyebrow',
  'rc-hero-m', 'rc-h1-m', 'rc-h1-article-m', 'rc-h2-m', 'rc-article-m',
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: RC_FONT_SIZES }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getGradientByIndex(index: number): string {
  const gradients = [
    'from-blue-600 to-indigo-700',
    'from-cyan-500 to-blue-700',
    'from-indigo-600 to-purple-700',
    'from-blue-700 to-cyan-600',
    'from-violet-600 to-indigo-700',
  ];
  
  return gradients[index % gradients.length];
}

// Add SEO metadata helper
export function generateSeoMetaTags({
  title = BLOG_NAME,
  description = DESCRIPTION,
  url = '',
  imageUrl = '/og-image.png'
}: {
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
}) {
  return {
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: imageUrl },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:title', content: title },
      { property: 'twitter:description', content: description },
      { property: 'twitter:image', content: imageUrl }
    ]
  };
}
