'use client';

import { useState } from 'react';
import { ContentMeta } from '@/lib/api';
import ContentCard from '@/components/ContentCard';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface ChallengesContentProps {
  challenges: ContentMeta[];
  tags: string[];
}

export default function ChallengesContent({ challenges, tags }: ChallengesContentProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChallenges = challenges.filter(challenge => {
    const matchesTag = !selectedTag || challenge.tags?.includes(selectedTag);
    const matchesSearch = !searchTerm || 
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <Layout>
      <div className="content-container py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Desafios de Programação</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Desafios práticos para melhorar suas habilidades de programação.
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
            <div className="w-full md:w-auto flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar desafios..."
                className="w-full px-4 py-2 rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar py-1">
              <Select value={selectedTag ?? 'all'} onValueChange={(val) => setSelectedTag(val === 'all' ? null : val)}>
                <SelectTrigger className="w-56 min-w-[12rem]" aria-label="Filtrar por tag">
                  <SelectValue placeholder={selectedTag ? selectedTag : 'Todas as tags'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as tags</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {filteredChallenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
            {filteredChallenges.map((challenge) => (
              <ContentCard key={challenge.slug} item={challenge} type="challenge" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl mb-2">Nenhum desafio encontrado</p>
            <p className="text-muted-foreground">
              Tente remover filtros ou buscar por outros termos.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
} 