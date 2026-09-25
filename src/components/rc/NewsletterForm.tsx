'use client';

import { useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyticsService } from '@/lib/services/analytics.service';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface NewsletterFormProps {
  withName?: boolean;
  layout?: 'inline' | 'stacked';
  submitLabel?: string;
  source?: string;
  className?: string;
}

const inputClasses =
  'h-12 w-full rounded-[11px] border border-rc-border-strong bg-rc-input px-3.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link md:h-[50px] md:rounded-[10px]';

// Formulário de newsletter com estados idle → submitting → success | error.
// Sucesso substitui o formulário por confirmação inline; erro mantém os campos preenchidos.
export function NewsletterForm({ withName = false, layout = 'inline', submitLabel = 'Assinar', source = 'site', className }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError('Informe um email válido.');
      return;
    }
    setError(null);
    setStatus('submitting');
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || undefined }),
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('success');
      analyticsService.event('newsletter_subscribe', 'newsletter', source);
    } catch {
      setStatus('error');
      setError('Não deu certo. Tenta de novo?');
    }
  };

  if (status === 'success') {
    return (
      <div role="status" className={cn('flex items-start gap-3 rounded-[11px] border border-rc-green-border-strong bg-rc-green-surface p-4', className)}>
        <Check className="mt-0.5 h-[18px] w-[18px] shrink-0 text-rc-green" aria-hidden="true" />
        <p className="text-[14.5px] leading-[1.55] text-rc-ink-2">Confere seu email para confirmar a inscrição.</p>
      </div>
    );
  }

  const stacked = layout === 'stacked';

  return (
    <form onSubmit={onSubmit} noValidate className={className}>
      <div className={cn('flex gap-2.5', stacked ? 'flex-col' : 'flex-col md:flex-row')}>
        {withName && (
          <label className="flex-1">
            <span className="sr-only">Nome</span>
            <input type="text" autoComplete="name" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} />
          </label>
        )}
        <label className="flex-1">
          <span className="sr-only">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!error}
            className={inputClasses}
          />
        </label>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="h-12 shrink-0 rounded-[11px] bg-rc-blue px-5 text-[15px] font-semibold text-white shadow-rc-primary transition-colors duration-150 hover:bg-rc-blue-hover disabled:opacity-70 md:h-[50px] md:rounded-[10px]"
        >
          {status === 'submitting' ? 'Enviando…' : submitLabel}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2.5 text-[13.5px] text-rc-amber">
          {error}
        </p>
      )}
    </form>
  );
}
