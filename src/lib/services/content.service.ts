import { pbListWithPreview, pbFirstByFilterWithPreview } from '@/lib/pocketbase-server';
import { ContentItem, ContentMeta } from '@/lib/api';
import { getCached, cacheKey, cacheListKey } from '@/lib/cache/cache.service';
import { calculateReadingTime } from '../utils';

// Mappers PB -> tipos locais
function mapPbToContentMeta(rec: any): ContentMeta {
  return {
    title: rec.title,
    slug: rec.slug,
    date: rec.date || rec.created,
    excerpt: rec.excerpt || '',
    coverImage: rec.coverImage ? fileUrl(rec, rec.coverImage) : undefined,
    tags: rec.tags || [],
    status: rec.status || undefined,
    readingTime: calculateReadingTime(rec.content || ''),
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

export const contentService = {
  async getAllPosts(fields: string[] = [], isPreview: boolean = false): Promise<ContentMeta[]> {
    // Verificar se é preview/admin
    const isAdminPreview = isPreview;

    // Buscar com cache
    const cacheKeyData = cacheListKey('posts');

    return await getCached(
      cacheKeyData,
      async () => {
        const res = await pbListWithPreview('posts', {
          filter: isAdminPreview ? undefined : "status='published'",
          sort: '-date',
        }, isPreview);

        return (res.items || []).map(mapPbToContentMeta);
      },
      3600000 // 1 hora
    );
  },

  async getPostBySlug(slug: string, fields: string[] = [], isPreview: boolean = false): Promise<ContentItem | null> {
    // Verificar se é preview/admin
    const isAdminPreview = isPreview;

    // Buscar com cache
    const cacheKeyData = cacheKey('posts', slug);

    return await getCached(
      cacheKeyData,
      async () => {
        const filter = isAdminPreview
          ? `slug='${slug}'`
          : `slug='${slug}' && status='published'`;

        try {
          const rec = await pbFirstByFilterWithPreview('posts', filter, undefined, isPreview);
          return rec ? mapPbToContentItem(rec) : null;
        } catch (error) {
          return null;
        }
      },
      3600000 // 1 hora
    );
  },

  async getAllChallenges(fields: string[] = [], isPreview: boolean = false): Promise<ContentMeta[]> {
    // Re-exporta do challenge.service para manter compatibilidade
    const { challengeService } = await import('./challenge.service');
    return challengeService.getAllChallenges(fields, isPreview);
  },

  async getChallengeBySlug(slug: string, fields: string[] = [], isPreview: boolean = false): Promise<ContentItem | null> {
    // Re-exporta do challenge.service para manter compatibilidade
    const { challengeService } = await import('./challenge.service');
    return challengeService.getChallengeBySlug(slug, fields, isPreview);
  },
};


