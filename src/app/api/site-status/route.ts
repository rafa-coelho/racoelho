import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/pocketbase-server';
import { siteStatusService } from '@/lib/services/site-status.service';

export async function GET() {
  const status = await siteStatusService.get();
  return NextResponse.json(status);
}

// PATCH { text, active } — só admin. Revalida a home.
export async function PATCH(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Não autenticado como admin' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const text = String(body?.text ?? '').trim();
    const active = body?.active !== false;
    if (text.length > 120) {
      return NextResponse.json({ error: 'Máximo de 120 caracteres' }, { status: 400 });
    }
    if (active && !text) {
      return NextResponse.json({ error: 'Texto obrigatório' }, { status: 400 });
    }
    const saved = await siteStatusService.save({ text, active });
    revalidatePath('/');
    return NextResponse.json(saved);
  } catch (error) {
    console.error('[site-status] erro ao salvar:', error);
    return NextResponse.json({ error: 'Erro ao salvar status' }, { status: 500 });
  }
}
