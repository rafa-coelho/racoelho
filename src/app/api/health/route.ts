import { NextResponse } from 'next/server';

// Health para o Sentinela: sem auth, checa a dependência crítica (PocketBase).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PB_URL = (process.env.PB_URL || process.env.NEXT_PUBLIC_PB_URL || '').replace(/\/+$/, '');
const TIMEOUT_MS = 3000;

export async function GET() {
  const startedAt = Date.now();
  try {
    if (!PB_URL) throw new Error('PB_URL não configurada');
    // /api/health do PocketBase: a consulta mais barata, não precisa de credenciais
    const res = await fetch(`${PB_URL}/api/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`PocketBase respondeu ${res.status}`);
    return NextResponse.json({ status: 'ok', latencyMs: Date.now() - startedAt });
  } catch (error) {
    console.error('[health] PocketBase indisponível:', error);
    return NextResponse.json({ status: 'degraded' }, { status: 503 });
  }
}
