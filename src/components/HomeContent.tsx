'use client';

import { useState } from 'react';
import { ContentMeta } from '@/lib/api';
import ContentCard from '@/components/ContentCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Layout from './Layout';
import { TrackedLink } from '@/components/TrackedLink';

interface HomeContentProps {
  posts: ContentMeta[];
  challenges: ContentMeta[];
}

export default function HomeContent({ posts, challenges }: HomeContentProps) {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-background to-accent/20 min-h-[80vh] flex items-center justify-center">
        <div className="content-container text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-in">
            Desenvolvimento, Tecnologia e Desafios
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Compartilhando conhecimento e experiências sobre o mundo do 
            desenvolvimento de software, novas tecnologias e desafios de programação.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/posts"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Ver Blog
            </Link>
            <Link
              href="/listas/desafios"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Explorar Desafios
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-background">
        <div className="content-container">
          <div className="glass-panel rounded-xl p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Sobre Mim</h2>
            <div className="grid md:grid-cols-[1fr_2fr] gap-8 items-center">
              <div className="aspect-square rounded-xl overflow-hidden bg-accent flex items-center justify-center">
                <img 
                  src="https://github.com/rafa-coelho.png" 
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Perfil';
                  }}
                />
              </div>
              <div>
                <p className="text-lg mb-4">
                  Olá! Sou um desenvolvedor e criador de conteúdo apaixonado por tecnologia e programação.
                  Compartilho meus conhecimentos e experiências através de posts, tutoriais e desafios práticos.
                </p>
                <p className="text-lg mb-6">
                  Meu objetivo é tornar o conhecimento técnico acessível, ajudando outros desenvolvedores
                  a crescerem em suas jornadas profissionais.
                </p>
                <Link
                  href="/links"
                  className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                >
                  Conheça minhas redes sociais <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16 bg-accent/10">
        <div className="content-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Últimos Posts</h2>
            <Link
              href="/posts"
              className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium transition-colors"
            >
              Ver todos <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <ContentCard 
                  key={post.slug} 
                  item={post} 
                  type="post"
                  LinkComponent={TrackedLink}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum post disponível no momento.
            </div>
          )}
        </div>
      </section>

      {/* Latest Challenges Section */}
      <section className="py-16 bg-background">
        <div className="content-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Últimos Desafios</h2>
            <Link
              href="/listas/desafios"
              className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium transition-colors"
            >
              Ver todos <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {challenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <ContentCard 
                  key={challenge.slug} 
                  item={challenge} 
                  type="challenge"
                  LinkComponent={TrackedLink}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum desafio disponível no momento.
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-t from-background to-accent/20">
        <div className="content-container text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Receba novidades</h2>
          <p className="text-muted-foreground mb-8">
            Assine a newsletter para receber atualizações sobre novos posts, 
            desafios e conteúdos exclusivos.
          </p>
          <TrackedLink 
            href="/newsletter" 
            label="Inscrever na newsletter"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Assinar newsletter
          </TrackedLink>
        </div>
      </section>
    </Layout>
  );
} 