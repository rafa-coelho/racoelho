import dotenv from 'dotenv';
import PocketBase from 'pocketbase';
dotenv.config();

const pb = new PocketBase(process.env.PB_URL || process.env.NEXT_PUBLIC_PB_URL);
await pb.admins.authWithPassword(process.env.PB_ADMIN_EMAIL, process.env.PB_ADMIN_PASSWORD);

const list = await pb.collection('projects').getFullList({ sort: '-featured,order' });
console.log(`Total: ${list.length} projetos\n`);
for (const p of list) {
  const mermaids = (p.content.match(/```mermaid/g) || []).length;
  console.log(`${p.featured ? '⭐' : '  '} #${p.order} ${p.slug} | ${p.status} | content=${p.content.length} chars | mermaid=${mermaids} | tags=${(p.tags||[]).length}`);
}

const z = list.find(p => p.slug === 'zumbicho');
console.log('\n--- zumbicho: primeiros 300 chars ---');
console.log(z.content.slice(0, 300));
