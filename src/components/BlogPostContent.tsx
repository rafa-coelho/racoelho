'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Layout from './Layout';
import MarkdownRenderer, { extractHeadings } from '@/components/MarkdownRenderer';
import { ContentItem, ContentMeta } from '@/lib/api';
import { calculateReadingTime } from '@/lib/utils';
import { TrackedLink } from './TrackedLink';
import { authorInfo } from '@/lib/config/constants';
import AdSlot from './AdSlot';
import { useAds } from '@/hooks/use-ads';
import { SlotType } from '@/lib/services/adOrchestrator';
import { useFeatureFlags } from '@/hooks/use-feature-flag';
import ShareButtons from './ShareButtons';
import { useViewTracking } from '@/hooks/use-view-tracking';
import { Eyebrow, NewsletterForm, RcImage, Tag, cardClasses, formatShortDate } from '@/components/rc';

interface BlogPostContentProps {
  post: ContentItem;
  related?: ContentMeta[];
}

export default function BlogPostContent({ post, related = [] }: BlogPostContentProps) {
  const readingTime = calculateReadingTime(post.content);
  const [postUrl, setPostUrl] = useState('');
  const headings = useMemo(() => extractHeadings(post.content), [post.content]);

  useEffect(() => {
    setPostUrl(window.location.href);
  }, []);

  // View Tracking
  useViewTracking({ postId: post.slug });

  // Feature Flags
  const { flags } = useFeatureFlags(['share', 'newsletter', 'ads']);
  // Slots que realmente existem na página de posts
  // sidebar-mid (topo direita) tem prioridade mais alta, então vem primeiro
  const postSlots: SlotType[] = ['sidebar-mid', 'sidebar-top', 'inline', 'sidebar-bottom'];
  const { placements, loading: adsLoading } = useAds('posts', postSlots);

  const firstTag = post.tags?.[0];

  return (
    <Layout>
      {/* Trilha */}
      <div className="rc-container pt-5 md:pt-10">
        <nav aria-label="Trilha" className="truncate font-mono text-[11.5px] text-rc-ink-6 md:text-xs">
          <TrackedLink href="/posts" label="Voltar para o blog" className="text-rc-blue-link hover:text-rc-blue-soft">
            blog
          </TrackedLink>
          {firstTag && (
            <>
              {' / '}
              <Link href={`/posts?tag=${encodeURIComponent(firstTag)}`} className="hover:text-rc-ink">
                {firstTag}
              </Link>
            </>
          )}
          <span className="hidden md:inline"> / {post.slug}</span>
        </nav>
      </div>

      <div className="rc-container grid grid-cols-1 gap-14 pb-2 pt-5 md:pt-7 lg:grid-cols-[minmax(0,1fr)_300px] lg:pb-16">
        <article className="min-w-0 max-w-[72ch]">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {post.tags.map((tag) => (
                <TrackedLink key={tag} href={`/posts?tag=${encodeURIComponent(tag)}`} label={`Filtrar posts por tag: ${tag}`}>
                  <Tag className="rounded-full px-[9px] py-1 text-[10px] transition-colors hover:border-rc-border-hover hover:text-rc-ink md:rounded-md md:px-2.5 md:py-[5px] md:text-[11.5px]">
                    {tag}
                  </Tag>
                </TrackedLink>
              ))}
            </div>
          )}

          <h1 className="mt-3.5 text-rc-h1-article-m font-semibold text-rc-ink [text-wrap:balance] md:mt-5 md:text-rc-h1-article">{post.title}</h1>

          <div className="mt-4 flex items-center gap-[11px] border-b border-rc-border pb-[18px] md:mt-[22px] md:gap-3.5 md:pb-[26px]">
            <RcImage src={authorInfo.avatar} alt="" ratio="1/1" className="w-9 shrink-0 rounded-full border border-rc-photo-border md:w-[38px]" />
            <div className="font-mono text-[11px] text-rc-ink-4 md:font-sans md:text-sm md:text-rc-ink-3">
              {authorInfo.name}
              <div className="mt-0.5 font-mono text-[11px] text-rc-ink-6 md:mt-[3px] md:text-rc-meta md:text-rc-ink-5">
                <time dateTime={post.date}>{formatShortDate(post.date)}</time> · {readingTime} min de leitura
              </div>
            </div>
          </div>

          {post.coverImage && (
            <RcImage src={post.coverImage} alt="" ratio="16/9" className="mt-6 rounded-rc-card border border-rc-border-card md:mt-[30px]" />
          )}

          <MarkdownRenderer content={post.content} className="mt-1 md:mt-2" />

          {/* Anúncio no artigo */}
          {flags.ads && !adsLoading && placements['inline'] && (
            <div className="my-8 md:my-10">
              <AdSlot placement={placements['inline']} size="728x90" />
            </div>
          )}

          {flags.share && (
            <ShareButtons title={post.title} url={postUrl} variant="inline" className="mt-10 border-t border-rc-border pt-[26px]" />
          )}

          {/* Newsletter no fim (mobile/tablet; no desktop fica na lateral) */}
          {flags.newsletter && (
            <div className="mt-7 rounded-rc-card-lg border border-rc-blue-border bg-rc-blue-surface px-[18px] py-5 lg:hidden">
              <Eyebrow className="text-rc-blue-soft">Newsletter</Eyebrow>
              <h2 className="mt-[9px] text-[19px] font-semibold tracking-[-.025em] text-rc-ink">Gostou? Recebe o próximo por email</h2>
              <NewsletterForm layout="stacked" submitLabel="Inscrever" source="post" className="mt-3.5" />
            </div>
          )}
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-4">
            {flags.ads && !adsLoading && placements['sidebar-mid'] && (
              <AdSlot placement={placements['sidebar-mid']} size="300x300" />
            )}

            {headings.length > 1 && (
              <nav aria-label="Neste artigo" className={cardClasses({ className: 'p-5' })}>
                <Eyebrow>Neste artigo</Eyebrow>
                <TableOfContents headings={headings} />
              </nav>
            )}

            {flags.ads && !adsLoading && placements['sidebar-top'] && (
              <AdSlot placement={placements['sidebar-top']} size="300x300" />
            )}

            {flags.newsletter && (
              <div className="rounded-rc-card border border-rc-blue-border bg-rc-blue-surface p-5">
                <Eyebrow className="text-rc-blue-soft">Newsletter</Eyebrow>
                <p className="mt-3 text-[14.5px] leading-[1.6] text-rc-ink-3">Receba novos artigos no seu email.</p>
                <NewsletterForm layout="stacked" source="post-sidebar" className="mt-3.5" />
              </div>
            )}

            {flags.ads && !adsLoading && placements['sidebar-bottom'] && (
              <AdSlot placement={placements['sidebar-bottom']} size="300x600" />
            )}
          </div>
        </aside>
      </div>

      {/* Continue lendo */}
      {related.length > 0 && (
        <section className="mt-[26px] md:mt-0 md:border-t md:border-rc-border md:bg-rc-footer">
          <div className="rc-container md:pb-14 md:pt-11">
            <div className="mb-3 flex items-center gap-4 md:mb-5">
              <h2 className="text-base font-semibold tracking-[-.02em] text-rc-ink md:text-[19px]">
                <span className="md:hidden">Leia também</span>
                <span className="hidden md:inline">Continue lendo</span>
              </h2>
              <span className="hidden h-px flex-1 bg-rc-border md:block" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-2.5 md:grid md:grid-cols-3 md:gap-[18px]">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/posts/${item.slug}`}
                  className={cardClasses({ interactive: true, className: 'flex flex-col gap-[9px] rounded-[13px] p-3.5 md:min-h-[150px] md:rounded-rc-card md:p-5' })}
                >
                  {item.readingTime ? <span className="order-last font-mono text-[10.5px] text-rc-ink-5 md:order-none md:text-[11px]">{item.readingTime} min</span> : null}
                  <h3 className="text-[15px] font-medium leading-[1.35] text-rc-ink md:text-lg md:font-semibold md:leading-[1.32] md:tracking-[-.015em]">{item.title}</h3>
                  {item.tags?.[0] && <span className="mt-auto hidden font-mono text-[11px] text-rc-ink-5 md:block">{item.tags[0]}</span>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

// Sumário com a seção atual destacada.
function TableOfContents({ headings }: { headings: { id: string; text: string }[] }) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const elements = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -60% 0px' },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <ul className="mt-3.5 flex flex-col gap-[11px] text-sm">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            className={
              h.id === active
                ? 'block border-l-2 border-rc-blue pl-2.5 text-rc-blue-link'
                : 'block border-l-2 border-rc-border-chip pl-2.5 text-rc-nav-ink transition-colors hover:text-rc-ink'
            }
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
