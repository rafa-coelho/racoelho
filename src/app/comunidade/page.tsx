import ComunidadeContent, { type CommunityStatsView } from '@/components/ComunidadeContent';
import { Metadata } from 'next';
import { featureFlagService } from '@/lib/services/feature-flag.service';
import { communityStatsService, formatCount } from '@/lib/services/community-stats.service';

// Dinâmica como as demais páginas com dado do PocketBase: o cache fica no service
// (community_stats: 10 min; flags: 1 min). Evita o data cache do Next guardar a flag.
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Comunidade',
  description: 'Entre na comunidade Racoelho no Discord. Teste o jogo, jogue com a galera e troque ideia sobre dev, games e tech.',
};

export default async function ComunidadePage() {
  // Flag community_stats; cache com mais de 48h já vem null → bloco escondido.
  let stats: CommunityStatsView | null = null;
  if (await featureFlagService.isEnabled('community_stats')) {
    const raw = await communityStatsService.get();
    if (raw) {
      stats = {
        members: formatCount(raw.members),
        online: formatCount(raw.online),
        // sem DISCORD_CHANNEL_COUNT o valor é 0: mostra "—" em vez de inventar
        channels: raw.channels > 0 ? formatCount(raw.channels) : null,
      };
    }
  }

  return <ComunidadeContent stats={stats} />;
}
