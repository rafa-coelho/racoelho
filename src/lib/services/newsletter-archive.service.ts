// Arquivo de edições da newsletter (ConvertKit API v3, broadcasts).
// Só entram broadcasts já enviados, marcados como públicos e com URL pública.
// Sem API secret, com erro ou sem nenhuma edição pública → lista vazia (a seção some).
// Espelhar o HTML da edição no site é item DECIDIR: não fazemos.

const API_BASE = 'https://api.convertkit.com/v3';
const REVALIDATE_SECONDS = 3600; // 1h
const MAX_PAGES = 10;
const MAX_DETAILS = 60; // teto de broadcasts consultados por revalidação
const CONCURRENCY = 5;

export interface NewsletterIssue {
  id: number;
  number: number | null; // nº da edição (ordem cronológica entre as públicas); null se o histórico foi truncado
  date: string; // ISO
  subject: string;
  url: string; // versão web pública do ConvertKit
}

interface BroadcastListItem {
  id: number;
  created_at?: string;
  subject?: string;
}

interface BroadcastDetail extends BroadcastListItem {
  public?: boolean;
  published_at?: string | null;
  send_at?: string | null;
  public_url?: string | null;
  url?: string | null;
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`ConvertKit respondeu ${res.status}`);
  return res.json() as Promise<T>;
}

async function listBroadcasts(secret: string): Promise<BroadcastListItem[]> {
  const all: BroadcastListItem[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const data = await getJson<{ broadcasts?: BroadcastListItem[] }>(
      `${API_BASE}/broadcasts?page=${page}&api_secret=${encodeURIComponent(secret)}`,
    );
    const items = Array.isArray(data.broadcasts) ? data.broadcasts : [];
    all.push(...items);
    if (items.length < 50) break; // v3 pagina de 50 em 50
  }
  return all;
}

async function getDetail(secret: string, id: number): Promise<BroadcastDetail | null> {
  try {
    const data = await getJson<{ broadcast?: BroadcastDetail }>(
      `${API_BASE}/broadcasts/${id}?api_secret=${encodeURIComponent(secret)}`,
    );
    return data.broadcast ? { ...data.broadcast, id } : null;
  } catch {
    return null;
  }
}

// Busca em lotes para não estourar o limite de requisições do ConvertKit.
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    out.push(...(await Promise.all(items.slice(i, i + limit).map(fn))));
  }
  return out;
}

function publicUrl(b: BroadcastDetail): string | null {
  const url = b.public_url || b.url;
  return typeof url === 'string' && /^https:\/\//.test(url) ? url : null;
}

// Enviado = data de envio/publicação no passado.
function sentAt(b: BroadcastDetail, now: number): string | null {
  const when = b.published_at || b.send_at;
  if (!when) return null;
  const t = new Date(when).getTime();
  return Number.isFinite(t) && t <= now ? new Date(t).toISOString() : null;
}

export function toIssues(details: (BroadcastDetail | null)[], limit: number, complete = true, now = Date.now()): NewsletterIssue[] {
  const eligible = details
    .filter((b): b is BroadcastDetail => !!b && b.public === true && !!b.subject)
    .map((b) => ({ b, date: sentAt(b, now), url: publicUrl(b) }))
    .filter((x): x is { b: BroadcastDetail; date: string; url: string } => !!x.date && !!x.url)
    .sort((a, b) => a.date.localeCompare(b.date));

  return eligible
    .map(({ b, date, url }, i) => ({ id: b.id, number: complete ? i + 1 : null, date, subject: b.subject!.trim(), url }))
    .reverse()
    .slice(0, limit);
}

export const newsletterArchiveService = {
  async getRecent(limit = 5): Promise<NewsletterIssue[]> {
    const secret = process.env.CONVERTKIT_API_SECRET;
    if (!secret) return [];

    try {
      const list = await listBroadcasts(secret);
      // mais recentes primeiro, com teto de detalhes consultados
      const recent = [...list]
        .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || '') || b.id - a.id)
        .slice(0, MAX_DETAILS);
      const details = await mapLimit(recent, CONCURRENCY, (b) => getDetail(secret, b.id));
      // sem o histórico completo a numeração ficaria errada: omite o número
      return toIssues(details, limit, list.length <= MAX_DETAILS);
    } catch (error) {
      console.error('[newsletter-archive] falha ao buscar broadcasts:', error);
      return [];
    }
  },
};
