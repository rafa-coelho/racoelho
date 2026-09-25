'use client';
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { ContentMeta } from '@/lib/api';
import Link from 'next/link';
import Layout from './Layout';
import { Search, X } from 'lucide-react';
import { Chip, EmptyState, Eyebrow, RcImage, Tag, cardClasses, formatShortDate } from '@/components/rc';
import { POSTS_PER_PAGE, matchesSearch, pickFeatured, popularTags } from '@/components/posts/search';

interface BlogContentProps {
  posts: (ContentMeta & { content?: string })[];
  tags?: string[];
  /** ?tag= vindo do servidor */
  initialTag?: string | null;
  /** ?page= vindo do servidor */
  initialPage?: number;
}

// Filtros refletidos na URL sem navegar (tag e página).
function syncUrl(tag: string | null, page: number) {
  try {
    const url = new URL(window.location.href);
    if (tag) url.searchParams.set('tag', tag);
    else url.searchParams.delete('tag');
    if (page > 1) url.searchParams.set('page', String(page));
    else url.searchParams.delete('page');
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url);
  } catch {
    /* ignora */
  }
}

// Link de "Carregar mais" (funciona sem JavaScript).
function pageHref(tag: string | null, page: number) {
  const params = new URLSearchParams();
  if (tag) params.set('tag', tag);
  params.set('page', String(page));
  return `/posts?${params.toString()}`;
}

