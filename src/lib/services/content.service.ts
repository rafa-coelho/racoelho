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

    // Buscar com cache - chave diferente para preview e não-preview
    const cacheKeyData = `${cacheListKey('posts')}:${isPreview ? 'preview' : 'public'}`;

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

    // Buscar com cache - chave diferente para preview e não-preview
    const cacheKeyData = `${cacheKey('posts', slug)}:${isPreview ? 'preview' : 'public'}`;

    return await getCached(
      cacheKeyData,
      async () => {
        const filter = isAdminPreview
          ? `slug='${slug}'`
          : `slug='${slug}' && status='published'`;

        try {
          // Passar fields para garantir que content seja retornado
          const fieldsParam = fields.length > 0 ? fields.join(',') : undefined;
          const rec = await pbFirstByFilterWithPreview('posts', filter, fieldsParam, isPreview);
          
          if (!rec) {
            return null;
          }
          
          return mapPbToContentItem(rec);
        } catch (error: any) {
          console.error('[ContentService] Erro ao buscar post:', error?.message || error);
          return null;
        }
      },
      isPreview ? 0 : 3600000 // Preview sem cache, publicado com cache de 1 hora
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


