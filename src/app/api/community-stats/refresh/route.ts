import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { communityStatsService } from '@/lib/services/community-stats.service';

// Chamado por cron (a cada 6h) com o header x-cron-secret.
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('x-cron-secret') !== secret) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const stats = await communityStatsService.refresh();
    revalidatePath('/comunidade');
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('[community-stats] erro:', error);
    return NextResponse.json({ error: error?.message || 'Erro ao atualizar' }, { status: 500 });
  }
}
