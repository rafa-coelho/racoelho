'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Layout from './Layout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ContentItem } from '@/lib/api';
import { formatDate, calculateReadingTime } from '@/lib/utils';
import { TrackedLink } from './TrackedLink';

interface BlogPostContentProps {
  post: ContentItem;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  return (
    <Layout>
      <article className="content-container py-12 max-w-4xl mx-auto">
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

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              <span>{calculateReadingTime(post.content)} min de leitura</span>
            </div>
          </div>

          {post.coverImage && (
            <div className="aspect-video rounded-lg overflow-hidden bg-accent">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <TrackedLink
                  key={tag}
                  href={`/posts?tag=${tag}`}
                  label={`Filtrar posts por tag: ${tag}`}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {tag}
                </TrackedLink>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 pt-6 border-t">
          <TrackedLink
            href="/posts"
            label="Voltar para todos os posts"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar para todos os posts
          </TrackedLink>
        </div>
      </article>
    </Layout>
  );
}

