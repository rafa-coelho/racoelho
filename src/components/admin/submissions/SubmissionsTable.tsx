'use client';

import { ExternalLink } from 'lucide-react';
import type { ChallengeSubmission } from '@/lib/types';
import { SubmissionStatusPill } from './SubmissionStatusPill';
import { formatSubmissionDate } from './format';

const COLS = 'md:grid-cols-[1.2fr_1fr_1.4fr_150px_110px]';

function repoLabel(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

// Tabela no desktop, lista de cartões no mobile. Clique abre o painel lateral.
export default function SubmissionsTable({ items, onOpen }: { items: ChallengeSubmission[]; onOpen: (s: ChallengeSubmission) => void }) {
  return (
    <div className="overflow-hidden rounded-rc-card border border-rc-border-card bg-rc-surface" role="table" aria-label="Soluções enviadas">
      <div role="row" className={`hidden gap-4 border-b border-rc-border-card px-5 py-[13px] font-mono text-rc-eyebrow uppercase text-rc-ink-5 md:grid ${COLS}`}>
        <span role="columnheader">Desafio</span>
        <span role="columnheader">Nome</span>
        <span role="columnheader">Repositório</span>
        <span role="columnheader">Recebida</span>
        <span role="columnheader">Status</span>
      </div>
      <ul role="rowgroup" className="divide-y divide-rc-border-card">
        {items.map((s) => (
          <li
            key={s.id}
            role="row"
            tabIndex={0}
            onClick={() => onOpen(s)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpen(s);
              }
            }}
            aria-label={`Abrir solução de ${s.name}`}
            className={`grid cursor-pointer grid-cols-1 gap-1.5 px-4 py-3.5 outline-none transition-colors duration-150 hover:bg-rc-surface-2 focus-visible:bg-rc-surface-2 md:items-center md:gap-4 md:px-5 md:py-4 ${COLS}`}
          >
            <span role="cell" className="order-2 truncate text-[13px] text-rc-ink-4 md:order-none md:text-[14.5px] md:font-medium md:text-rc-ink">
              {s.challengeTitle || s.challenge}
            </span>
            <span role="cell" className="order-1 truncate text-[15px] font-semibold text-rc-ink md:order-none md:text-[14.5px] md:font-normal md:text-rc-ink-2">
              {s.name}
            </span>
            <span role="cell" className="order-3 min-w-0 md:order-none">
              <a
                href={s.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex max-w-full items-center gap-1.5 font-mono text-[12.5px] text-rc-ink-3 hover:text-rc-blue-link"
              >
                <span className="truncate">{repoLabel(s.repoUrl)}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-rc-blue-link" aria-hidden="true" />
              </a>
            </span>
            <span role="cell" className="order-4 font-mono text-[12px] text-rc-ink-5 md:order-none md:text-[12.5px]">
              {formatSubmissionDate(s.created)}
            </span>
            <span role="cell" className="order-5 mt-1 md:order-none md:mt-0">
              <SubmissionStatusPill status={s.status} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
