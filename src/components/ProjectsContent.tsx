'use client';

import { useMemo, useState } from 'react';
import { PROJECT_KIND_LABEL, ProjectMeta, ProjectStage } from '@/lib/types';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';
import { ArrowUpRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { isProduct } from '@/lib/utils/projects';
import { Button, ButtonLink, Chip, EmptyState, Eyebrow, cardClasses } from '@/components/rc';
import { ProjectIcon } from '@/components/projects/ProjectIcon';
import { ProductCard, StagePill } from '@/components/projects/ProductCard';

interface ProjectsContentProps {
  projects: ProjectMeta[];
  tags: string[];
  initialKind?: string;
}

type ProjectGroup = 'apps' | 'sistemas' | 'comunidade' | 'jogos' | 'open-source' | 'clientes' | 'outros';

const GROUP_LABEL: Record<ProjectGroup, string> = {
  apps: 'Apps para usar',
  sistemas: 'Sistemas',
  comunidade: 'Comunidade',
  jogos: 'Jogos e 3D',
  'open-source': 'Open source e ferramentas',
  clientes: 'Para clientes',
  outros: 'Outros',
};

// ?tipo= aceita o grupo e também os tipos antigos, para links já divulgados.
const TIPO_TO_GROUP: Record<string, ProjectGroup> = {
  apps: 'apps', app: 'apps', saas: 'apps', sistemas: 'sistemas', comunidade: 'comunidade', jogos: 'jogos', jogo: 'jogos',
  experimento: 'jogos', 'open-source': 'open-source', ferramenta: 'open-source', clientes: 'clientes', cliente: 'clientes',
};

const STAGE_FILTERS: { stage: ProjectStage; label: string }[] = [
  { stage: 'live', label: 'No ar' },
  { stage: 'wip', label: 'Em construção' },
];

function groupOf(project: ProjectMeta): ProjectGroup {
  if (isProduct(project)) return 'apps';
  switch (project.kind) {
    case 'app':
    case 'saas':
      return 'sistemas';
    case 'comunidade':
      return 'comunidade';
    case 'jogo':
    case 'experimento':
      return 'jogos';
    case 'open-source':
    case 'ferramenta':
      return 'open-source';
    case 'cliente':
      return 'clientes';
    default:
      return 'outros';
  }
}

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

// Sem filtro ativo, a página abre com o que dá para usar agora; o resto é o portfólio
// técnico, por grupo. O que está em construção fica no próprio grupo, depois dos que estão no ar.
interface ProjectSection {
  id: ProjectGroup | 'destaque' | 'arquivados';
  title: string;
  description: string;
  projects: ProjectMeta[];
  variant: 'feature' | 'product' | 'compact';
}

function buildSections(projects: ProjectMeta[]): ProjectSection[] {
  const active = projects.filter((p) => p.stage !== 'arquivado');
  // Estável: mantém a ordem de sortProjects e só joga o "wip" para o fim do grupo.
  const inGroup = (group: ProjectGroup) =>
    active.filter((p) => groupOf(p) === group).sort((a, b) => Number(a.stage === 'wip') - Number(b.stage === 'wip'));
  const sections: ProjectSection[] = [
    { id: 'destaque', title: 'Em destaque', description: 'Os apps que acabei de lançar.', projects: active.filter((p) => p.featured), variant: 'feature' },
    { id: 'apps', title: GROUP_LABEL.apps, description: 'Mais produtos no ar, prontos para você testar agora.', projects: inGroup('apps').filter((p) => !p.featured), variant: 'product' },
    { id: 'sistemas', title: 'Outros sistemas e apps', description: 'Produtos em construção e sistemas de uso próprio.', projects: inGroup('sistemas'), variant: 'compact' },
    { id: 'comunidade', title: 'Para a comunidade dev', description: 'Sites abertos para quem programa.', projects: inGroup('comunidade'), variant: 'compact' },
    { id: 'jogos', title: GROUP_LABEL.jogos, description: 'Jogos, experimentos interativos e ferramentas para game dev.', projects: inGroup('jogos'), variant: 'compact' },
    { id: 'open-source', title: GROUP_LABEL['open-source'], description: 'Código aberto e utilitários para o dia a dia de dev.', projects: inGroup('open-source'), variant: 'compact' },
    { id: 'clientes', title: GROUP_LABEL.clientes, description: 'Sistemas sob medida, com código privado.', projects: inGroup('clientes'), variant: 'compact' },
    { id: 'outros', title: 'Outros projetos', description: '', projects: inGroup('outros'), variant: 'compact' },
    { id: 'arquivados', title: 'Arquivados', description: 'Projetos encerrados, mantidos aqui pelo registro técnico.', projects: projects.filter((p) => p.stage === 'arquivado'), variant: 'compact' },
  ];
  return sections.filter((section) => section.projects.length > 0);
}

export default function ProjectsContent({ projects: rawProjects, initialKind }: ProjectsContentProps) {
  const projects = useMemo(() => sortProjects(rawProjects), [rawProjects]);

  // Grupos presentes (só eles viram chip)
  const groups = useMemo(
    () => (Object.keys(GROUP_LABEL) as ProjectGroup[]).filter((group) => projects.some((p) => p.stage !== 'arquivado' && groupOf(p) === group)),
    [projects],
  );

  const initialGroup = initialKind ? TIPO_TO_GROUP[initialKind] : undefined;
  const [selectedGroup, setSelectedGroup] = useState<ProjectGroup | null>(initialGroup && groups.includes(initialGroup) ? initialGroup : null);
  const [selectedStage, setSelectedStage] = useState<ProjectStage | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Reflete o grupo em ?tipo= sem recarregar a página
  const selectGroup = (group: ProjectGroup | null) => {
    setSelectedGroup(group);
    try {
      const url = new URL(window.location.href);
      if (group) url.searchParams.set('tipo', group);
      else url.searchParams.delete('tipo');
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    } catch {
      // ignora
    }
  };

  const search = searchTerm.trim().toLowerCase();
  const filteredProjects = projects.filter(project => {
    const matchesGroup = !selectedGroup || (project.stage !== 'arquivado' && groupOf(project) === selectedGroup);
    const matchesStage = !selectedStage || project.stage === selectedStage;
    const matchesTag = !selectedTag || project.tags?.includes(selectedTag);
    const matchesSearch = !search ||
      [project.title, project.excerpt, ...(project.tags ?? []), ...(project.stack ?? [])].some((text) => text.toLowerCase().includes(search));
    return matchesGroup && matchesStage && matchesTag && matchesSearch;
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

  const hasFilters = !!(selectedTag || searchTerm || selectedGroup || selectedStage);
  const sections = useMemo(() => buildSections(projects), [projects]);

  const clearFilters = () => {
    setSelectedTag(null);
    setSearchTerm('');
    setSelectedStage(null);
    selectGroup(null);
  };

  return (
    <Layout>
      {/* Cabeçalho */}
      <section className="relative overflow-hidden border-b border-rc-border">
        <div className="rc-dots-bg hidden md:block" />
        <div className="rc-dots-fade hidden md:block" />
        <div className="rc-container relative pb-5 pt-6 md:pb-9 md:pt-[52px]">
          <Eyebrow className="text-rc-amber-num md:text-[11.5px] md:text-rc-amber">Produtos</Eyebrow>
          <h1 className="mt-[9px] text-rc-h1-m font-semibold text-rc-ink md:mt-3.5 md:text-[42px] md:leading-[1.12] md:tracking-[-.035em]">Produtos e projetos</h1>
          <p className="mt-[9px] max-w-[56ch] text-[15px] leading-[1.6] text-rc-ink-3 md:mt-3 md:text-[17.5px]">
            Apps que você pode testar agora e o portfólio técnico por trás deles, com arquitetura e decisões de cada projeto.
          </p>

          <div className="mt-4 flex gap-2.5 md:mt-[26px] md:gap-3">
            <label className="flex h-12 min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-rc-border-chip bg-rc-surface px-3.5 text-rc-ink-6 transition-colors focus-within:border-rc-blue-link md:h-[50px] md:rounded-[10px]">
              <Search className="h-[17px] w-[17px] shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <span className="sr-only">Buscar projetos</span>
              <input
                type="search"
                placeholder="Buscar por nome ou tecnologia…"
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

          {/* Filtro por grupo (os mesmos das seções) e por estado */}
          {groups.length > 0 && (
            <div
              role="group"
              aria-label="Filtrar projetos"
              className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:mt-4 md:flex-wrap md:overflow-visible md:px-0"
            >
              <Chip active={!selectedGroup} onClick={() => selectGroup(null)} className="h-11 shrink-0 font-sans text-[13.5px] md:h-9">
                Todos
              </Chip>
              {groups.map((group) => (
                <Chip
                  key={group}
                  active={selectedGroup === group}
                  onClick={() => selectGroup(selectedGroup === group ? null : group)}
                  className="h-11 shrink-0 font-sans text-[13.5px] md:h-9"
                >
                  {GROUP_LABEL[group]}
                </Chip>
              ))}
              <span aria-hidden="true" className="mx-1 w-px shrink-0 self-stretch bg-rc-border-chip" />
              {STAGE_FILTERS.map(({ stage, label }) => (
                <Chip
                  key={stage}
                  active={selectedStage === stage}
                  onClick={() => setSelectedStage(selectedStage === stage ? null : stage)}
                  className="h-11 shrink-0 font-sans text-[13.5px] md:h-9"
                >
                  {label}
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
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-20">
                {index > 0 && section.variant === 'compact' && sections[index - 1].variant !== 'compact' && (
                  <div className="mb-7 border-t border-rc-border pt-7 md:mb-9 md:pt-9">
                    <Eyebrow className="text-rc-amber">Portfólio técnico</Eyebrow>
                    <p className="mt-2 text-[14.5px] leading-[1.55] text-rc-ink-3 md:text-rc-body">O que eu construí para aprender, para a comunidade e para clientes.</p>
                  </div>
                )}
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
                {section.variant !== 'compact' ? (
                  <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3.5 lg:grid-cols-3">
                    {section.projects.map((project) => (
                      <ProductCard key={project.slug} project={project} placement="projetos" featured={section.variant === 'feature'} />
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
          selectedGroup === 'apps' ? (
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3.5 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProductCard key={project.slug} project={project} placement="projetos" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 md:gap-3.5 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          )
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
            <h2 className="text-[19px] font-semibold tracking-[-.02em] text-rc-ink md:text-[21px]">Precisa de um sistema sob medida?</h2>
            <p className="mt-2 text-[14.5px] leading-[1.6] text-rc-ink-3 md:text-rc-body">
              Eu também desenvolvo para empresas e criadores. Me conta o que você precisa.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5 md:flex md:shrink-0">
            <ButtonLink href="/trabalhe-comigo" size="lg" className="rounded-[11px] md:rounded-[10px]">
              Trabalhe comigo
            </ButtonLink>
            <ButtonLink href="/posts" variant="secondary" size="lg" className="rounded-[11px] md:rounded-[10px]">
              Ver artigos
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
  const tags = project.tags ?? [];
  const extra = tags.length - 3;

  return (
    <article
      className={cardClasses({
        interactive: true,
        className: cn(
          'group relative flex flex-col overflow-hidden rounded-[13px] md:rounded-rc-card',
          isArchived && 'opacity-70',
        ),
      })}
    >
      <div className="flex flex-1 flex-col gap-[9px] p-3.5 md:gap-2.5 md:p-5">
      {/* Ícone ao lado do título; categoria e selos embaixo. No celular (2 colunas) o ícone fica em cima. */}
      <div className="flex flex-col gap-[9px] sm:flex-row sm:items-start sm:gap-3">
        <ProjectIcon project={project} />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-3 text-[14.5px] font-semibold leading-[1.3] tracking-[-.018em] text-rc-ink md:text-rc-card-title">
            {/* O link do título cobre o card inteiro; o "Abrir" fica por cima. */}
            <Link href={`/projetos/${project.slug}`} className="after:absolute after:inset-0 after:rounded-[13px] focus-visible:outline-none md:after:rounded-rc-card">
              {project.title}
            </Link>
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[9.5px] uppercase tracking-[.1em] text-rc-amber">{project.kind ? PROJECT_KIND_LABEL[project.kind] : project.role || 'Projeto'}</span>
            {isWip && <StagePill>wip</StagePill>}
            {isPrivate && !isWip && <PrivateBadge />}
          </div>
        </div>
      </div>
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

      <div className={cn('flex items-center justify-between gap-2 border-t border-rc-border-card pt-[11px]', tags.length === 0 && 'mt-auto')}>
        <span className="hidden font-mono text-[10px] text-rc-ink-5 md:inline">
          {[projectYear(project.date), isPrivate ? 'spec & arquitetura' : project.liveUrl ? 'site no ar' : 'código aberto'].filter(Boolean).join(' · ')}
        </span>
        <span className="text-[12.5px] font-medium text-rc-blue-link md:text-[13.5px]">Ver case →</span>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 -my-2 inline-flex h-10 items-center gap-0.5 rounded-lg px-1.5 text-[12.5px] font-medium text-rc-ink-3 transition-colors hover:bg-rc-surface-2 hover:text-rc-ink md:text-[13.5px]"
          >
            Abrir
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            <span className="sr-only">{project.title} (abre em nova aba)</span>
          </a>
        )}
      </div>
      </div>
    </article>
  );
}

function projectYear(date?: string): string | null {
  if (!date) return null;
  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? null : String(year);
}

function PrivateBadge() {
  return (
    <span className="whitespace-nowrap rounded-full border border-rc-border-chip px-[7px] py-[3px] font-mono text-[9px] uppercase tracking-[.06em] text-rc-ink-4">
      <span className="md:hidden">privado</span>
      <span className="hidden md:inline">código privado</span>
    </span>
  );
}
