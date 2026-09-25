'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';
import { VagaMeta } from '@/lib/types/vaga';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Chip, EmptyState, PageHeader, Pill, buttonClasses, cardClasses, formatRelative } from '@/components/rc';

interface VagasContentProps {
  vagas: VagaMeta[];
  departments: string[];
  techs: string[];
}

const WORKPLACE_LABELS: Record<string, string> = {
  remote: 'Remoto',
  hybrid: 'Híbrido',
  onsite: 'Presencial',
  'on-site': 'Presencial',
};

function modalityLabel(vaga: VagaMeta): string | undefined {
  if (vaga.workplaceType) return WORKPLACE_LABELS[vaga.workplaceType.toLowerCase()] || vaga.workplaceType;
  return vaga.isRemote ? 'Remoto' : undefined;
}

const tagBase = 'inline-flex items-center rounded-full border px-2 py-1 font-mono text-[10px] transition-colors duration-150';

export default function VagasContent({ vagas, departments, techs }: VagasContentProps) {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [onlyBrazil, setOnlyBrazil] = useState(false);

  const filtered = vagas.filter((vaga) => {
    const matchesDept = !selectedDept || vaga.department === selectedDept;
    const matchesTech = !selectedTech || (vaga.tags || []).includes(selectedTech);
    const matchesRemote = !onlyRemote || Boolean(vaga.isRemote);
    const matchesBrazil = !onlyBrazil || Boolean(vaga.acceptsBrazil);
    const matchesSearch =
      !searchTerm ||
      vaga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vaga.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vaga.tags || []).some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesDept && matchesTech && matchesRemote && matchesBrazil && matchesSearch;
  });

  const deptCounts = vagas.reduce((acc, vaga) => {
    if (vaga.department) acc[vaga.department] = (acc[vaga.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const techCounts = vagas.reduce((acc, vaga) => {
    (vaga.tags || []).forEach((t) => (acc[t] = (acc[t] || 0) + 1));
    return acc;
  }, {} as Record<string, number>);

  const hasActiveFilter = Boolean(selectedDept || selectedTech || searchTerm || onlyRemote || onlyBrazil);
  const clearAll = () => {
    setSelectedDept(null);
    setSelectedTech(null);
    setSearchTerm('');
    setOnlyRemote(false);
    setOnlyBrazil(false);
  };

  const chipCls = 'h-11 font-sans text-[13.5px] md:h-9';

  return (
    <Layout>
      <PageHeader
        eyebrow={<span className="text-rc-green">Vagas &amp; indicações</span>}
        title="Vagas abertas"
        lead="Conhece alguém massa? Me indica aqui que eu levo a indicação adiante — sem redirect, direto comigo."
      >
        {/* Busca + Áreas */}
        <div className="mt-5 flex gap-2.5 md:mt-[26px] md:gap-3">
          <label className="flex h-12 min-w-0 flex-1 items-center gap-2.5 rounded-[10px] border border-rc-border-chip bg-rc-surface px-3.5 transition-colors duration-150 focus-within:border-rc-blue-link">
            <Search size={16} className="shrink-0 text-rc-ink-6" aria-hidden="true" />
            <span className="sr-only">Buscar vagas</span>
            <input
              type="text"
              placeholder="Buscar vagas..."
              className="min-w-0 flex-1 bg-transparent text-[15px] text-rc-ink outline-none placeholder:text-rc-ink-5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
          {departments.length > 0 && (
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              className={cn(
                'inline-flex h-12 shrink-0 items-center gap-2 rounded-[10px] border px-4 text-[15px] transition-colors duration-150 md:px-[18px]',
                showFilters
                  ? 'border-rc-blue-border bg-rc-blue-chip text-rc-ink'
                  : 'border-rc-border-chip bg-rc-surface text-rc-ink hover:border-rc-border-hover'
              )}
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              Áreas
            </button>
          )}
        </div>

        {/* Filtros rápidos */}
        <div className="-mx-4 mt-3.5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          <Chip active={!onlyRemote && !onlyBrazil} onClick={() => { setOnlyRemote(false); setOnlyBrazil(false); }} className={chipCls}>
            Todas
          </Chip>
          <Chip active={onlyRemote} onClick={() => setOnlyRemote(!onlyRemote)} className={chipCls}>
            Remoto
          </Chip>
          <Chip active={onlyBrazil} onClick={() => setOnlyBrazil(!onlyBrazil)} className={chipCls}>
            Aceita Brasil
          </Chip>
        </div>
      </PageHeader>

      <div className="rc-container pb-10 pt-5 md:pb-14 md:pt-7">
        {/* Painel de áreas / tecnologias */}
        {showFilters && departments.length > 0 && (
          <div className={cardClasses({ className: 'mb-5 p-4 md:mb-7 md:p-5' })}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-mono text-rc-eyebrow uppercase text-rc-ink-5">Filtrar por área</h3>
              {selectedDept && (
                <button
                  type="button"
                  onClick={() => setSelectedDept(null)}
                  className="inline-flex h-11 items-center gap-1 text-sm text-rc-blue-link hover:text-rc-blue-soft md:h-auto"
                >
                  <X size={14} aria-hidden="true" />
                  Limpar
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <Chip key={dept} active={selectedDept === dept} onClick={() => setSelectedDept(selectedDept === dept ? null : dept)} className="h-11 md:h-9">
                  {dept} <span className="ml-1.5 text-rc-ink-5">{deptCounts[dept] || 0}</span>
                </Chip>
              ))}
            </div>

            {techs.length > 0 && (
              <div className="mt-5 border-t border-rc-border-card pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-mono text-rc-eyebrow uppercase text-rc-ink-5">Filtrar por tecnologia</h3>
                  {selectedTech && (
                    <button
                      type="button"
                      onClick={() => setSelectedTech(null)}
                      className="inline-flex h-11 items-center gap-1 text-sm text-rc-blue-link hover:text-rc-blue-soft md:h-auto"
                    >
                      <X size={14} aria-hidden="true" />
                      Limpar
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech) => (
                    <Chip key={tech} active={selectedTech === tech} onClick={() => setSelectedTech(selectedTech === tech ? null : tech)} className="h-11 md:h-9">
                      {tech} <span className="ml-1.5 text-rc-ink-5">{techCounts[tech] || 0}</span>
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contagem */}
        <div className="mb-3.5 flex min-h-[28px] flex-wrap items-center justify-between gap-2 font-mono text-[12.5px] text-rc-ink-5">
          <p>
            <b className="font-semibold text-rc-ink">{filtered.length}</b>{' '}
            {filtered.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
          </p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex h-11 items-center gap-1 font-sans text-sm font-medium text-rc-blue-link hover:text-rc-blue-soft md:h-auto"
            >
              <X size={14} aria-hidden="true" />
              Limpar filtros
            </button>
          )}
        </div>

        {/* Lista de vagas */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-[11px] md:grid-cols-2 md:gap-3.5 lg:grid-cols-3">
            {filtered.map((vaga) => {
              const modality = modalityLabel(vaga);
              const meta = [vaga.department, modality, vaga.location].filter(Boolean).join(' · ');
              const published = formatRelative(vaga.publishedAt);
              const tags = vaga.tags || [];
              return (
                <Link
                  key={vaga.slug}
                  href={`/vagas/${vaga.slug}`}
                  className={cardClasses({ tone: 'blue', interactive: true, className: 'group flex flex-col p-4 md:min-h-[196px] md:p-5' })}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Pill tone="blue" className="px-[9px] text-[10px] tracking-[.06em]">indicação</Pill>
                    {published && (
                      <span className="font-mono text-[10.5px] text-rc-ink-5" suppressHydrationWarning>
                        {published}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-[11px] line-clamp-3 text-[17.5px] font-semibold leading-[1.34] tracking-[-.018em] text-rc-ink transition-colors duration-150 group-hover:text-rc-blue-soft">
                    {vaga.title}
                  </h2>

                  {meta && <div className="mt-[7px] text-[14px] text-rc-ink-3">{meta}</div>}

                  {vaga.excerpt && (
                    <p className="mt-2 line-clamp-2 text-[13.5px] leading-[1.55] text-rc-ink-4">{vaga.excerpt}</p>
                  )}

                  {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tags.slice(0, 4).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedTech(selectedTech === tag ? null : tag);
                          }}
                          aria-pressed={selectedTech === tag}
                          className={cn(
                            tagBase,
                            selectedTech === tag
                              ? 'border-rc-blue-link bg-rc-blue-chip text-rc-ink'
                              : 'border-rc-border-chip text-rc-ink-4 hover:border-rc-border-hover hover:text-rc-ink'
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                      {tags.length > 4 && (
                        <span className={cn(tagBase, 'border-rc-border-chip text-rc-ink-5')}>+{tags.length - 4}</span>
                      )}
                    </div>
                  )}

                  <div className="min-h-[14px] flex-1" aria-hidden="true" />
                  <div className="flex items-center justify-between border-t border-rc-blue-border pt-[11px] font-mono text-[11px] text-rc-ink-5">
                    <span>{vaga.acceptsBrazil ? 'aceita brasil' : 'internacional'}</span>
                    <span className="font-sans text-[13.5px] font-medium text-rc-green transition-colors duration-150 group-hover:text-rc-green-hover">
                      Indicar →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState
            message="Nenhuma vaga encontrada com esses filtros."
            action={
              <button type="button" onClick={clearAll} className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
                Limpar filtros
              </button>
            }
          />
        )}

        {/* Como funciona */}
        <div className={cardClasses({ size: 'lg', className: 'mt-6 px-[18px] py-5 md:mt-8 md:p-8' })}>
          <h2 className="text-center text-rc-h2-m font-semibold text-rc-ink md:text-rc-h2">Como funciona a indicação</h2>
          <ol className="mt-5 grid grid-cols-1 gap-5 md:mt-[26px] md:grid-cols-3 md:gap-6">
            {[
              'Escolha a vaga e clique nela.',
              'Preencha os dados de quem você quer indicar.',
              'Eu levo a indicação adiante pessoalmente.',
            ].map((step, i) => (
              <li key={step} className="text-center">
                <div className="font-mono text-[26px] leading-none text-rc-green">{i + 1}</div>
                <p className="mt-2.5 text-[15px] leading-[1.6] text-rc-ink-3">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Layout>
  );
}
