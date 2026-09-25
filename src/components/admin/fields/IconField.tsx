'use client';

import { ProjectIcon, resolveProjectIcon } from '@/components/projects/ProjectIcon';
import { cn } from '@/lib/utils';
import { Field } from './Field';
import { rcInput } from './styles';

// Sugestões curtas (todas resolvidas por ProjectIcon).
const SUGGESTIONS = ['terminal', 'code', 'rocket', 'database', 'server', 'bot', 'brain', 'layers', 'workflow', 'globe', 'package', 'wrench', 'sparkles', 'zap'];

// Nome do ícone lucide (kebab-case) com preview e sugestões.
export function IconField({ id, value, onChange, accent, title }: { id: string; value: string; onChange: (v: string) => void; accent?: 'blue' | 'green' | 'amber'; title: string }) {
  const known = !value.trim() || !!resolveProjectIcon(value);
  return (
    <Field
      label="Ícone (lucide)"
      htmlFor={id}
      hint={known ? 'Nome kebab-case do lucide. Vazio usa a inicial do título.' : 'Ícone não reconhecido — vai aparecer a inicial do título.'}
    >
      <div className="flex items-center gap-3">
        <ProjectIcon project={{ title: title || '?', icon: value, accent: accent || undefined }} size="lg" />
        <input id={id} className={rcInput} value={value} placeholder="terminal" onChange={(e) => onChange(e.target.value)} autoCapitalize="off" spellCheck={false} />
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5" role="group" aria-label="Sugestões de ícone">
        {SUGGESTIONS.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            aria-pressed={value === name}
            className={cn(
              'inline-flex min-h-[36px] items-center gap-1.5 rounded-rc-chip border px-2.5 font-mono text-[12px] transition-colors duration-150',
              value === name ? 'border-rc-blue-border bg-rc-blue-chip text-rc-blue-link' : 'border-rc-border-chip bg-rc-tag text-rc-ink-3 hover:border-rc-border-hover hover:text-rc-ink',
            )}
          >
            <IconGlyph name={name} />
            {name}
          </button>
        ))}
      </div>
    </Field>
  );
}

function IconGlyph({ name }: { name: string }) {
  const Icon = resolveProjectIcon(name);
  return Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={1.75} /> : null;
}
