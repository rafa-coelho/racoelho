'use client';

import { ArrowLeft, Calendar, FolderGit2, Github, Globe, Lock, Mail, User, Layers } from 'lucide-react';
import Layout from './Layout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Project } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { TrackedLink } from './TrackedLink';
import { authorInfo } from '@/lib/config/constants';
import { useFeatureFlags } from '@/hooks/use-feature-flag';
import ShareButtons from './ShareButtons';

interface ProjectContentProps {
  project: Project;
}

// Ficha técnica reutilizada no mobile (acima do conteúdo) e na sidebar desktop
function ProjectFacts({ project }: { project: Project }) {
  const isPrivate = !project.repoUrl && !project.liveUrl;

  return (
    <div className="card-modern p-5 sm:p-6">
      <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase tracking-wider">Ficha Técnica</h3>
      <div className="space-y-4">
        {project.role && (
          <div className="flex items-start gap-3">
            <User size={18} className="text-project mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Papel</p>
              <p className="text-sm font-medium">{project.role}</p>
            </div>
          </div>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className="flex items-start gap-3">
            <Layers size={18} className="text-project mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-medium rounded-full bg-project/10 text-project border border-project/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-white/10 space-y-2">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-project/50 hover:bg-project/10 transition-all text-sm font-medium"
            >
              <Github size={18} />
              Ver código no GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-project text-white hover:opacity-90 transition-all text-sm font-semibold"
            >
              <Globe size={18} />
              Ver projeto no ar
            </a>
          )}
          {isPrivate && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-muted-foreground">
              <Lock size={16} className="mt-0.5 flex-shrink-0" />
              <span>Código privado — o case abaixo detalha a arquitetura e as decisões técnicas.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectContent({ project }: ProjectContentProps) {
  const projectUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/projetos/${project.slug}`
    : '';

  // Feature Flags
  const { flags } = useFeatureFlags(['share', 'newsletter']);

  return (
    <Layout>
      <div className="min-h-screen py-8 md:py-12">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6 md:mb-8">
            <TrackedLink
              href="/projetos"
              label="Voltar para projetos"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar para projetos
            </TrackedLink>
          </div>

          {/* Header do Projeto */}
          <header className="mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-project/10 border border-project/20 mb-5 md:mb-6">
              <FolderGit2 size={16} className="text-project" />
              <span className="text-sm font-medium text-project">Projeto</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-5 md:mb-6 leading-tight max-w-5xl break-words">
              {project.title}
            </h1>

            {project.excerpt && (
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mb-6 leading-relaxed">
                {project.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <time dateTime={project.date} className="font-medium text-sm sm:text-base">{formatDate(project.date)}</time>
              </div>
              {project.role && (
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span className="font-medium text-sm sm:text-base">{project.role}</span>
                </div>
              )}
            </div>
          </header>

          {/* Cover */}
          {project.coverImage && (
            <div className="mb-8 md:mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-auto max-h-[520px] object-cover"
              />
            </div>
          )}

          {/* Layout com 2 colunas: Conteúdo + Sidebar Direita */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 lg:gap-12">
            {/* Conteúdo Principal */}
            <article className="min-w-0">
              {/* Ficha técnica no mobile (na sidebar em telas grandes) */}
              <div className="lg:hidden mb-8">
                <ProjectFacts project={project} />
              </div>

              {/* Mobile Share Buttons */}
              {flags.share && (
                <ShareButtons title={project.title} url={projectUrl} variant="inline" className="lg:hidden mb-8" />
              )}

              {/* Conteúdo do Projeto (spec, arquitetura, decisões) */}
              <div className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-base prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-project prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-bold
                prose-code:text-primary prose-code:bg-secondary prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-secondary prose-pre:border prose-pre:border-white/10 prose-pre:shadow-xl
                prose-blockquote:border-l-4 prose-blockquote:border-project prose-blockquote:bg-project/5 prose-blockquote:py-4 prose-blockquote:px-6
                prose-ul:my-6 prose-ol:my-6
                prose-li:my-2
                prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-8">
                <MarkdownRenderer content={project.content} />
              </div>

              {/* Call to Action - Contato */}
              <div className="mt-12 md:mt-16 card-modern p-6 sm:p-8 border-2 border-project/20 bg-gradient-to-br from-project/5 to-transparent">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="p-3 rounded-xl bg-project/10 border border-project/20">
                    <Mail size={28} className="text-project" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 text-foreground">Curtiu o projeto?</h2>
                    <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                      Se quiser conversar sobre esse projeto, arquitetura ou uma oportunidade de trabalho, é só me chamar. 🚀
                    </p>
                    <a
                      href={`mailto:${authorInfo.email}?subject=${encodeURIComponent(`Sobre o projeto: ${project.title}`)}`}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-project text-white font-semibold hover:opacity-90 transition-all hover:scale-105 text-sm sm:text-base break-all"
                    >
                      <Mail size={20} className="flex-shrink-0" />
                      {authorInfo.email}
                    </a>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar Direita */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <ProjectFacts project={project} />

                {/* Author Card */}
                <div className="card-modern p-6">
                  <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase tracking-wider">Sobre o Autor</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={authorInfo.avatar}
                      alt={authorInfo.name}
                      className="w-16 h-16 rounded-full ring-2 ring-project"
                    />
                    <div>
                      <p className="font-bold text-lg">{authorInfo.name}</p>
                      <p className="text-sm text-muted-foreground">{authorInfo.title}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {authorInfo.bio}
                  </p>
                  <TrackedLink
                    href={authorInfo.profileUrl}
                    label="Ver perfil completo"
                    className="text-sm text-project hover:opacity-80 font-medium"
                  >
                    Ver perfil completo →
                  </TrackedLink>
                </div>

                {/* Share Buttons */}
                {flags.share && (
                  <ShareButtons title={project.title} url={projectUrl} variant="sidebar" />
                )}

                {/* Newsletter CTA */}
                {flags.newsletter && (
                  <div className="card-modern p-6 bg-gradient-to-br from-project/10 to-transparent border-2 border-project/20">
                    <h3 className="text-lg font-bold mb-3">📬 Newsletter</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      Receba novos projetos, artigos e desafios direto no seu email!
                    </p>
                    <TrackedLink
                      href="/newsletter"
                      label="Assinar newsletter"
                      className="block w-full text-center px-4 py-3 rounded-xl bg-project text-white font-semibold hover:opacity-90 transition-all hover:scale-105"
                    >
                      Assinar Newsletter
                    </TrackedLink>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
