import dotenv from 'dotenv';
import PocketBase, { RecordModel } from 'pocketbase';
dotenv.config();

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
    const pbUrl = process.env.NEXT_PUBLIC_PB_URL!;
    const adminEmail = process.env.NEXT_PUBLIC_PB_ADMIN_EMAIL!;
    const adminPass = process.env.NEXT_PUBLIC_PB_ADMIN_PASSWORD!;

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

    console.log('Migração concluída.');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});