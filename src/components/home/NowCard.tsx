import type { SiteStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

// "● ativo" até 14 dias; depois disso, "atualizado há N dias".
const ACTIVE_DAYS = 14;

function ageInDays(updatedAt?: string): number {
  if (!updatedAt) return 0;
  const time = new Date(updatedAt).getTime();
  if (Number.isNaN(time)) return 0;
  return Math.max(0, Math.floor((Date.now() - time) / 86400000));
}

// Card "Agora" do hero (flag now_status). Sem status ativo, não renderiza nada.
export function NowCard({ status, className }: { status?: SiteStatus | null; className?: string }) {
  if (!status || !status.active || !status.text?.trim()) return null;
  const days = ageInDays(status.updatedAt);
  const fresh = days <= ACTIVE_DAYS;

  return (
    <div className={cn('rounded-xl border border-rc-border-chip bg-rc-surface px-[15px] py-[13px] font-mono text-[11.5px] md:px-4 md:py-3.5 md:text-xs', className)}>
      <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[.1em] text-rc-ink-5 md:text-[10.5px]">
        <span>Agora</span>
        {fresh ? (
          <span className="text-rc-green">
            <span aria-hidden="true">●</span> ativo
          </span>
        ) : (
          <span className="normal-case tracking-normal" suppressHydrationWarning>
            atualizado há {days} dias
          </span>
        )}
      </div>
      <p className="mt-2 leading-[1.5] text-rc-ink-2 md:mt-[9px]">{status.text}</p>
    </div>
  );
}
