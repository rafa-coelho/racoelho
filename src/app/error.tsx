'use client';

import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button, ButtonLink, Eyebrow } from '@/components/rc';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Layout>
      <div className="rc-container py-12 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="text-rc-amber">Erro 500</Eyebrow>
          <h1 className="mt-3 text-rc-h1-m font-semibold text-rc-ink md:text-rc-h1">Erro interno do servidor</h1>
          <p className="mb-8 mt-3 text-rc-body text-rc-ink-3">
            Desculpe, algo deu errado. Por favor, tente novamente mais tarde.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={reset} className="h-12 md:h-auto">
              Tentar novamente
            </Button>
            <ButtonLink href="/" variant="secondary" className="h-12 md:h-auto">
              Voltar para a página inicial
            </ButtonLink>
          </div>
        </div>
      </div>
    </Layout>
  );
} 