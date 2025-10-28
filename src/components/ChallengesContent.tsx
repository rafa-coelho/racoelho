'use client';

import { useState } from 'react';
import { ContentMeta } from '@/lib/api';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';
import { Search, X, Zap, Trophy, ArrowUpRight, Filter, Target } from 'lucide-react';

interface ChallengesContentProps {
  challenges: ContentMeta[];
  tags: string[];
}

export default function ChallengesContent({ challenges, tags }: ChallengesContentProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredChallenges = challenges.filter(challenge => {
    const matchesTag = !selectedTag || challenge.tags?.includes(selectedTag);
    const matchesSearch = !searchTerm || 
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
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
    .slice(0, 15);

  return (
    <Layout>
      <div className="min-h-screen py-20">
        <div className="content-container">
          {/* Header */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-challenge/10 border border-challenge/20 mb-6">
              <Zap size={24} className="text-challenge" />
              <span className="font-bold text-challenge">Pratique & Evolua</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
                Desafios
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
              Projetos práticos para você implementar e desenvolver suas habilidades
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-12 space-y-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Buscar desafios..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white/10 bg-card/50 backdrop-blur-sm focus:outline-none focus:border-challenge transition-all text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "px-6 py-4 rounded-2xl border-2 transition-all font-medium flex items-center gap-2",
                  showFilters 
                    ? "border-challenge bg-challenge/10 text-challenge" 
                    : "border-white/10 bg-card/50 hover:border-challenge/50"
                )}
              >
                <Filter size={20} />
                Filtros
              </button>
            </div>

            {/* Tags Filter */}
            {showFilters && (
              <div className="card-modern p-6 animate-fade-in border-l-4 border-challenge">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Filtrar por tecnologia</h3>
                  {selectedTag && (
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="text-sm text-challenge hover:text-challenge/80 flex items-center gap-1"
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
                        "px-4 py-2 rounded-full text-sm font-medium transition-all",
                        selectedTag === tag
                          ? "bg-challenge text-white"
                          : "bg-challenge/10 text-challenge hover:bg-challenge/20"
                      )}
                    >
                      {tag} ({count})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            <div className="flex items-center justify-between text-muted-foreground">
              <p className="text-lg">
                <span className="text-foreground font-bold">{filteredChallenges.length}</span> {filteredChallenges.length === 1 ? 'desafio encontrado' : 'desafios encontrados'}
              </p>
              {(selectedTag || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedTag(null);
                    setSearchTerm('');
                  }}
                  className="text-challenge hover:text-challenge/80 flex items-center gap-1 text-sm font-medium"
                >
                  <X size={16} />
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {/* Challenges Grid - Creative Layout */}
          {filteredChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge, index) => {
                const isLarge = index % 6 === 0;
                const isMedium = index % 4 === 0 && !isLarge;
                
                return (
                  <Link
                    key={challenge.slug}
                    href={`/listas/desafios/${challenge.slug}`}
                    className={cn(
                      "card-modern group overflow-hidden accent-challenge hover:scale-[1.02] transition-all duration-300 animate-fade-in-up",
                      isLarge && "md:col-span-2",
                      isMedium && "md:col-span-2 lg:col-span-1"
                    )}
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                  >
                    {challenge.coverImage && (
                      <div className={cn(
                        "relative overflow-hidden",
                        isLarge ? "h-64" : "h-48"
                      )}>
                        <img
                          src={challenge.coverImage}
                          alt={challenge.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60"></div>
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-challenge text-white text-xs font-bold flex items-center gap-1">
                          <Target size={14} />
                          DESAFIO
                        </div>
                        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-challenge/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight size={24} className="text-white" />
                        </div>
                      </div>
                    )}
                    
                    <div className={cn("p-6", isLarge && "md:p-8")}>
                      <div className="flex items-center gap-2 text-challenge mb-3">
                        <Zap size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Desafio Prático</span>
                      </div>

                      <h2 className={cn(
                        "font-bold mb-3 group-hover:text-challenge transition-colors line-clamp-2",
                        isLarge ? "text-3xl" : "text-xl"
                      )}>
                        {challenge.title}
                      </h2>

                      {challenge.excerpt && (
                        <p className={cn(
                          "text-muted-foreground mb-4 leading-relaxed",
                          isLarge ? "text-base line-clamp-3" : "text-sm line-clamp-2"
                        )}>
                          {challenge.excerpt}
                        </p>
                      )}

                      {challenge.tags && challenge.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {challenge.tags.slice(0, isLarge ? 4 : 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 text-xs font-medium rounded-full bg-challenge/10 text-challenge border border-challenge/20"
                            >
                              {tag}
                            </span>
                          ))}
                          {challenge.tags.length > (isLarge ? 4 : 3) && (
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-challenge/10 text-challenge">
                              +{challenge.tags.length - (isLarge ? 4 : 3)}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Trophy size={16} />
                            <span>Nível: Intermediário</span>
                          </div>
                          <span className="text-challenge font-medium group-hover:translate-x-1 transition-transform inline-block">
                            Começar →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-block p-8 rounded-full bg-challenge/10 mb-6">
                <Zap size={64} className="text-challenge" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Nenhum desafio encontrado</h3>
              <p className="text-xl text-muted-foreground mb-8">
                Tente ajustar os filtros ou buscar por outros termos
              </p>
              <button
                onClick={() => {
                  setSelectedTag(null);
                  setSearchTerm('');
                }}
                className="btn-primary bg-challenge hover:bg-challenge/90"
              >
                Limpar Filtros
              </button>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-20">
            <div className="card-modern p-12 text-center border-2 border-challenge/20">
              <Zap size={48} className="mx-auto mb-6 text-challenge" />
              <h3 className="text-3xl font-bold mb-4">Continue Aprendendo</h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Confira nossos artigos para complementar seu conhecimento e dominar novas tecnologias
              </p>
              <Link href="/posts" className="btn-primary inline-flex items-center gap-2">
                Ver Artigos
                <ArrowUpRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
