import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/pocketbase-server';

export const dynamic = 'force-dynamic';

const CK_URL = 'https://api.convertkit.com/v3/subscribers';

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

// Conta inscritos no ConvertKit (opcionalmente num intervalo de datas de inscrição)
async function countSubscribers(secret: string, from?: Date, to?: Date): Promise<number> {
  const params = new URLSearchParams({ api_secret: secret });
  if (from) params.set('from', ymd(from));
  if (to) params.set('to', ymd(to));
  const res = await fetch(`${CK_URL}?${params}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`ConvertKit ${res.status}`);
  const data = await res.json();
  return Number(data?.total_subscribers ?? 0);
}

// GET — só admin. { available, total, last30, prev30 } para o card "Inscritos" do dashboard.
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Não autenticado como admin' }, { status: 401 });
  }

  const secret = process.env.CONVERTKIT_API_SECRET;
  if (!secret) {
    return NextResponse.json({ available: false });
  }

  try {
    const now = new Date();
    const d30 = new Date(now.getTime() - 30 * 86400000);
    const d60 = new Date(now.getTime() - 60 * 86400000);
    const d31 = new Date(d30.getTime() - 86400000);
    const [total, last30, prev30] = await Promise.all([
      countSubscribers(secret),
      countSubscribers(secret, d30),
      countSubscribers(secret, d60, d31),
    ]);
    return NextResponse.json({ available: true, total, last30, prev30 });
  } catch (error) {
    console.error('[admin/subscribers] erro ao consultar ConvertKit:', error);
    return NextResponse.json({ available: false, error: 'Falha ao consultar ConvertKit' }, { status: 502 });
  }
}
