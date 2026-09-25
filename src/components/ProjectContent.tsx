'use client';

import { ArrowLeft, ExternalLink, Github, Globe } from 'lucide-react';
import Layout from './Layout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Project } from '@/lib/types';
import { cn, formatDate } from '@/lib/utils';
import { TrackedLink } from './TrackedLink';
import { authorInfo } from '@/lib/config/constants';
import { useFeatureFlags } from '@/hooks/use-feature-flag';
import ShareButtons from './ShareButtons';
import { ButtonLink, Eyebrow, Pill, RcImage, buttonClasses, cardClasses } from '@/components/rc';

interface ProjectContentProps {
  project: Project;
}

// Tipografia do case (markdown) nos tokens do rebranding. Listas numeradas viram
// passos em cartão ("O loop completo"), com numeração mono 01, 02…
const caseProse = cn(
  'text-rc-ink-3',
  // parágrafos
  '[&_p]:my-4 [&_p]:text-rc-article-m md:[&_p]:my-[22px] md:[&_p]:text-rc-article [&_p]:[text-wrap:pretty]',
  // títulos
  '[&_h1]:mb-0 [&_h1]:mt-[30px] [&_h1]:text-[24px] [&_h1]:font-semibold [&_h1]:tracking-[-.03em] [&_h1]:text-rc-ink md:[&_h1]:mt-10 md:[&_h1]:text-[32px]',
  '[&_h2]:mb-0 [&_h2]:mt-[30px] [&_h2]:text-[21px] [&_h2]:font-semibold [&_h2]:tracking-[-.028em] [&_h2]:text-rc-ink md:[&_h2]:mt-10 md:[&_h2]:text-rc-h2-article md:[&_h2]:tracking-[-.028em]',
  '[&_h3]:mb-0 [&_h3]:mt-6 [&_h3]:text-[17.5px] [&_h3]:font-semibold [&_h3]:tracking-[-.02em] [&_h3]:text-rc-ink md:[&_h3]:mt-8 md:[&_h3]:text-[21px]',
  '[&_h4]:mb-0 [&_h4]:mt-5 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-rc-ink md:[&_h4]:text-[17px]',
  // ênfase e links
  '[&_strong]:font-semibold [&_strong]:text-rc-ink',
  '[&_a]:text-rc-blue-link [&_a]:underline-offset-2 hover:[&_a]:text-rc-blue-soft',
  // listas simples
  '[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-[15.5px] [&_ul]:leading-[1.7] md:[&_ul]:text-[17px] [&_li]:marker:text-rc-ink-6',
  // listas numeradas = passos em cartão
  '[&_ol]:my-4 [&_ol]:flex [&_ol]:list-none [&_ol]:flex-col [&_ol]:gap-2.5 [&_ol]:pl-0 [&_ol]:[counter-reset:rc-step] md:[&_ol]:my-5 md:[&_ol]:gap-3',
  '[&_ol>li]:relative [&_ol>li]:m-0 [&_ol>li]:rounded-xl [&_ol>li]:border [&_ol>li]:border-rc-border-card [&_ol>li]:bg-rc-surface [&_ol>li]:py-3.5 [&_ol>li]:pl-[55px] [&_ol>li]:pr-[15px] [&_ol>li]:text-[14.5px] [&_ol>li]:leading-[1.55] [&_ol>li]:text-rc-ink-3 [&_ol>li]:[counter-increment:rc-step]',
  'md:[&_ol>li]:py-[18px] md:[&_ol>li]:pl-[70px] md:[&_ol>li]:pr-5 md:[&_ol>li]:text-[16.5px] md:[&_ol>li]:leading-[1.65] md:[&_ol>li]:text-rc-ink-2',
  "[&_ol>li]:before:absolute [&_ol>li]:before:left-[15px] [&_ol>li]:before:top-[16px] [&_ol>li]:before:font-mono [&_ol>li]:before:text-[11px] [&_ol>li]:before:text-rc-blue-link [&_ol>li]:before:content-[counter(rc-step,decimal-leading-zero)]",
  'md:[&_ol>li]:before:left-5 md:[&_ol>li]:before:top-[21px] md:[&_ol>li]:before:text-[13px]',
  '[&_ol>li_p]:my-0 [&_ol>li_p]:text-[length:inherit] [&_ol>li_p]:leading-[inherit]',
  // citação
  '[&_blockquote]:my-6 [&_blockquote]:rounded-r-xl [&_blockquote]:border-l-[3px] [&_blockquote]:border-rc-amber [&_blockquote]:bg-rc-surface-2 [&_blockquote]:px-[18px] [&_blockquote]:py-4 [&_blockquote]:italic md:[&_blockquote]:my-7 md:[&_blockquote]:px-[22px] md:[&_blockquote]:py-[18px]',
  '[&_blockquote_p]:my-0 [&_blockquote_p]:text-[15.5px] [&_blockquote_p]:leading-[1.7] [&_blockquote_p]:text-rc-ink-2 md:[&_blockquote_p]:text-[17px]',
  // código inline
  '[&_p>code]:rounded-[5px] [&_p>code]:border [&_p>code]:border-rc-border-chip [&_p>code]:bg-rc-tag [&_p>code]:px-1.5 [&_p>code]:py-0.5 [&_p>code]:text-[0.8em] [&_p>code]:text-rc-ink-2',
  '[&_li>code]:rounded-[5px] [&_li>code]:border [&_li>code]:border-rc-border-chip [&_li>code]:bg-rc-tag [&_li>code]:px-1.5 [&_li>code]:py-0.5 [&_li>code]:text-[0.85em] [&_li>code]:text-rc-ink-2',
  // imagens, divisores
  '[&_img]:rounded-rc-card [&_img]:border [&_img]:border-rc-border-card',
  '[&_hr]:my-8 [&_hr]:border-rc-border',
);

