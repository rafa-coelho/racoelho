/**
 * Migração do rebranding (FEATURES.md §2 e §5).
 *
 * - Só ADICIONA: campos novos (todos opcionais) nas collections existentes,
 *   collections novas e as feature flags novas (desligadas).
 * - Nunca remove nem altera campos existentes. Pode rodar quantas vezes quiser.
 * - Funciona com PocketBase >= 0.23 (`fields`) e com o formato antigo (`schema`).
 *
 * Uso: PB_URL=... PB_ADMIN_EMAIL=... PB_ADMIN_PASSWORD=... npm run pb:migrate:rebranding
 */
import dotenv from 'dotenv';
import PocketBase from 'pocketbase';
dotenv.config();

type Field = { name: string; type: string; [k: string]: any };

const REBRANDING_FLAGS: { key: string; description: string }[] = [
  { key: 'now_status', description: 'Card "Agora" na home (site_status)' },
  { key: 'reading_progress', description: 'Barra de progresso de leitura nos posts' },
  { key: 'likes', description: 'Curtir posts (post_likes)' },
  { key: 'challenge_progress', description: 'Progresso local e estados na trilha de desafios' },
  { key: 'challenge_submissions', description: 'Formulário de envio de solução de desafio' },
  { key: 'community_stats', description: 'Estatísticas do Discord em /comunidade' },
  { key: 'newsletter_archive', description: 'Arquivo de edições em /newsletter' },
  { key: 'mediakit', description: 'Página /mediakit para marcas' },
];

// Campos no formato novo (>= 0.23). `toLegacy` converte para o formato antigo.
const NEW_FIELDS: Record<string, Field[]> = {
  posts: [
    { name: 'featured', type: 'bool' },
    { name: 'likes', type: 'number', onlyInt: true, min: 0 },
  ],
  challenges: [
    { name: 'number', type: 'number', onlyInt: true, min: 0 },
    { name: 'difficulty', type: 'select', values: ['facil', 'medio', 'dificil'], maxSelect: 1 },
    { name: 'estimatedHours', type: 'number', min: 0 },
    { name: 'stack', type: 'json' },
    { name: 'deliverables', type: 'json' },
    { name: 'criteria', type: 'json' },
    { name: 'comingSoon', type: 'bool' },
  ],
  projects: [
    { name: 'kind', type: 'select', values: ['saas', 'open-source', 'ferramenta', 'experimento'], maxSelect: 1 },
    { name: 'icon', type: 'text', max: 60 },
    { name: 'accent', type: 'select', values: ['blue', 'green', 'amber'], maxSelect: 1 },
    { name: 'stage', type: 'select', values: ['live', 'wip', 'arquivado'], maxSelect: 1 },
    { name: 'stack', type: 'json' },
  ],
  setup_items: [
    { name: 'affiliate', type: 'bool' },
    { name: 'detail', type: 'text', max: 200 },
    { name: 'kind', type: 'select', values: ['hardware', 'software'], maxSelect: 1 },
    { name: 'order', type: 'number' },
  ],
};

