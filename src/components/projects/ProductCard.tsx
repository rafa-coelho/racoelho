import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PROJECT_KIND_LABEL, ProjectMeta } from '@/lib/types';
import { cn } from '@/lib/utils';
import { RcImage, cardClasses } from '@/components/rc';
import { isProduct } from '@/lib/utils/projects';
import { BrowserBar } from './BrowserBar';
import { ProductCta } from './ProductCta';
import { ProjectIcon } from './ProjectIcon';

export function StagePill({ children }: { children: string }) {
  return (
    <span className="whitespace-nowrap rounded-full border border-rc-border-chip px-[7px] py-[3px] font-mono text-[9px] uppercase tracking-[.06em] text-rc-ink-4">
      {children}
    </span>
  );
}

// Card com link direto pro site. Produto mostra a oferta e o botão; o resto, as tags e o "Abrir".
// O "featured" é o dos destaques: traz a capa do produto no lugar da barra de endereço.
export function ProductCard({ project, placement, featured = false }: { project: ProjectMeta; placement: string; featured?: boolean }) {
  const product = isProduct(project);
  const tags = project.tags ?? [];
  const host = project.liveUrl ? project.liveUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : null;

  return (
    <article className={cardClasses({ interactive: true, className: 'group relative flex flex-col overflow-hidden rounded-rc-card' })}>
      {featured && project.coverImage ? (
        <RcImage src={project.coverImage} alt="" ratio="16/9" className="border-b border-rc-border-card" />
      ) : (
        host && <BrowserBar host={host} />
      )}
      <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
        <div className="flex items-start gap-3">
          <ProjectIcon project={project} size="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="text-[16.5px] font-semibold leading-[1.3] tracking-[-.02em] text-rc-ink md:text-[17px]">
              {/* O link do título cobre o card inteiro; o botão fica por cima. */}
              <Link href={`/projetos/${project.slug}`} className="after:absolute after:inset-0 after:rounded-rc-card focus-visible:outline-none">
                {project.title}
              </Link>
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {project.kind && <span className="font-mono text-[9.5px] uppercase tracking-[.1em] text-rc-amber">{PROJECT_KIND_LABEL[project.kind]}</span>}
              {project.stage === 'wip' && <StagePill>wip</StagePill>}
            </div>
          </div>
        </div>

        {project.excerpt && <p className="line-clamp-3 text-[13.5px] leading-[1.55] text-rc-ink-3">{project.excerpt}</p>}

        {product ? (
          project.offer && <p className="text-[13px] font-medium leading-[1.45] text-rc-green">{project.offer}</p>
        ) : (
          tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-rc-ink-4">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-md border border-rc-border-chip px-[7px] py-1">{tag}</span>
              ))}
              {tags.length > 3 && <span className="rounded-md border border-rc-border-chip px-[7px] py-1 text-rc-ink-5">+{tags.length - 3}</span>}
            </div>
          )
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-rc-border-card pt-3">
          <span className="text-[13.5px] font-medium text-rc-blue-link">{product ? 'Ver detalhes →' : 'Ver case →'}</span>
          {product ? (
            <ProductCta project={project} placement={placement} className="relative z-10 h-10 rounded-[9px]" />
          ) : (
            project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 -my-2 inline-flex h-10 items-center gap-1 rounded-lg px-2.5 text-[13.5px] font-medium text-rc-ink-3 transition-colors hover:bg-rc-surface-2 hover:text-rc-ink"
              >
                Abrir
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                <span className="sr-only">{project.title} (abre em nova aba)</span>
              </a>
            )
          )}
        </div>
      </div>
    </article>
  );
}
