'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast, Toaster } from 'sonner';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle2, Send } from 'lucide-react';

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

const labelCls = 'block text-sm font-bold text-foreground mb-2';
const inputCls =
  'w-full px-4 py-3 rounded-xl border-2 border-white/10 bg-card/50 backdrop-blur-sm focus:outline-none focus:border-primary transition-all text-base';
const errorCls = 'mt-1.5 text-sm text-red-400';

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
      <div className="card-modern p-8 sm:p-10 text-center border-2 border-primary/30">
        <CheckCircle2 size={48} className="mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-2">Indicação recebida!</h3>
        <p className="text-muted-foreground mb-6">
          Obrigado por indicar alguém para <strong>{vagaTitle}</strong>. Vou revisar e levar a
          indicação adiante pessoalmente.
        </p>
        <button onClick={() => setSubmitted(false)} className="btn-secondary">
          Indicar outra pessoa
        </button>
        <Toaster theme={theme as any} richColors position="bottom-center" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-modern p-5 sm:p-6 space-y-5">
      {/* Nome */}
      <div>
        <label htmlFor="candidateName" className={labelCls}>
          Nome completo do candidato <span className="text-primary">*</span>
        </label>
        <input id="candidateName" type="text" className={inputCls} {...register('candidateName')} />
        {errors.candidateName && <p className={errorCls}>{errors.candidateName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="candidateEmail" className={labelCls}>
          E-mail do candidato <span className="text-primary">*</span>
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
          LinkedIn <span className="text-primary">*</span>
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
            'file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:font-medium file:cursor-pointer cursor-pointer py-2.5'
          )}
          {...register('cv')}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
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
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5 rounded border-2 border-primary/50 accent-primary cursor-pointer"
            {...register('consent')}
          />
          <span className="text-sm text-foreground">
            Confirmo que tenho consentimento da pessoa indicada para compartilhar seus dados nesta
            indicação. <span className="text-primary">*</span>
          </span>
        </label>
        {errors.consent && <p className={errorCls}>{errors.consent.message as string}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
