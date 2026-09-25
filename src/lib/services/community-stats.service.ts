import { getPocketBaseServer } from '@/lib/pocketbase-server';
import { getCached, invalidateCollection } from '@/lib/cache/cache.service';
import type { CommunityStats } from '@/lib/types';

const COLLECTION = 'community_stats';
export const COMMUNITY_STATS_MAX_AGE_MS = 48 * 60 * 60 * 1000;

// "1.2k" acima de mil; inteiro abaixo.
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, '')}k`;
}

export const communityStatsService = {
  // Lê o cache; nunca consulta o Discord em tempo de request.
  async get(): Promise<CommunityStats | null> {
    return getCached(
      `${COLLECTION}:latest`,
      async () => {
        try {
          const pb = await getPocketBaseServer();
          const res = await pb.collection(COLLECTION).getList(1, 1, { sort: '-fetchedAt' });
          const rec = res.items[0];
          if (!rec) return null;
          const stats = { members: rec.members || 0, online: rec.online || 0, channels: rec.channels || 0, fetchedAt: rec.fetchedAt };
          // cache velho some em vez de mostrar número antigo
          if (Date.now() - new Date(stats.fetchedAt).getTime() > COMMUNITY_STATS_MAX_AGE_MS) return null;
          return stats;
        } catch {
          return null;
        }
      },
      10 * 60 * 1000,
    );
  },

  // Busca no Discord (convite com with_counts) e grava no PocketBase.
  async refresh(): Promise<CommunityStats> {
    const invite = process.env.DISCORD_INVITE_CODE;
    if (!invite) throw new Error('DISCORD_INVITE_CODE não configurado');
    const res = await fetch(`https://discord.com/api/v10/invites/${encodeURIComponent(invite)}?with_counts=true`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Discord respondeu ${res.status}`);
    const data = await res.json();
    const stats: CommunityStats = {
      members: Number(data.approximate_member_count) || 0,
      online: Number(data.approximate_presence_count) || 0,
      channels: Number(process.env.DISCORD_CHANNEL_COUNT) || 0,
      fetchedAt: new Date().toISOString(),
    };
    const pb = await getPocketBaseServer();
    await pb.collection(COLLECTION).create(stats);
    await invalidateCollection(COLLECTION);
    return stats;
  },
};
