import type { ProjectMeta } from '@/lib/types';

// Produto é o que tem botão e site no ar: aparece em "Apps para usar" e ganha oferta.
export function isProduct(project: Pick<ProjectMeta, 'ctaLabel' | 'liveUrl' | 'stage'>): boolean {
  return !!project.ctaLabel && !!project.liveUrl && project.stage === 'live';
}

// UTM para o site do produto saber de onde veio o clique.
export function withUtm(url: string, placement: string): string {
  try {
    const target = new URL(url);
    target.searchParams.set('utm_source', 'racoelho.com.br');
    target.searchParams.set('utm_medium', 'site');
    target.searchParams.set('utm_campaign', placement);
    return target.toString();
  } catch {
    return url;
  }
}

// Bloco de produto no fim do post: o produto citado no post; sem citação, um dos
// destaques, sempre o mesmo para o mesmo post.
export function pickPromoProduct<T extends ProjectMeta>(
  post: { slug: string; title: string; tags?: string[] },
  projects: T[],
): T | null {
  const products = projects.filter(isProduct);
  if (products.length === 0) return null;

  const haystack = `${post.title} ${(post.tags ?? []).join(' ')}`.toLowerCase();
  const mentioned = products.find((p) => haystack.includes(productName(p).toLowerCase()));
  if (mentioned) return mentioned;

  const pool = products.filter((p) => p.featured && p.offer);
  const options = pool.length > 0 ? pool : products;
  const hash = Array.from(post.slug).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return options[hash % options.length];
}

// "Doca: um dock com ambientes" -> "Doca"
export function productName(project: Pick<ProjectMeta, 'title'>): string {
  return project.title.split(':')[0].trim();
}

// Relacionados: prioriza produtos, depois tags em comum e o mesmo tipo.
export function pickRelatedProjects<T extends ProjectMeta>(project: ProjectMeta, projects: T[], limit = 3): T[] {
  const tags = new Set(project.tags ?? []);
  const score = (other: T) =>
    (other.tags ?? []).filter((tag) => tags.has(tag)).length +
    (other.kind === project.kind ? 2 : 0) +
    (isProduct(other) ? 3 : 0);

  return projects
    .filter((other) => other.slug !== project.slug && other.stage !== 'arquivado')
    .map((other) => ({ other, value: score(other) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
    .map(({ other }) => other);
}