export default function BlogContent({ posts: allPosts, initialTag = null, initialPage = 1 }: BlogContentProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [page, setPage] = useState(Math.max(1, initialPage));
  const isFirstRender = useRef(true);

  // Debounce da busca (150ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 150);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Novo filtro volta para a primeira página
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
  }, [debouncedSearchTerm, selectedTag]);

  useEffect(() => {
    syncUrl(selectedTag, page);
  }, [selectedTag, page]);

  const tagList = useMemo(() => popularTags(allPosts), [allPosts]);

  const isFiltering = !!selectedTag || !!debouncedSearchTerm.trim();

  const filtered = useMemo(
    () =>
      allPosts.filter(
        (post) => (!selectedTag || post.tags?.includes(selectedTag)) && matchesSearch(post, debouncedSearchTerm),
      ),
    [allPosts, selectedTag, debouncedSearchTerm],
  );

  // Destaque só na lista sem filtro; sai da grade para não repetir.
  const featured = !isFiltering ? pickFeatured(filtered) : undefined;
  const listPosts = featured ? filtered.filter((post) => post !== featured) : filtered;
  const visiblePosts = listPosts.slice(0, page * POSTS_PER_PAGE);
  const hasMore = visiblePosts.length < listPosts.length;
  const posts = featured ? [featured, ...visiblePosts] : visiblePosts;

  const handleLoadMore = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setPage((p) => p + 1);
  };

  const handleClearFilters = () => {
    setSelectedTag(null);
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };

  return (
    <Layout>
      {/* Cabeçalho */}
      <section className="relative overflow-hidden border-b border-rc-border">
        <div className="rc-dots-bg hidden md:block" />
        <div className="rc-dots-fade hidden md:block" />
        <div className="rc-container relative pt-6 md:pb-10 md:pt-14">
          <Eyebrow className="md:text-[11.5px] md:text-rc-blue-soft">
            Blog<span className="hidden md:inline"> · {allPosts.length} artigos</span>
          </Eyebrow>
          <h1 className="mt-[9px] text-rc-h1-m font-semibold text-rc-ink md:mt-3.5 md:text-rc-h1">Artigos e tutoriais</h1>
          <p className="mt-[9px] max-w-[56ch] text-[15px] leading-[1.6] text-rc-ink-3 md:mt-3 md:text-lg">
            O que eu aprendo construindo sistemas de verdade: backend, dados, tempo real e carreira.
          </p>

          <label id="busca" className="mt-4 flex h-12 scroll-mt-24 items-center gap-2.5 rounded-xl border border-rc-border-card bg-rc-surface px-3.5 text-rc-ink-6 transition-colors focus-within:border-rc-blue-link md:mt-7 md:h-[50px] md:rounded-[10px]">
            <Search className="h-[17px] w-[17px] shrink-0" strokeWidth={1.75} aria-hidden="true" />
            <span className="sr-only">Buscar artigos</span>
            <input
              type="search"
              placeholder="Buscar artigos…"
              className="h-full flex-1 bg-transparent text-[15px] text-rc-ink outline-none placeholder:text-rc-ink-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button type="button" onClick={handleClearSearch} className="-mr-2 grid h-11 w-11 place-items-center text-rc-ink-5 hover:text-rc-ink" aria-label="Limpar busca">
                <X className="h-4 w-4" />
              </button>
            )}
          </label>

          {tagList.length > 0 && (
            <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:mt-4 md:flex-wrap md:overflow-visible md:px-0">
              <Chip active={!selectedTag} onClick={() => setSelectedTag(null)}>
                todos · {allPosts.length}
              </Chip>
              {tagList.map(([tag, count]) => (
                <Chip key={tag} active={selectedTag === tag} onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}>
                  {tag} · {count}
                </Chip>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="rc-container pb-7 pt-5 md:pb-14 md:pt-10">
        {posts.length > 0 ? (
          <>
            {featured && (
              <Link
                href={`/posts/${featured.slug}`}
                className={cardClasses({ interactive: true, size: 'lg', className: 'mb-3 block overflow-hidden rounded-rc-card md:mb-0 md:grid md:grid-cols-[1.05fr_1fr] md:rounded-rc-card-lg' })}
              >
                <div className="relative">
                  <RcImage src={featured.coverImage} alt="" ratio="16/9" className="md:h-full md:min-h-[300px]" />
                  <span className="absolute left-3.5 top-3.5 hidden rounded-md bg-rc-blue px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[.1em] text-white md:inline">
                    {featured.featured ? 'Destaque' : 'Mais recente'}
                  </span>
                </div>
                <div className="flex flex-col p-4 md:p-[34px]">
                  <div className="flex gap-2 font-mono text-[10.5px] text-rc-ink-5 md:gap-3 md:text-rc-meta">
                    <time dateTime={featured.date}>{formatShortDate(featured.date)}</time>
                    {featured.readingTime ? (<><span aria-hidden="true">·</span><span>{featured.readingTime} min</span></>) : null}
                    <span aria-hidden="true" className="md:hidden">·</span>
                    <span className="text-rc-blue-link md:hidden">{featured.featured ? 'destaque' : 'mais recente'}</span>
                  </div>
                  <h2 className="mt-[9px] text-[21px] font-semibold leading-[1.22] tracking-[-.026em] text-rc-ink [text-wrap:balance] md:mt-3 md:text-[32px] md:leading-[1.16] md:tracking-[-.03em]">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-[9px] line-clamp-3 text-[14.5px] leading-[1.55] text-rc-ink-3 md:mt-3.5 md:text-base md:leading-[1.65]">{featured.excerpt}</p>
                  )}
                  <div className="mt-auto hidden items-center gap-2 pt-6 md:flex">
                    {featured.tags?.slice(0, 3).map((tag) => <Tag key={tag}>{tag}</Tag>)}
                    <span className="ml-auto text-[14.5px] font-medium text-rc-blue-link">Ler artigo →</span>
                  </div>
                </div>
              </Link>
            )}

            <div className="mb-5 mt-10 hidden items-center gap-4 font-mono text-xs text-rc-ink-6 md:flex">
              <span>{isFiltering ? `${filtered.length} ${filtered.length === 1 ? 'resultado' : 'resultados'}` : 'Todos os artigos'}</span>
              <span className="h-px flex-1 bg-rc-border" aria-hidden="true" />
              {isFiltering && (
                <button type="button" onClick={handleClearFilters} className="text-rc-blue-link hover:text-rc-blue-soft">
                  limpar filtros ×
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-[18px] lg:grid-cols-3">
              {visiblePosts.map((post, index) => (
                <Link
                  key={`${post.slug}-${index}`}
                  href={`/posts/${post.slug}`}
                  className={cardClasses({ interactive: true, className: 'flex gap-[13px] p-[15px] md:flex-col md:gap-0 md:overflow-hidden md:rounded-rc-card-lg md:p-0' })}
                >
                  <RcImage src={post.coverImage} alt="" ratio="16/9" className="aspect-square w-[72px] shrink-0 rounded-[10px] md:aspect-video md:w-full md:rounded-none" />
                  <div className="flex min-w-0 flex-1 flex-col md:gap-2.5 md:p-5">
                    <div className="flex gap-1.5 font-mono text-[10.5px] text-rc-ink-5 md:justify-between md:text-[11px]">
                      <time dateTime={post.date}>{formatShortDate(post.date)}</time>
                      {post.readingTime ? (<><span aria-hidden="true" className="md:hidden">·</span><span>{post.readingTime} min</span></>) : null}
                    </div>
                    <h2 className="mt-1.5 text-base font-semibold leading-[1.3] tracking-[-.02em] text-rc-ink md:mt-0 md:text-[18.5px] md:leading-[1.32] md:tracking-[-.015em]">
                      {post.title}
                    </h2>
                    {post.excerpt && <p className="hidden text-[14.5px] leading-[1.6] text-rc-ink-4 md:line-clamp-2">{post.excerpt}</p>}
                    {post.tags && post.tags.length > 0 && (
                      <>
                        <div className="mt-[7px] flex flex-wrap gap-1.5 md:hidden">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="rounded-full border border-rc-border-chip px-2 py-[3px] font-mono text-[10px] text-rc-ink-4">{tag}</span>
                          ))}
                        </div>
                        <span className="mt-auto hidden font-mono text-[11px] text-rc-ink-5 md:block">{post.tags.slice(0, 2).join(' · ')}</span>
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Carregar mais: sem JavaScript, vira link para ?page=N+1 */}
            {hasMore ? (
              <div className="mt-5 flex justify-center md:mt-10">
                <a
                  href={pageHref(selectedTag, page + 1)}
                  onClick={handleLoadMore}
                  className="grid h-12 w-full place-items-center rounded-xl border border-rc-border-card bg-rc-surface text-[15px] text-rc-ink-2 transition-colors hover:border-rc-border-hover hover:text-rc-ink md:w-auto md:rounded-[10px] md:border-rc-border-strong md:bg-rc-surface-3 md:px-[22px] md:font-medium md:text-rc-ink"
                >
                  Carregar mais
                </a>
              </div>
            ) : (
              listPosts.length > POSTS_PER_PAGE && (
                <p className="py-10 text-center font-mono text-xs text-rc-ink-6">fim da lista</p>
              )
            )}
          </>
        ) : (
          <EmptyState
            message={debouncedSearchTerm.trim() ? `Nenhum artigo sobre '${debouncedSearchTerm.trim()}'` : 'Nenhum artigo encontrado.'}
            action={
              <button
                type="button"
                onClick={debouncedSearchTerm.trim() ? handleClearSearch : handleClearFilters}
                className="min-h-11 px-3 text-sm font-medium text-rc-blue-link hover:text-rc-blue-soft"
              >
                {debouncedSearchTerm.trim() ? 'Limpar busca' : 'Limpar filtros'}
              </button>
            }
          />
        )}
      </div>
    </Layout>
  );
}
