import { pbList } from '@/lib/pocketbase';

export type PageType = 'posts' | 'challenges';
export type SlotType = 'header' | 'inline' | 'sidebar-top' | 'sidebar-mid' | 'sidebar-bottom' | 'footer';

export type Placement =
  | {
      kind: 'internal';
      adId: string;
      slotType: SlotType;
      imageUrl: string;
      clickUrl: string;
      title: string;
    }
  | { kind: 'google'; slotType: SlotType };

type OrchestratorParams = {
  pageType: PageType;
  slots: SlotType[];
  now?: Date;
  maxPerPage?: number; // limite de anúncios internos distintos por página
};

type AdRecord = any;

function fileUrl(rec: any, filename: string): string {
  if (!filename) return '';
  const base = process.env.NEXT_PUBLIC_PB_URL || '';
  return `${base}/api/files/${rec.collectionId || rec.collection}/${rec.id}/${filename}`;
}

function targetsFilter(pageType: PageType): string {
  // PocketBase array contains: field ?~ "value"
  return `targets ?~ "${pageType}"`;
}

function statusFilter(): string {
  return `status = 'active'`;
}

function windowFilter(nowISO: string): string {
  // (startAt = null || startAt <= now) && (endAt = null || endAt > now)
  return `((startAt = null) || (startAt <= '${nowISO}')) && ((endAt = null) || (endAt > '${nowISO}'))`;
}

function byPriorityDesc(a: AdRecord, b: AdRecord): number {
  const pa = typeof a.priority === 'number' ? a.priority : 0;
  const pb = typeof b.priority === 'number' ? b.priority : 0;
  return pb - pa;
}

function selectCreativeForSlot(rec: AdRecord, slot: SlotType): string | null {
  // mapeamento do plano
  switch (slot) {
    case 'header':
      return rec.creative_leaderboard ? fileUrl(rec, rec.creative_leaderboard) : null;
    case 'inline':
      return rec.creative_rectangle ? fileUrl(rec, rec.creative_rectangle) : null;
    case 'sidebar-top':
    case 'sidebar-mid':
    case 'sidebar-bottom':
      if (rec.creative_skyscraper) return fileUrl(rec, rec.creative_skyscraper);
      if (rec.creative_rectangle) return fileUrl(rec, rec.creative_rectangle);
      return null;
    case 'footer':
      if (rec.creative_leaderboard) return fileUrl(rec, rec.creative_leaderboard);
      if (rec.creative_rectangle) return fileUrl(rec, rec.creative_rectangle);
      return null;
    default:
      return null;
  }
}

export async function getPlacements({ pageType, slots, now, maxPerPage = Infinity }: OrchestratorParams): Promise<Record<string, Placement>> {
  const nowDate = now || new Date();
  const nowISO = nowDate.toISOString();

  const filter = [statusFilter(), targetsFilter(pageType), windowFilter(nowISO)].join(' && ');

  const res = await pbList('ads', {
    page: 1,
    perPage: 200,
    filter,
    sort: '-priority,created',
  });

  const ads: AdRecord[] = (res?.items ?? []).sort(byPriorityDesc);

  const usedAdIds = new Set<string>();
  const placements: Record<string, Placement> = {};

  // estratégia: percorrer slots em ordem, atribuir ad com melhor criativo disponível respeitando prioridade
  for (const slot of slots) {
    let placed: Placement | null = null;

    for (const rec of ads) {
      if (usedAdIds.size >= maxPerPage && !usedAdIds.has(rec.id)) continue;

      const imageUrl = selectCreativeForSlot(rec, slot);
      if (!imageUrl) continue;

      placed = {
        kind: 'internal',
        adId: rec.id,
        slotType: slot,
        imageUrl,
        clickUrl: rec.clickUrl || rec.link || '#',
        title: rec.title || '',
      };

      usedAdIds.add(rec.id);
      break;
    }

    if (!placed) {
      placed = { kind: 'google', slotType: slot };
    }

    placements[slot] = placed;
  }

  return placements;
}

export function getPageSlots(pageType: PageType): SlotType[] {
  if (pageType === 'posts') {
    // sidebar-mid (topo direita) tem prioridade mais alta
    return ['sidebar-mid', 'sidebar-top', 'inline', 'sidebar-bottom'];
  }
  return ['inline', 'footer'];
}