// Ficha técnica: na sidebar (desktop) e no fim do case (mobile).
function ProjectFacts({ project, showLinks = true }: { project: Project; showLinks?: boolean }) {
  const isPrivate = !project.repoUrl && !project.liveUrl;
  const hasLinks = showLinks && (project.repoUrl || project.liveUrl);

  return (
    <div className={cardClasses({ className: 'p-[18px] md:p-5' })}>
      <Eyebrow>Ficha técnica</Eyebrow>

      {project.role && (
        <>
          <div className="mt-4 font-mono text-[10.5px] uppercase tracking-[.1em] text-rc-ink-5">Papel</div>
          <div className="mt-1.5 text-[15px] font-medium text-rc-ink">{project.role}</div>
        </>
      )}

      {project.tags && project.tags.length > 0 && (
        <>
          <div className="mt-[18px] font-mono text-[10.5px] uppercase tracking-[.1em] text-rc-ink-5">Stack</div>
          <div className="mt-[9px] flex flex-wrap gap-1.5 font-mono text-[10.5px] text-rc-ink-4">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-md border border-rc-border-chip px-2 py-1">
                {tag}
              </span>
            ))}
          </div>
        </>
      )}

      {(hasLinks || isPrivate) && (
        <div className="mt-[18px] border-t border-rc-border-card pt-3.5">
          {hasLinks && (
            <div className="flex flex-col gap-2">
              {project.repoUrl && (
                <ButtonLink href={project.repoUrl} external variant="secondary" size="sm" className="h-10 justify-start">
                  <Github className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  Ver código no GitHub
                </ButtonLink>
              )}
              {project.liveUrl && (
                <ButtonLink href={project.liveUrl} external size="sm" className="h-10 justify-start">
                  <Globe className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  Ver projeto no ar
                </ButtonLink>
              )}
            </div>
          )}
          {isPrivate && (
            <p className="text-[13.5px] leading-[1.6] text-rc-ink-4">
              Código privado — o case detalha a arquitetura e as decisões técnicas.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProjectContent({ project }: ProjectContentProps) {
  const projectUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/projetos/${project.slug}`
    : '';

  // Feature Flags
  const { flags } = useFeatureFlags(['share', 'newsletter']);

  const contactHref = `mailto:${authorInfo.email}?subject=${encodeURIComponent(`Sobre o projeto: ${project.title}`)}`;

  return (
    <Layout>
      {/* Voltar */}
      <div className="rc-container pt-2 md:pt-8">
        <TrackedLink
          href="/projetos"
          label="Voltar para projetos"
          className="-ml-1 inline-flex h-11 items-center gap-1.5 px-1 font-mono text-xs text-rc-ink-4 transition-colors duration-150 hover:text-rc-blue-link md:ml-0 md:h-auto md:px-0"
        >
          <ArrowLeft className="h-3.5 w-3.5 md:hidden" aria-hidden="true" />
          <span className="hidden md:inline" aria-hidden="true">←</span>
          voltar para projetos
        </TrackedLink>
      </div>

      <div className="rc-container grid grid-cols-1 items-start gap-8 pb-7 pt-3 md:pb-14 md:pt-[26px] lg:grid-cols-[1fr_320px] lg:gap-12">
        <article className="min-w-0">
          {/* Cabeçalho */}
          <header>
            <div className="flex items-center gap-[11px]">
              <span
                aria-hidden="true"
                className="grid h-11 w-11 place-items-center rounded-xl border border-rc-amber-border bg-rc-amber-surface font-mono text-lg text-rc-amber md:hidden"
              >
                {project.title.charAt(0).toUpperCase()}
              </span>
              <Pill tone="amber" className="md:px-3 md:py-1.5 md:text-[11px] md:tracking-[.1em]">Projeto</Pill>
            </div>

            <h1 className="mt-4 max-w-[24ch] break-words text-[29px] font-semibold leading-[1.15] tracking-[-.033em] text-rc-ink [text-wrap:balance] md:mt-5 md:text-[48px] md:leading-[1.14] md:tracking-[-.04em]">
              {project.title}
            </h1>

            {project.excerpt && (
              <p className="mt-3 max-w-[60ch] text-[16.5px] leading-[1.68] text-rc-ink-3 [text-wrap:pretty] md:mt-5 md:text-rc-lead md:text-rc-ink-2">
                {project.excerpt}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-b border-rc-border pb-5 font-mono text-[11.5px] text-rc-ink-5 md:mt-[22px] md:pb-[26px] md:text-xs">
              <time dateTime={project.date}>{formatDate(project.date)}</time>
              {project.role && <span className="lowercase">{project.role}</span>}
            </div>
          </header>

          {/* Capa */}
          {project.coverImage && (
            <RcImage
              src={project.coverImage}
              alt={project.title}
              ratio="16/9"
              className="mt-6 rounded-rc-card border border-rc-border-card md:mt-7"
            />
          )}

          {/* Mobile Share Buttons */}
          {flags.share && (
            <ShareButtons title={project.title} url={projectUrl} variant="inline" className="mt-6 lg:hidden" />
          )}

          {/* Conteúdo do Projeto (spec, arquitetura, decisões) */}
          <div className={cn('mt-2 md:mt-3', caseProse)}>
            <MarkdownRenderer content={project.content} />
          </div>

          {/* Ficha técnica no mobile (na sidebar em telas grandes) */}
          <div className="mt-8 lg:hidden">
            <ProjectFacts project={project} showLinks={false} />
          </div>

          {/* Ações no mobile: GitHub + link externo */}
          {(project.repoUrl || project.liveUrl) && (
            <div className="mt-4 flex gap-2.5 lg:hidden">
              {project.repoUrl ? (
                <ButtonLink href={project.repoUrl} external size="lg" className="flex-1 rounded-xl">
                  <Github className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                  Ver no GitHub
                </ButtonLink>
              ) : (
                <ButtonLink href={project.liveUrl!} external size="lg" className="flex-1 rounded-xl">
                  <Globe className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                  Ver projeto no ar
                </ButtonLink>
              )}
              {project.repoUrl && project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ver projeto no ar"
                  className={cardClasses({ interactive: true, className: 'grid h-12 w-12 shrink-0 place-items-center rounded-xl text-rc-ink-3' })}
                >
                  <ExternalLink className="h-[19px] w-[19px]" strokeWidth={1.75} aria-hidden="true" />
                </a>
              )}
            </div>
          )}

          {/* Call to Action - Contato */}
          <div className="mt-8 flex flex-col gap-4 rounded-rc-card-lg border border-rc-blue-border bg-rc-blue-surface px-[18px] py-[22px] md:mt-9 md:flex-row md:items-center md:justify-between md:gap-7 md:p-7">
            <div>
              <h2 className="text-[19px] font-semibold tracking-[-.02em] text-rc-ink md:text-[21px]">Curtiu o projeto?</h2>
              <p className="mt-2 max-w-[52ch] text-[14.5px] leading-[1.6] text-rc-ink-3 md:text-rc-body">
                Se quiser conversar sobre esse projeto, arquitetura ou uma oportunidade de trabalho, é só me chamar.
              </p>
            </div>
            <ButtonLink href={contactHref} size="lg" className="min-w-0 shrink rounded-xl md:h-auto md:rounded-[10px] md:px-5 md:py-[13px]">
              <span className="truncate">{authorInfo.email}</span>
            </ButtonLink>
          </div>
        </article>

        {/* Sidebar Direita */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-4">
            <ProjectFacts project={project} />

            {/* Author Card */}
            <div className={cardClasses({ className: 'p-5' })}>
              <Eyebrow>Sobre o autor</Eyebrow>
              <div className="mt-3.5 flex items-center gap-3.5">
                <RcImage src={authorInfo.avatar} alt={authorInfo.name} ratio="1/1" className="w-12 shrink-0 rounded-full border border-rc-photo-border" />
                <div>
                  <p className="text-base font-semibold text-rc-ink">{authorInfo.name}</p>
                  <p className="mt-0.5 text-[13px] text-rc-ink-4">{authorInfo.title}</p>
                </div>
              </div>
              <p className="mt-3.5 text-rc-small text-rc-ink-4">{authorInfo.bio}</p>
              <TrackedLink
                href={authorInfo.profileUrl}
                label="Ver perfil completo"
                className="mt-3 inline-block text-[13.5px] font-medium text-rc-blue-link transition-colors hover:text-rc-blue-soft"
              >
                Ver perfil completo →
              </TrackedLink>
            </div>

            {/* Share Buttons */}
            {flags.share && (
              <ShareButtons title={project.title} url={projectUrl} variant="sidebar" />
            )}

            {/* Newsletter CTA */}
            {flags.newsletter && (
              <div className="rounded-rc-card border border-rc-blue-border bg-rc-blue-surface p-5">
                <h3 className="text-[17px] font-semibold tracking-[-.02em] text-rc-ink">Newsletter</h3>
                <p className="mt-2.5 text-rc-small text-rc-ink-3">
                  Receba novos projetos, artigos e desafios direto no seu email.
                </p>
                <TrackedLink
                  href="/newsletter"
                  label="Assinar newsletter"
                  className={buttonClasses({ size: 'sm', className: 'mt-3.5 h-11 w-full rounded-[9px] text-[14.5px]' })}
                >
                  Assinar newsletter
                </TrackedLink>
              </div>
            )}
          </div>
        </aside>
      </div>
    </Layout>
  );
}
