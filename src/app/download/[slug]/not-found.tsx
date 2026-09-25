import Link from 'next/link';
import { buttonClasses } from '@/components/rc';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-rc-bg p-4">
      <div className="w-full max-w-md rounded-rc-card-lg border border-rc-border-card bg-rc-surface p-6 text-center md:p-8">
        <svg
          className="mx-auto mb-4 h-10 w-10 text-rc-ink-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <h1 className="mb-2 text-rc-h1-m font-semibold text-rc-ink">
          Ebook não encontrado
        </h1>
        <p className="mb-6 text-rc-body text-rc-ink-3">
          O ebook que você está procurando não existe ou o link está inválido.
        </p>

        <Link
          href="/"
          className={buttonClasses({ className: 'h-12' })}
        >
          Voltar ao site
        </Link>
      </div>
    </div>
  );
} 