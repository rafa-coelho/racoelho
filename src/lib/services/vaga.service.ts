import vagasData from '@/data/vagas.json';
import { Vaga, VagaMeta } from '@/lib/types/vaga';

const vagas = vagasData as Vaga[];

// Excerpt curto — prefere a descrição PT-BR (adaptada) e cai pro texto puro original
function makeExcerpt(v: Vaga, max = 180): string {
  const source = v.descriptionPtBr || v.descriptionPlain || '';
  const text = source
    .replace(/[#*_>`\-]/g, ' ') // tira marcações markdown básicas
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

function toMeta(v: Vaga): VagaMeta {
  const { descriptionHtml, descriptionPlain, descriptionPtBr, ...rest } = v;
  return { ...rest, excerpt: makeExcerpt(v) };
}

export const vagaService = {
  /** Lista todas as vagas (metadados leves, sem a descrição completa) */
  getAllVagas(): VagaMeta[] {
    return vagas.map(toMeta);
  },

  /** Retorna a vaga completa pelo slug, ou null */
  getVagaBySlug(slug: string): Vaga | null {
    return vagas.find((v) => v.slug === slug) || null;
  },

  /** Slugs para generateStaticParams */
  getAllSlugs(): string[] {
    return vagas.map((v) => v.slug);
  },

  /** Departamentos/áreas únicos, para filtros */
  getDepartments(): string[] {
    return Array.from(
      new Set(vagas.map((v) => v.department).filter(Boolean) as string[])
    ).sort();
  },

  /** Tecnologias mais frequentes (para o filtro), ordenadas por nº de vagas */
  getTopTechs(limit = 20): string[] {
    const counts: Record<string, number> = {};
    for (const v of vagas) {
      for (const t of v.tags || []) counts[t] = (counts[t] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, limit)
      .map(([tech]) => tech);
  },
};
