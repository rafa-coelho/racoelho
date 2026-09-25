import { cn } from '@/lib/utils';
import { pad2 } from '@/components/rc';

interface ChallengeProgressCardProps {
  done: number;
  total: number;
  firstNumber: number;
  className?: string;
}

// "Seu progresso 3 / 8" + barra de 6px. Com zero concluídos: "Comece pelo #01" e sem barra.
export default function ChallengeProgressCard({ done, total, firstNumber, className }: ChallengeProgressCardProps) {
  const pct = total > 0 ? Math.min(100, Math.round((done / total) * 1000) / 10) : 0;
  return (
    <div className={cn('rounded-rc-card border border-rc-green-border bg-rc-green-surface p-[15px] md:rounded-rc-card-lg md:p-5', className)}>
      <div className="flex items-baseline justify-between gap-3 font-mono text-[11px] text-rc-ink-4 md:text-xs">
        <span className="uppercase tracking-[.1em]">Seu progresso</span>
        <span className="text-rc-green md:text-[13px]">{done > 0 ? `${done} / ${total}` : `Comece pelo #${pad2(firstNumber)}`}</span>
      </div>
      {done > 0 && (
        <div
          className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-rc-green-track md:mt-3"
          role="progressbar"
          aria-label="Desafios concluídos"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
        >
          <div className="h-full rounded-full bg-rc-green" style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}
