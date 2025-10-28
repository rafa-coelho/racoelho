import { pbList, pbFirstByFilter } from '@/lib/pocketbase';
import { ContentItem, ContentMeta } from '@/lib/api';

const SOURCE = (process.env.NEXT_PUBLIC_CONTENT_SOURCE || 'fs') as 'fs' | 'pb';

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

export const contentService = {
  async getAllPosts(fields: string[] = []): Promise<ContentMeta[]> {
    if (SOURCE === 'fs') {
      const { getAllPosts } = await import('@/lib/api');
      return getAllPosts(fields);
    }
    const res = await pbList('posts', {
      filter: "status='published'",
      sort: '-date',
    });
    return (res.items || []).map(mapPbToContentMeta);
  },

  async getPostBySlug(slug: string, fields: string[] = []): Promise<ContentItem | null> {
    if (SOURCE === 'fs') {
      const { getPostBySlug } = await import('@/lib/api');
      return (getPostBySlug as any)(slug, fields) as ContentItem;
    }
    const rec = await pbFirstByFilter('posts', `slug='${slug}'`);
    return rec ? mapPbToContentItem(rec) : null;
  },
};


