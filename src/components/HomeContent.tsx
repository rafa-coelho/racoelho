'use client';

import { ContentMeta, ProjectMeta, YoutubeVideo, SocialLink, LinkTreeItem } from '@/lib/api';
import { ArrowRight, Code2, Zap, Youtube, Sparkles, TrendingUp, FolderGit2, Lock } from 'lucide-react';
import Link from 'next/link';
import Layout from './Layout';
import { TrackedLink } from '@/components/TrackedLink';
import { useFeatureFlag } from '@/hooks/use-feature-flag';

interface HomeContentProps {
  posts: ContentMeta[];
  challenges: ContentMeta[];
  projects?: ProjectMeta[];
  videos?: YoutubeVideo[];
  socialLinks?: SocialLink[];
  linkItems?: LinkTreeItem[];
  totalPosts?: number;
  totalChallenges?: number;
}

export default function HomeContent({
  posts,
  challenges,
  projects = [],
  videos = [],
  socialLinks = [],
  linkItems = [],
  totalPosts = posts.length,
  totalChallenges = challenges.length
}: HomeContentProps) {
  const featuredPost = posts[0];

  // Feature Flags
  const { enabled: newsletterEnabled } = useFeatureFlag('newsletter');
  const { enabled: projectsEnabled } = useFeatureFlag('projects');

  return (
    <Layout>
      {/* Hero Section - Pessoal e Conectado */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent"></div>

        <div className="content-container relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              {/* Avatar Section */}
              <div className="flex-shrink-0 animate-fade-in">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-600/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 animate-glow-pulse"></div>
                  <img
                    src="https://github.com/rafa-coelho.png"
                    alt="Rafael Coelho"
                    className="relative w-48 h-48 md:w-56 md:h-56 rounded-3xl object-cover border-4 border-primary/20 shadow-2xl group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/200x200?text=RC';
                    }}
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 animate-fade-in">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-sm font-medium text-primary">Desenvolvedor Fullstack</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight animate-fade-in-up">
                  <span className="text-muted-foreground text-3xl md:text-4xl font-normal block mb-2">Oi, eu sou</span>
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Rafael Coelho
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed animate-fade-in max-w-3xl" style={{ animationDelay: '100ms' }}>
                  Compartilho o que aprendo sobre{' '}
                  <span className="text-foreground font-semibold">programação</span>,{' '}
                  <span className="text-primary font-semibold">desafios práticos</span> e{' '}
                  <span className="text-foreground font-semibold">dicas de carreira</span> em tech
                </p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <Link href="#content" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
                    <TrendingUp size={24} />
                    Explorar Conteúdo
                  </Link>
                  <Link href="/links" className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-4">
                    Minhas Redes
                    <ArrowRight size={20} />
                  </Link>
                </div>

                {/* Stats/Social Proof */}
                <div className="flex flex-wrap gap-6 mt-8 justify-center md:justify-start text-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Code2 size={16} className="text-primary" />
                    <span><span className="text-foreground font-bold">{totalPosts}</span> artigos</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Zap size={16} className="text-challenge" />
                    <span><span className="text-foreground font-bold">{totalChallenges}</span> desafios</span>
                  </div>
                  {videos.length > 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Youtube size={16} className="text-video" />
                      <span><span className="text-foreground font-bold">{videos.length}+</span> vídeos</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">Role para baixo</span>
            <ArrowRight size={20} className="rotate-90" />
          </div>
        </div>
      </section>

      {/* Bento Grid - Conteúdo Misto e Fluido */}
      <section id="content" className="py-20 section-gradient-1">
        <div className="content-container">
          {/* Featured Post - Grande Destaque */}
          {featuredPost && (
            <Link href={`/posts/${featuredPost.slug}`} className="block mb-12 group">
              <div className="card-modern overflow-hidden accent-post">
                <div className="grid md:grid-cols-2 gap-0">
                  {featuredPost.coverImage && (
                    <div className="relative h-[400px] md:h-auto overflow-hidden">
                      <img
                        src={featuredPost.coverImage}
                        alt={featuredPost.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent md:bg-gradient-to-r"></div>
                    </div>
                  )}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 text-sm font-medium text-post mb-4">
                      <Code2 size={18} />
                      <span>Artigo em Destaque</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredPost.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="px-3 py-1 text-xs font-medium rounded-full bg-post text-white">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="inline-flex items-center gap-2 text-primary font-semibold group">
                      Ler artigo
                      <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Bento Grid - Mix de Conteúdos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {posts.slice(1, 3).map((post, idx) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="card-modern overflow-hidden group accent-post hover:scale-[1.02] transition-all duration-300"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {post.coverImage && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-post text-white text-xs font-bold">
                      POST
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}

            {challenges.slice(0, 2).map((challenge, idx) => (
              <Link
                key={challenge.slug}
                href={`/listas/desafios/${challenge.slug}`}
                className="card-modern overflow-hidden group accent-challenge hover:scale-[1.02] transition-all duration-300"
                style={{ animationDelay: `${(idx + 3) * 100}ms` }}
              >
                {challenge.coverImage && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={challenge.coverImage}
                      alt={challenge.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-challenge text-white text-xs font-bold">
                      DESAFIO
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-challenge mb-2">
                    <Zap size={18} />
                    <span className="text-xs font-bold">DESAFIO</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-challenge transition-colors line-clamp-2">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{challenge.excerpt}</p>
                </div>
              </Link>
            ))}

            {videos.slice(0, 1).map((video, idx) => (
              <a
                key={video.id}
                href={video.link}
                target="_blank"
                rel="noopener noreferrer"
                className="card-modern overflow-hidden group accent-video hover:scale-[1.02] transition-all duration-300"
                style={{ animationDelay: `${(idx + 5) * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Youtube size={48} className="text-white" />
                  </div>
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-video text-white text-xs font-bold">
                    VÍDEO
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-video mb-2">
                    <Youtube size={18} />
                    <span className="text-xs font-bold">YOUTUBE</span>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-video transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>

          {/* CTAs para Ver Mais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/posts" className="card-modern p-8 text-center group hover:scale-105 transition-all accent-post">
              <Code2 size={48} className="mx-auto mb-4 text-post" />
              <h3 className="text-2xl font-bold mb-2 group-hover:text-post transition-colors">Ver Todos os Posts</h3>
              <p className="text-muted-foreground mb-4">Tutoriais e artigos sobre desenvolvimento</p>
              <ArrowRight size={24} className="mx-auto text-post" />
            </Link>

            <Link href="/listas/desafios" className="card-modern p-8 text-center group hover:scale-105 transition-all accent-challenge">
              <Zap size={48} className="mx-auto mb-4 text-challenge" />
              <h3 className="text-2xl font-bold mb-2 group-hover:text-challenge transition-colors">Ver Todos os Desafios</h3>
              <p className="text-muted-foreground mb-4">Projetos práticos para você implementar</p>
              <ArrowRight size={24} className="mx-auto text-challenge" />
            </Link>

            <a href="https://www.youtube.com/@racoelhoo" target="_blank" rel="noopener noreferrer" className="card-modern p-8 text-center group hover:scale-105 transition-all accent-video">
              <Youtube size={48} className="mx-auto mb-4 text-video" />
              <h3 className="text-2xl font-bold mb-2 group-hover:text-video transition-colors">Canal no YouTube</h3>
              <p className="text-muted-foreground mb-4">Vídeos sobre programação e tech</p>
              <ArrowRight size={24} className="mx-auto text-video" />
            </a>
          </div>
        </div>
      </section>

      {/* Projetos em Destaque */}
      {projectsEnabled && projects.length > 0 && (
        <section className="py-16 md:py-20 section-gradient-2">
          <div className="content-container">
            <div className="text-center mb-10 md:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-project/10 border border-project/20 mb-4">
                <FolderGit2 size={18} className="text-project" />
                <span className="text-sm font-bold text-project">Portfólio</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Projetos em Destaque</h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Cases com especificação, arquitetura e decisões técnicas — inclusive de apps privados
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
              {projects.slice(0, 3).map((project, idx) => {
                const isPrivate = !project.repoUrl && !project.liveUrl;
                return (
                  <Link
                    key={project.slug}
                    href={`/projetos/${project.slug}`}
                    className="card-modern overflow-hidden group accent-project hover:scale-[1.02] transition-all duration-300 flex flex-col"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {project.coverImage && (
                      <div className="relative h-44 sm:h-48 overflow-hidden">
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-project text-white text-xs font-bold">
                          PROJETO
                        </div>
                      </div>
                    )}
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 text-project">
                          <FolderGit2 size={18} />
                          <span className="text-xs font-bold uppercase tracking-wider">{project.role || 'Case Study'}</span>
                        </div>
                        {isPrivate && <Lock size={14} className="text-muted-foreground flex-shrink-0" />}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-project transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.excerpt}</p>
                      {project.tags && project.tags.length > 0 && (
                        <div className="mt-auto flex flex-wrap gap-1.5">
                          {project.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2.5 py-1 text-xs font-medium rounded-full bg-project/10 text-project border border-project/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center">
              <Link href="/projetos" className="btn-primary inline-flex items-center gap-2">
                Ver Todos os Projetos
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Setup CTA */}
      <section className="py-20 section-gradient-1">
        <div className="content-container">
          <Link href="/setup" className="block max-w-4xl mx-auto">
            <div className="card-modern p-12 md:p-16 text-center group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-6">💻</div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 group-hover:text-primary transition-colors">
                  Meu Setup de Desenvolvimento
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Ferramentas, equipamentos e configurações que uso no dia a dia
                </p>
                <div className="inline-flex items-center gap-2 text-primary font-bold text-lg">
                  Ver setup completo
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Newsletter CTA - Final */}
      {newsletterEnabled && (
        <section className="py-20 section-gradient-2">
          <div className="content-container">
            <div className="card-modern p-12 md:p-20 text-center max-w-3xl mx-auto border-2 border-primary/20">
              <div className="text-5xl mb-6">📬</div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Não Perca Nenhum Conteúdo</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Receba novos artigos, desafios e dicas diretamente no seu email
              </p>
              <TrackedLink
                href="/newsletter"
                label="Inscrever na newsletter"
                className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-5"
              >
                Assinar Newsletter Gratuitamente
                <ArrowRight size={24} />
              </TrackedLink>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
} 
