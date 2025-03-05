import { useEffect } from 'react';
import Head from 'next/head';
import { getAllEbooks, getEbookBySlug } from '../../../lib/local-api';
import Link from 'next/link';
import { validateEbookToken } from '../../../lib/services/data.service';

export default function DownloadPage ({ ebook }) {
    const downloadUrl =
        ebook.downloadUrl || `/assets/ebooks/${ebook.slug}/${ebook.slug}.pdf`;

    useEffect(() => {
        const anchor = document.createElement('a');
        anchor.href = downloadUrl;
        anchor.setAttribute('download', `${ebook.slug}.pdf`);
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }, [downloadUrl, ebook.slug]);

    return (
        <>
            <Head>
                <title>Download - {ebook.title}</title>
                <meta name="description" content={`Baixando o ebook ${ebook.title}`} />
            </Head>

            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] p-4 relative">
                <div className="bg-[#161b22] rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                    <svg
                        className="w-16 h-16 text-green-500 mx-auto mb-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 0 1 1.416 1.414l-8.197 8.204a1 1 0 0 1-1.415 0l-4.198-4.197a1 1 0 1 1 1.415-1.415l3.49 3.49 7.49-7.496z"
                            clipRule="evenodd"
                        />
                    </svg>

                    <h1 className="text-3xl font-extrabold mb-2 text-gray-100">
                        Muito obrigado!
                    </h1>
                    <p className="text-gray-300 mb-6">
                        Seu download do ebook <strong>{ebook.title}</strong> deve iniciar em alguns instantes.
                    </p>
                    <p className="text-gray-400 mb-4">
                        Se o download não começou automaticamente, clique aqui:
                    </p>

                    <a
                        href={downloadUrl}
                        download={`${ebook.slug}.pdf`}
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all"
                    >
                        Baixar agora
                    </a>
                </div>

                <footer className="fixed bottom-0 w-full bg-[#161b22] text-gray-300 p-3 text-center">
                    <p className="text-sm">
                        Obrigado por baixar!{' '}
                        <Link
                            href="/"
                            className="underline font-semibold hover:text-gray-100 transition"
                        >
                            Voltar ao site
                        </Link>
                    </p>
                </footer>
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const { token } = context.query || {};

  if (!token) {
    return { redirect: { destination: `/ebooks/${slug}`, permanent: false } };
  }

  const isValid = await validateEbookToken({ token, slug });
  if (!isValid) {
    return { redirect: { destination: `/ebooks/${slug}`, permanent: false } };
  }

  const ebook = getEbookBySlug(slug);
  return { props: { ebook } };
}
