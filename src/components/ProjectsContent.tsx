'use client';

import { useMemo, useState } from 'react';
import { PROJECT_KIND_LABEL, ProjectKind, ProjectMeta } from '@/lib/types';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';
import { ArrowUpRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { Button, ButtonLink, Chip, EmptyState, Eyebrow, cardClasses } from '@/components/rc';
import { ProjectIcon, resolveProjectIcon } from '@/components/projects/ProjectIcon';

interface ProjectsContentProps {
  projects: ProjectMeta[];
  tags: string[];
  initialKind?: string;
}

const KIND_ORDER = Object.keys(PROJECT_KIND_LABEL) as ProjectKind[];

// Ordem: featured, order, date desc; arquivados sempre no fim.
function sortProjects(list: ProjectMeta[]): ProjectMeta[] {
  return [...list].sort((a, b) => {
    const archA = a.stage === 'arquivado' ? 1 : 0;
    const archB = b.stage === 'arquivado' ? 1 : 0;
    if (archA !== archB) return archA - archB;
    if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// Sem filtro ativo, a página vira um portfólio em seções: produtos no ar
// primeiro (cards grandes, com link direto), depois o resto agrupado por tipo,
// o que está em construção e, por fim, os arquivados.
interface ProjectSection {
  id: string;
  title: string;
  description: string;
  projects: ProjectMeta[];
  variant: 'product' | 'compact';
}

function buildSections(projects: ProjectMeta[]): ProjectSection[] {
  const live = projects.filter((p) => p.stage !== 'wip' && p.stage !== 'arquivado');
  const byKind = (kinds: (ProjectKind | undefined)[]) => live.filter((p) => kinds.includes(p.kind));
  const sections: ProjectSection[] = [
    { id: 'produtos', title: 'Produtos no ar', description: 'SaaS que eu construí e mantenho, com gente usando.', projects: byKind(['saas']), variant: 'product' },
    { id: 'open-source', title: 'Open source e ferramentas', description: 'Código aberto e utilitários para o dia a dia de dev.', projects: byKind(['open-source', 'ferramenta']), variant: 'compact' },
    { id: 'experimentos', title: 'Jogos e experimentos', description: 'Onde eu testo ideias, tecnologias e um pouco de diversão.', projects: byKind(['experimento']), variant: 'compact' },
    { id: 'clientes', title: 'Para clientes', description: 'Sistemas sob medida, com código privado.', projects: byKind(['cliente']), variant: 'compact' },
    { id: 'outros', title: 'Outros projetos', description: '', projects: byKind([undefined]), variant: 'compact' },
    { id: 'em-construcao', title: 'Em construção', description: 'O que está saindo do forno agora.', projects: projects.filter((p) => p.stage === 'wip'), variant: 'compact' },
    { id: 'arquivados', title: 'Arquivados', description: 'Projetos encerrados, mantidos aqui pelo registro técnico.', projects: projects.filter((p) => p.stage === 'arquivado'), variant: 'compact' },
  ];
  return sections.filter((section) => section.projects.length > 0);
}

export default function ProjectsContent({ projects: rawProjects, initialKind }: ProjectsContentProps) {
  const projects = useMemo(() => sortProjects(rawProjects), [rawProjects]);

  // Tipos presentes (só eles viram chip)
  const kinds = useMemo(
    () => KIND_ORDER.filter((kind) => projects.some((p) => p.kind === kind)),
    [projects],
  );

  const [selectedKind, setSelectedKind] = useState<ProjectKind | null>(
    kinds.includes(initialKind as ProjectKind) ? (initialKind as ProjectKind) : null,
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Reflete o tipo em ?tipo= sem recarregar a página
  const selectKind = (kind: ProjectKind | null) => {
    setSelectedKind(kind);
    try {
      const url = new URL(window.location.href);
      if (kind) url.searchParams.set('tipo', kind);
      else url.searchParams.delete('tipo');
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    } catch {
      // ignora
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesKind = !selectedKind || project.kind === selectedKind;
    const matchesTag = !selectedTag || project.tags?.includes(selectedTag);
    const matchesSearch = !searchTerm ||
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesKind && matchesTag && matchesSearch;
  });

  // Get tag counts
  const tagCounts = projects.reduce((acc, project) => {
    project.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  const hasFilters = !!(selectedTag || searchTerm || selectedKind);
  const sections = useMemo(() => buildSections(projects), [projects]);

  const clearFilters = () => {
    setSelectedTag(null);
    setSearchTerm('');
    selectKind(null);
  };

  return (
    <Layout>
      {/* Cabeçalho */}
      <section className="relative overflow-hidden border-b border-rc-border">
        <div className="rc-dots-bg hidden md:block" />
        <div className="rc-dots-fade hidden md:block" />
        <div className="rc-container relative pb-5 pt-6 md:pb-9 md:pt-[52px]">
          <Eyebrow className="text-rc-amber-num md:text-[11.5px] md:text-rc-amber">Portfólio</Eyebrow>
          <h1 className="mt-[9px] text-rc-h1-m font-semibold text-rc-ink md:mt-3.5 md:text-[42px] md:leading-[1.12] md:tracking-[-.035em]">Projetos</h1>
          <p className="mt-[9px] max-w-[56ch] text-[15px] leading-[1.6] text-rc-ink-3 md:mt-3 md:text-[17.5px]">
            Especificação, arquitetura e decisões técnicas por trás de cada projeto — inclusive dos privados.
          </p>

          <div className="mt-4 flex gap-2.5 md:mt-[26px] md:gap-3">
            <label className="flex h-12 min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-rc-border-chip bg-rc-surface px-3.5 text-rc-ink-6 transition-colors focus-within:border-rc-blue-link md:h-[50px] md:rounded-[10px]">
              <Search className="h-[17px] w-[17px] shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <span className="sr-only">Buscar projetos</span>
              <input
                type="search"
                placeholder="Buscar projetos…"
                className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-rc-ink outline-none placeholder:text-rc-ink-6"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm('')} className="-mr-2 grid h-11 w-11 place-items-center text-rc-ink-5 hover:text-rc-ink" aria-label="Limpar busca">
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
            {popularTags.length > 0 && (
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                className={cn(
                  'flex h-12 shrink-0 items-center gap-2 rounded-xl border px-4 text-[15px] transition-colors duration-150 md:h-[50px] md:rounded-[10px] md:px-[18px]',
                  showFilters || selectedTag
                    ? 'border-rc-amber-border bg-rc-amber-surface text-rc-amber'
                    : 'border-rc-border-chip bg-rc-surface text-rc-ink hover:border-rc-border-hover',
                )}
              >
                <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                Filtros
              </button>
            )}
          </div>

          {/* Filtro por tipo */}
          {kinds.length > 0 && (
            <div
              role="group"
              aria-label="Filtrar por tipo"
              className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:mt-4 md:flex-wrap md:overflow-visible md:px-0"
            >
              <Chip active={!selectedKind} onClick={() => selectKind(null)} className="h-11 font-sans text-[13.5px] md:h-9">
                Todos
              </Chip>
              {kinds.map((kind) => (
                <Chip
                  key={kind}
                  active={selectedKind === kind}
                  onClick={() => selectKind(selectedKind === kind ? null : kind)}
                  className="h-11 font-sans text-[13.5px] md:h-9"
                >
                  {PROJECT_KIND_LABEL[kind]}
                </Chip>
              ))}
            </div>
          )}

          {showFilters && popularTags.length > 0 && (
            <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:mt-4 md:flex-wrap md:overflow-visible md:px-0">
              <Chip active={!selectedTag} onClick={() => setSelectedTag(null)} className="h-11 md:h-9">
                todos · {projects.length}
              </Chip>
              {popularTags.map(([tag, count]) => (
                <Chip
                  key={tag}
                  active={selectedTag === tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className="h-11 md:h-9"
                >
                  {tag} · {count}
                </Chip>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="rc-container pb-7 pt-[18px] md:pb-14 md:pt-7">
        {/* Resultado */}
        <div className="mb-3 flex min-h-[20px] items-center justify-between gap-2 font-mono text-xs text-rc-ink-5 md:mb-3.5 md:text-[12.5px]">
          {hasFilters ? (
            <p>
              <b className="font-medium text-rc-ink">{filteredProjects.length}</b>{' '}
              {filteredProjects.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}
            </p>
          ) : (
            <nav aria-label="Seções" className="-mx-1 flex flex-wrap gap-x-1 gap-y-0.5">
              {sections.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="rounded px-1 py-0.5 hover:text-rc-ink">
                  {section.title.toLowerCase()} <b className="font-medium text-rc-ink">{section.projects.length}</b>
                </a>
              ))}
            </nav>
          )}
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="-my-3 flex h-11 items-center gap-1 text-rc-amber transition-colors hover:text-rc-amber-hover">
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              limpar filtros
            </button>
          )}
        </div>

        {!hasFilters ? (
          <div className="space-y-9 md:space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-20">
                <div className="mb-3 flex items-baseline justify-between gap-3 md:mb-4">
                  <div>
                    <h2 id={`${section.id}-title`} className="text-[18px] font-semibold tracking-[-.02em] text-rc-ink md:text-[22px]">
                      {section.title}
                    </h2>
                    {section.description && (
                      <p className="mt-1 text-[13.5px] leading-[1.5] text-rc-ink-4 md:text-rc-small">{section.description}</p>
                    )}
                  </div>
                  <span className="shrink-0 font-mono text-xs text-rc-ink-5">{section.projects.length}</span>
                </div>
                {section.variant === 'product' ? (
                  <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3.5">
                    {section.projects.map((project) => (
                      <ProductCard key={project.slug} project={project} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 md:gap-3.5 lg:grid-cols-3">
                    {section.projects.map((project) => (
                      <ProjectCard key={project.slug} project={project} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5 md:gap-3.5 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            message="Nenhum projeto encontrado com esses filtros."
            action={
              <Button variant="secondary" size="lg" onClick={clearFilters}>
                Limpar filtros
              </Button>
            }
          />
        )}

        {/* CTA */}
        <div className="mt-6 flex flex-col gap-4 rounded-rc-card-lg border border-rc-blue-border bg-rc-blue-surface px-[18px] py-[22px] md:mt-7 md:flex-row md:items-center md:justify-between md:gap-7 md:p-7">
          <div>
            <h2 className="text-[19px] font-semibold tracking-[-.02em] text-rc-ink md:text-[21px]">Quer trocar uma ideia?</h2>
            <p className="mt-2 text-[14.5px] leading-[1.6] text-rc-ink-3 md:text-rc-body">
              Confira meus artigos e desafios, ou entre em contato pelas redes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5 md:flex md:shrink-0">
            <ButtonLink href="/posts" size="lg" className="rounded-[11px] md:rounded-[10px]">
              Ver artigos
            </ButtonLink>
            <ButtonLink href="/links" variant="secondary" size="lg" className="rounded-[11px] md:rounded-[10px]">
              Minhas redes
            </ButtonLink>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ProjectCard({ project }: { project: ProjectMeta }) {
  const isPrivate = !project.repoUrl && !project.liveUrl;
  const isWip = project.stage === 'wip';
  const isArchived = project.stage === 'arquivado';
  const hasIcon = !!resolveProjectIcon(project.icon);
  const tags = project.tags ?? [];
  const extra = tags.length - 3;

  return (
    <Link
      href={`/projetos/${project.slug}`}
      className={cardClasses({
        interactive: true,
        className: cn(
          'flex flex-col gap-[9px] rounded-[13px] p-3.5 md:min-h-[214px] md:gap-2.5 md:rounded-rc-card md:p-5',
          isArchived && 'opacity-70',
        ),
      })}
    >
      {/* Mobile: quadrado do ícone (ou inicial do título) */}
      <div className="flex items-start justify-between gap-2 md:hidden">
        <ProjectIcon project={project} />
        {(isWip || isPrivate) && (
          <div className="flex flex-col items-end gap-1">
            {isWip && <StagePill>wip</StagePill>}
                {isPrivate && !isWip && <PrivateBadge />}
          </div>
        )}
      </div>

      {/* Desktop: ícone (se houver) + papel + selos */}
      <div className="hidden flex-wrap items-center gap-2 md:flex">
        {hasIcon && <ProjectIcon project={project} className="mr-1" />}
        <span className="font-mono text-[9.5px] uppercase tracking-[.1em] text-rc-amber">{project.kind ? PROJECT_KIND_LABEL[project.kind] : project.role || 'Projeto'}</span>
        {isWip && <StagePill>wip</StagePill>}
        {isPrivate && <PrivateBadge />}
      </div>

      <h2 className="line-clamp-3 text-[14.5px] font-semibold leading-[1.3] tracking-[-.018em] text-rc-ink md:text-rc-card-title">
        {project.title}
      </h2>
      {project.excerpt && (
        <p className="line-clamp-2 text-[12.5px] leading-[1.45] text-rc-ink-4 md:line-clamp-3 md:text-rc-small">{project.excerpt}</p>
      )}

      {tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-[5px] font-mono text-[9.5px] text-rc-ink-4 md:gap-1.5 md:text-[10px]">
          {tags.slice(0, 3).map((tag, i) => (
            <span
              key={tag}
              className={cn(
                'rounded-full border border-rc-border-chip px-[7px] py-[3px] md:rounded-md md:py-1',
                i > 1 && 'hidden md:inline',
              )}
            >
              {tag}
            </span>
          ))}
          {extra > 0 && (
            <span className="hidden rounded-md border border-rc-border-chip px-[7px] py-1 text-rc-ink-5 md:inline">+{extra}</span>
          )}
        </div>
      )}

      <div className={cn('hidden items-center justify-between border-t border-rc-border-card pt-[11px] md:flex', tags.length === 0 && 'mt-auto')}>
        <span className="font-mono text-[10px] text-rc-ink-5">{isPrivate ? 'spec & arquitetura' : project.liveUrl ? 'site no ar' : 'código aberto'}</span>
        <span className="text-[13.5px] font-medium text-rc-blue-link">Ver case →</span>
      </div>
    </Link>
  );
}

function ProductCard({ project }: { project: ProjectMeta }) {
  const tags = project.tags ?? [];
  const host = project.liveUrl ? project.liveUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : null;

  return (
    <article className={cardClasses({ interactive: true, className: 'group relative flex flex-col gap-3 rounded-rc-card p-4 md:gap-3.5 md:p-6' })}>
      <div className="flex items-start gap-3">
        <ProjectIcon project={project} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="text-[16.5px] font-semibold leading-[1.3] tracking-[-.02em] text-rc-ink md:text-[19px]">
            {/* O link do título cobre o card inteiro; o "Abrir" fica por cima. */}
            <Link href={`/projetos/${project.slug}`} className="after:absolute after:inset-0 after:rounded-rc-card focus-visible:outline-none">
              {project.title}
            </Link>
          </h3>
          {host && <p className="mt-1 truncate font-mono text-[11.5px] text-rc-ink-5">{host}</p>}
        </div>
      </div>

      {project.excerpt && (
        <p className="line-clamp-2 text-[13.5px] leading-[1.55] text-rc-ink-3 md:line-clamp-3 md:text-rc-small">{project.excerpt}</p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-rc-ink-4">
          {tags.slice(0, 5).map((tag, i) => (
            <span key={tag} className={cn('rounded-md border border-rc-border-chip px-[7px] py-1', i > 2 && 'hidden md:inline')}>{tag}</span>
          ))}
          {tags.length > 3 && (
            <span className="rounded-md border border-rc-border-chip px-[7px] py-1 text-rc-ink-5 md:hidden">+{tags.length - 3}</span>
          )}
          {tags.length > 5 && (
            <span className="hidden rounded-md border border-rc-border-chip px-[7px] py-1 text-rc-ink-5 md:inline">+{tags.length - 5}</span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-rc-border-card pt-3">
        <span className="text-[13.5px] font-medium text-rc-blue-link">Ver case →</span>
        {project.liveUrl && (
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
        )}
      </div>
    </article>
  );
}

function PrivateBadge() {
  return (
    <span className="whitespace-nowrap rounded-full border border-rc-border-chip px-[7px] py-[3px] font-mono text-[9px] uppercase tracking-[.06em] text-rc-ink-4">
      <span className="md:hidden">privado</span>
      <span className="hidden md:inline">código privado</span>
    </span>
  );
}

function StagePill({ children }: { children: string }) {
  return (
    <span className="whitespace-nowrap rounded-full border border-rc-border-chip px-[7px] py-[3px] font-mono text-[9px] uppercase tracking-[.06em] text-rc-ink-4">
      {children}
    </span>
  );
}
