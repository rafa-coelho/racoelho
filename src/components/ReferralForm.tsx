'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast, Toaster } from 'sonner';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle2, Send } from 'lucide-react';
import { buttonClasses, cardClasses } from '@/components/rc';

const MAX_CV_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_CV = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const schema = z.object({
  candidateName: z.string().min(2, 'Informe o nome completo do candidato'),
  candidateEmail: z.string().email('E-mail inválido'),
  linkedinUrl: z
    .string()
    .url('URL inválida')
    .refine((v) => /linkedin\.com/i.test(v), 'Informe uma URL do LinkedIn'),
  cv: z
    .custom<FileList>()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= MAX_CV_BYTES,
      'Arquivo muito grande (máx. 10 MB)'
    )
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_CV.includes(files[0].type),
      'Envie um PDF ou documento Word'
    ),
  phone: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Você precisa confirmar os termos' }),
  }),
});

type FormValues = z.infer<typeof schema>;

interface ReferralFormProps {
  vagaSlug: string;
  vagaTitle: string;
  referralId: string;
}

const labelCls = 'mb-2 block text-[13.5px] font-medium text-rc-ink-2';
const inputCls =
  'h-12 w-full rounded-[11px] border border-rc-border-strong bg-rc-input px-3.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link md:h-[50px] md:rounded-[10px]';
const errorCls = 'mt-1.5 text-[13px] text-rc-red';
const requiredMark = <span className="text-rc-blue-link">*</span>;

export default function ReferralForm({ vagaSlug, vagaTitle, referralId }: ReferralFormProps) {
  const { theme = 'system' } = useTheme();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const fd = new FormData();
      fd.append('vagaSlug', vagaSlug);
      fd.append('vagaTitle', vagaTitle);
      fd.append('referralId', referralId);
      fd.append('candidateName', values.candidateName);
      fd.append('candidateEmail', values.candidateEmail);
      fd.append('linkedinUrl', values.linkedinUrl);
      if (values.phone) fd.append('phone', values.phone);
      if (values.cv && values.cv.length > 0) fd.append('cv', values.cv[0]);

      const res = await fetch('/api/referrals', { method: 'POST', body: fd });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Falha ao enviar a indicação');
      }

      setSubmitted(true);
      toast.success('Indicação enviada! Vou levar adiante. Valeu 🙌');
      reset();
    } catch (err: any) {
      toast.error(err.message || 'Algo deu errado. Tente novamente.');
    }
  };

  if (submitted) {
    return (
      <div role="status" className={cardClasses({ tone: 'green', size: 'lg', className: 'p-6 text-center md:p-8' })}>
        <CheckCircle2 size={36} className="mx-auto mb-3 text-rc-green" aria-hidden="true" />
        <h3 className="text-rc-h2-m font-semibold text-rc-ink md:text-rc-h2">Indicação recebida!</h3>
        <p className="mb-5 mt-2 text-rc-body text-rc-ink-3">
          Obrigado por indicar alguém para <strong className="font-medium text-rc-ink">{vagaTitle}</strong>. Vou revisar e levar a
          indicação adiante pessoalmente.
        </p>
        <button type="button" onClick={() => setSubmitted(false)} className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
          Indicar outra pessoa
        </button>
        <Toaster theme={theme as any} richColors position="bottom-center" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cardClasses({ tone: 'blue', size: 'lg', className: 'space-y-5 p-4 md:p-6' })}>
      {/* Nome */}
      <div>
        <label htmlFor="candidateName" className={labelCls}>
          Nome completo do candidato {requiredMark}
        </label>
        <input id="candidateName" type="text" className={inputCls} {...register('candidateName')} />
        {errors.candidateName && <p className={errorCls}>{errors.candidateName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="candidateEmail" className={labelCls}>
          E-mail do candidato {requiredMark}
        </label>
        <input
          id="candidateEmail"
          type="email"
          className={inputCls}
          {...register('candidateEmail')}
        />
        {errors.candidateEmail && <p className={errorCls}>{errors.candidateEmail.message}</p>}
      </div>

      {/* LinkedIn */}
      <div>
        <label htmlFor="linkedinUrl" className={labelCls}>
          LinkedIn {requiredMark}
        </label>
        <input
          id="linkedinUrl"
          type="url"
          placeholder="https://www.linkedin.com/in/…"
          className={inputCls}
          {...register('linkedinUrl')}
        />
        {errors.linkedinUrl && <p className={errorCls}>{errors.linkedinUrl.message}</p>}
      </div>

      {/* CV */}
      <div>
        <label htmlFor="cv" className={labelCls}>
          CV / Currículo
        </label>
        <input
          id="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          className={cn(
            inputCls,
            'h-auto min-h-12 cursor-pointer py-2 text-[14px] text-rc-ink-3 file:mr-3 file:h-9 file:cursor-pointer file:rounded-[9px] file:border file:border-rc-border-strong file:bg-rc-surface-3 file:px-3.5 file:text-[13.5px] file:font-medium file:text-rc-ink md:min-h-[50px]'
          )}
          {...register('cv')}
        />
        <p className="mt-1.5 font-mono text-rc-meta text-rc-ink-5">
          PDF ou documento Word, até 10 MB. Opcional.
        </p>
        {errors.cv && <p className={errorCls}>{errors.cv.message as string}</p>}
      </div>

      {/* Telefone */}
      <div>
        <label htmlFor="phone" className={labelCls}>
          Telefone
        </label>
        <input id="phone" type="tel" className={inputCls} {...register('phone')} />
      </div>

      {/* Consentimento */}
      <div>
        <label className="flex min-h-11 cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border border-rc-border-strong accent-rc-blue"
            {...register('consent')}
          />
          <span className="text-[14px] leading-[1.55] text-rc-ink-3">
            Confirmo que tenho consentimento da pessoa indicada para compartilhar seus dados nesta
            indicação. {requiredMark}
          </span>
        </label>
        {errors.consent && <p className={errorCls}>{errors.consent.message as string}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={buttonClasses({ size: 'lg', className: 'w-full md:h-[50px]' })}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            <Send size={18} />
            Enviar indicação
          </>
        )}
      </button>

      <Toaster theme={theme as any} richColors position="bottom-center" />
    </form>
  );
}
