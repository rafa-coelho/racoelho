import { cn } from '@/lib/utils';

// Ponto verde pulsante (desligado com prefers-reduced-motion).
export function StatusDot({ className, pulse = true }: { className?: string; pulse?: boolean }) {
  return <span aria-hidden="true" className={cn('inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rc-green', pulse && 'animate-rc-pulse', className)} />;
}
