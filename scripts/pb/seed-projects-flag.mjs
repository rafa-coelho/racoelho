// Cria a feature flag 'projects' (enabled=true) que ficou faltando,
// e verifica que ela é legível SEM autenticação (como o browser lê).
import dotenv from 'dotenv';
import PocketBase from 'pocketbase';
dotenv.config();

const url = process.env.PB_URL || process.env.NEXT_PUBLIC_PB_URL;

// 1. Cria/garante a flag (como admin)
const admin = new PocketBase(url);
await admin.admins.authWithPassword(process.env.PB_ADMIN_EMAIL, process.env.PB_ADMIN_PASSWORD);
try {
  const existing = await admin.collection('feature_flags').getFirstListItem("key='projects'");
  if (!existing.enabled) {
    await admin.collection('feature_flags').update(existing.id, { enabled: true });
    console.log("~ flag 'projects' existia desabilitada — habilitada agora.");
  } else {
    console.log("= flag 'projects' já existia habilitada.");
  }
} catch {
  await admin.collection('feature_flags').create({ key: 'projects', enabled: true, metadata: {} });
  console.log("+ flag 'projects' criada (enabled=true).");
}

// 2. Garante leitura pública da collection (list/view = ""), escrita continua restrita
const col = (await admin.collections.getList(1, 1, { filter: "name='feature_flags'" })).items[0];
if (col.listRule !== '' || col.viewRule !== '') {
  await admin.collections.update(col.id, { listRule: '', viewRule: '' });
  console.log('~ regras de leitura da feature_flags abertas (list/view = público).');
} else {
  console.log('= regras de leitura já eram públicas.');
}

// 3. Verifica leitura pública (cliente anônimo, igual ao browser)
const anon = new PocketBase(url);
try {
  const rec = await anon.collection('feature_flags').getFirstListItem("key='projects'");
  console.log(`✓ leitura anônima OK: projects.enabled = ${rec.enabled}`);
} catch (e) {
  console.error('✗ leitura anônima FALHOU — as regras da collection feature_flags não são públicas:', e?.status, e?.message);
  console.error('  Corrija: listRule/viewRule da collection feature_flags devem ser "" (público).');
  process.exit(1);
}
