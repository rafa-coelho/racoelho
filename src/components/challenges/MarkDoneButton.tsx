'use client';

import { Check, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChallengeProgress } from '@/hooks/use-challenge-progress';

// "Marcar como concluído" no fim do desafio (flag challenge_progress). Só local.
export default function MarkDoneButton({ slug, className }: { slug: string; className?: string }) {
  const { ready, isDone, markDone, unmarkDone } = useChallengeProgress();
  if (!ready) return null;
  const done = isDone(slug);

  return (
    <div className={cn('flex flex-col gap-3 rounded-rc-card border border-rc-border-card bg-rc-surface p-4 md:flex-row md:items-center md:justify-between md:px-5', className)}>
      <p className="text-[14.5px] leading-[1.5] text-rc-ink-3">
        {done ? 'Você concluiu este desafio. Fica salvo só neste navegador.' : 'Terminou? Marque para acompanhar seu progresso na trilha.'}
      </p>
      <button
        type="button"
        onClick={() => (done ? unmarkDone(slug) : markDone(slug))}
        aria-pressed={done}
        className={cn(
          'inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[10px] border px-4 text-[14.5px] font-medium transition-colors duration-150',
          done
            ? 'border-rc-green-border-strong bg-rc-green-surface text-rc-green hover:border-rc-green'
            : 'border-rc-border-strong bg-rc-surface-3 text-rc-ink hover:border-rc-border-hover',
        )}
      >
        {done ? <CheckCircle2 className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> : <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
        {done ? 'Concluído' : 'Marcar como concluído'}
      </button>
    </div>
  );
}
