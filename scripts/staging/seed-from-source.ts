/**
 * Semeia um PocketBase de staging com o conteúdo PÚBLICO de outro PocketBase
 * (ex.: produção). Só lê a API pública da origem — nenhuma credencial de
 * produção é usada e nada é escrito lá.
 *
 * - Copia registros publicados (o que as regras públicas da origem liberam)
 *   e os arquivos anexos (capas, imagens).
 * - Upsert por slug/key/nome: pode rodar em todo deploy.
 * - Campos que existem na origem e faltam no destino são criados (tipo inferido).
 *
 * Uso: SOURCE_PB_URL=https://... PB_URL=... PB_ADMIN_EMAIL=... PB_ADMIN_PASSWORD=... npm run staging:seed
 */
import dotenv from 'dotenv';
import PocketBase from 'pocketbase';
dotenv.config();

const SOURCE = (process.env.SOURCE_PB_URL || '').replace(/\/$/, '');

// collection → campo usado para casar registros entre origem e destino
const COLLECTIONS: Record<string, string> = {
  posts: 'slug',
  challenges: 'slug',
  projects: 'slug',
  setup_items: 'name',
  social_links: 'name',
  link_items: 'title',
  sales_pages: 'slug',
  feature_flags: 'key',
};

const FILE_FIELDS = new Set(['coverImage', 'image', 'files', 'logo', 'pdf', 'cv']);
const SYSTEM = new Set(['id', 'collectionId', 'collectionName', 'created', 'updated', 'expand']);

// Flags que ficam desligadas no staging independentemente da origem
const STAGING_FLAG_OVERRIDES: Record<string, boolean> = { ads: false, analytics: false };

function inferField(name: string, value: any) {
  if (FILE_FIELDS.has(name)) return { name, type: 'file', maxSelect: Array.isArray(value) ? 10 : 1, maxSize: 20 * 1024 * 1024 };
  if (typeof value === 'boolean') return { name, type: 'bool' };
  if (typeof value === 'number') return { name, type: 'number' };
  if (value !== null && typeof value === 'object') return { name, type: 'json' };
  return { name, type: 'text', max: 1_000_000 };
}

async function fetchAll(collection: string): Promise<any[]> {
  const items: any[] = [];
  for (let page = 1; page < 50; page++) {
    const res = await fetch(`${SOURCE}/api/collections/${collection}/records?page=${page}&perPage=200`);
    if (!res.ok) {
      console.warn(`  ! ${collection}: origem respondeu ${res.status} — pulando`);
      return items;
    }
    const data = await res.json();
    items.push(...(data.items || []));
    if (page >= (data.totalPages || 1)) break;
  }
  return items;
}

async function downloadFile(rec: any, filename: string): Promise<Blob | null> {
  const res = await fetch(`${SOURCE}/api/files/${rec.collectionId}/${rec.id}/${encodeURIComponent(filename)}`);
  if (!res.ok) return null;
  return new Blob([await res.arrayBuffer()], { type: res.headers.get('content-type') || 'application/octet-stream' });
}

async function main() {
  const pbUrl = process.env.PB_URL || process.env.NEXT_PUBLIC_PB_URL;
  if (!SOURCE) throw new Error('SOURCE_PB_URL é obrigatório');
  if (!pbUrl || !process.env.PB_ADMIN_EMAIL || !process.env.PB_ADMIN_PASSWORD) throw new Error('PB_URL, PB_ADMIN_EMAIL e PB_ADMIN_PASSWORD são obrigatórios');
  if (pbUrl.replace(/\/$/, '') === SOURCE) throw new Error('Origem e destino são o mesmo PocketBase — abortando');

  const pb = new PocketBase(pbUrl);
  pb.autoCancellation(false);
  await pb.admins.authWithPassword(process.env.PB_ADMIN_EMAIL!, process.env.PB_ADMIN_PASSWORD!);

  for (const [collection, key] of Object.entries(COLLECTIONS)) {
    const target: any = await pb.collections.getOne(collection).catch(() => null);
    if (!target) {
      console.warn(`  ! ${collection}: não existe no destino (rode pb:migrate antes) — pulando`);
      continue;
    }
    const records = await fetchAll(collection);
    if (records.length === 0) {
      console.log(`  = ${collection}: nada público na origem`);
      continue;
    }

    // cria no destino os campos que só existem na origem
    const have = new Set((target.fields || []).map((f: any) => f.name));
    const extra = new Map<string, any>();
    for (const rec of records) {
      for (const [name, value] of Object.entries(rec)) {
        if (SYSTEM.has(name) || have.has(name) || extra.has(name)) continue;
        if (value === '' || value === null) continue;
        extra.set(name, inferField(name, value));
      }
    }
    if (extra.size) {
      await pb.collections.update(target.id, { fields: [...target.fields, ...Array.from(extra.values())] });
      console.log(`  + ${collection}: campos ${Array.from(extra.keys()).join(', ')}`);
    }
    const fields: any[] = (await pb.collections.getOne(collection)).fields;
    const fileFields = new Set(fields.filter((f) => f.type === 'file').map((f) => f.name));
    const known = new Set(fields.map((f) => f.name));

    let created = 0;
    let updated = 0;
    for (const rec of records) {
      const match = String(rec[key] ?? '').replace(/"/g, '\\"');
      const existing: any = match ? await pb.collection(collection).getFirstListItem(`${key}="${match}"`).catch(() => null) : null;
      const form = new FormData();
      for (const [name, value] of Object.entries(rec)) {
        if (SYSTEM.has(name) || !known.has(name)) continue;
        if (fileFields.has(name)) {
          // Não reenvia arquivo que já existe: o PocketBase renomearia e quebraria URLs já geradas
          const has = existing?.[name];
          if (Array.isArray(has) ? has.length > 0 : !!has) continue;
          for (const filename of (Array.isArray(value) ? value : [value]).filter(Boolean) as string[]) {
            const blob = await downloadFile(rec, filename);
            if (blob) form.append(name, blob, filename);
          }
          continue;
        }
        let v: any = value;
        if (collection === 'feature_flags' && name === 'enabled' && rec.key in STAGING_FLAG_OVERRIDES) v = STAGING_FLAG_OVERRIDES[rec.key];
        form.append(name, v !== null && typeof v === 'object' ? JSON.stringify(v) : String(v ?? ''));
      }
      try {
        if (existing) {
          await pb.collection(collection).update(existing.id, form);
          updated++;
        } else {
          await pb.collection(collection).create(form);
          created++;
        }
      } catch (err: any) {
        console.warn(`  ! ${collection} ${match}:`, JSON.stringify(err?.response?.data || err?.message));
      }
    }
    console.log(`  ✓ ${collection}: ${created} criados, ${updated} atualizados`);
  }
  // Flags ligadas no staging (ex.: STAGING_FLAGS_ON=share,newsletter,projects,now_status,likes)
  const flagsOn = (process.env.STAGING_FLAGS_ON || '').split(',').map((f) => f.trim()).filter(Boolean);
  for (const key of flagsOn) {
    const found = await pb.collection('feature_flags').getFirstListItem(`key="${key}"`).catch(() => null);
    if (found) await pb.collection('feature_flags').update(found.id, { enabled: true });
    else await pb.collection('feature_flags').create({ key, enabled: true });
  }
  if (flagsOn.length) console.log(`  ✓ flags ligadas: ${flagsOn.join(', ')}`);

  console.log('Seed do staging concluído.');
}

main().catch((err) => {
  console.error('Falha no seed do staging:', err?.response || err);
  process.exit(1);
});
