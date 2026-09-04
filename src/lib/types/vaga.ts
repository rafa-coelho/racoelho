// Tipos das vagas de referral (fonte: Ashby)
//
// A fonte da VERDADE de QUAIS vagas exibir é o dump do sistema de referral
// (as vagas habilitadas para indicação). O conteúdo (descrição, local, área)
// vem da API pública do Ashby, cruzado por título. Vagas presentes no dump que
// não existem mais no Ashby ainda são exibidas (com descrição vazia), pois é
// possível indicar candidatos para elas.

export interface Vaga {
  /** id do sistema de referral (dump) — usado para analytics/rastreio */
  referralId: string;
  /** slug para a URL (/vagas/[slug]) */
  slug: string;
  /** título da vaga */
  title: string;
  /** área/departamento (ex: Technology, Marketing) — do Ashby, quando disponível */
  department?: string;
  /** localização principal (ex: Brazil, LatAm) — do Ashby, quando disponível */
  location?: string;
  /** todas as localizações onde a vaga está aberta (juntando as cópias do Ashby) */
  allLocations?: string[];
  /** true quando a vaga aceita candidatos do Brasil (ou é LatAm ampla) */
  acceptsBrazil?: boolean;
  /** tecnologias detectadas no título/descrição (ex: React, Python, AWS) */
  tags?: string[];
  /** tipo de emprego (ex: FullTime) */
  employmentType?: string;
  /** se é remoto */
  isRemote?: boolean;
  /** modelo de trabalho (ex: Remote, Hybrid) */
  workplaceType?: string;
  /** descrição em HTML (do Ashby, original em inglês) */
  descriptionHtml?: string;
  /** descrição em texto puro (usada para excerpt/SEO) */
  descriptionPlain?: string;
  /** descrição adaptada/traduzida em PT-BR (markdown) — o que é exibido ao público */
  descriptionPtBr?: string;
  /** data de publicação (ISO) */
  publishedAt?: string;
  /** true quando os dados vieram do Ashby; false quando só temos o dump */
  enriched: boolean;
}

/** Metadados leves para a listagem (sem as descrições completas) */
export type VagaMeta = Omit<Vaga, 'descriptionHtml' | 'descriptionPlain' | 'descriptionPtBr'> & {
  excerpt?: string;
};
