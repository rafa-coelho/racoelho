'use client';
import { useState } from 'react';
import { ContentMeta } from '@/lib/api';
import Link from 'next/link';
import { cn, calculateReadingTime } from '@/lib/utils';
import Layout from './Layout';
import { Search, X, Calendar, Clock, ArrowUpRight, Filter } from 'lucide-react';

interface BlogContentProps {
  posts: (ContentMeta & { content?: string })[];
  tags: string[];
}

export default function BlogContent({ posts, tags }: BlogContentProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredPosts = posts.filter(post => {
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
    const matchesSearch = !searchTerm ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
  });

  // Get tag counts
  const tagCounts = posts.reduce((acc, post) => {
    post.tags?.forEach(tag => {
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
            <h1 className="text-6xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
              Artigos, tutoriais e insights sobre desenvolvimento e tecnologia
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-12 space-y-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white/10 bg-card/50 backdrop-blur-sm focus:outline-none focus:border-primary transition-all text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "px-6 py-4 rounded-2xl border-2 transition-all font-medium flex items-center gap-2",
                  showFilters 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-white/10 bg-card/50 hover:border-primary/50"
                )}
              >
                <Filter size={20} />
                Filtros
              </button>
            </div>

            {/* Tags Filter */}
            {showFilters && (
              <div className="card-modern p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Filtrar por tag</h3>
                  {selectedTag && (
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
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
                          ? "bg-primary text-white"
                          : "bg-primary/10 text-primary hover:bg-primary/20"
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
                <span className="text-foreground font-bold">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
              </p>
              {(selectedTag || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedTag(null);
                    setSearchTerm('');
                  }}
                  className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium"
                >
                  <X size={16} />
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {/* Posts Grid - Clean & Uniform */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => {
                const isLarge = index % 6 === 0;
                const isMedium = index % 4 === 0 && !isLarge;
                
                return (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className={cn(
                      "card-modern group overflow-hidden accent-post hover:scale-[1.02] transition-all duration-300 animate-fade-in-up",
                      isLarge && "md:col-span-2",
                      isMedium && "md:col-span-2 lg:col-span-1"
                    )}
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                  >
                    {post.coverImage && (
                      <div className={cn(
                        "relative overflow-hidden",
                        isLarge ? "h-64" : "h-48"
                      )}>
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60"></div>
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-post text-white text-xs font-bold flex items-center gap-1">
                          <Calendar size={14} />
                          POST
                        </div>
                        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-post/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight size={24} className="text-white" />
                        </div>
                      </div>
                    )}
                    
                    <div className={cn("p-6", isLarge && "md:p-8")}>
                      <h2 className={cn(
                        "font-bold mb-3 group-hover:text-post transition-colors line-clamp-2",
                        isLarge ? "text-3xl" : "text-xl"
                      )}>
                        {post.title}
                      </h2>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('pt-BR', { 
                              day: 'numeric', 
                              month: 'short',
                              year: 'numeric'
                            })}
                          </time>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{post.readingTime ? `${post.readingTime} min` : '—'}</span>
                        </div>
                      </div>

                      {post.excerpt && (
                        <p className={cn(
                          "text-muted-foreground mb-4 leading-relaxed",
                          isLarge ? "text-base line-clamp-3" : "text-sm line-clamp-2"
                        )}>
                          {post.excerpt}
                        </p>
                      )}

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, isLarge ? 4 : 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 text-xs font-medium rounded-full bg-post/10 text-post border border-post/20"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > (isLarge ? 4 : 3) && (
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-post/10 text-post">
                              +{post.tags.length - (isLarge ? 4 : 3)}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock size={16} />
                            <span>Leitura: {post.readingTime ? `${post.readingTime} min` : '—'}</span>
                          </div>
                          <span className="text-post font-medium group-hover:translate-x-1 transition-transform inline-block">
                            Ler →
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
              <div className="inline-block p-8 rounded-full bg-secondary/50 mb-6">
                <Search size={64} className="text-muted-foreground" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Nenhum artigo encontrado</h3>
              <p className="text-xl text-muted-foreground mb-8">
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
        </div>
      </div>
    </Layout>
  );
}
