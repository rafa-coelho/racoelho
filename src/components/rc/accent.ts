// Acentos por área do site: azul = blog/conteúdo, verde = desafios, âmbar = projetos.
export type Accent = 'blue' | 'green' | 'amber' | 'red';

// Classes estáticas (o Tailwind precisa enxergar os nomes completos).
export const accentText: Record<Accent, string> = {
  blue: 'text-rc-blue-link',
  green: 'text-rc-green',
  amber: 'text-rc-amber',
  red: 'text-rc-red',
};

export const accentTextHover: Record<Accent, string> = {
  blue: 'text-rc-blue-link hover:text-rc-blue-soft',
  green: 'text-rc-green hover:text-rc-green-hover',
  amber: 'text-rc-amber hover:text-rc-amber-hover',
  red: 'text-rc-red hover:opacity-80',
};

// Cor da numeração 01/02/03 do título de seção.
export const accentNum: Record<Accent, string> = {
  blue: 'text-rc-ink-6',
  green: 'text-rc-green-num',
  amber: 'text-rc-amber-num',
  red: 'text-rc-ink-6',
};

export const accentBorder: Record<Accent, string> = {
  blue: 'border-rc-blue-border',
  green: 'border-rc-green-border-strong',
  amber: 'border-rc-amber-border',
  red: 'border-rc-border-strong',
};

// Quadrado de ícone colorido (projetos, links, canais).
export const accentIconBox: Record<Accent, string> = {
  blue: 'bg-rc-blue-chip border-rc-blue-border text-rc-blue-link',
  green: 'bg-rc-green-surface border-rc-green-border-strong text-rc-green',
  amber: 'bg-rc-amber-surface border-rc-amber-border text-rc-amber',
  red: 'bg-rc-surface-2 border-rc-border-strong text-rc-red',
};
