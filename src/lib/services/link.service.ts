import { pbListWithPreview } from '@/lib/pocketbase-server';
import { LinkTreeItem } from '@/lib/api';
import { getCached, cacheListKey } from '@/lib/cache/cache.service';

// Mapper PB -> LinkTreeItem
function mapPbToLinkItem(rec: any): LinkTreeItem {
  return {
    title: rec.title,
    url: rec.url,
    description: rec.description,
    type: rec.type || 'link',
    icon: rec.icon,
    image: rec.image ? fileUrl(rec, rec.image) : undefined,
  };
}

function fileUrl(rec: any, filename: string) {
  if (!filename) return '';
  const base = process.env.NEXT_PUBLIC_PB_URL || '';
  return `${base}/api/files/${rec.collectionId || rec.collection}/${rec.id}/${filename}`;
}

export const linkService = {
  async getLinkItems(): Promise<LinkTreeItem[]> {
    // Buscar com cache
    const cacheKeyData = cacheListKey('link_items');

    return await getCached(
      cacheKeyData,
      async () => {
        const res = await pbListWithPreview('link_items', {
          sort: 'order',
          perPage: 100, // Link items geralmente são poucos
        });

        return (res.items || []).map(mapPbToLinkItem);
      },
      86400000 // 24 horas
    );
  },
};

