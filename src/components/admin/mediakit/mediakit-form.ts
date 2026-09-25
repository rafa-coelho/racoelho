import type { MediaKitBlock, MediaKitBrand, MediaKitChannel, MediaKitFeatured, MediaKitFormat } from '@/lib/types';

// Estado do formulário (números como string para permitir vazio).
export type ChannelDraft = Omit<MediaKitChannel, 'followers'> & { followers: string };

export interface MediaKitDraft {
  headline: string;
  summary: string;
  contactEmail: string;
  availability: string;
  channels: ChannelDraft[];
  formats: MediaKitFormat[];
  featured: MediaKitFeatured[];
  brands: MediaKitBrand[];
  process: MediaKitBlock[];
  principles: MediaKitBlock[];
  reviewed: boolean;
}

export const FEATURED_MAX = 6;
export const DEFAULT_CONTACT = 'contato@racoelho.com.br';

export const FEATURED_TYPES: { value: MediaKitFeatured['type']; label: string }[] = [
  { value: 'video', label: 'Vídeo' },
  { value: 'post', label: 'Post' },
  { value: 'challenge', label: 'Desafio' },
  { value: 'talk', label: 'Palestra' },
];

const arr = (v: unknown): any[] => (Array.isArray(v) ? v : []);
const str = (v: unknown) => (typeof v === 'string' ? v : '');

export function emptyDraft(): MediaKitDraft {
  return {
    headline: '',
    summary: '',
    contactEmail: DEFAULT_CONTACT,
    availability: '',
    channels: [],
    formats: [],
    featured: [],
    brands: [],
    process: [],
    principles: [],
    reviewed: false,
  };
}

export function draftFromRecord(rec: any): MediaKitDraft {
  return {
    headline: str(rec.headline),
    summary: str(rec.summary),
    contactEmail: str(rec.contactEmail),
    availability: str(rec.availability),
    channels: arr(rec.channels).map((c) => ({
      network: str(c?.network),
      handle: str(c?.handle),
      url: str(c?.url),
      followers: typeof c?.followers === 'number' ? String(c.followers) : '',
      note: str(c?.note),
    })),
    formats: arr(rec.formats).map((f) => ({
      tag: str(f?.tag),
      title: str(f?.title),
      description: str(f?.description),
      exampleLabel: str(f?.exampleLabel),
      exampleUrl: str(f?.exampleUrl),
    })),
    featured: arr(rec.featured)
      .slice(0, FEATURED_MAX)
      .map((f) => ({
        type: FEATURED_TYPES.some((t) => t.value === f?.type) ? f.type : 'post',
        title: str(f?.title),
        url: str(f?.url),
        coverImage: str(f?.coverImage),
      })),
    brands: arr(rec.brands).map((b) => ({ name: str(b?.name), url: str(b?.url), logo: str(b?.logo) })),
    process: arr(rec.process).map((p) => ({ title: str(p?.title), text: str(p?.text) })),
    principles: arr(rec.principles).map((p) => ({ title: str(p?.title), text: str(p?.text) })),
    reviewed: !!rec.reviewed,
  };
}

// Remove chaves opcionais vazias e itens totalmente vazios.
function compact<T extends Record<string, any>>(items: T[], optional: (keyof T)[]): T[] {
  return items
    .map((it) => {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(it)) {
        const val = typeof v === 'string' ? v.trim() : v;
        if (optional.includes(k as keyof T) && (val === '' || val === undefined || val === null)) continue;
        out[k] = val;
      }
      return out as T;
    })
    .filter((it) => Object.values(it).some((v) => typeof v === 'number' || (typeof v === 'string' && v !== '')));
}

export function draftToPayload(d: MediaKitDraft) {
  const channels = compact(
    d.channels.map((c) => {
      const n = Number(c.followers.replace(/[.\s]/g, '').replace(',', '.'));
      const { followers, ...rest } = c;
      return { ...rest, ...(c.followers.trim() && Number.isFinite(n) ? { followers: Math.round(n) } : {}) } as MediaKitChannel;
    }),
    ['note'],
  );
  // featured: o tipo sempre tem valor; filtra pelos campos de texto.
  const featured = d.featured
    .map((f) => ({ type: f.type, title: f.title.trim(), url: f.url.trim(), ...(f.coverImage?.trim() ? { coverImage: f.coverImage.trim() } : {}) }))
    .filter((f) => f.title || f.url)
    .slice(0, FEATURED_MAX);

  return {
    headline: d.headline.trim(),
    summary: d.summary.trim(),
    contactEmail: d.contactEmail.trim(),
    availability: d.availability.trim(),
    channels,
    formats: compact(d.formats, ['exampleLabel', 'exampleUrl']),
    featured,
    brands: compact(d.brands, ['url', 'logo']),
    process: compact(d.process, []),
    principles: compact(d.principles, []),
    reviewed: d.reviewed,
    updatedAt: new Date().toISOString(),
  };
}
