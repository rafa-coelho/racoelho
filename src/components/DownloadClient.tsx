'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { buttonClasses } from '@/components/rc';
import { Ebook } from '@/lib/api';

interface DownloadClientProps {
  ebook: Ebook;
  downloadUrl: string;
}

export default function DownloadClient({ ebook, downloadUrl }: DownloadClientProps) {
  useEffect(() => {
    // Cria um link temporário para iniciar o download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${ebook.slug}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [downloadUrl, ebook.slug]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-rc-bg p-4">
      <div className="w-full max-w-md rounded-rc-card-lg border border-rc-border-card bg-rc-surface p-6 text-center md:p-8">
        <svg
          className="mx-auto mb-4 h-10 w-10 text-rc-green"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M5 13l4 4L19 7"
          />
        </svg>

        <h1 className="mb-2 text-rc-h1-m font-semibold text-rc-ink">
          Download iniciado!
        </h1>
        <p className="mb-6 text-rc-body text-rc-ink-3">
          Obrigado por baixar o ebook "{ebook.title}". O download começará automaticamente.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href={downloadUrl}
            download={`${ebook.slug}.pdf`}
            className={buttonClasses({ className: 'h-12' })}
          >
            Baixar novamente
          </Link>
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