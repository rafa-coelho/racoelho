import Link from 'next/link';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type CardTone = 'neutral' | 'blue' | 'green' | 'amber';

const tones: Record<CardTone, string> = {
  neutral: 'bg-rc-surface border-rc-border-card',
  blue: 'bg-rc-blue-surface border-rc-blue-border',
  green: 'bg-rc-green-surface border-rc-green-border',
  amber: 'bg-rc-amber-surface-2 border-rc-amber-border-soft',
};

const interactiveTones: Record<CardTone, string> = {
  neutral: 'hover:border-rc-border-hover',
  blue: 'hover:border-rc-border-hover',
  green: 'hover:border-rc-green-border-strong',
  amber: 'hover:border-rc-amber-border',
};

export function cardClasses({ tone = 'neutral', interactive = false, size = 'md', className }: { tone?: CardTone; interactive?: boolean; size?: 'md' | 'lg'; className?: string } = {}) {
  return cn(
    'border transition-colors duration-150 ease-out',
    size === 'lg' ? 'rounded-rc-card-lg' : 'rounded-rc-card',
    tones[tone],
    interactive && interactiveTones[tone],
    className,
  );
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
  interactive?: boolean;
  size?: 'md' | 'lg';
  href?: string;
  external?: boolean;
  children: ReactNode;
}

export function Card({ tone, interactive, size, href, external, className, children, ...rest }: CardProps) {
  const classes = cardClasses({ tone, interactive: interactive ?? !!href, size, className });
  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
