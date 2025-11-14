'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2, MessageCircle, Linkedin, Copy, Check, AtSign } from 'lucide-react';
import { useState } from 'react';
import Layout from './Layout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ContentItem } from '@/lib/api';
import { formatDate, calculateReadingTime } from '@/lib/utils';
import { TrackedLink } from './TrackedLink';
import { authorInfo } from '@/lib/config/constants';
import AdSlot from './AdSlot';
import { useAds } from '@/hooks/use-ads';
import { SlotType } from '@/lib/services/adOrchestrator';
import { generateShareLinks, openSharePopup } from '@/lib/utils/share';
import { useFeatureFlags, useFeatureFlagWithMetadata } from '@/hooks/use-feature-flag';
import ShareButtons from './ShareButtons';
import { useViewTracking } from '@/hooks/use-view-tracking';

interface BlogPostContentProps {
  post: ContentItem;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const [copied, setCopied] = useState(false);
  const readingTime = calculateReadingTime(post.content);
  const postUrl = typeof window !== 'undefined' ? window.location.href : '';

  // View Tracking
  useViewTracking({ postId: post.slug });

  // Feature Flags
  const { flags, loading: flagsLoading } = useFeatureFlags(['share', 'newsletter', 'ads']);
  // Slots que realmente existem na página de posts
  // sidebar-mid (topo direita) tem prioridade mais alta, então vem primeiro
  const postSlots: SlotType[] = ['sidebar-mid', 'sidebar-top', 'inline', 'sidebar-bottom'];
  const { placements, loading: adsLoading } = useAds('posts', postSlots);


  return (
    <Layout>
      <div className="min-h-screen py-12">
        {/* Container mais largo para o header */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <TrackedLink
              href="/posts"
              label="Voltar para o blog"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar para o blog
            </TrackedLink>
          </div>

          {/* Header do Artigo - Full Width */}
          <header className="mb-12">
            {/* Badge de categoria */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-sm font-medium text-primary">Artigo</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight max-w-5xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <time dateTime={post.date} className="font-medium">{formatDate(post.date)}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span className="font-medium">{readingTime} min de leitura</span>
              </div>
            </div>

          </header>

          {/* Layout com 3 colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-8">
            {/* Sidebar Esquerda - Ads & Share */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                {/* Share Buttons - Sticky */}
                {flags.share && (
                  <ShareButtons title={post.title} url={postUrl} variant="sidebar" />
                )}

                {/* Ad Slot 1 - Sidebar Left */}
                {flags.ads && !adsLoading && <AdSlot placement={placements['sidebar-top']} size="300x300" />}
              </div>
            </aside>

            {/* Conteúdo Principal */}
            <article className="min-w-0">

              {/* Mobile Share Buttons */}
              {flags.share && (
                <ShareButtons title={post.title} url={postUrl} variant="inline" className="lg:hidden mb-8" />
              )}

              {/* Conteúdo do Post */}
              <div className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-bold
                prose-code:text-primary prose-code:bg-primary/10 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-card prose-pre:border prose-pre:border-white/10
                prose-img:rounded-xl prose-img:shadow-lg
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1
                ">
                <MarkdownRenderer content={post.content} />
              </div>

              {/* Ad Slot - Content */}
              {flags.ads && !adsLoading && (
                <div className="my-12">
                  <AdSlot placement={placements['inline']} size="728x90" />
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/10">
                  <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase tracking-wider">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <TrackedLink
                        key={tag}
                        href={`/posts?tag=${tag}`}
                        label={`Filtrar posts por tag: ${tag}`}
                        className="px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/20 transition-colors"
                      >
                        {tag}
                      </TrackedLink>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <TrackedLink
                  href="/posts"
                  label="Voltar para todos os posts"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium group"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  Voltar para todos os posts
                </TrackedLink>
              </div>
            </article>

            {/* Sidebar Direita - Ads & Info */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                {/* Author Info */}
                <div className="card-modern p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={authorInfo.avatar}
                      alt={authorInfo.name}
                      className="w-16 h-16 rounded-full border-2 border-primary/30"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/64x64?text=RC';
                      }}
                    />
                    <div>
                      <h3 className="font-bold text-lg">{authorInfo.name}</h3>
                      <p className="text-sm text-muted-foreground">{authorInfo.title}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {authorInfo.bio}
                  </p>
                  <Link href={authorInfo.profileUrl} className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                    Ver perfil →
                  </Link>
                </div>

                {/* Ad Slot 2 - Sidebar Right Top */}
                {flags.ads && !adsLoading && <AdSlot placement={placements['sidebar-mid']} size="300x300" />}

                {/* Newsletter CTA */}
                {flags.newsletter && (
                  <div className="card-modern p-6 bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/20">
                    <div className="text-center">
                      <div className="text-4xl mb-4">📬</div>
                      <h3 className="font-bold text-lg mb-2">Newsletter</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Receba novos artigos no seu email
                      </p>
                      <Link href="/newsletter" className="btn-primary w-full justify-center text-sm py-2">
                        Assinar
                      </Link>
                    </div>
                  </div>
                )}

                {/* Ad Slot 3 - Sidebar Right Skyscraper */}
                {flags.ads && !adsLoading && <AdSlot placement={placements['sidebar-bottom']} size="300x600" />}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
