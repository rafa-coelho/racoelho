'use client';

import { useMemo, useState } from 'react';
import { ContentMeta } from '@/lib/api';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { ButtonLink, Chip, EmptyState, StatusDot, pad2 } from '@/components/rc';

interface ChallengesContentProps {
  challenges: ContentMeta[];
  tags: string[];
}

export default function ChallengesContent({ challenges }: ChallengesContentProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Trilha em ordem cronológica: o mais antigo é o #01.
  const trail = useMemo(
    () =>
      [...challenges]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((challenge, index) => ({ challenge, number: index + 1 })),
    [challenges],
  );

  const filtered = trail.filter(({ challenge }) => {
    const matchesTag = !selectedTag || challenge.tags?.includes(selectedTag);
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term || challenge.title.toLowerCase().includes(term) || challenge.excerpt.toLowerCase().includes(term);
    return matchesTag && matchesSearch;
  });

  // Get tag counts
  const tagCounts = challenges.reduce((acc, challenge) => {
    challenge.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const clearFilters = () => {
    setSelectedTag(null);
    setSearchTerm('');
  };

  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-rc-border">
        <div className="rc-dots-bg hidden md:block" />
        <div className="rc-dots-fade hidden md:block" />
        <div className="rc-container relative pb-5 pt-6 md:pb-11 md:pt-14">
          <span className="inline-flex items-center gap-2 font-mono text-rc-eyebrow uppercase text-rc-green-num md:text-[11.5px] md:text-rc-green">
            <StatusDot className="hidden md:inline-block" />
            Pratique &amp; evolua
          </span>
          <h1 className="mt-[9px] text-rc-h1-m font-semibold text-rc-ink md:mt-3.5 md:text-rc-h1">Desafios práticos</h1>
          <p className="mt-[9px] max-w-[52ch] text-[15px] leading-[1.6] text-rc-ink-3 md:mt-3 md:text-lg">
            Projetos para você implementar de ponta a ponta — com escopo, requisitos e critério de pronto.
          </p>

          <label className="mt-4 flex h-12 items-center gap-2.5 rounded-xl border border-rc-border-card bg-rc-surface px-3.5 text-rc-ink-6 transition-colors focus-within:border-rc-green md:mt-7 md:h-[50px] md:rounded-[10px]">
            <Search className="h-[17px] w-[17px] shrink-0" strokeWidth={1.75} aria-hidden="true" />
            <span className="sr-only">Buscar desafios</span>
            <input
              type="search"
              placeholder="Buscar desafios…"
              className="h-full flex-1 bg-transparent text-[15px] text-rc-ink outline-none placeholder:text-rc-ink-6"
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
            <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:mt-4 md:flex-wrap md:overflow-visible md:px-0">
              <Chip active={!selectedTag} onClick={() => setSelectedTag(null)}>todos</Chip>
              {popularTags.map(([tag]) => (
                <Chip key={tag} active={selectedTag === tag} onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}>
                  {tag}
                </Chip>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="rc-container pt-5 md:pt-9">
        <div className="mb-4 flex items-center justify-between font-mono text-xs text-rc-ink-5 md:text-[12.5px]">
          <span>
            {filtered.length} {filtered.length === 1 ? 'desafio encontrado' : 'desafios encontrados'}
          </span>
          {(selectedTag || searchTerm) && (
            <button type="button" onClick={clearFilters} className="text-rc-green hover:text-rc-green-hover">
              limpar filtros ×
            </button>
          )}
        </div>

        {filtered.length > 0 ? (
          <ol className="flex flex-col">
            {filtered.map(({ challenge, number }, index) => {
              const isLast = index === filtered.length - 1;
              // O botão aparece só no primeiro desafio em aberto da trilha.
              const showCta = index === 0;
              return (
                <li key={challenge.slug} className="grid grid-cols-[32px_1fr] gap-3 md:grid-cols-[40px_1fr] md:gap-5">
                  <div className="flex flex-col items-center gap-1">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-rc-border-hover bg-rc-surface-2 font-mono text-[11px] text-rc-blue-link md:h-10 md:w-10 md:text-xs">
                      {pad2(number)}
                    </span>
                    {!isLast && <span className="w-px flex-1 bg-rc-border" aria-hidden="true" />}
                  </div>
                  <Link
                    href={`/listas/desafios/${challenge.slug}`}
                    className="group mb-3.5 block rounded-rc-card border border-rc-blue-border bg-rc-blue-surface p-[15px] transition-colors duration-150 hover:border-rc-border-hover md:mb-4 md:p-6"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[.06em] text-rc-blue-soft md:text-[11px]">
                      <span>#{pad2(number)} em aberto</span>
                    </div>
                    <h2 className="mt-2 text-[16.5px] font-semibold tracking-[-.02em] text-rc-ink md:text-xl md:tracking-[-.018em]">{challenge.title}</h2>
                    {challenge.excerpt && (
                      <p className="mt-1.5 max-w-[62ch] text-[13.5px] leading-[1.5] text-rc-ink-3 md:mt-[7px] md:text-[14.5px] md:leading-[1.6]">{challenge.excerpt}</p>
                    )}
                    {challenge.tags && challenge.tags.length > 0 && (
                      <div className="mt-3 hidden flex-wrap gap-[7px] md:flex">
                        {challenge.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="rounded-md border border-rc-border-chip px-2 py-1 font-mono text-[11px] text-rc-ink-4">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {showCta && (
                      <span className="mt-3 grid h-11 place-items-center rounded-[11px] bg-rc-blue text-[14.5px] font-semibold text-white transition-colors group-hover:bg-rc-blue-hover md:inline-grid md:px-5">
                        Começar desafio
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ol>
        ) : (
          <EmptyState
            message={searchTerm ? `Nenhum desafio sobre "${searchTerm}"` : 'Nenhum desafio encontrado.'}
            action={
              <button type="button" onClick={clearFilters} className="text-sm font-medium text-rc-green hover:text-rc-green-hover">
                Limpar filtros
              </button>
            }
          />
        )}

        {/* Continue aprendendo */}
        <div className="mt-6 flex flex-col gap-3.5 rounded-rc-card-lg border border-rc-blue-border bg-rc-blue-surface px-[18px] py-5 md:mt-8 md:flex-row md:items-center md:justify-between md:gap-8 md:p-8">
          <div>
            <h2 className="text-[19px] font-semibold tracking-[-.025em] text-rc-ink md:text-2xl">Continue aprendendo</h2>
            <p className="mt-2 max-w-[52ch] text-[14.5px] leading-[1.55] text-rc-ink-3 md:mt-2.5 md:text-base md:leading-[1.6]">
              Os artigos complementam os desafios: leia a teoria depois de travar na prática.
            </p>
          </div>
          <ButtonLink href="/posts" className={cn('h-[46px] md:h-auto')}>
            Ver artigos
          </ButtonLink>
        </div>
      </div>
    </Layout>
  );
}
