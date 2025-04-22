import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] p-4">
      <div className="bg-[#161b22] rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <h1 className="text-3xl font-extrabold mb-2 text-gray-100">
          Ebook não encontrado
        </h1>
        <p className="text-gray-300 mb-6">
          O ebook que você está procurando não existe ou o link está inválido.
        </p>

        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all inline-block"
        >
          Voltar ao site
        </Link>
      </div>
    </div>
  );
} 