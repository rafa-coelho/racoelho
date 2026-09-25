import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Tag mono (tecnologia, categoria). Sempre secundária.
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-md border border-rc-border-chip bg-rc-tag px-2.5 py-[5px] font-mono text-[11px] text-rc-ink-4 md:text-[11.5px]', className)}>
      {children}
    </span>
  );
}

export type PillTone = 'neutral' | 'blue' | 'green' | 'amber' | 'red';

const pillTones: Record<PillTone, string> = {
  neutral: 'border-rc-border-chip bg-rc-surface-2 text-rc-ink-4',
  blue: 'border-rc-blue-border bg-rc-blue-chip text-rc-blue-soft',
  green: 'border-rc-green-border-strong bg-rc-green-surface text-rc-green',
  amber: 'border-rc-amber-border bg-rc-amber-surface text-rc-amber',
  red: 'border-rc-border-strong bg-rc-surface-2 text-rc-red',
};

// Pílula de status / dificuldade.
export function Pill({ children, tone = 'neutral', className }: { children: ReactNode; tone?: PillTone; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[.08em]', pillTones[tone], className)}>
      {children}
    </span>
  );
}

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

// Chip de filtro com estado ativo.
export function Chip({ active, className, children, type = 'button', ...rest }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        'inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full border px-3.5 font-mono text-[12px] transition-colors duration-150 ease-out',
        active
          ? 'border-rc-blue-border bg-rc-blue-chip text-rc-ink'
          : 'border-rc-border-chip bg-rc-surface text-rc-ink-4 hover:border-rc-border-hover hover:text-rc-ink',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
