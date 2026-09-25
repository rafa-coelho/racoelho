import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/pocketbase-server';
import { vagaService } from '@/lib/services/vaga.service';

export const dynamic = 'force-dynamic';

// GET — só admin. Dados do dashboard que vivem no servidor (vagas vêm de src/data/vagas.json).
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Não autenticado como admin' }, { status: 401 });
  }
  return NextResponse.json({ vagasAtivas: vagaService.getAllVagas().length });
}
