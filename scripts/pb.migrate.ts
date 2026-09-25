import dotenv from 'dotenv';
import PocketBase, { RecordModel } from 'pocketbase';
dotenv.config();

// PocketBase >= 0.23 trocou `schema` (opções aninhadas) por `fields` (opções no nível do campo)
// e deixou de criar created/updated automaticamente. Detectado uma vez por execução.
let newFormat: boolean | null = null;

async function detectFormat(pb: PocketBase): Promise<boolean> {
  if (newFormat !== null) return newFormat;
  const list = await pb.collections.getList(1, 1).catch(() => null);
  const sample: any = list?.items?.[0];
  // sem collections: assume o formato novo se o servidor tem a collection _superusers
  newFormat = sample ? Array.isArray(sample.fields) : !!(await pb.collections.getOne('_superusers').catch(() => null));
  return newFormat;
}

function toFields(schema: any[] = []): any[] {
  return schema.map(({ name, type, required, options = {} }) => {
    const field: any = { name, type, required: !!required };
    if (type === 'select') Object.assign(field, { values: options.values || [], maxSelect: options.maxSelect ?? 1 });
    else if (type === 'file') Object.assign(field, { maxSelect: options.maxSelect ?? 1, maxSize: options.maxSize ?? 5242880, mimeTypes: options.mimeTypes || [] });
    else if (type === 'relation') Object.assign(field, { collectionId: options.collectionId, maxSelect: options.maxSelect ?? 1, cascadeDelete: !!options.cascadeDelete });
    // max 0 no PocketBase novo = limite padrão de 5000 caracteres; conteúdo de post passa disso
    else if (type === 'text') Object.assign(field, { min: options.min ?? 0, max: options.max || TEXT_MAX, pattern: options.pattern ?? '' });
    return field;
  });
}

const TEXT_MAX = 1_000_000;

