import type { ContentMeta } from '@/lib/types';

export interface TrailItem {
  challenge: ContentMeta;
  number: number;
}

// Ordem da trilha: challenges.number crescente (sem número: data crescente, depois dos numerados);
// "em breve" (comingSoon) sempre no fim.
export function buildTrail(challenges: ContentMeta[]): TrailItem[] {
  const time = (c: ContentMeta) => new Date(c.date).getTime() || 0;
  const sorted = [...challenges].sort((a, b) => {
    if (!!a.comingSoon !== !!b.comingSoon) return a.comingSoon ? 1 : -1;
    const an = a.number ?? Number.POSITIVE_INFINITY;
    const bn = b.number ?? Number.POSITIVE_INFINITY;
    if (an !== bn) return an - bn;
    return time(a) - time(b);
  });
  // Sem número cadastrado, usa a posição na trilha (como antes).
  return sorted.map((challenge, index) => ({ challenge, number: challenge.number ?? index + 1 }));
}
