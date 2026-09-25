import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Eyebrow } from './Eyebrow';

interface PageHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  dots?: boolean;
  className?: string;
}

// Cabeçalho de página: eyebrow mono + H1 44px (30px mobile) + linha de apoio.
export function PageHeader({ eyebrow, title, lead, children, dots = true, className }: PageHeaderProps) {
  return (
    <section className={cn('relative overflow-hidden border-b border-rc-border', className)}>
      {dots && (
        <>
          <div className="rc-dots-bg" />
          <div className="rc-dots-fade" />
        </>
      )}
      <div className="rc-container relative pb-7 pt-8 md:pb-12 md:pt-14">
        {eyebrow && <Eyebrow className="text-rc-ink-5">{eyebrow}</Eyebrow>}
        <h1 className="mt-3 text-rc-h1-m font-semibold text-rc-ink md:text-rc-h1">{title}</h1>
        {lead && <p className="mt-3 max-w-[60ch] text-[15.5px] leading-[1.6] text-rc-ink-3 md:mt-4 md:text-[17.5px]">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
