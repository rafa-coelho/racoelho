import { pbListWithPreview } from '@/lib/pocketbase-server';
import { SetupItem } from '@/lib/api';
import { getCached, cacheListKey } from '@/lib/cache/cache.service';

// Mapper PB -> SetupItem
function mapPbToSetupItem(rec: any): SetupItem {
  return {
    name: rec.name,
    category: rec.category || '',
    description: rec.description || '',
    image: fileUrl(rec, rec.image),
    url: rec.url,
    price: rec.price,
  };
}

function fileUrl(rec: any, filename: string) {
  if (!filename) return '';
  const base = process.env.NEXT_PUBLIC_PB_URL || '';
  return `${base}/api/files/${rec.collectionId || rec.collection}/${rec.id}/${filename}`;
}

export const setupService = {
  async getSetupItems(): Promise<SetupItem[]> {
    // Buscar com cache
    const cacheKeyData = cacheListKey('setup_items');

    return await getCached(
      cacheKeyData,
      async () => {
        const res = await pbListWithPreview('setup_items', {
          sort: 'order',
          perPage: 100, // Setup items geralmente são poucos
        });

        return (res.items || []).map(mapPbToSetupItem);
      },
      86400000 // 24 horas (setup items mudam raramente)
    );
  },
};

