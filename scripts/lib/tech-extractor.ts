// Extrai tecnologias de um texto de vaga (título + descrição) por allowlist.
// O Ashby não entrega tags estruturadas, então derivamos das techs conhecidas.
// Cada entrada tem o rótulo canônico e os padrões que o identificam no texto.

interface TechDef {
  label: string;
  // padrões (regex sources) que casam a tech; usados com word-boundary
  patterns: string[];
}

const TECHS: TechDef[] = [
  { label: 'React', patterns: ['react(?:\\.js)?', 'react native'] },
  { label: 'Vue', patterns: ['vue(?:\\.js)?'] },
  { label: 'Angular', patterns: ['angular'] },
  { label: 'Next.js', patterns: ['next\\.?js'] },
  { label: 'Node', patterns: ['node(?:\\.js)?'] },
  { label: 'TypeScript', patterns: ['typescript'] },
  { label: 'JavaScript', patterns: ['javascript'] },
  { label: 'Python', patterns: ['python', 'pandas', 'pyspark', 'django', 'flask'] },
  { label: 'Java', patterns: ['java(?!script)'] },
  { label: 'Kotlin', patterns: ['kotlin'] },
  { label: 'Swift', patterns: ['swift'] },
  { label: '.NET', patterns: ['\\.net', 'dotnet'] },
  { label: 'C#', patterns: ['c#', 'c-sharp'] },
  { label: 'PHP', patterns: ['php'] },
  { label: 'Ruby', patterns: ['ruby', 'rails', 'ruby on rails'] },
  { label: 'Elixir', patterns: ['elixir', 'phoenix'] },
  { label: 'Go', patterns: ['golang', 'go lang'] },
  { label: 'Rust', patterns: ['rust'] },
  { label: 'GraphQL', patterns: ['graphql'] },
  { label: 'REST', patterns: ['rest api', 'restful', 'rest'] },
  { label: 'AWS', patterns: ['aws', 'amazon web services'] },
  { label: 'GCP', patterns: ['gcp', 'google cloud'] },
  { label: 'Azure', patterns: ['azure'] },
  { label: 'Docker', patterns: ['docker'] },
  { label: 'Kubernetes', patterns: ['kubernetes', 'k8s'] },
  { label: 'Terraform', patterns: ['terraform'] },
  { label: 'Kafka', patterns: ['kafka'] },
  { label: 'Spark', patterns: ['spark'] },
  { label: 'Airflow', patterns: ['airflow'] },
  { label: 'Snowflake', patterns: ['snowflake'] },
  { label: 'Redshift', patterns: ['redshift'] },
  { label: 'PostgreSQL', patterns: ['postgresql', 'postgres'] },
  { label: 'MySQL', patterns: ['mysql'] },
  { label: 'MongoDB', patterns: ['mongodb', 'mongo'] },
  { label: 'Redis', patterns: ['redis'] },
  { label: 'Elasticsearch', patterns: ['elasticsearch', 'elastic search'] },
  { label: 'SQL', patterns: ['sql(?! server)', 'sql server'] },
  { label: 'Power BI', patterns: ['power bi', 'powerbi'] },
  { label: 'Tableau', patterns: ['tableau'] },
  { label: 'Looker', patterns: ['looker'] },
  { label: 'Figma', patterns: ['figma'] },
  { label: 'Spring', patterns: ['spring boot', 'spring framework'] },
  { label: 'Laravel', patterns: ['laravel'] },
];

function makeRegex(pattern: string): RegExp {
  // word-boundary tolerante a símbolos técnicos (#, ., +) nas extremidades
  return new RegExp(`(?:^|[^a-zA-Z0-9])(?:${pattern})(?:$|[^a-zA-Z0-9+#])`, 'i');
}

/**
 * Retorna as tecnologias detectadas no texto, em ordem canônica (a de TECHS).
 */
export function extractTechs(text: string): string[] {
  const hay = ` ${(text || '').toLowerCase()} `;
  const found: string[] = [];
  for (const tech of TECHS) {
    const hit = tech.patterns.some((p) => makeRegex(p).test(hay));
    if (hit) found.push(tech.label);
  }
  return found;
}
