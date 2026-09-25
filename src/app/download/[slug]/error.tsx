'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { buttonClasses } from '@/components/rc';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Erro na página de download:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-rc-bg p-4">
      <div className="w-full max-w-md rounded-rc-card-lg border border-rc-border-card bg-rc-surface p-6 text-center md:p-8">
        <svg
          className="mx-auto mb-4 h-10 w-10 text-rc-amber"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <h1 className="mb-2 text-rc-h1-m font-semibold text-rc-ink">
          Ops! Algo deu errado
        </h1>
        <p className="mb-6 text-rc-body text-rc-ink-3">
          Não foi possível processar seu download. Por favor, tente novamente.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className={buttonClasses({ className: 'h-12' })}
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className={buttonClasses({ variant: 'secondary', className: 'h-12' })}
          >
            Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
} 