'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, Trophy, GitBranch, ArrowUpRight } from 'lucide-react';
import Layout from './Layout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ContentItem } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { TrackedLink } from './TrackedLink';

interface ChallengeContentProps {
  challenge: ContentItem;
}

export default function ChallengeContent({ challenge }: ChallengeContentProps) {
  return (
    <Layout>
      <article className="content-container py-12">
        <div className="max-w-3xl mx-auto">
          <TrackedLink
            href="/listas/desafios"
            label="Voltar para desafios"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" /> Voltar para desafios
          </TrackedLink>

          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{challenge.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <time dateTime={challenge.date}>{formatDate(challenge.date)}</time>
              </div>
            </div>

            {challenge.tags && challenge.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {challenge.tags.map((tag) => (
                  <TrackedLink
                    key={tag}
                    href={`/desafios?tag=${tag}`}
                    label={`Filtrar desafios por tag: ${tag}`}
                    className="inline-block px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {tag}
                  </TrackedLink>
                ))}
              </div>
            )}

            {challenge.coverImage && (
              <div className="aspect-video rounded-lg overflow-hidden bg-accent">
                <img
                  src={challenge.coverImage}
                  alt={challenge.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </header>

          <div className="prose prose-lg max-w-none">
            <MarkdownRenderer content={challenge.content} />
          </div>

          <div className="p-4">
            <h2 className="text-2xl font-bold">Envie o link do seu projeto</h2>
            <p className="text-lg">
              Envie o link do seu projeto para o email
              <a href="mailto:contato@racoelho.com.br" className="text-blue-500">
                {' '}
                contato@racoelho.com.br
              </a>.
            </p>
          </div>
        </div>
      </article>
    </Layout>
  );
}


