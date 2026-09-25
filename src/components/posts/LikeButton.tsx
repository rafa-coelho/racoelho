'use client';

import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

// O número só aparece a partir de 5 curtidas.
export const LIKE_COUNT_MIN = 5;

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onToggle: () => void;
  /** bar: quadrado de 48px da barra mobile; inline: chip ao lado do compartilhar */
  variant?: 'bar' | 'inline';
  /** mostra o rótulo "curtir" (chip inline, ou barra sem compartilhar) */
  showLabel?: boolean;
  className?: string;
}

export function LikeButton({ liked, count, onToggle, variant = 'bar', showLabel = false, className }: LikeButtonProps) {
  const showCount = count >= LIKE_COUNT_MIN;
  const label = liked ? 'Descurtir' : 'Curtir';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={liked}
      aria-label={showCount ? `${label} (${count} curtidas)` : label}
      className={cn(
        'inline-flex items-center justify-center gap-2 border transition-colors duration-150',
        variant === 'bar'
          ? 'h-12 min-w-[48px] rounded-xl bg-rc-surface px-3 text-[15px]'
          : 'h-10 rounded-lg bg-rc-surface px-3 font-mono text-xs md:h-9',
        liked
          ? 'border-rc-border-hover text-rc-red'
          : 'border-rc-border-card text-rc-ink-3 hover:border-rc-border-hover hover:text-rc-ink',
        variant === 'inline' && !liked && 'border-rc-border-chip text-rc-nav-ink',
        className,
      )}
    >
      <Heart
        aria-hidden="true"
        className={cn(variant === 'bar' ? 'h-[19px] w-[19px]' : 'h-3.5 w-3.5', liked && 'fill-current')}
        strokeWidth={1.75}
      />
      {showLabel && <span>{liked ? 'curtido' : 'curtir'}</span>}
      {showCount && <span className="font-mono text-xs tabular-nums">{count}</span>}
    </button>
  );
}
