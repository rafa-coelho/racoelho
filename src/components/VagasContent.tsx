'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';
import { VagaMeta } from '@/lib/types/vaga';
import { Search, X, Briefcase, Filter, Globe, ArrowUpRight, Gift } from 'lucide-react';

interface VagasContentProps {
  vagas: VagaMeta[];
  departments: string[];
  techs: string[];
}

export default function VagasContent({ vagas, departments, techs }: VagasContentProps) {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = vagas.filter((vaga) => {
    const matchesDept = !selectedDept || vaga.department === selectedDept;
    const matchesTech = !selectedTech || (vaga.tags || []).includes(selectedTech);
    const matchesSearch =
      !searchTerm ||
      vaga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vaga.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vaga.tags || []).some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesDept && matchesTech && matchesSearch;
  });

  const deptCounts = vagas.reduce((acc, vaga) => {
    if (vaga.department) acc[vaga.department] = (acc[vaga.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const techCounts = vagas.reduce((acc, vaga) => {
    (vaga.tags || []).forEach((t) => (acc[t] = (acc[t] || 0) + 1));
    return acc;
  }, {} as Record<string, number>);

  const hasActiveFilter = Boolean(selectedDept || selectedTech || searchTerm);
  const clearAll = () => {
    setSelectedDept(null);
    setSelectedTech(null);
    setSearchTerm('');
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 md:py-20">
        <div className="content-container">
          {/* Header */}
          <div className="mb-10 md:mb-16 text-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Briefcase size={20} className="text-primary" />
              <span className="font-bold text-primary text-sm sm:text-base">Vagas & Indicações</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Vagas abertas
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-2">
              Conhece alguém massa? Me indica aqui que eu levo a indicação adiante — sem redirect, direto comigo.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-8 md:mb-12 space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Buscar vagas..."
                  className="w-full pl-12 pr-4 py-3 md:py-4 rounded-2xl border-2 border-white/10 bg-card/50 backdrop-blur-sm focus:outline-none focus:border-primary transition-all text-base md:text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {departments.length > 0 && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    'px-5 py-3 md:px-6 md:py-4 rounded-2xl border-2 transition-all font-medium flex items-center justify-center gap-2',
                    showFilters
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 bg-card/50 hover:border-primary/50'
                  )}
                >
                  <Filter size={20} />
                  Áreas
                </button>
              )}
            </div>

            {/* Department Filter */}
            {showFilters && departments.length > 0 && (
              <div className="card-modern p-4 sm:p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base sm:text-lg">Filtrar por área</h3>
                  {selectedDept && (
                    <button
                      onClick={() => setSelectedDept(null)}
                      className="text-sm text-primary hover:opacity-80 flex items-center gap-1"
                    >
                      <X size={16} />
                      Limpar
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDept(selectedDept === dept ? null : dept)}
                      className={cn(
                        'px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all',
                        selectedDept === dept
                          ? 'bg-primary text-white'
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      )}
                    >
                      {dept} ({deptCounts[dept] || 0})
                    </button>
                  ))}
                </div>

                {/* Tecnologias */}
                {techs.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-base sm:text-lg">Filtrar por tecnologia</h3>
                      {selectedTech && (
                        <button
                          onClick={() => setSelectedTech(null)}
                          className="text-sm text-primary hover:opacity-80 flex items-center gap-1"
                        >
                          <X size={16} />
                          Limpar
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {techs.map((tech) => (
                        <button
                          key={tech}
                          onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                          className={cn(
                            'px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all',
                            selectedTech === tech
                              ? 'bg-primary text-white'
                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                          )}
                        >
                          {tech} ({techCounts[tech] || 0})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Results count */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-muted-foreground">
              <p className="text-base md:text-lg">
                <span className="text-foreground font-bold">{filtered.length}</span>{' '}
                {filtered.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
              </p>
              {hasActiveFilter && (
                <button
                  onClick={clearAll}
                  className="text-primary hover:opacity-80 flex items-center gap-1 text-sm font-medium"
                >
                  <X size={16} />
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {/* Vagas Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((vaga, index) => (
                <Link
                  key={vaga.slug}
                  href={`/vagas/${vaga.slug}`}
                  className="card-modern group overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-fade-in-up flex flex-col p-5 sm:p-6"
                  style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'backwards' }}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 text-primary">
                      <Briefcase size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {vaga.department || 'Vaga'}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight size={18} className="text-white" />
                    </div>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-3">
                    {vaga.title}
                  </h2>

                  {vaga.excerpt && (
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                      {vaga.excerpt}
                    </p>
                  )}

                  {/* Tags de tecnologia */}
                  {vaga.tags && vaga.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {vaga.tags.slice(0, 4).map((tag) => (
                        <button
                          key={tag}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedTech(selectedTech === tag ? null : tag);
                          }}
                          className={cn(
                            'px-2 py-0.5 text-[11px] font-medium rounded-full border transition-colors',
                            selectedTech === tag
                              ? 'bg-primary text-white border-primary'
                              : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                      {vaga.tags.length > 4 && (
                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-white/5 text-muted-foreground">
                          +{vaga.tags.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span
                        className={
                          vaga.acceptsBrazil
                            ? 'inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400'
                            : 'inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400'
                        }
                      >
                        {vaga.acceptsBrazil ? 'BR' : 'Intl'}
                      </span>
                      {vaga.isRemote && (
                        <span className="inline-flex items-center gap-1 text-xs">
                          <Globe size={14} />
                          Remoto
                        </span>
                      )}
                    </div>
                    <span className="text-primary font-medium group-hover:translate-x-1 transition-transform inline-block">
                      Indicar →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 md:py-20 px-4">
              <div className="inline-block p-6 sm:p-8 rounded-full bg-primary/10 mb-6">
                <Briefcase size={56} className="text-primary" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Nenhuma vaga encontrada</h3>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                Tente ajustar os filtros ou buscar por outros termos
              </p>
              <button onClick={clearAll} className="btn-primary">
                Limpar Filtros
              </button>
            </div>
          )}

          {/* Como funciona */}
          <div className="mt-14 md:mt-20">
            <div className="card-modern p-8 sm:p-12 border-2 border-primary/20">
              <div className="text-center mb-8">
                <Gift size={44} className="mx-auto mb-6 text-primary" />
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Como funciona a indicação</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-black text-primary mb-2">1</div>
                  <p className="text-muted-foreground">Escolha a vaga e clique nela</p>
                </div>
                <div>
                  <div className="text-2xl font-black text-primary mb-2">2</div>
                  <p className="text-muted-foreground">Preencha os dados de quem você quer indicar</p>
                </div>
                <div>
                  <div className="text-2xl font-black text-primary mb-2">3</div>
                  <p className="text-muted-foreground">Eu levo a indicação adiante pessoalmente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
