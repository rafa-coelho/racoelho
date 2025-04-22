'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

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
      <div className="content-container py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-4">500</h1>
          <h2 className="text-2xl font-semibold mb-4">Erro interno do servidor</h2>
          <p className="text-muted-foreground mb-8">
            Desculpe, algo deu errado. Por favor, tente novamente mais tarde.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Tentar novamente
            </button>
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
} 