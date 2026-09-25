import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Rótulo mono 10.5px uppercase.
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('font-mono text-rc-eyebrow uppercase text-rc-ink-5', className)}>{children}</span>;
}
