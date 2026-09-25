'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NOTES_MAX, validateSubmission, type SubmissionInput } from '@/lib/utils/submission-validation';
import { markChallengeDone } from '@/hooks/use-challenge-progress';

type Field = keyof SubmissionInput;

const labelCls = 'mb-2 block text-[13.5px] font-medium text-rc-ink-2';
const inputCls =
  'h-12 w-full rounded-[11px] border border-rc-border-strong bg-rc-input px-3.5 text-[15px] text-rc-ink outline-none transition-colors duration-150 placeholder:text-rc-ink-6 focus:border-rc-green md:rounded-[10px]';
const errorCls = 'mt-1.5 text-[13px] text-rc-red';
const optional = <span className="font-mono text-[11px] font-normal text-rc-ink-5">opcional</span>;
const greenBtn =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-rc-green px-5 text-[15px] font-semibold text-rc-canvas transition-colors duration-150 hover:bg-rc-green-hover disabled:pointer-events-none disabled:opacity-60';

const EMPTY: SubmissionInput = { name: '', email: '', repoUrl: '', demoUrl: '', notes: '' };

// Envio de solução (flag challenge_submissions): CTA abre formulário inline no próprio cartão.
export default function ChallengeSubmission({ challengeSlug }: { challengeSlug: string }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<SubmissionInput>(EMPTY);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (field: Field) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }));
  };

  // Valida o campo ao sair dele (só mostra erro de quem já foi tocado).
  const blur = (field: Field) => () => {
    if (!(values[field] || '').trim()) return;
    setErrors((e) => ({ ...e, [field]: validateSubmission(values)[field] }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const found = validateSubmission(values);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;

    setSending(true);
    try {
      const fd = new FormData();
      fd.append('challengeId', challengeSlug);
      fd.append('name', values.name.trim());
      fd.append('email', values.email.trim());
      fd.append('repoUrl', values.repoUrl.trim());
      if (values.demoUrl?.trim()) fd.append('demoUrl', values.demoUrl.trim());
      if (values.notes?.trim()) fd.append('notes', values.notes.trim());
      fd.append('website', honeypot);

      const res = await fetch('/api/challenge-submissions', { method: 'POST', body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Não foi possível enviar. Tente novamente.');
      }
      markChallengeDone(challengeSlug);
      setSent(true);
    } catch (err: any) {
      setServerError(err?.message || 'Não foi possível enviar. Tente novamente.');
    } finally {
      setSending(false);
    }
  };

  const notesLen = (values.notes || '').length;

  return (
    <div className="mt-10 rounded-rc-card-lg border border-rc-green-border-strong bg-rc-green-surface p-5 md:mt-11 md:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-rc-green-border-strong bg-rc-green-chip text-rc-green" aria-hidden="true">
          {sent ? <CheckCircle2 className="h-[18px] w-[18px]" strokeWidth={1.75} /> : <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.75} />}
        </span>
        <div className="min-w-0 flex-1">
          {sent ? (
            <div role="status" aria-live="polite">
              <h2 className="text-xl font-semibold tracking-[-.022em] text-rc-ink md:text-[22px]">Recebido.</h2>
              <p className="mt-2.5 max-w-[56ch] text-[15px] leading-[1.65] text-rc-ink-3 md:text-base">
                Manda o repositório que eu dou uma olhada — se eu tiver alguma dúvida, te respondo por email.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold tracking-[-.022em] text-rc-ink md:text-[22px]">Fez o desafio?</h2>
              <p className="mt-2.5 max-w-[56ch] text-[15px] leading-[1.65] text-rc-ink-3 md:text-base">Manda o repositório que eu dou uma olhada.</p>
              {!open && (
                <button type="button" onClick={() => setOpen(true)} aria-expanded={false} aria-controls="challenge-submission-form" className={cn(greenBtn, 'mt-4 w-full md:w-auto')}>
                  Enviar solução
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {open && !sent && (
        <form id="challenge-submission-form" onSubmit={onSubmit} noValidate className="mt-5 flex flex-col gap-4 border-t border-rc-green-border pt-5 md:mt-6 md:pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="sub-name" className={labelCls}>Nome</label>
              <input id="sub-name" type="text" autoComplete="name" className={inputCls} value={values.name} onChange={set('name')} onBlur={blur('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'sub-name-err' : undefined} />
              {errors.name && <p id="sub-name-err" className={errorCls}>{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="sub-email" className={labelCls}>Email</label>
              <input id="sub-email" type="email" autoComplete="email" inputMode="email" className={inputCls} value={values.email} onChange={set('email')} onBlur={blur('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'sub-email-err' : undefined} />
              {errors.email && <p id="sub-email-err" className={errorCls}>{errors.email}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="sub-repo" className={labelCls}>URL do repositório</label>
            <input id="sub-repo" type="url" inputMode="url" placeholder="https://github.com/voce/projeto" className={inputCls} value={values.repoUrl} onChange={set('repoUrl')} onBlur={blur('repoUrl')} aria-invalid={!!errors.repoUrl} aria-describedby={errors.repoUrl ? 'sub-repo-err' : 'sub-repo-hint'} />
            {errors.repoUrl ? (
              <p id="sub-repo-err" className={errorCls}>{errors.repoUrl}</p>
            ) : (
              <p id="sub-repo-hint" className="mt-1.5 font-mono text-rc-meta text-rc-ink-5">GitHub, GitLab ou Bitbucket.</p>
            )}
          </div>

          <div>
            <label htmlFor="sub-demo" className={cn(labelCls, 'flex items-center justify-between')}>URL de demo {optional}</label>
            <input id="sub-demo" type="url" inputMode="url" placeholder="https://" className={inputCls} value={values.demoUrl} onChange={set('demoUrl')} onBlur={blur('demoUrl')} aria-invalid={!!errors.demoUrl} aria-describedby={errors.demoUrl ? 'sub-demo-err' : undefined} />
            {errors.demoUrl && <p id="sub-demo-err" className={errorCls}>{errors.demoUrl}</p>}
          </div>

          <div>
            <label htmlFor="sub-notes" className={cn(labelCls, 'flex items-center justify-between')}>Observações {optional}</label>
            <textarea id="sub-notes" rows={4} className={cn(inputCls, 'h-auto min-h-[112px] resize-y py-3 leading-[1.55]')} value={values.notes} onChange={set('notes')} aria-invalid={!!errors.notes} aria-describedby="sub-notes-count" />
            <div className="mt-1.5 flex items-start justify-between gap-3">
              {errors.notes ? <p className={cn(errorCls, 'mt-0')}>{errors.notes}</p> : <span />}
              <span id="sub-notes-count" className={cn('shrink-0 font-mono text-rc-meta', notesLen > NOTES_MAX ? 'text-rc-red' : 'text-rc-ink-5')}>
                {notesLen} / {NOTES_MAX}
              </span>
            </div>
          </div>

          {/* honeypot: invisível para gente, robô preenche */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="sub-website">Website</label>
            <input id="sub-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>

          {serverError && (
            <p role="alert" className="rounded-[10px] border border-rc-amber-border-soft bg-rc-amber-surface-2 px-3.5 py-3 text-[14px] text-rc-amber">
              {serverError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 md:flex-row md:items-center">
            <button type="button" onClick={() => setOpen(false)} className="inline-flex h-12 items-center justify-center rounded-xl px-4 text-[14.5px] font-medium text-rc-ink-4 transition-colors hover:text-rc-ink">
              Cancelar
            </button>
            <button type="submit" disabled={sending} className={cn(greenBtn, 'md:order-first')}>
              {sending ? (
                <>
                  <Loader2 className="h-[18px] w-[18px] animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  Enviando…
                </>
              ) : (
                'Enviar solução'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
