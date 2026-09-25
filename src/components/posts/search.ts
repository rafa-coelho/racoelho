import type { ContentMeta } from '@/lib/types';

export const POSTS_PER_PAGE = 12;

// Minúsculas e sem acentos, para a busca casar "producao" com "Produção".
export function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

// Busca em título, resumo e tags. Todas as palavras do termo precisam aparecer.
export function matchesSearch(post: Pick<ContentMeta, 'title' | 'excerpt' | 'tags'>, term: string): boolean {
  const words = normalizeText(term).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalizeText([post.title, post.excerpt, ...(post.tags || [])].join(' '));
  return words.every((word) => haystack.includes(word));
}

// Tags com pelo menos 2 posts, da mais frequente para a menos.
export function popularTags(posts: Pick<ContentMeta, 'tags'>[], min = 2): [string, number][] {
  const counts = new Map<string, number>();
  posts.forEach((post) => post.tags?.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1)));
  return Array.from(counts.entries())
    .filter(([, count]) => count >= min)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt-BR'));
}

// Destaque: o mais recente com featured; sem nenhum, o mais recente.
export function pickFeatured<T extends Pick<ContentMeta, 'featured' | 'date'>>(posts: T[]): T | undefined {
  const byDate = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return byDate.find((post) => post.featured) || byDate[0];
}

export function parsePage(value: unknown): number {
  const page = parseInt(String(value ?? ''), 10);
  return Number.isFinite(page) && page > 1 ? Math.min(page, 1000) : 1;
}
