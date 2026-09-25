import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BLOG_NAME } from '@/lib/config/constants';

export function LogoMark({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid place-items-center border border-rc-border-hover bg-rc-blue-logo font-mono text-rc-logo-ink',
        size === 'md' ? 'h-[30px] w-[30px] rounded-[9px] text-[13px]' : 'h-[26px] w-[26px] rounded-lg text-[11.5px]',
      )}
    >
      rc
    </span>
  );
}

export function Logo({ size = 'md', className }: { size?: 'sm' | 'md'; className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-[11px]', className)} aria-label={`${BLOG_NAME} — início`}>
      <LogoMark size={size} />
      <span className={cn('font-semibold tracking-[-.02em] text-rc-ink', size === 'md' ? 'text-[17px] md:text-lg' : 'text-[17px]')}>{BLOG_NAME}</span>
    </Link>
  );
}
