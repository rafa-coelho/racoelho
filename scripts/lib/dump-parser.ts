// Parser do "dump" do sistema de referral.
//
// O sistema exporta as vagas habilitadas num formato serializado peculiar,
// com type-tags ("t") e índices ("i"). Cada vaga é um objeto (t:10) cujas
// chaves são exatamente ["id", "title"]. Este parser varre a estrutura
// recursivamente e extrai todos esses objetos, sem depender do caminho exato.

export interface DumpJob {
  id: string;
  title: string;
}

/**
 * Extrai a lista de vagas {id, title} de um dump serializado do referral.
 * Aceita tanto o objeto já parseado quanto uma string JSON.
 */
export function parseReferralDump(input: unknown): DumpJob[] {
  const root = typeof input === 'string' ? JSON.parse(input) : input;
  const jobs: DumpJob[] = [];
  const seen = new Set<string>();

  const walk = (node: any): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node && typeof node === 'object') {
      const k = node?.p?.k;
      const v = node?.p?.v;
      const isJob =
        node.t === 10 &&
        Array.isArray(k) &&
        k.length === 2 &&
        k[0] === 'id' &&
        k[1] === 'title' &&
        Array.isArray(v);

      if (isJob) {
        const id = v[0]?.s;
        const title = (v[1]?.s || '').trim();
        if (id && !seen.has(id)) {
          seen.add(id);
          jobs.push({ id, title });
        }
      }

      // Continua descendo pela árvore
      if (node?.p?.v) walk(node.p.v);
      if (node?.a) walk(node.a);
    }
  };

  walk(root);
  return jobs;
}
