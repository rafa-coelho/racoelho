// Gera src/data/vagas.json a partir de:
//   1. O dump do sistema de referral (fonte da VERDADE de QUAIS vagas exibir)
//   2. A API pública do Ashby (fonte do CONTEÚDO: descrição, local, área)
//
// As duas fontes são cruzadas por TÍTULO (os ids são de sistemas diferentes e
// não batem). Vagas do dump que não existem no Ashby ainda são incluídas, com
// enriched=false e descrição vazia — pois é possível indicar candidatos a elas.
//
// Uso:
//   npm run generate:vagas -- ./caminho/para/dump.json
//   (sem argumento, usa scripts/data/referral-dump.json se existir)

import fs from 'fs';
import path from 'path';
import { parseReferralDump, DumpJob } from './lib/dump-parser';
import { extractTechs } from './lib/tech-extractor';

const ASHBY_BOARD = 'truelogic';
const ASHBY_API = `https://api.ashbyhq.com/posting-api/job-board/${ASHBY_BOARD}?includeCompensation=true`;

interface AshbyJob {
  id: string;
  title: string;
  department?: string;
  team?: string;
  employmentType?: string;
  location?: string;
  secondaryLocations?: { location?: string }[];
  isRemote?: boolean;
  workplaceType?: string;
  descriptionHtml?: string;
  descriptionPlain?: string;
  publishedAt?: string;
}

// Mesma normalização de título usada para o cruzamento entre as fontes.
function normTitle(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[–—]/g, '-') // normaliza travessões (– —) para hífen
    .trim();
}