const TIMESTAMPS = [
  { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
  { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
];

async function ensureCollection(pb: PocketBase, name: string, payload: any) {
    const exists = await pb.collections.getList(1, 1, { filter: `name="${name}"` })
        .then(r => r.items?.length > 0)
        .catch(() => false);

  // Aplica em 2 passos para evitar erro de regra referenciando campos ainda não criados
  const rules = {
    listRule: payload.listRule ?? null,
    viewRule: payload.viewRule ?? null,
    createRule: payload.createRule ?? null,
    updateRule: payload.updateRule ?? null,
    deleteRule: payload.deleteRule ?? null,
  };

  if (await detectFormat(pb)) {
    // Formato novo: só adiciona campos que faltam (nunca remove nem altera os existentes)
    const { schema, ...rest } = payload;
    const wanted = toFields(schema);
    if (exists) {
      const col: any = (await pb.collections.getList(1, 1, { filter: `name="${name}"` })).items[0];
      const have = new Set((col.fields || []).map((f: any) => f.name));
      const missing = [...wanted, ...TIMESTAMPS].filter((f) => !have.has(f.name));
      // Só aumenta limites de texto que ficaram no padrão (0/5000); nunca reduz nem altera tipo
      let raised = false;
      const current = (col.fields || []).map((f: any) => {
        const w = wanted.find((x) => x.name === f.name);
        if (w && f.type === 'text' && w.type === 'text' && (!f.max || f.max <= 5000) && w.max > (f.max || 5000)) {
          raised = true;
          return { ...f, max: w.max };
        }
        return f;
      });
      if (missing.length || raised) await pb.collections.update(col.id, { fields: [...current, ...missing] });
    } else {
      const created = await pb.collections.create({ ...rest, listRule: null, viewRule: null, fields: [...wanted, ...TIMESTAMPS] });
      await pb.collections.update(created.id, { listRule: rules.listRule, viewRule: rules.viewRule });
    }
    return;
  }

  const basePayload = { ...payload, listRule: null, viewRule: null, createRule: rules.createRule ?? null, updateRule: rules.updateRule ?? null, deleteRule: rules.deleteRule ?? null };

  if (exists) {
    const col = (await pb.collections.getList(1, 1, { filter: `name="${name}"` })).items[0];
    await pb.collections.update(col.id, basePayload); // atualiza schema sem regras de leitura/visualização
    await pb.collections.update(col.id, { listRule: rules.listRule, viewRule: rules.viewRule }); // aplica regras após schema
  } else {
    const created = await pb.collections.create(basePayload);
    await pb.collections.update(created.id, { listRule: rules.listRule, viewRule: rules.viewRule });
  }
}

async function main() {
    const pbUrl = process.env.PB_URL || process.env.NEXT_PUBLIC_PB_URL!;
    newFormat = null;
    const adminEmail = process.env.PB_ADMIN_EMAIL!;
    const adminPass = process.env.PB_ADMIN_PASSWORD!;

    const pb = new PocketBase(pbUrl);
    await pb.admins.authWithPassword(adminEmail, adminPass);

    // posts
    await ensureCollection(pb, 'posts', {
        name: 'posts',
        type: 'base',
        schema: [
            { name: 'title', type: 'text', required: true },
            { name: 'slug', type: 'text', required: true, options: { min: 1, max: 200, pattern: '' } },
            { name: 'excerpt', type: 'text' },
            { name: 'content', type: 'text' },
            { name: 'coverImage', type: 'file', options: { maxSelect: 1 } },
            { name: 'tags', type: 'json' },
            { name: 'date', type: 'date' },
            { name: 'status', type: 'select', options: { values: ['draft', 'published'] } },
            { name: 'readingTime', type: 'number' },
            // opcional: relation para users
            // { name: 'author', type: 'relation', options: { collectionId: '_pb_users_auth_' } },
        ],
        listRule: "status = 'published' || @request.auth.id != ''",
        viewRule: "status = 'published' || @request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        indexes: [
            'CREATE UNIQUE INDEX posts_slug_idx ON posts (slug)',
        ],
    });

    // feature_flags
    await ensureCollection(pb, 'feature_flags', {
        name: 'feature_flags',
        type: 'base',
        schema: [
            { name: 'key', type: 'text', required: true },
            { name: 'enabled', type: 'bool' },
            { name: 'metadata', type: 'json' },
        ],
        listRule: null,
        viewRule: null,
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        indexes: [
            'CREATE UNIQUE INDEX ff_key_idx ON feature_flags (key)',
        ],
    });

    // challenges
    await ensureCollection(pb, 'challenges', {
        name: 'challenges',
        type: 'base',
        schema: [
            { name: 'title', type: 'text', required: true },
            { name: 'slug', type: 'text', required: true },
            { name: 'excerpt', type: 'text' },
            { name: 'content', type: 'text' },
            { name: 'coverImage', type: 'file', options: { maxSelect: 1 } },
            { name: 'tags', type: 'json' },
            { name: 'difficulty', type: 'select', options: { values: ['easy', 'medium', 'hard'] } },
            { name: 'status', type: 'select', options: { values: ['draft', 'published'] } },
            { name: 'date', type: 'date' },
        ],
        listRule: "status = 'published' || @request.auth.id != ''",
        viewRule: "status = 'published' || @request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        indexes: [
            'CREATE UNIQUE INDEX challenges_slug_idx ON challenges (slug)'
        ],
    });

    // projects (portfólio)
    await ensureCollection(pb, 'projects', {
        name: 'projects',
        type: 'base',
        schema: [
            { name: 'title', type: 'text', required: true },
            { name: 'slug', type: 'text', required: true },
            { name: 'excerpt', type: 'text' },
            { name: 'content', type: 'text' },
            { name: 'coverImage', type: 'file', options: { maxSelect: 1 } },
            { name: 'tags', type: 'json' },
            { name: 'role', type: 'text' },
            { name: 'repoUrl', type: 'text' },
            { name: 'liveUrl', type: 'text' },
            { name: 'featured', type: 'bool' },
            { name: 'order', type: 'number' },
            { name: 'status', type: 'select', options: { values: ['draft', 'published'] } },
            { name: 'date', type: 'date' },
        ],
        listRule: "status = 'published' || @request.auth.id != ''",
        viewRule: "status = 'published' || @request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        indexes: [
            'CREATE UNIQUE INDEX projects_slug_idx ON projects (slug)'
        ],
    });

    // sales_pages
    await ensureCollection(pb, 'sales_pages', {
        name: 'sales_pages',
        type: 'base',
        schema: [
            { name: 'title', type: 'text', required: true },
            { name: 'slug', type: 'text', required: true },
            { name: 'blocks', type: 'json' },
            { name: 'ctaText', type: 'text' },
            { name: 'ctaUrl', type: 'text' },
            { name: 'paymentUrl', type: 'text' },
            { name: 'status', type: 'select', options: { values: ['draft', 'published'] } },
        ],
        listRule: "status = 'published' || @request.auth.id != ''",
        viewRule: "status = 'published' || @request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        indexes: [
            'CREATE UNIQUE INDEX sales_pages_slug_idx ON sales_pages (slug)'
        ],
    });

    // ads (novo schema)
    await ensureCollection(pb, 'ads', {
        name: 'ads',
        type: 'base',
        schema: [
            { name: 'title', type: 'text', required: true },
            { name: 'status', type: 'select', required: true, options: { values: ['draft', 'active', 'paused', 'archived'] } },
            { name: 'targets', type: 'select', required: true, options: { values: ['posts', 'challenges'], maxSelect: 2 } },
            { name: 'priority', type: 'number' },
            { name: 'startAt', type: 'date' },
            { name: 'endAt', type: 'date' },
            { name: 'clickUrl', type: 'text', required: true },
            { name: 'utmSource', type: 'text' },
            { name: 'utmCampaign', type: 'text' },
            { name: 'utmMedium', type: 'text' },
            { name: 'notes', type: 'text' },
            { name: 'creative_leaderboard', type: 'file', options: { maxSelect: 1 } },
            { name: 'creative_rectangle', type: 'file', options: { maxSelect: 1 } },
            { name: 'creative_skyscraper', type: 'file', options: { maxSelect: 1 } },
            { name: 'creative_square', type: 'file', options: { maxSelect: 1 } },
            { name: 'creative_mobile_banner', type: 'file', options: { maxSelect: 1 } },
        ],
        listRule: null,
        viewRule: null,
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        indexes: [
            'CREATE INDEX ads_status_idx ON ads (status)',
            'CREATE INDEX ads_priority_idx ON ads (priority)'
        ],
    });

    // Backfill básico de registros existentes (se vierem do schema antigo)
    try {
        const adsList = await pb.collection('ads').getList(1, 200);
        for (const rec of adsList.items) {
            const updates: any = {};
            if (typeof (rec as any).position === 'string') {
                const pos: string = (rec as any).position;
                if (pos.startsWith('post:')) updates.targets = ['posts'];
                else if (pos.startsWith('challenge:')) updates.targets = ['challenges'];
            }
            if ((rec as any).link && !(rec as any).clickUrl) updates.clickUrl = (rec as any).link;
            if ((rec as any).image) {
                // move imagem antiga para rectangle por padrão
                updates.creative_rectangle = (rec as any).image;
            }
            if (Object.keys(updates).length > 0) {
                await pb.collection('ads').update(rec.id, updates);
            }
        }
    } catch (e) {
        console.warn('Backfill de ads não aplicado:', e);
    }

    // setup_items
    await ensureCollection(pb, 'setup_items', {
        name: 'setup_items',
        type: 'base',
        schema: [
            { name: 'name', type: 'text', required: true },
            { name: 'category', type: 'text' },
            { name: 'description', type: 'text' },
            { name: 'image', type: 'file', options: { maxSelect: 1 } },
            { name: 'url', type: 'text' },
            { name: 'price', type: 'text' },
            { name: 'order', type: 'number' },
        ],
        listRule: null,
        viewRule: null,
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
    });

    // social_links
    await ensureCollection(pb, 'social_links', {
        name: 'social_links',
        type: 'base',
        schema: [
            { name: 'name', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
            { name: 'icon', type: 'text' },
            { name: 'order', type: 'number' },
        ],
        listRule: null,
        viewRule: null,
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        indexes: [
            'CREATE INDEX social_order_idx ON social_links (order)'
        ],
    });

    // link_items (para /links)
    await ensureCollection(pb, 'link_items', {
        name: 'link_items',
        type: 'base',
        schema: [
            { name: 'title', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
            { name: 'description', type: 'text' },
            { name: 'type', type: 'select', options: { values: ['link', 'highlight'] } },
            { name: 'icon', type: 'text' },
            { name: 'image', type: 'file', options: { maxSelect: 1 } },
            { name: 'order', type: 'number' },
        ],
        listRule: null,
        viewRule: null,
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        indexes: [
            'CREATE INDEX link_items_order_idx ON link_items (order)'
        ],
    });

    // asset_packs
    await ensureCollection(pb, 'asset_packs', {
        name: 'asset_packs',
        type: 'base',
        schema: [
            { name: 'slug', type: 'text', required: true, options: { min: 1, max: 200, pattern: '' } },
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'text' },
            { name: 'files', type: 'file', options: { maxSelect: 10 } },
            { name: 'metadata', type: 'json' },
            { name: 'status', type: 'select', options: { values: ['draft', 'published'] } },
        ],
        listRule: "status = 'published' || @request.auth.id != ''",
        viewRule: "status = 'published' || @request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        indexes: [
            'CREATE UNIQUE INDEX asset_packs_slug_idx ON asset_packs (slug)'
        ],
    });

    // access_tokens (genérico para downloads/acessos protegidos)
    await ensureCollection(pb, 'access_tokens', {
        name: 'access_tokens',
        type: 'base',
        schema: [
            { name: 'email', type: 'text', required: true },
            { name: 'name', type: 'text' },
            { name: 'slug', type: 'text', required: true },
            { name: 'valid', type: 'bool' },
            { name: 'expiresAt', type: 'date' },
            { name: 'meta', type: 'json' },
        ],
        listRule: null,
        viewRule: null,
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        indexes: [
            'CREATE INDEX access_tokens_email_slug_idx ON access_tokens (email, slug)'
        ],
    });

    // job_referrals (indicações de candidatos vindas de /vagas)
    await ensureCollection(pb, 'job_referrals', {
        name: 'job_referrals',
        type: 'base',
        schema: [
            { name: 'vagaSlug', type: 'text', required: true },
            { name: 'vagaTitle', type: 'text', required: true },
            { name: 'referralId', type: 'text' },
            { name: 'candidateName', type: 'text', required: true },
            { name: 'candidateEmail', type: 'text', required: true },
            { name: 'linkedinUrl', type: 'text' },
            { name: 'phone', type: 'text' },
            { name: 'cv', type: 'file', options: { maxSelect: 1, maxSize: 10485760 } },
            { name: 'status', type: 'select', options: { values: ['new', 'submitted', 'archived'] } },
        ],
        // Regras: só admin lê/gerencia. A criação é feita pelo server (admin auth),
        // por isso createRule também exige auth — o público NÃO escreve direto no PB.
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        indexes: [
            'CREATE INDEX job_referrals_vaga_idx ON job_referrals (vagaSlug)',
            'CREATE INDEX job_referrals_created_idx ON job_referrals (created)',
        ],
    });

    // Seed da feature flag 'projects' (habilitada por padrão)
    try {
        await pb.collection('feature_flags').getFirstListItem("key='projects'");
    } catch {
        await pb.collection('feature_flags').create({ key: 'projects', enabled: true, metadata: {} });
        console.log("Feature flag 'projects' criada (enabled=true).");
    }

    console.log('Migração concluída.');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});