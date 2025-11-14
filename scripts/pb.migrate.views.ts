import dotenv from 'dotenv';
import PocketBase from 'pocketbase';
dotenv.config();

async function ensureCollection(pb: PocketBase, name: string, payload: any, recreate = false) {
    const existingList = await pb.collections.getList(1, 1, { filter: `name="${name}"` })
        .catch(() => ({ items: [] }));
    
    const exists = existingList.items?.length > 0;

  // Define as regras de permissão
  const rules = {
    listRule: payload.listRule ?? null,
    viewRule: payload.viewRule ?? null,
    createRule: payload.createRule ?? null,
    updateRule: payload.updateRule ?? null,
    deleteRule: payload.deleteRule ?? null,
  };
  
  // Payload completo com todas as regras
  const fullPayload = { ...payload, ...rules };
  
  console.log(`   📦 Payload schema fields: ${fullPayload.schema?.length || 0}`);

  if (exists && recreate) {
    const col = existingList.items[0];
    console.log(`   Deleting existing empty collection: ${name} (id: ${col.id})`);
    await pb.collections.delete(col.id);
    console.log(`   Creating fresh collection: ${name} with ${payload.schema?.length || 0} fields`);
    const created = await pb.collections.create(fullPayload);
    console.log(`   ✓ Created - Response schema fields: ${created.schema?.length || 0}`);
    if (created.schema && created.schema.length > 0) {
      console.log(`   ✓ Fields: ${created.schema.map((f: any) => f.name).join(', ')}`);
    }
    console.log(`   ✓ createRule: ${created.createRule === null ? 'null (PUBLIC ✅)' : created.createRule || 'undefined'}`);
  } else if (exists) {
    const col = existingList.items[0];
    console.log(`   Updating existing collection: ${name} (id: ${col.id})`);
    const updated = await pb.collections.update(col.id, fullPayload);
    console.log(`   ✓ Schema fields: ${updated.schema?.length || 0}`);
    console.log(`   ✓ createRule: ${updated.createRule === null ? 'null (PUBLIC ✅)' : updated.createRule === '' ? 'empty string (PUBLIC ✅)' : updated.createRule || 'undefined'}`);
    console.log(`   ✓ listRule: ${updated.listRule === null ? 'null (PUBLIC ✅)' : updated.listRule === '' ? 'empty string (PUBLIC ✅)' : updated.listRule || 'undefined'}`);
  } else {
    console.log(`   Creating new collection: ${name}`);
    const created = await pb.collections.create(fullPayload);
    console.log(`   ✓ Created with ${created.schema?.length || 0} fields`);
    console.log(`   ✓ createRule: ${created.createRule === null ? 'null (PUBLIC ✅)' : created.createRule === '' ? 'empty (PUBLIC ✅)' : created.createRule || 'undefined'}`);
  }
}

async function main() {
    const pbUrl = process.env.PB_URL || process.env.NEXT_PUBLIC_PB_URL!;
    const adminEmail = process.env.PB_ADMIN_EMAIL!;
    const adminPass = process.env.PB_ADMIN_PASSWORD!;

    const pb = new PocketBase(pbUrl);
    await pb.admins.authWithPassword(adminEmail, adminPass);

    console.log('🚀 Creating post_views collection...');
    
    // post_views - RECRIA se existir vazia (schema.length === 0)
    await ensureCollection(pb, 'post_views', {
        name: 'post_views',
        type: 'base',
        schema: [
            { name: 'postId', type: 'text', required: true },
            { name: 'sessionId', type: 'text', required: true },
            { name: 'viewerId', type: 'text', required: true },
            { name: 'ip', type: 'text', required: true },
            { name: 'userAgent', type: 'text', required: true },
            { name: 'country', type: 'text' },
            { name: 'city', type: 'text' },
            { name: 'device', type: 'text' }, // mobile, tablet, desktop
            { name: 'browser', type: 'text' }, // chrome, safari, firefox, etc
            { name: 'os', type: 'text' }, // windows, macos, linux, android, ios
        ],
        // PERMISSÕES PÚBLICAS - Importante para tracking funcionar
        listRule: null,      // Qualquer um pode listar (necessário para analytics)
        viewRule: null,      // Qualquer um pode ver registros individuais
        createRule: null,    // Qualquer um pode criar (API pública de tracking)
        updateRule: null,    // Ninguém pode atualizar
        deleteRule: "@request.auth.id != ''", // Apenas usuários autenticados (admin) podem deletar
    }, true); // true = recriar se existir vazia

    console.log('✅ post_views collection created/updated with public permissions!');
    console.log('🚀 Creating challenge_views collection...');

    // challenge_views - RECRIA se existir vazia
    await ensureCollection(pb, 'challenge_views', {
        name: 'challenge_views',
        type: 'base',
        schema: [
            { name: 'challengeId', type: 'text', required: true },
            { name: 'sessionId', type: 'text', required: true },
            { name: 'viewerId', type: 'text', required: true },
            { name: 'ip', type: 'text', required: true },
            { name: 'userAgent', type: 'text', required: true },
            { name: 'country', type: 'text' },
            { name: 'city', type: 'text' },
            { name: 'device', type: 'text' },
            { name: 'browser', type: 'text' },
            { name: 'os', type: 'text' },
        ],
        // PERMISSÕES PÚBLICAS - Importante para tracking funcionar
        listRule: null,      // Qualquer um pode listar
        viewRule: null,      // Qualquer um pode ver
        createRule: null,    // Qualquer um pode criar (API pública de tracking)
        updateRule: null,    // Ninguém pode atualizar
        deleteRule: "@request.auth.id != ''", // Apenas admin pode deletar
    }, true); // true = recriar se existir vazia

    console.log('✅ challenge_views collection created/updated with public permissions!');
    console.log('🎉 All views collections created successfully!');
    console.log('\n⚠️  IMPORTANTE: Verifique as permissões no PocketBase Admin UI:');
    console.log('   - post_views e challenge_views devem ter createRule = null (vazio)');
    console.log('   - Isso permite que a API pública registre views sem autenticação');
}

main().catch(console.error);
