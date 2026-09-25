import { AlertCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Vazio: uma frase em ink-4 + no máximo uma ação. Sem ilustração.
export function EmptyState({ message, action, className }: { message: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-4 rounded-rc-card border border-rc-border-card bg-rc-surface px-6 py-12 text-center', className)}>
      <p className="text-rc-body text-rc-ink-4">{message}</p>
      {action}
    </div>
  );
}

// Erro: cartão com borda âmbar suave, ícone alert-circle âmbar, mensagem e "Tentar de novo".
export function ErrorState({ message, onRetry, className }: { message: ReactNode; onRetry?: () => void; className?: string }) {
  return (
    <div role="alert" className={cn('flex items-start gap-3 rounded-rc-card border border-rc-amber-border-soft bg-rc-amber-surface-2 p-4', className)}>
      <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-rc-amber" aria-hidden="true" />
      <div className="flex flex-1 flex-col gap-2">
        <p className="text-rc-small text-rc-ink-2">{message}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="self-start text-sm font-medium text-rc-amber hover:text-rc-amber-hover">
            Tentar de novo
          </button>
        )}
      </div>
    </div>
  );
}

// Skeleton: mesma altura/raio do componente final, brilho de 1.4s. Nunca spinner em lista.
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('rc-shimmer animate-rc-shimmer rounded-rc-card', className)} />;
}
