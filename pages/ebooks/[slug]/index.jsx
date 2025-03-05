import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { toast } from 'react-hot-toast'; // Biblioteca de toast
import Layout from '../../../components/Layout/Layout';
import { getAllEbooks, getEbookBySlug } from '../../../lib/local-api';
import { BLOG_NAME } from '../../../lib/config/constants';

export default function EbookPage ({ ebook }) {
  const router = useRouter();

  // Estados para capturar nome e email do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // Estado para controlar o envio (loader)
  const [isLoading, setIsLoading] = useState(false);

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  // Título da aba (Head)
  const pageTitle = `${ebook.title} | ${BLOG_NAME || ''}`;

  // Link do PDF (caso precise usar ou enviar por email)
  const downloadUrl =
    ebook.downloadUrl || `/assets/ebooks/${ebook.slug}/${ebook.slug}.pdf`;

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Bloqueia novos submits e exibe loader
    setIsLoading(true);

    try {
      const response = await fetch('/api/send-ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, slug: ebook.slug }),
      });

      if (!response.ok) {
        throw new Error('Falha no envio do eBook');
      }

      // Se tudo certo, feedback de sucesso
      toast.success('Ebook enviado! Verifique seu e-mail.');
      setName('');
      setEmail('');
    } catch (err) {
      console.error(err);
      toast.error('Ocorreu um erro. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideNav>
      <Head>
        <title>{pageTitle}</title>
        {ebook.description && (
          <meta name="description" content={ebook.description} />
        )}
        {ebook.keywords && <meta name="keywords" content={ebook.keywords} />}
        {ebook.imageUrl && <meta property="og:image" content={ebook.imageUrl} />}
      </Head>

      {/*
        SEÇÃO 1: HERO
        - Full-width, fundo gradiente
        - Botão rola para o formulário (id="downloadSection")
        - Sem margin entre seções, apenas padding interno
      */}
      <section className="h-[100vh] w-full bg-gradient-to-br from-blue-900 to-blue-600 text-white flex flex-col items-center justify-center p-10 md:p-20">
        <Image
          src={ebook.imageUrl}
          alt={`Capa do eBook: ${ebook.title}`}
          width={120}
          height={120}
          className="rounded-3xl shadow-xl mb-4"
          blurDataURL={ebook.imageUrl}
          placeholder="blur"
        />
        <div className="max-w-3xl text-center justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {ebook.title}
          </h1>
          {ebook.subtitle && (
            <h2 className="text-xl md:text-2xl font-semibold mb-6">
              {ebook.subtitle}
            </h2>
          )}

          {/* Botão que rola até a seção do formulário */}
          <a
            href="#downloadSection"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all"
          >
            Quero Receber o eBook
          </a>
        </div>
      </section>

      {/*
        SEÇÃO 2: IMAGEM + FORMULÁRIO
        - ID "downloadSection" para rolar até aqui
        - Duas colunas: imagem e texto+form
        - Sem margin-top, sem margin-bottom
      */}
      <section id="downloadSection" className="w-full bg-gray-50 p-10 md:p-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* Coluna da imagem */}
          {ebook.imageUrl && (
            <div className="flex-1 flex justify-center">
              <Image
                src={ebook.imageUrl}
                alt={`Capa do eBook: ${ebook.title}`}
                width={400}
                height={400}
                className="rounded-xl shadow-xl"
                blurDataURL={ebook.imageUrl}
                placeholder="blur"
              />
            </div>
          )}

          {/* Coluna do texto + formulário */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {ebook.title}
            </h2>
            {ebook.description && (
              <p className="text-gray-600 leading-relaxed mb-6">
                {ebook.description}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Seu Nome"
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
              <input
                type="email"
                placeholder="Seu E-mail"
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all mt-2 disabled:opacity-50"
              >
                {isLoading ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/*
        SEÇÃO 3: BENEFÍCIOS (se existirem)
        - Full-width, sem margem externa
      */}
      {ebook.benefits && ebook.benefits.length > 0 && (
        <section className="w-full bg-white p-10 md:p-20">
          <div className="max-w-6xl mx-auto">
            {ebook.benefitsTitle && (
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-10">
                {ebook.benefitsTitle}
              </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ebook.benefits.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col"
                >
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/*
        SEÇÃO 4: CTA FINAL (se existir)
        - Botão rola novamente ao formulário (#downloadSection)
      */}
      {ebook.finalCallToAction && (
        <section className="w-full bg-blue-600 text-white p-10 md:p-20 flex flex-col items-center justify-center">
          <div className="max-w-3xl text-center">
            <h3 className="text-3xl font-bold mb-4">
              {ebook.finalCallToAction.title}
            </h3>
            <p className="text-lg md:text-xl mb-6 leading-relaxed">
              {ebook.finalCallToAction.description}
            </p>
            <a
              href="#downloadSection"
              className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-full shadow hover:shadow-xl transition-all"
            >
              {ebook.finalCallToAction.buttonLabel || 'Quero Receber Agora'}
            </a>
          </div>
        </section>
      )}
    </Layout>
  );
}

// getStaticProps / getStaticPaths para gerar a página com base no slug
export async function getStaticProps ({ params }) {
  const ebook = getEbookBySlug(params.slug);
  return {
    props: { ebook },
  };
}

export async function getStaticPaths () {
  const ebooks = getAllEbooks();
  return {
    paths: ebooks.map((ebook) => ({ params: { slug: ebook.slug } })),
    fallback: false,
  };
}
