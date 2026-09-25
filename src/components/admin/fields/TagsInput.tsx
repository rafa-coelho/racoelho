'use client';

import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Lista de strings como chips. Enter ou vírgula adiciona; Backspace no campo vazio remove o último.
export function TagsInput({ id, value, onChange, placeholder = 'Digite e aperte Enter', className }: { id?: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; className?: string }) {
  const [draft, setDraft] = useState('');

  const addMany = (raw: string) => {
    const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;
    const next = [...value];
    for (const p of parts) if (!next.some((t) => t.toLowerCase() === p.toLowerCase())) next.push(p);
    onChange(next);
    setDraft('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addMany(draft);
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div
      className={cn(
        'flex min-h-[46px] w-full flex-wrap items-center gap-1.5 rounded-[10px] border border-rc-border-strong bg-rc-input px-2 py-1.5 transition-colors duration-150 focus-within:border-rc-blue-link',
        className,
      )}
    >
      {value.map((tag, i) => (
        <span key={`${tag}-${i}`} className="inline-flex items-center gap-1 rounded-rc-chip border border-rc-border-chip bg-rc-tag py-1 pl-2.5 pr-1 font-mono text-[12.5px] text-rc-ink-2">
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            aria-label={`Remover ${tag}`}
            className="relative inline-flex h-6 w-6 items-center justify-center rounded-md text-rc-ink-4 transition-colors hover:bg-rc-nav-hover hover:text-rc-ink after:absolute after:-inset-2.5 after:content-['']"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </span>
      ))}
      <input
        id={id}
        className="min-h-[34px] min-w-[120px] flex-1 bg-transparent px-1.5 text-[15px] text-rc-ink outline-none placeholder:text-rc-ink-5"
        value={draft}
        placeholder={value.length ? '' : placeholder}
        onChange={(e) => {
          const v = e.target.value;
          if (v.includes(',')) addMany(v);
          else setDraft(v);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => addMany(draft)}
      />
    </div>
  );
}

// Normaliza json do PB em string[].
export function toStringList(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && !!x.trim()) : [];
}
