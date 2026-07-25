// Publica/atualiza registros de projetos no PocketBase a partir de uma pasta de dados.
// Estrutura esperada: <dataDir>/<slug>/meta.json + content.md
// Uso: node _publish-projects-data.mjs <dataDir> [slug1 slug2 ...]
import dotenv from 'dotenv';
import PocketBase from 'pocketbase';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
dotenv.config();

const dataDir = process.argv[2];
const only = process.argv.slice(3);
if (!dataDir || !existsSync(dataDir)) {
  console.error('Uso: node _publish-projects-data.mjs <dataDir> [slugs...]');
  process.exit(1);
}

const pb = new PocketBase(process.env.PB_URL || process.env.NEXT_PUBLIC_PB_URL);
await pb.admins.authWithPassword(process.env.PB_ADMIN_EMAIL, process.env.PB_ADMIN_PASSWORD);

const dirs = readdirSync(dataDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .filter(name => only.length === 0 || only.includes(name));

let ok = 0, fail = 0;
for (const slug of dirs) {
  try {
    const meta = JSON.parse(readFileSync(join(dataDir, slug, 'meta.json'), 'utf-8'));
    const content = readFileSync(join(dataDir, slug, 'content.md'), 'utf-8');
    const payload = { ...meta, slug: meta.slug || slug, content };

    let existing = null;
    try {
      existing = await pb.collection('projects').getFirstListItem(`slug='${payload.slug}'`);
    } catch { /* não existe ainda */ }

    if (existing) {
      await pb.collection('projects').update(existing.id, payload);
      console.log(`~ atualizado: ${payload.slug}`);
    } else {
      await pb.collection('projects').create(payload);
      console.log(`+ criado:     ${payload.slug}`);
    }
    ok++;
  } catch (e) {
    fail++;
    console.error(`x falhou:     ${slug}:`, e?.response?.data || e.message);
  }
}
console.log(`\nConcluído: ${ok} ok, ${fail} falhas.`);