function slugify(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove acentos (marcas diacríticas)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function fetchAshbyJobs(): Promise<AshbyJob[]> {
  const res = await fetch(ASHBY_API, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    throw new Error(`Ashby API retornou HTTP ${res.status}`);
  }
  const data = await res.json();
  return (data.jobs || []) as AshbyJob[];
}

function resolveDumpPath(): string {
  const arg = process.argv[2];
  if (arg) return path.resolve(process.cwd(), arg);
  return path.join(process.cwd(), 'scripts', 'data', 'referral-dump.json');
}

async function generate(): Promise<void> {
  const dumpPath = resolveDumpPath();

  if (!fs.existsSync(dumpPath)) {
    console.error(`\n✗ Dump não encontrado em: ${dumpPath}`);
    console.error('  Passe o caminho: npm run generate:vagas -- ./meu-dump.json');
    console.error('  Ou salve o dump em scripts/data/referral-dump.json\n');
    process.exit(1);
  }

  console.log(`→ Lendo dump: ${dumpPath}`);
  const dumpRaw = fs.readFileSync(dumpPath, 'utf8');
  const dumpJobs: DumpJob[] = parseReferralDump(dumpRaw);
  console.log(`  ${dumpJobs.length} vagas habilitadas no dump`);

  console.log(`→ Buscando conteúdo no Ashby (${ASHBY_BOARD})...`);
  const ashbyJobs = await fetchAshbyJobs();
  console.log(`  ${ashbyJobs.length} vagas públicas no Ashby`);

  // Ashby publica a MESMA vaga várias vezes, uma por localização. Agrupamos
  // TODAS as cópias por título para juntar o conjunto completo de localizações.
  const ashbyByTitle = new Map<string, AshbyJob[]>();
  for (const j of ashbyJobs) {
    const key = normTitle(j.title);
    const arr = ashbyByTitle.get(key) || [];
    arr.push(j);
    ashbyByTitle.set(key, arr);
  }

  // Preserva traduções já feitas (descriptionPtBr) entre regerações, casando por título.
  const prevOut = path.join(process.cwd(), 'src', 'data', 'vagas.json');
  const prevPtByTitle = new Map<string, string>();
  if (fs.existsSync(prevOut)) {
    try {
      const prev = JSON.parse(fs.readFileSync(prevOut, 'utf8')) as any[];
      for (const p of prev) {
        if (p.descriptionPtBr) prevPtByTitle.set(normTitle(p.title), p.descriptionPtBr);
      }
    } catch {
      /* ignora arquivo anterior inválido */
    }
  }

  const usedSlugs = new Set<string>();
  const notEnriched: string[] = [];

  const vagas = dumpJobs.map((d) => {
    const copies = ashbyByTitle.get(normTitle(d.title)) || [];
    const match = copies[0]; // referência para conteúdo (descrição etc.)

    // slug único (evita colisão entre títulos parecidos)
    let slug = slugify(d.title);
    let n = 2;
    while (usedSlugs.has(slug)) slug = `${slugify(d.title)}-${n++}`;
    usedSlugs.add(slug);

    if (!match) notEnriched.push(d.title);

    // Junta TODAS as localizações de todas as cópias (principal + secundárias)
    const locSet = new Set<string>();
    for (const c of copies) {
      if (c.location) locSet.add(c.location.trim());
      for (const s of c.secondaryLocations || []) {
        if (s.location) locSet.add(s.location.trim());
      }
    }
    const allLocations = Array.from(locSet).sort();

    // "Aceita Brasil?" — se Brazil/São Paulo estiver entre as localizações,
    // ou se for uma vaga LatAm/aberta ampla (sem país específico).
    const locHay = allLocations.map((l) => l.toLowerCase());
    const hasBrazil = locHay.some((l) => l.includes('brazil') || l.includes('brasil') || l.includes('são paulo') || l.includes('sao paulo'));
    const isBroadLatam = locHay.some((l) => l === 'latam' || l.includes('latin'));
    const acceptsBrazil = hasBrazil || isBroadLatam;

    // Tecnologias: extraídas do título + descrição (Ashby não traz tags)
    const techSource = `${d.title} ${match?.descriptionPlain || ''}`;
    const tags = extractTechs(techSource);

    return {
      referralId: d.id,
      slug,
      title: d.title,
      department: match?.department,
      location: match?.location,
      allLocations,
      acceptsBrazil,
      tags,
      employmentType: match?.employmentType,
      isRemote: match?.isRemote,
      workplaceType: match?.workplaceType,
      descriptionHtml: match?.descriptionHtml || '',
      descriptionPlain: match?.descriptionPlain || '',
      descriptionPtBr: prevPtByTitle.get(normTitle(d.title)) || '',
      publishedAt: match?.publishedAt,
      enriched: Boolean(match),
    };
  });

  // Só exibimos vagas que aceitam Brasil. Removemos as que SABIDAMENTE não
  // aceitam (têm localização definida e o Brasil/LatAm não está entre elas).
  // Vagas sem localização conhecida (sem match no Ashby) são MANTIDAS — não dá
  // para afirmar que rejeitam Brasil, e estão habilitadas para indicação.
  const removed = vagas.filter((v) => !v.acceptsBrazil && v.allLocations.length > 0);
  const vagasBR = vagas.filter((v) => v.acceptsBrazil || v.allLocations.length === 0);

  const outDir = path.join(process.cwd(), 'src', 'data');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'vagas.json');
  fs.writeFileSync(outPath, JSON.stringify(vagasBR, null, 2), 'utf8');

  const ptCount = vagasBR.filter((v) => v.descriptionPtBr).length;

  console.log(`\n✓ Gerado ${outPath}`);
  console.log(`  ${vagasBR.length} vagas exibidas (aceitam Brasil ou localização desconhecida)`);
  console.log(`  ${vagasBR.length - notEnriched.length} com conteúdo do Ashby`);
  console.log(`  ${ptCount} com descrição PT-BR preservada`);

  if (removed.length) {
    console.log(`\n✗ ${removed.length} vaga(s) removida(s) por NÃO aceitar Brasil:`);
    removed.forEach((v) => console.log(`    - ${v.title}  (${v.allLocations.join(', ')})`));
  }

  if (notEnriched.length) {
    console.log(`\n⚠ ${notEnriched.length} vaga(s) do dump SEM correspondência no Ashby`);
    console.log('  (serão exibidas apenas com o título; descrição vazia):');
    notEnriched.forEach((t) => console.log(`    - ${t}`));
    console.log(
      '\n  Se o título estiver levemente diferente entre o dump e o Ashby,\n' +
      '  ajuste o dump para bater exatamente e rode novamente.'
    );
  }
  console.log('');
}

generate().catch((err) => {
  console.error('Erro ao gerar vagas:', err);
  process.exit(1);
});
