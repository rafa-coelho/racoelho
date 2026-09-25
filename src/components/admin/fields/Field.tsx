'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { rcCheckbox, rcFormCard, rcHint, rcInput, rcLabel, rcSelect } from './styles';

// Rótulo mono + campo + dica.
export function Field({ label, hint, htmlFor, className, children }: { label: ReactNode; hint?: ReactNode; htmlFor?: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={rcLabel}>
        {label}
      </label>
      {children}
      {hint && <p className={rcHint}>{hint}</p>}
    </div>
  );
}

// Seção de formulário em cartão rc, com título mono opcional.
export function FormSection({ title, description, className, children }: { title?: ReactNode; description?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={cn(rcFormCard, className)}>
      {title && (
        <header className="mb-5">
          <h2 className="font-mono text-[11.5px] uppercase tracking-[.1em] text-rc-ink-3">{title}</h2>
          {description && <p className="mt-1 text-[13.5px] leading-[1.55] text-rc-ink-4">{description}</p>}
        </header>
      )}
      <div className="space-y-5">{children}</div>
    </section>
  );
}

// Campo de texto simples.
export function TextField({ id, label, hint, value, onChange, placeholder, type = 'text', className }: { id: string; label: ReactNode; hint?: ReactNode; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; className?: string }) {
  return (
    <Field label={label} hint={hint} htmlFor={id} className={className}>
      <input id={id} type={type} className={rcInput} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

// Campo numérico. Guarda string no estado para permitir vazio; use toNumberOrNull ao salvar.
export function NumberField({ id, label, hint, value, onChange, placeholder, step, min, className }: { id: string; label: ReactNode; hint?: ReactNode; value: string; onChange: (v: string) => void; placeholder?: string; step?: number | 'any'; min?: number; className?: string }) {
  return (
    <Field label={label} hint={hint} htmlFor={id} className={className}>
      <input id={id} type="number" inputMode={step === 1 ? 'numeric' : 'decimal'} step={step} min={min} className={rcInput} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export type SelectOption = { value: string; label: string };

// Select nativo. `emptyLabel` adiciona a opção vazia (campo opcional).
export function SelectField({ id, label, hint, value, onChange, options, emptyLabel, className }: { id: string; label: ReactNode; hint?: ReactNode; value: string; onChange: (v: string) => void; options: SelectOption[]; emptyLabel?: string; className?: string }) {
  return (
    <Field label={label} hint={hint} htmlFor={id} className={className}>
      <select id={id} className={rcSelect} value={value} onChange={(e) => onChange(e.target.value)}>
        {emptyLabel !== undefined && <option value="">{emptyLabel}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

// Checkbox com rótulo clicável (linha inteira ≥ 44px).
export function CheckboxField({ label, hint, checked, onChange, className }: { label: ReactNode; hint?: ReactNode; checked: boolean; onChange: (v: boolean) => void; className?: string }) {
  return (
    <label className={cn('flex min-h-[44px] cursor-pointer select-none items-start gap-3 rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-3 transition-colors duration-150 hover:border-rc-border-hover', className)}>
      <input type="checkbox" className={cn(rcCheckbox, 'mt-px')} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="min-w-0">
        <span className="block text-[14.5px] font-medium text-rc-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-[12.5px] leading-[1.5] text-rc-ink-5">{hint}</span>}
      </span>
    </label>
  );
}

// "" → null (PB aceita null em number e zera o campo); senão Number.
export function toNumberOrNull(v: string, integer = false): number | null {
  const t = v.trim();
  if (!t) return null;
  const n = Number(t.replace(',', '.'));
  if (!Number.isFinite(n)) return null;
  return integer ? Math.trunc(n) : n;
}

export function numberToField(v: unknown): string {
  return typeof v === 'number' && Number.isFinite(v) ? String(v) : '';
}
