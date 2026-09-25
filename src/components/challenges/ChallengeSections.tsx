import { CheckCircle2 } from 'lucide-react';
import { pad2 } from '@/components/rc';

const h2Cls = 'mt-9 text-[20px] font-semibold tracking-[-.025em] text-rc-ink md:mt-11 md:text-rc-h2-article';

// "O que você vai construir": lista numerada em cartões. Vazia = não aparece.
export function ChallengeDeliverables({ items }: { items?: { text: string }[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section aria-labelledby="challenge-deliverables">
      <h2 id="challenge-deliverables" className={h2Cls}>
        O que você vai construir
      </h2>
      <ol className="mt-3.5 flex flex-col gap-2.5 md:mt-4">
        {items.map((item, i) => (
          <li key={i} className="grid grid-cols-[28px_1fr] gap-3 rounded-xl border border-rc-border-card bg-rc-surface p-3.5 md:grid-cols-[32px_1fr] md:px-[18px] md:py-4">
            <span className="pt-[3px] font-mono text-[11px] text-rc-green md:text-xs" aria-hidden="true">
              {pad2(i + 1)}
            </span>
            <p className="text-[14.5px] leading-[1.55] text-rc-ink-3 md:text-base md:leading-[1.6]">{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

// "Critérios de aceite": lista com check verde. Vazia = não aparece.
export function ChallengeCriteria({ items }: { items?: { text: string }[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section aria-labelledby="challenge-criteria">
      <h2 id="challenge-criteria" className={h2Cls}>
        Critérios de aceite
      </h2>
      <ul className="mt-3.5 flex flex-col gap-[9px] md:mt-4 md:gap-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-[14.5px] leading-[1.5] text-rc-ink-3 md:text-base md:leading-[1.6]">
            <CheckCircle2 className="mt-[2px] h-4 w-4 shrink-0 text-rc-green md:mt-1" strokeWidth={1.75} aria-hidden="true" />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
