'use client';

import { useState } from 'react';
import { ProjectMeta } from '@/lib/types';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';
import { Search, X, FolderGit2, Filter, Github, Globe, Lock, Star, ArrowUpRight, Layers } from 'lucide-react';

interface ProjectsContentProps {
  projects: ProjectMeta[];
  tags: string[];
}

export default function ProjectsContent({ projects, tags }: ProjectsContentProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProjects = projects.filter(project => {
    const matchesTag = !selectedTag || project.tags?.includes(selectedTag);
    const matchesSearch = !searchTerm ||
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
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

  return (
    <Layout>
      <div className="min-h-screen py-12 md:py-20">
        <div className="content-container">
          {/* Header */}
          <div className="mb-10 md:mb-16 text-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-project/10 border border-project/20 mb-6">
              <FolderGit2 size={20} className="text-project" />
              <span className="font-bold text-project text-sm sm:text-base">Portfólio</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Projetos
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-2">
              Especificação, arquitetura e decisões técnicas por trás de cada projeto — inclusive dos privados
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-8 md:mb-12 space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Buscar projetos..."
                  className="w-full pl-12 pr-4 py-3 md:py-4 rounded-2xl border-2 border-white/10 bg-card/50 backdrop-blur-sm focus:outline-none focus:border-project transition-all text-base md:text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "px-5 py-3 md:px-6 md:py-4 rounded-2xl border-2 transition-all font-medium flex items-center justify-center gap-2",
                  showFilters
                    ? "border-project bg-project/10 text-project"
                    : "border-white/10 bg-card/50 hover:border-project/50"
                )}
              >
                <Filter size={20} />
                Filtros
              </button>
            </div>

            {/* Tags Filter */}
            {showFilters && (
              <div className="card-modern p-4 sm:p-6 animate-fade-in accent-project">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base sm:text-lg">Filtrar por tecnologia</h3>
                  {selectedTag && (
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="text-sm text-project hover:opacity-80 flex items-center gap-1"
                    >
                      <X size={16} />
                      Limpar
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(([tag, count]) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={cn(
                        "px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all",
                        selectedTag === tag
                          ? "bg-project text-white"
                          : "bg-project/10 text-project hover:bg-project/20"
                      )}
                    >
                      {tag} ({count})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-muted-foreground">
              <p className="text-base md:text-lg">
                <span className="text-foreground font-bold">{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}
              </p>
              {(selectedTag || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedTag(null);
                    setSearchTerm('');
                  }}
                  className="text-project hover:opacity-80 flex items-center gap-1 text-sm font-medium"
                >
                  <X size={16} />
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProjects.map((project, index) => {
                const isLarge = project.featured && index === 0;
                const isPrivate = !project.repoUrl && !project.liveUrl;

                return (
                  <Link
                    key={project.slug}
                    href={`/projetos/${project.slug}`}
                    className={cn(
                      "card-modern group overflow-hidden accent-project hover:scale-[1.02] transition-all duration-300 animate-fade-in-up flex flex-col",
                      isLarge && "sm:col-span-2"
                    )}
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                  >
                    {project.coverImage && (
                      <div className={cn(
                        "relative overflow-hidden",
                        isLarge ? "h-52 sm:h-64" : "h-44 sm:h-48"
                      )}>
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60"></div>
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-project text-white text-xs font-bold flex items-center gap-1">
                            <FolderGit2 size={14} />
                            PROJETO
                          </span>
                          {project.featured && (
                            <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-project text-xs font-bold flex items-center gap-1 border border-project/30">
                              <Star size={12} />
                              Destaque
                            </span>
                          )}
                        </div>
                        <div className="absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-project/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight size={22} className="text-white" />
                        </div>
                      </div>
                    )}

                    <div className={cn("p-5 sm:p-6 flex flex-col flex-1", isLarge && "md:p-8")}>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 text-project">
                          <Layers size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {project.role || 'Case Study'}
                          </span>
                        </div>
                        {isPrivate && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-muted-foreground">
                            <Lock size={12} />
                            Código privado
                          </span>
                        )}
                      </div>

                      <h2 className={cn(
                        "font-bold mb-3 group-hover:text-project transition-colors line-clamp-2",
                        isLarge ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
                      )}>
                        {project.title}
                      </h2>

                      {project.excerpt && (
                        <p className={cn(
                          "text-muted-foreground mb-4 leading-relaxed",
                          isLarge ? "text-sm sm:text-base line-clamp-3" : "text-sm line-clamp-2"
                        )}>
                          {project.excerpt}
                        </p>
                      )}

                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.slice(0, isLarge ? 5 : 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 text-xs font-medium rounded-full bg-project/10 text-project border border-project/20"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > (isLarge ? 5 : 3) && (
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-project/10 text-project">
                              +{project.tags.length - (isLarge ? 5 : 3)}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-auto pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            {project.repoUrl && <Github size={16} />}
                            {project.liveUrl && <Globe size={16} />}
                            {isPrivate && <span className="text-xs">Spec & arquitetura</span>}
                          </div>
                          <span className="text-project font-medium group-hover:translate-x-1 transition-transform inline-block">
                            Ver case →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 md:py-20 px-4">
              <div className="inline-block p-6 sm:p-8 rounded-full bg-project/10 mb-6">
                <FolderGit2 size={56} className="text-project" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Nenhum projeto encontrado</h3>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                Tente ajustar os filtros ou buscar por outros termos
              </p>
              <button
                onClick={() => {
                  setSelectedTag(null);
                  setSearchTerm('');
                }}
                className="btn-primary"
              >
                Limpar Filtros
              </button>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-14 md:mt-20">
            <div className="card-modern p-8 sm:p-12 text-center border-2 border-project/20">
              <FolderGit2 size={44} className="mx-auto mb-6 text-project" />
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Quer trocar uma ideia?</h3>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Confira meus artigos e desafios, ou entre em contato pelas redes
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link href="/posts" className="btn-primary inline-flex items-center justify-center gap-2">
                  Ver Artigos
                  <ArrowUpRight size={20} />
                </Link>
                <Link href="/links" className="btn-secondary inline-flex items-center justify-center gap-2">
                  Minhas Redes
                  <ArrowUpRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
