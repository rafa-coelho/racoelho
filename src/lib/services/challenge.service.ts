import { pbListWithPreview, pbFirstByFilterWithPreview } from '@/lib/pocketbase-server';
import { ContentItem, ContentMeta } from '@/lib/api';
import { getCached, cacheKey, cacheListKey, cacheFilterKey } from '@/lib/cache/cache.service';

// Mappers PB -> tipos locais
function asStringArray(value: any): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const list = value.map((v) => String(v).trim()).filter(Boolean);
  return list.length ? list : undefined;
}

function asTextList(value: any): { text: string }[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const list = value
    .map((v) => (typeof v === 'string' ? v : v?.text))
    .filter((t) => typeof t === 'string' && t.trim())
    .map((text) => ({ text: String(text).trim() }));
  return list.length ? list : undefined;
}

function mapPbToContentMeta(rec: any): ContentMeta {
  return {
    title: rec.title,
    slug: rec.slug,
    date: rec.date || rec.created,
    excerpt: rec.excerpt || '',
    coverImage: rec.coverImage ? fileUrl(rec, rec.coverImage) : undefined,
    tags: rec.tags || [],
    status: rec.status || undefined,
    number: typeof rec.number === 'number' && rec.number > 0 ? rec.number : undefined,
    difficulty: ['facil', 'medio', 'dificil'].includes(rec.difficulty) ? rec.difficulty : undefined,
    estimatedHours: typeof rec.estimatedHours === 'number' && rec.estimatedHours > 0 ? rec.estimatedHours : undefined,
    stack: asStringArray(rec.stack),
    deliverables: asTextList(rec.deliverables),
    criteria: asTextList(rec.criteria),
    comingSoon: !!rec.comingSoon,
  };
}

function mapPbToContentItem(rec: any): ContentItem {
  return {
    ...mapPbToContentMeta(rec),
    content: rec.content || '',
  };
}

function fileUrl(rec: any, filename: string) {
  const base = process.env.NEXT_PUBLIC_PB_URL || '';
  return `${base}/api/files/${rec.collectionId || rec.collection}/${rec.id}/${filename}`;
}

export const challengeService = {
  async getAllChallenges(fields: string[] = [], isPreview: boolean = false): Promise<ContentMeta[]> {
    // Verificar se é preview/admin
    const isAdminPreview = isPreview;

    // Buscar com cache - chave diferente para preview e não-preview
    const cacheKeyData = `${cacheListKey('challenges')}:${isPreview ? 'preview' : 'public'}`;
    
    return await getCached(
      cacheKeyData,
      async () => {
        const res = await pbListWithPreview('challenges', {
          filter: isAdminPreview ? undefined : "status='published'",
          sort: '-date',
        }, isPreview);

        return (res.items || []).map(mapPbToContentMeta);
      },
      3600000 // 1 hora
    );
  },

  async getChallengeBySlug(slug: string, fields: string[] = [], isPreview: boolean = false): Promise<ContentItem | null> {
    // Verificar se é preview/admin
    const isAdminPreview = isPreview;

    // Buscar com cache - chave diferente para preview e não-preview
    const cacheKeyData = `${cacheKey('challenges', slug)}:${isPreview ? 'preview' : 'public'}`;

    return await getCached(
      cacheKeyData,
      async () => {
        const filter = isAdminPreview
          ? `slug='${slug}'`
          : `slug='${slug}' && status='published'`;

        try {
          const rec = await pbFirstByFilterWithPreview('challenges', filter, undefined, isPreview);
          return rec ? mapPbToContentItem(rec) : null;
        } catch (error) {
          return null;
        }
      },
      3600000 // 1 hora
    );
  },
};

