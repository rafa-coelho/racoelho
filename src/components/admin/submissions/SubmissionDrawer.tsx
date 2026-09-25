'use client';

import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Ban, CheckCircle2, ExternalLink, Loader2, Mail, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Eyebrow } from '@/components/rc';
import type { ChallengeSubmission, ChallengeSubmissionStatus } from '@/lib/types';
import { SubmissionStatusPill } from './SubmissionStatusPill';
import { formatSubmissionDate } from './format';

interface SubmissionDrawerProps {
  submission: ChallengeSubmission | null;
  onClose: () => void;
  // Atualiza status + reviewNote. Nenhum email é enviado ao participante.
  onSave: (id: string, data: { status: ChallengeSubmissionStatus; reviewNote: string }) => Promise<void>;
}

const ACTIONS: { status: ChallengeSubmissionStatus; label: string; icon: typeof CheckCircle2; cls: string }[] = [
  { status: 'reviewed', label: 'Revisada', icon: CheckCircle2, cls: 'border-rc-blue-border bg-rc-blue-chip text-rc-ink hover:border-rc-border-hover' },
  { status: 'featured', label: 'Destacar', icon: Star, cls: 'border-rc-green-border-strong bg-rc-green-surface text-rc-green hover:border-rc-green' },
  { status: 'rejected', label: 'Rejeitar', icon: Ban, cls: 'border-rc-border-strong bg-rc-surface-3 text-rc-ink-3 hover:border-rc-border-hover hover:text-rc-red' },
];

function LinkRow({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-h-11 items-center justify-between gap-3 rounded-[10px] border border-rc-border-card bg-rc-bg px-3.5 py-2.5 transition-colors hover:border-rc-border-hover"
    >
      <span className="min-w-0">
        <span className="block font-mono text-[10.5px] uppercase tracking-[.1em] text-rc-ink-5">{label}</span>
        <span className="mt-0.5 block truncate font-mono text-[12.5px] text-rc-ink-2 group-hover:text-rc-blue-link">{href.replace(/^https?:\/\//, '')}</span>
      </span>
      <ExternalLink className="h-4 w-4 shrink-0 text-rc-ink-5 group-hover:text-rc-blue-link" aria-hidden="true" />
    </a>
  );
}

export default function SubmissionDrawer({ submission, onClose, onSave }: SubmissionDrawerProps) {
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState<ChallengeSubmissionStatus | null>(null);

  useEffect(() => {
    setNote(submission?.reviewNote || '');
  }, [submission?.id, submission?.reviewNote]);

  const act = async (status: ChallengeSubmissionStatus) => {
    if (!submission) return;
    setBusy(status);
    try {
      await onSave(submission.id, { status, reviewNote: note.trim() });
    } finally {
      setBusy(null);
    }
  };

  return (
    <Dialog.Root open={!!submission} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-[71] flex w-full flex-col border-l border-rc-border bg-rc-bg-admin text-rc-ink shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-right motion-reduce:animate-none sm:max-w-[460px]"
          aria-describedby={undefined}
        >
          {submission && (
            <>
              <div className="flex items-start justify-between gap-3 border-b border-rc-border px-5 py-4 md:px-6">
                <div className="min-w-0">
                  <Eyebrow>Solução de desafio</Eyebrow>
                  <Dialog.Title className="mt-1.5 truncate text-lg font-semibold tracking-[-.02em]">{submission.name}</Dialog.Title>
                  <div className="mt-1 truncate text-[13.5px] text-rc-ink-4">{submission.challengeTitle || submission.challenge}</div>
                </div>
                <Dialog.Close className="-mr-2 -mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-[10px] text-rc-ink-4 transition-colors hover:bg-rc-nav-hover hover:text-rc-ink" aria-label="Fechar">
                  <X className="h-5 w-5" />
                </Dialog.Close>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 md:px-6">
                <div className="flex flex-wrap items-center gap-3 font-mono text-[12px] text-rc-ink-5">
                  <SubmissionStatusPill status={submission.status} />
                  <span>{formatSubmissionDate(submission.created)}</span>
                </div>

                <div className="space-y-2">
                  <a
                    href={`mailto:${submission.email}`}
                    className="flex min-h-11 items-center gap-2.5 rounded-[10px] border border-rc-border-card bg-rc-bg px-3.5 py-2.5 font-mono text-[12.5px] text-rc-ink-2 transition-colors hover:border-rc-border-hover hover:text-rc-blue-link"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-rc-ink-5" aria-hidden="true" />
                    <span className="truncate">{submission.email}</span>
                  </a>
                  <LinkRow label="Repositório" href={submission.repoUrl} />
                  {submission.demoUrl && <LinkRow label="Demo" href={submission.demoUrl} />}
                </div>

                <div>
                  <Eyebrow>Observações</Eyebrow>
                  {submission.notes ? (
                    <p className="mt-2.5 whitespace-pre-wrap break-words text-[14.5px] leading-[1.6] text-rc-ink-2">{submission.notes}</p>
                  ) : (
                    <p className="mt-2.5 text-[14px] text-rc-ink-5">Sem observações.</p>
                  )}
                </div>

                <div>
                  <label htmlFor="review-note" className="block">
                    <Eyebrow>Nota de revisão</Eyebrow>
                  </label>
                  <textarea
                    id="review-note"
                    rows={5}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Anotação interna (não é enviada ao participante)"
                    className="mt-2.5 w-full resize-y rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-3 text-[14.5px] leading-[1.55] text-rc-ink outline-none transition-colors placeholder:text-rc-ink-6 focus:border-rc-blue-link"
                  />
                </div>
              </div>

              <div className="border-t border-rc-border px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-6">
                <div className="grid grid-cols-3 gap-2">
                  {ACTIONS.map(({ status, label, icon: Icon, cls }) => (
                    <button
                      key={status}
                      type="button"
                      disabled={!!busy}
                      onClick={() => act(status)}
                      aria-pressed={submission.status === status}
                      className={cn(
                        'inline-flex h-11 items-center justify-center gap-1.5 rounded-[10px] border px-2 text-[13.5px] font-medium transition-colors disabled:opacity-60',
                        cls,
                        submission.status === status && 'ring-1 ring-inset ring-current',
                      )}
                    >
                      {busy === status ? <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Icon className="h-4 w-4" aria-hidden="true" />}
                      {label}
                    </button>
                  ))}
                </div>
                <p className="mt-2.5 font-mono text-[11px] text-rc-ink-5">Salva status e nota. Nenhum email é enviado ao participante.</p>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
