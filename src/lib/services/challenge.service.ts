import { pbListWithPreview, pbFirstByFilterWithPreview } from '@/lib/pocketbase-server';
import { ContentItem, ContentMeta } from '@/lib/api';
import { getCached, cacheKey, cacheListKey, cacheFilterKey } from '@/lib/cache/cache.service';

// Mappers PB -> tipos locais
function mapPbToContentMeta(rec: any): ContentMeta {
  return {
    title: rec.title,
    slug: rec.slug,
    date: rec.date || rec.created,
    excerpt: rec.excerpt || '',
    coverImage: rec.coverImage ? fileUrl(rec, rec.coverImage) : undefined,
    tags: rec.tags || [],
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

    // Buscar com cache
    const cacheKeyData = cacheListKey('challenges');
    
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

    // Buscar com cache
    const cacheKeyData = cacheKey('challenges', slug);

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

