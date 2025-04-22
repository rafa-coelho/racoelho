'use client';

import { useEffect } from 'react';
import Link from 'next/link';
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] p-4">
      <div className="bg-[#161b22] rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <svg
          className="w-16 h-16 text-green-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>

        <h1 className="text-3xl font-extrabold mb-2 text-gray-100">
          Download iniciado!
        </h1>
        <p className="text-gray-300 mb-6">
          Obrigado por baixar o ebook "{ebook.title}". O download começará automaticamente.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href={downloadUrl}
            download={`${ebook.slug}.pdf`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all"
          >
            Baixar novamente
          </Link>
          <Link
            href="/"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-full transition-all"
          >
            Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
} 