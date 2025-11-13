import dotenv from 'dotenv';
import PocketBase from 'pocketbase';
dotenv.config();

async function recreateCollection(pb: PocketBase, name: string, payload: any) {
  try {
    // Tenta encontrar a collection existente
    const existingList = await pb.collections.getList(1, 1, { filter: `name="${name}"` })
      .catch(() => ({ items: [] }));
    
    // Se existir, deleta
    if (existingList.items?.length > 0) {
      const col = existingList.items[0];
      console.log(`   🗑️  Deletando collection existente: ${name} (id: ${col.id})`);
      await pb.collections.delete(col.id);
      console.log(`   ✅ Collection deletada com sucesso`);
    }
    
    // Cria do zero
    console.log(`   🆕 Criando nova collection: ${name}`);
    const created = await pb.collections.create(payload);
    
    console.log(`   ✅ Collection criada com ID: ${created.id}`);
    console.log(`   📊 Campos: ${created.schema?.map((f: any) => f.name).join(', ') || 'nenhum'}`);
    console.log(`   🔓 createRule: ${created.createRule === null ? 'PUBLIC (null)' : created.createRule || 'vazio'}`);
    console.log(`   🔓 listRule: ${created.listRule === null ? 'PUBLIC (null)' : created.listRule || 'vazio'}`);
    
  } catch (error: any) {
    console.error(`   ❌ Erro ao recriar collection ${name}:`, error.message);
    throw error;
  }
}

async function main() {
  const pbUrl = process.env.PB_URL || process.env.NEXT_PUBLIC_PB_URL!;
  const adminEmail = process.env.PB_ADMIN_EMAIL!;
  const adminPass = process.env.PB_ADMIN_PASSWORD!;

  console.log('🚀 Conectando ao PocketBase...');
  const pb = new PocketBase(pbUrl);
  
  try {
    await pb.admins.authWithPassword(adminEmail, adminPass);
    console.log('✅ Autenticado como admin\n');
  } catch (error) {
    console.error('❌ Falha na autenticação:', error);
    process.exit(1);
  }

  console.log('📝 Recriando collection: post_views');
  await recreateCollection(pb, 'post_views', {
    name: 'post_views',
    type: 'base',
    schema: [
      { name: 'postId', type: 'text', required: true },
      { name: 'sessionId', type: 'text', required: true },
      { name: 'viewerId', type: 'text', required: true },
      { name: 'ip', type: 'text', required: true },
      { name: 'userAgent', type: 'text', required: true },
      { name: 'country', type: 'text', required: false },
      { name: 'city', type: 'text', required: false },
      { name: 'device', type: 'text', required: false },
      { name: 'browser', type: 'text', required: false },
      { name: 'os', type: 'text', required: false },
    ],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: "@request.auth.id != ''",
  });

  console.log('\n📝 Recriando collection: challenge_views');
  await recreateCollection(pb, 'challenge_views', {
    name: 'challenge_views',
    type: 'base',
    schema: [
      { name: 'challengeId', type: 'text', required: true },
      { name: 'sessionId', type: 'text', required: true },
      { name: 'viewerId', type: 'text', required: true },
      { name: 'ip', type: 'text', required: true },
      { name: 'userAgent', type: 'text', required: true },
      { name: 'country', type: 'text', required: false },
      { name: 'city', type: 'text', required: false },
      { name: 'device', type: 'text', required: false },
      { name: 'browser', type: 'text', required: false },
      { name: 'os', type: 'text', required: false },
    ],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: "@request.auth.id != ''",
  });

  console.log('\n🎉 Collections recriadas com sucesso!');
  console.log('\n⚠️  AVISO: Dados anteriores foram DELETADOS!');
  console.log('   Se você tinha views registradas, elas foram perdidas.');
  console.log('   Novos registros serão criados conforme o site for acessado.\n');
}

main().catch(console.error);
