'use client';

import { useRef, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { rcBtnSecondary, rcIconBtn, rcInput } from './styles';

let keySeq = 0;
const nextKey = () => `li-${++keySeq}`;

interface ListEditorProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  addLabel?: string;
  emptyLabel?: string;
  max?: number;
  /** Título curto do item no cabeçalho do cartão (padrão: número). */
  itemTitle?: (item: T, index: number) => ReactNode;
  className?: string;
}

// Lista de itens reordenável (subir/descer/remover). Cada item vira um cartão.
export function ListEditor<T>({ items, onChange, createItem, renderItem, addLabel = 'Adicionar item', emptyLabel = 'Nenhum item.', max, itemTitle, className }: ListEditorProps<T>) {
  // Chaves estáveis paralelas aos itens (para não perder foco ao reordenar).
  const keys = useRef<string[]>([]);
  while (keys.current.length < items.length) keys.current.push(nextKey());
  if (keys.current.length > items.length) keys.current.length = items.length;

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    const k = [...keys.current];
    const [kk] = k.splice(from, 1);
    k.splice(to, 0, kk);
    keys.current = k;
    onChange(next);
  };

  const remove = (i: number) => {
    keys.current = keys.current.filter((_, j) => j !== i);
    onChange(items.filter((_, j) => j !== i));
  };

  const update = (i: number, patch: Partial<T>) => {
    onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  };

  const add = () => {
    keys.current = [...keys.current, nextKey()];
    onChange([...items, createItem()]);
  };

  const full = max !== undefined && items.length >= max;

  return (
    <div className={cn('space-y-3', className)}>
      {items.length === 0 && <p className="rounded-[10px] border border-dashed border-rc-border-strong px-4 py-3 text-[13.5px] text-rc-ink-5">{emptyLabel}</p>}
      <ol className="space-y-3">
        {items.map((item, i) => (
          <li key={keys.current[i]} className="rounded-[12px] border border-rc-border-strong bg-rc-sunken p-3 md:p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="font-mono text-[11px] tracking-[.08em] text-rc-ink-5">{String(i + 1).padStart(2, '0')}</span>
              <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-rc-ink-3">{itemTitle?.(item, i)}</span>
              <button type="button" className={rcIconBtn} onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Mover item ${i + 1} para cima`}>
                <ArrowUp className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" className={rcIconBtn} onClick={() => move(i, i + 1)} disabled={i === items.length - 1} aria-label={`Mover item ${i + 1} para baixo`}>
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" className={cn(rcIconBtn, 'hover:text-rc-red')} onClick={() => remove(i)} aria-label={`Remover item ${i + 1}`}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            {renderItem(item, (patch) => update(i, patch), i)}
          </li>
        ))}
      </ol>
      <button type="button" className={rcBtnSecondary} onClick={add} disabled={full}>
        <Plus className="h-4 w-4" aria-hidden="true" /> {addLabel}
        {max !== undefined && <span className="font-mono text-[11.5px] text-rc-ink-5">{items.length}/{max}</span>}
      </button>
    </div>
  );
}

// Lista de textos simples salva como [{ text }] (entregáveis, critérios).
export function TextListEditor({ items, onChange, addLabel, placeholder, emptyLabel }: { items: { text: string }[]; onChange: (items: { text: string }[]) => void; addLabel?: string; placeholder?: string; emptyLabel?: string }) {
  return (
    <ListEditor
      items={items}
      onChange={onChange}
      createItem={() => ({ text: '' })}
      addLabel={addLabel}
      emptyLabel={emptyLabel}
      renderItem={(item, update, i) => (
        <textarea
          aria-label={`Texto do item ${i + 1}`}
          className={cn(rcInput, 'resize-y leading-[1.55]')}
          rows={2}
          value={item.text}
          placeholder={placeholder}
          onChange={(e) => update({ text: e.target.value })}
        />
      )}
    />
  );
}

// Normaliza o JSON do PB em [{ text }] (aceita também array de strings).
export function toTextList(v: unknown): { text: string }[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => (typeof x === 'string' ? { text: x } : x && typeof x === 'object' && typeof (x as any).text === 'string' ? { text: (x as any).text } : null))
    .filter((x): x is { text: string } => !!x);
}

// Remove itens vazios antes de salvar.
export function cleanTextList(items: { text: string }[]): { text: string }[] {
  return items.map((i) => ({ text: i.text.trim() })).filter((i) => i.text);
}