const TIMESTAMPS: Field[] = [
  { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
  { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
];

type NewCollection = {
  name: string;
  fields: (ids: Record<string, string>) => Field[];
  rules: { listRule: string | null; viewRule: string | null; createRule: string | null; updateRule: string | null; deleteRule: string | null };
  indexes?: string[];
};

const ADMIN_ONLY = { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null };

const NEW_COLLECTIONS: NewCollection[] = [
  {
    name: 'site_status',
    fields: () => [
      { name: 'text', type: 'text', required: true, max: 120 },
      { name: 'active', type: 'bool' },
      { name: 'updatedAt', type: 'date' },
    ],
    rules: { ...ADMIN_ONLY, listRule: '', viewRule: '' },
  },
  {
    name: 'challenge_submissions',
    fields: (ids) => [
      { name: 'challenge', type: 'relation', required: true, collectionId: ids.challenges, maxSelect: 1, cascadeDelete: false },
      { name: 'name', type: 'text', required: true, max: 200 },
      { name: 'email', type: 'email', required: true },
      { name: 'repoUrl', type: 'url', required: true },
      { name: 'demoUrl', type: 'url' },
      { name: 'notes', type: 'text', max: 1000 },
      { name: 'status', type: 'select', values: ['new', 'reviewed', 'featured', 'rejected'], maxSelect: 1 },
      { name: 'reviewNote', type: 'text' },
    ],
    // criação só via API route (valida, honeypot, rate limit) autenticada como admin
    rules: ADMIN_ONLY,
  },
  {
    name: 'post_likes',
    fields: (ids) => [
      { name: 'post', type: 'relation', required: true, collectionId: ids.posts, maxSelect: 1, cascadeDelete: true },
      { name: 'viewerId', type: 'text', required: true, max: 64 },
      { name: 'sessionId', type: 'text', max: 128 },
    ],
    rules: ADMIN_ONLY,
    indexes: ['CREATE UNIQUE INDEX post_likes_post_viewer_idx ON post_likes (post, viewerId)'],
  },
  {
    name: 'mediakit',
    fields: () => [
      { name: 'headline', type: 'text' },
      { name: 'summary', type: 'text' },
      { name: 'channels', type: 'json' },
      { name: 'formats', type: 'json' },
      { name: 'featured', type: 'json' },
      { name: 'brands', type: 'json' },
      { name: 'process', type: 'json' },
      { name: 'principles', type: 'json' },
      { name: 'contactEmail', type: 'email' },
      { name: 'pdf', type: 'file', maxSelect: 1, maxSize: 20 * 1024 * 1024, mimeTypes: ['application/pdf'] },
      { name: 'availability', type: 'text' },
      { name: 'reviewed', type: 'bool' },
      { name: 'updatedAt', type: 'date' },
    ],
    rules: ADMIN_ONLY,
  },
  {
    name: 'community_stats',
    fields: () => [
      { name: 'members', type: 'number', onlyInt: true, min: 0 },
      { name: 'online', type: 'number', onlyInt: true, min: 0 },
      { name: 'channels', type: 'number', onlyInt: true, min: 0 },
      { name: 'fetchedAt', type: 'date', required: true },
    ],
    rules: ADMIN_ONLY,
  },
];

// Formato antigo (< 0.23): opções dentro de `options`, sem autodate.
function toLegacy(field: Field): Field | null {
  const { name, type, required, ...rest } = field;
  if (type === 'autodate') return null;
  const options: Record<string, any> = {};
  if (type === 'select') Object.assign(options, { values: rest.values, maxSelect: rest.maxSelect ?? 1 });
  if (type === 'relation') Object.assign(options, { collectionId: rest.collectionId, maxSelect: rest.maxSelect ?? 1, cascadeDelete: !!rest.cascadeDelete });
  if (type === 'file') Object.assign(options, { maxSelect: rest.maxSelect ?? 1, maxSize: rest.maxSize, mimeTypes: rest.mimeTypes || [] });
  if (type === 'text' && rest.max) options.max = rest.max;
  if (type === 'number') Object.assign(options, { min: rest.min ?? null, noDecimal: !!rest.onlyInt });
  return { name, type, required: !!required, options };
}

async function main() {
  const pbUrl = process.env.PB_URL || process.env.NEXT_PUBLIC_PB_URL;
  const email = process.env.PB_ADMIN_EMAIL;
  const password = process.env.PB_ADMIN_PASSWORD;
  if (!pbUrl || !email || !password) throw new Error('PB_URL, PB_ADMIN_EMAIL e PB_ADMIN_PASSWORD são obrigatórios');

  const pb = new PocketBase(pbUrl);
  pb.autoCancellation(false);
  await pb.admins.authWithPassword(email, password);

  const all = await pb.collections.getFullList();
  const byName = new Map(all.map((c: any) => [c.name, c]));
  const legacy = all.length > 0 && !Array.isArray((all[0] as any).fields);
  console.log(`PocketBase em ${pbUrl} — formato ${legacy ? 'antigo (schema)' : 'novo (fields)'}`);

  const listKey = legacy ? 'schema' : 'fields';
  const convert = (fields: Field[]) => (legacy ? (fields.map(toLegacy).filter(Boolean) as Field[]) : fields);

  // 1) campos novos nas collections existentes
  for (const [name, fields] of Object.entries(NEW_FIELDS)) {
    const col: any = byName.get(name);
    if (!col) {
      console.warn(`  ! collection ${name} não existe — pulando`);
      continue;
    }
    const current: Field[] = col[listKey] || [];
    const existing = new Set(current.map((f) => f.name));
    const missing = convert(fields).filter((f) => !existing.has(f.name));

    // Select que já existe (ex.: challenges.difficulty com easy/medium/hard em produção):
    // acrescenta os valores novos sem remover os antigos.
    const widened: string[] = [];
    const merged = current.map((f: any) => {
      const want = fields.find((w) => w.name === f.name && w.type === 'select');
      if (!want || f.type !== 'select') return f;
      const values: string[] = legacy ? f.options?.values || [] : f.values || [];
      const extra = (want.values as string[]).filter((v) => !values.includes(v));
      if (extra.length === 0) return f;
      widened.push(`${f.name} (+${extra.join(', ')})`);
      return legacy ? { ...f, options: { ...f.options, values: [...values, ...extra] } } : { ...f, values: [...values, ...extra] };
    });

    if (missing.length === 0 && widened.length === 0) {
      console.log(`  = ${name}: nada a adicionar`);
      continue;
    }
    await pb.collections.update(col.id, { [listKey]: [...merged, ...missing] });
    if (missing.length) console.log(`  + ${name}: ${missing.map((f) => f.name).join(', ')}`);
    if (widened.length) console.log(`  + ${name}: valores ${widened.join('; ')}`);
  }

  // 2) collections novas
  const ids: Record<string, string> = Object.fromEntries(all.map((c: any) => [c.name, c.id]));
  for (const def of NEW_COLLECTIONS) {
    if (byName.has(def.name)) {
      console.log(`  = ${def.name}: já existe`);
      continue;
    }
    const fields = def.fields(ids);
    const created = await pb.collections.create({
      name: def.name,
      type: 'base',
      [listKey]: convert(legacy ? fields : [...fields, ...TIMESTAMPS]),
      indexes: def.indexes || [],
      ...def.rules,
    });
    ids[def.name] = created.id;
    console.log(`  + collection ${def.name}`);
  }

  // 3) feature flags novas, desligadas
  for (const flag of REBRANDING_FLAGS) {
    const found = await pb.collection('feature_flags').getFirstListItem(`key="${flag.key}"`).catch(() => null);
    if (found) {
      console.log(`  = flag ${flag.key}: já existe (enabled=${found.enabled})`);
      continue;
    }
    await pb.collection('feature_flags').create({ key: flag.key, enabled: false, description: flag.description });
    console.log(`  + flag ${flag.key} (desligada)`);
  }

  console.log('Migração do rebranding concluída.');
}

main().catch((err) => {
  console.error('Falha na migração do rebranding:', err?.response || err);
  process.exit(1);
});
