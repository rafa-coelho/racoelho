// Injeta as descrições PT-BR (arquivos .md gerados) no src/data/vagas.json,
// casando por slug. Uso:
//   npm run apply:vagas-ptbr -- ./caminho/para/pasta-md
// A pasta deve conter arquivos <slug>.md.

import fs from 'fs';
import path from 'path';

function main() {
  // Default: pasta versionada das traduções. Pode sobrescrever passando outra.
  const dir = process.argv[2] || 'scripts/data/vagas-ptbr';
  const mdDir = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(mdDir)) {
    console.error(`Pasta não encontrada: ${mdDir}`);
    process.exit(1);
  }
  const vagasPath = path.join(process.cwd(), 'src', 'data', 'vagas.json');

  const vagas = JSON.parse(fs.readFileSync(vagasPath, 'utf8')) as any[];
  let applied = 0;
  const missing: string[] = [];

  for (const v of vagas) {
    const f = path.join(mdDir, `${v.slug}.md`);
    if (fs.existsSync(f)) {
      const md = fs.readFileSync(f, 'utf8').trim();
      if (md) {
        v.descriptionPtBr = md;
        applied++;
      }
    } else if (v.descriptionPlain) {
      // só reportamos ausência para vagas que TÊM descrição original
      missing.push(v.slug);
    }
  }

  fs.writeFileSync(vagasPath, JSON.stringify(vagas, null, 2), 'utf8');
  console.log(`✓ ${applied} descrições PT-BR aplicadas em vagas.json`);
  if (missing.length) {
    console.log(`⚠ ${missing.length} sem .md correspondente:`);
    missing.forEach((s) => console.log(`    - ${s}`));
  }
}

main();
