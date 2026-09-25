import { getPocketBaseServer } from '@/lib/pocketbase-server';
import { getCached, invalidateCollection } from '@/lib/cache/cache.service';
import type { MediaKit } from '@/lib/types';

const COLLECTION = 'mediakit';

const arr = <T,>(v: any): T[] => (Array.isArray(v) ? v : []);

function fileUrl(rec: any, filename?: string) {
  if (!filename) return undefined;
  const base = process.env.NEXT_PUBLIC_PB_URL || '';
  return `${base}/api/files/${rec.collectionId || rec.collectionName}/${rec.id}/${filename}`;
}

export function mapMediaKit(rec: any): MediaKit {
  return {
    id: rec.id,
    headline: rec.headline || '',
    summary: rec.summary || '',
    channels: arr(rec.channels),
    formats: arr(rec.formats),
    featured: arr<MediaKit["featured"][number]>(rec.featured).slice(0, 6),
    brands: arr(rec.brands),
    process: arr(rec.process),
    principles: arr(rec.principles),
    contactEmail: rec.contactEmail || 'contato@racoelho.com.br',
    pdf: fileUrl(rec, rec.pdf),
    availability: rec.availability || undefined,
    reviewed: !!rec.reviewed,
    updatedAt: rec.updatedAt || rec.updated,
  };
}

// Registro único do media kit.
export const mediakitService = {
  async get(): Promise<MediaKit | null> {
    return getCached(
      `pb:${COLLECTION}:single`,
      async () => {
        try {
          const pb = await getPocketBaseServer();
          const res = await pb.collection(COLLECTION).getList(1, 1, { sort: '-updated' });
          return res.items[0] ? mapMediaKit(res.items[0]) : null;
        } catch {
          return null;
        }
      },
      60000,
    );
  },

  async invalidate() {
    await invalidateCollection(COLLECTION);
  },
};
