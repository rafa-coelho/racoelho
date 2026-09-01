import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Layout from '@/components/Layout';
import ReferralForm from '@/components/ReferralForm';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { vagaService } from '@/lib/services/vaga.service';
import { sanitizeJobHtml } from '@/lib/utils/sanitize-html';
import { BLOG_NAME, SITE_URL } from '@/lib/config/constants';
import { ArrowLeft, Briefcase, MapPin, Globe, Clock, Plane, Flag } from 'lucide-react';

interface VagaPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return vagaService.getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: VagaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vaga = vagaService.getVagaBySlug(slug);

  if (!vaga) return { title: 'Vaga não encontrada' };

  const description =
    (vaga.descriptionPlain || '').replace(/\s+/g, ' ').trim().slice(0, 160) ||
    `Indique alguém para a vaga ${vaga.title}.`;

  return {
    title: `${vaga.title} | ${BLOG_NAME}`,
    description,
    alternates: { canonical: `${SITE_URL}/vagas/${vaga.slug}` },
    openGraph: {
      title: `${vaga.title} | ${BLOG_NAME}`,
      description,
      url: `${SITE_URL}/vagas/${vaga.slug}`,
      siteName: BLOG_NAME,
      locale: 'pt_BR',
      type: 'website',
    },
  };
}

export default async function VagaPage({ params }: VagaPageProps) {
  const { slug } = await params;
  const vaga = vagaService.getVagaBySlug(slug);

  if (!vaga) notFound();

  const descriptionHtml = sanitizeJobHtml(vaga.descriptionHtml || '');
  const hasPtBr = Boolean(vaga.descriptionPtBr && vaga.descriptionPtBr.trim());

  return (
    <Layout>
      <div className="min-h-screen py-10 md:py-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Voltar */}
          <Link
            href="/vagas"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Todas as vagas
          </Link>

          {/* Cabeçalho da vaga (full width) */}
          <div className="mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Briefcase size={16} className="text-primary" />
              <span className="text-sm font-bold text-primary">
                {vaga.department || 'Vaga aberta'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight">
              {vaga.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {/* Selo Brasil / Internacional */}
              <span
                className={
                  vaga.acceptsBrazil
                    ? 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium'
                    : 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium'
                }
              >
                {vaga.acceptsBrazil ? <Flag size={14} /> : <Plane size={14} />}
                {vaga.acceptsBrazil ? 'Aceita Brasil' : 'Internacional'}
              </span>
              {vaga.allLocations && vaga.allLocations.length > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={16} />
                  {vaga.allLocations.join(' · ')}
                </span>
              )}
              {vaga.isRemote && (
                <span className="inline-flex items-center gap-1.5">
                  <Globe size={16} />
                  {vaga.workplaceType || 'Remoto'}
                </span>
              )}
              {vaga.employmentType && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={16} />
                  {vaga.employmentType}
                </span>
              )}
            </div>
            {/* Aviso "pra gringa" */}
            <p className="mt-4 text-sm text-muted-foreground">
              💵 Vaga remota para atuar com empresas dos EUA (modelo nearshore).
            </p>
          </div>

          {/* Duas colunas: descrição (rola) + form sticky à direita */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[minmax(0,1fr)_480px] gap-10 lg:gap-20 items-start">
            {/* Coluna esquerda: descrição */}
            <div className="min-w-0 max-w-4xl">
              {hasPtBr ? (
                <MarkdownRenderer content={vaga.descriptionPtBr as string} />
              ) : descriptionHtml ? (
                <>
                  <div className="card-modern p-4 mb-6 text-sm text-muted-foreground border border-amber-500/20 bg-amber-500/5">
                    Descrição original (em inglês) — ainda não adaptei esta vaga para PT-BR.
                  </div>
                  <div
                    className="prose prose-invert prose-headings:font-bold prose-a:text-primary max-w-none prose-p:text-muted-foreground prose-li:text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                  />
                </>
              ) : (
                <div className="card-modern p-6 text-muted-foreground">
                  <p>
                    A descrição completa desta vaga não está disponível aqui no momento, mas a
                    indicação está aberta — preencha os dados ao lado que eu levo adiante.
                  </p>
                </div>
              )}
            </div>

            {/* Coluna direita: form sticky */}
            <aside className="lg:sticky lg:top-24">
              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl font-bold mb-1.5">Indicar alguém</h2>
                <p className="text-sm text-muted-foreground">
                  Sem redirect — a indicação vem direto pra mim, e eu levo adiante.
                </p>
              </div>
              <ReferralForm
                vagaSlug={vaga.slug}
                vagaTitle={vaga.title}
                referralId={vaga.referralId}
              />
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
