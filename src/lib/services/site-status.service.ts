import { getPocketBaseServer } from '@/lib/pocketbase-server';
import { getCached, invalidateCollection } from '@/lib/cache/cache.service';
import type { SiteStatus } from '@/lib/types';

const COLLECTION = 'site_status';

function map(rec: any): SiteStatus {
  return {
    id: rec.id,
    text: rec.text || '',
    active: rec.active !== false,
    updatedAt: rec.updatedAt || rec.updated,
  };
}

// Registro único que alimenta o card "Agora" da home.
export const siteStatusService = {
  async get(): Promise<SiteStatus | null> {
    return getCached(
      `pb:${COLLECTION}:single`,
      async () => {
        try {
          const pb = await getPocketBaseServer();
          const res = await pb.collection(COLLECTION).getList(1, 1, { sort: '-updated' });
          return res.items[0] ? map(res.items[0]) : null;
        } catch {
          return null;
        }
      },
      60000,
    );
  },

  async save(input: { text: string; active: boolean }): Promise<SiteStatus> {
    const pb = await getPocketBaseServer();
    const res = await pb.collection(COLLECTION).getList(1, 1, { sort: '-updated' });
    const data = { text: input.text, active: input.active, updatedAt: new Date().toISOString() };
    const rec = res.items[0]
      ? await pb.collection(COLLECTION).update(res.items[0].id, data)
      : await pb.collection(COLLECTION).create(data);
    await invalidateCollection(COLLECTION);
    return map(rec);
  },
};

// "● ativo" até 14 dias; depois disso, "atualizado há N dias".
export function siteStatusAgeDays(status: SiteStatus, now = new Date()): number {
  if (!status.updatedAt) return 0;
  return Math.floor((now.getTime() - new Date(status.updatedAt).getTime()) / 86400000);
}
