import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Layout from '@/components/Layout';
import ReferralForm from '@/components/ReferralForm';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { vagaService } from '@/lib/services/vaga.service';
import { sanitizeJobHtml } from '@/lib/utils/sanitize-html';
import { BLOG_NAME, SITE_URL } from '@/lib/config/constants';
import { ArrowLeft, MapPin, Globe, Clock, Plane, Flag } from 'lucide-react';
import { Eyebrow, Pill, cardClasses, formatShortDate } from '@/components/rc';

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

  const modality = vaga.workplaceType
    ? ({ remote: 'Remoto', hybrid: 'Híbrido', onsite: 'Presencial', 'on-site': 'Presencial' } as Record<string, string>)[
        vaga.workplaceType.toLowerCase()
      ] || vaga.workplaceType
    : 'Remoto';
  const published = formatShortDate(vaga.publishedAt);

  return (
    <Layout>
      {/* Cabeçalho da vaga */}
      <section className="relative overflow-hidden border-b border-rc-border">
        <div className="rc-dots-bg" />
        <div className="rc-dots-fade" />
        <div className="rc-container relative pb-7 pt-5 md:pb-10 md:pt-8">
          <Link
            href="/vagas"
            className="-ml-1 inline-flex h-11 items-center gap-2 px-1 text-sm font-medium text-rc-ink-4 transition-colors duration-150 hover:text-rc-ink"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Todas as vagas
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-2 md:mt-5">
            <Pill tone="blue">indicação</Pill>
            <Eyebrow>
              <span className="text-rc-blue-link">{vaga.department || 'Vaga aberta'}</span>
            </Eyebrow>
          </div>
          <h1 className="mt-3 max-w-[30ch] text-rc-h1-m font-semibold text-rc-ink md:mt-4 md:text-rc-h1">{vaga.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-rc-ink-3 md:mt-5">
            {/* Selo Brasil / Internacional */}
            <Pill tone={vaga.acceptsBrazil ? 'green' : 'neutral'}>
              {vaga.acceptsBrazil ? <Flag size={12} aria-hidden="true" /> : <Plane size={12} aria-hidden="true" />}
              {vaga.acceptsBrazil ? 'Aceita Brasil' : 'Internacional'}
            </Pill>
            {vaga.allLocations && vaga.allLocations.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={15} className="text-rc-ink-5" aria-hidden="true" />
                {vaga.allLocations.join(' · ')}
              </span>
            )}
            {vaga.isRemote && (
              <span className="inline-flex items-center gap-1.5">
                <Globe size={15} className="text-rc-ink-5" aria-hidden="true" />
                {modality}
              </span>
            )}
            {vaga.employmentType && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={15} className="text-rc-ink-5" aria-hidden="true" />
                {vaga.employmentType}
              </span>
            )}
            {published && <span className="font-mono text-rc-meta text-rc-ink-5">publicada em {published}</span>}
          </div>
          {/* Aviso "pra gringa" */}
          <p className="mt-4 font-mono text-[12px] text-rc-ink-4">
            Vaga remota para atuar com empresas dos EUA (modelo nearshore).
          </p>
        </div>
      </section>

      <div className="rc-container py-8 md:py-12">
        {/* Duas colunas: descrição (rola) + form sticky à direita */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-14">
          {/* Coluna esquerda: descrição */}
          <div className="min-w-0">
            {hasPtBr ? (
              <MarkdownRenderer content={vaga.descriptionPtBr as string} />
            ) : descriptionHtml ? (
              <>
                <div className="mb-6 rounded-rc-card border border-rc-amber-border-soft bg-rc-amber-surface-2 p-4 text-rc-small text-rc-ink-2">
                  Descrição original (em inglês) — ainda não adaptei esta vaga para PT-BR.
                </div>
                <div
                  className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:text-rc-ink prose-p:text-rc-ink-3 prose-a:text-rc-blue-link prose-strong:text-rc-ink prose-li:text-rc-ink-3"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              </>
            ) : (
              <div className={cardClasses({ className: 'p-5 text-rc-body text-rc-ink-3 md:p-6' })}>
                <p>
                  A descrição completa desta vaga não está disponível aqui no momento, mas a
                  indicação está aberta — preencha os dados ao lado que eu levo adiante.
                </p>
              </div>
            )}
          </div>

          {/* Coluna direita: form sticky */}
          <aside className="lg:sticky lg:top-24">
            <div className="mb-4">
              <h2 className="text-rc-h2-m font-semibold text-rc-ink md:text-rc-h2">Indicar alguém</h2>
              <p className="mt-1.5 text-rc-small text-rc-ink-4">
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
    </Layout>
  );
}
