import { NextRequest, NextResponse } from 'next/server';
import { pbListWithPreview } from '@/lib/pocketbase-server';
import { PageType, SlotType, Placement } from '@/lib/services/adOrchestrator';

function fileUrl(rec: any, filename: string): string {
  if (!filename) return '';
  const base = process.env.NEXT_PUBLIC_PB_URL || '';
  return `${base}/api/files/${rec.collectionId || rec.collection}/${rec.id}/${filename}`;
}

function selectCreativeForSlot(rec: any, slot: SlotType): string | null {
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pageType = searchParams.get('pageType') as PageType;
    const slotsParam = searchParams.get('slots');
    const maxPerPageParam = searchParams.get('maxPerPage');

    if (!pageType || !slotsParam) {
      return NextResponse.json(
        { error: 'pageType e slots são obrigatórios' },
        { status: 400 }
      );
    }

    const slots: SlotType[] = JSON.parse(slotsParam);
    const maxPerPage = maxPerPageParam ? parseInt(maxPerPageParam, 10) : Infinity;
    const now = new Date();
    const nowISO = now.toISOString();

    // Construir filtro
    const statusFilter = `status = 'active'`;
    const targetsFilter = `targets ?~ "${pageType}"`;
    const windowFilter = `((startAt = null) || (startAt <= '${nowISO}')) && ((endAt = null) || (endAt > '${nowISO}'))`;
    const filter = [statusFilter, targetsFilter, windowFilter].join(' && ');

    const res = await pbListWithPreview('ads', {
      page: 1,
      perPage: 200,
      filter,
      sort: '-priority',
    });

    const ads = (res?.items || []).sort((a: any, b: any) => {
      const pa = typeof a.priority === 'number' ? a.priority : 0;
      const pb = typeof b.priority === 'number' ? b.priority : 0;
      return pb - pa;
    });

    const usedAdIds = new Set<string>();
    const placements: Record<string, Placement> = {};

    for (const slot of slots) {
      let placed: Placement | null = null;

      for (const rec of ads) {
        // Se o AD já foi usado, pule para o próximo
        if (usedAdIds.has(rec.id)) continue;
        
        // Se já atingimos o limite máximo de ADs por página, pule
        if (usedAdIds.size >= maxPerPage) continue;

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

    // Retornar apenas os placements para os slots solicitados
    const result: Record<string, Placement> = {};
    for (const slot of slots) {
      result[slot] = placements[slot] || { kind: 'google', slotType: slot };
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[Ads API] Error getting placements:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro ao buscar placements' },
      { status: 500 }
    );
  }
}
