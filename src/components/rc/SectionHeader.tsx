import Link from 'next/link';
import { cn } from '@/lib/utils';
import { type Accent, accentNum, accentTextHover } from './accent';

interface SectionHeaderProps {
  number: string;
  title: string;
  accent?: Accent;
  href?: string;
  linkLabel?: string;
  as?: 'h2' | 'h3';
  className?: string;
}

// Cabeçalho de seção numerado: "01  Título ───────── Ver todos →"
export function SectionHeader({ number, title, accent = 'blue', href, linkLabel = 'Ver todos →', as: Tag = 'h2', className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-[18px] flex items-center gap-3 md:mb-[26px] md:gap-4', className)}>
      <span className={cn('font-mono text-[11.5px] md:text-xs', accentNum[accent])}>{number}</span>
      <Tag className="text-rc-h2-m font-semibold text-rc-ink md:text-rc-h2">{title}</Tag>
      <span className="h-px flex-1 bg-rc-border" aria-hidden="true" />
      {href && (
        <Link href={href} className={cn('hidden text-sm transition-colors duration-150 md:inline', accentTextHover[accent])}>
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

const mobileLinkBorder: Record<Accent, string> = {
  blue: 'border-rc-blue-border text-rc-blue-link',
  green: 'border-rc-green-border-strong text-rc-green',
  amber: 'border-rc-amber-border text-rc-amber',
  red: 'border-rc-border-strong text-rc-red',
};

// No mobile, o "ver todos" vira botão de largura total com borda na cor do acento.
export function SectionMobileLink({ href, label, accent = 'blue' }: { href: string; label: string; accent?: Accent }) {
  return (
    <Link
      href={href}
      className={cn('mt-3 flex h-[46px] items-center justify-center rounded-[11px] border text-[14.5px] font-medium md:hidden', mobileLinkBorder[accent])}
    >
      {label}
    </Link>
  );
}
