'use client';

import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Twitter, Linkedin, Facebook, Copy, Check, Zap, Mail, Send } from 'lucide-react';
import Layout from './Layout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ContentItem } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { TrackedLink } from './TrackedLink';
import { authorInfo } from '@/lib/config/constants';

interface ChallengeContentProps {
  challenge: ContentItem;
}

export default function ChallengeContent({ challenge }: ChallengeContentProps) {
  const [copied, setCopied] = useState(false);

  const challengeUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/listas/desafios/${challenge.slug}` 
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(challengeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(challenge.title)}&url=${encodeURIComponent(challengeUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(challengeUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(challengeUrl)}`,
  };

  return (
    <Layout>
      <div className="min-h-screen py-12">
        {/* Container mais largo para o header */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
          <TrackedLink
            href="/listas/desafios"
            label="Voltar para desafios"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
              <ArrowLeft size={16} className="mr-2" />
              Voltar para desafios
          </TrackedLink>
          </div>

          {/* Header do Desafio - Full Width */}
          <header className="mb-12">
            {/* Badge de categoria */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-challenge/10 border border-challenge/20 mb-6">
              <Zap size={16} className="text-challenge" />
              <span className="text-sm font-medium text-challenge">Desafio Prático</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight max-w-5xl">
              {challenge.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <time dateTime={challenge.date} className="font-medium">{formatDate(challenge.date)}</time>
              </div>
            </div>

            {/* Tags */}
            {challenge.tags && challenge.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {challenge.tags.map((tag) => (
                  <TrackedLink
                    key={tag}
                    href={`/listas/desafios?tag=${tag}`}
                    label={`Filtrar desafios por tag: ${tag}`}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-challenge/10 text-challenge border border-challenge/20 hover:bg-challenge/20 transition-colors"
                  >
                    {tag}
                  </TrackedLink>
                ))}
              </div>
            )}
          </header>

          {/* Layout com 2 colunas: Conteúdo + Sidebar Direita */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
            {/* Conteúdo Principal */}
            <article className="min-w-0">
              {/* Mobile Share Buttons */}
              <div className="lg:hidden mb-8 space-y-4">
                <div className="card-modern p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Compartilhar:</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(shareLinks.twitter, '_blank', 'width=550,height=420');
                        }}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <Twitter size={18} className="text-[#1DA1F2]" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(shareLinks.linkedin, '_blank', 'width=550,height=420');
                        }}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <Linkedin size={18} className="text-[#0A66C2]" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(shareLinks.facebook, '_blank', 'width=550,height=420');
                        }}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <Facebook size={18} className="text-[#1877F2]" />
                      </button>
                      <button onClick={handleCopyLink} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enviar Projeto - Mobile */}
                <a
                  href={`mailto:${authorInfo.email}?subject=${encodeURIComponent(`Solução do Desafio: ${challenge.title}`)}&body=${encodeURIComponent(`Olá! Conclui o desafio "${challenge.title}" e gostaria de compartilhar minha solução.\n\nLink do projeto: `)}`}
                  className="card-modern p-4 flex items-center justify-center gap-2 bg-challenge/10 hover:bg-challenge/20 border border-challenge/20 transition-colors"
                >
                  <Send size={18} className="text-challenge" />
                  <span className="text-sm font-medium text-challenge">Enviar Projeto</span>
                </a>
              </div>

              {/* Conteúdo do Desafio */}
              <div className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-base prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-challenge prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-bold
                prose-code:text-primary prose-code:bg-secondary prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-secondary prose-pre:border prose-pre:border-white/10 prose-pre:shadow-xl
                prose-blockquote:border-l-4 prose-blockquote:border-challenge prose-blockquote:bg-challenge/5 prose-blockquote:py-4 prose-blockquote:px-6
                prose-ul:my-6 prose-ol:my-6
                prose-li:my-2
                prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-8">
            <MarkdownRenderer content={challenge.content} />
          </div>

              {/* Call to Action - Enviar Projeto */}
              <div className="mt-16 card-modern p-8 border-2 border-challenge/20 bg-gradient-to-br from-challenge/5 to-transparent">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-challenge/10 border border-challenge/20">
                    <Send size={28} className="text-challenge" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-3 text-foreground">Envie o link do seu projeto</h2>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      Concluiu o desafio? Compartilhe sua solução! Envie o link do seu projeto (GitHub, deploy, etc.) para o email abaixo. 
                      Adoraria ver como você resolveu! 🚀
                    </p>
                    <a 
                      href={`mailto:${authorInfo.email}?subject=${encodeURIComponent(`Solução do Desafio: ${challenge.title}`)}&body=${encodeURIComponent(`Olá! Conclui o desafio "${challenge.title}" e gostaria de compartilhar minha solução.\n\nLink do projeto: `)}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-challenge text-white font-semibold hover:bg-challenge/90 transition-all hover:scale-105"
                    >
                      <Mail size={20} />
                      {authorInfo.email}
                    </a>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar Direita */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                {/* Share Buttons */}
                <div className="card-modern p-6">
                  <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase tracking-wider">Compartilhar</h3>
                  <div className="space-y-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(shareLinks.twitter, '_blank', 'width=550,height=420');
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group w-full text-left"
                    >
                      <Twitter size={20} className="text-[#1DA1F2]" />
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">Twitter</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(shareLinks.linkedin, '_blank', 'width=550,height=420');
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group w-full text-left"
                    >
                      <Linkedin size={20} className="text-[#0A66C2]" />
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">LinkedIn</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(shareLinks.facebook, '_blank', 'width=550,height=420');
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group w-full text-left"
                    >
                      <Facebook size={20} className="text-[#1877F2]" />
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">Facebook</span>
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group w-full text-left"
                    >
                      {copied ? (
                        <Check size={20} className="text-green-500" />
                      ) : (
                        <Copy size={20} className="text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">
                        {copied ? 'Copiado!' : 'Copiar link'}
                      </span>
                    </button>

                    {/* Divider */}
                    <div className="border-t border-white/10 my-2"></div>

                    {/* Enviar Projeto */}
                    <a
                      href={`mailto:${authorInfo.email}?subject=${encodeURIComponent(`Solução do Desafio: ${challenge.title}`)}&body=${encodeURIComponent(`Olá! Conclui o desafio "${challenge.title}" e gostaria de compartilhar minha solução.\n\nLink do projeto: `)}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-challenge/10 hover:bg-challenge/20 border border-challenge/20 transition-colors group w-full text-left"
                    >
                      <Send size={20} className="text-challenge" />
                      <span className="text-sm font-medium text-challenge">Enviar Projeto</span>
                    </a>
                  </div>
                </div>

                {/* Author Card */}
                <div className="card-modern p-6">
                  <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase tracking-wider">Sobre o Autor</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={authorInfo.avatar} 
                      alt={authorInfo.name}
                      className="w-16 h-16 rounded-full ring-2 ring-challenge"
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
                    className="text-sm text-challenge hover:text-challenge/80 font-medium"
                  >
                    Ver perfil completo →
                  </TrackedLink>
                </div>

                {/* Ad Slot 1 */}
                <div className="card-modern p-6 bg-gradient-to-br from-primary/5 to-purple-600/5 border-2 border-dashed border-primary/20">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">PUBLICIDADE</p>
                    <div className="aspect-square bg-secondary/50 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Ad 300x300</p>
                    </div>
                  </div>
                </div>

                {/* Newsletter CTA */}
                <div className="card-modern p-6 bg-gradient-to-br from-challenge/10 to-transparent border-2 border-challenge/20">
                  <h3 className="text-lg font-bold mb-3">📬 Newsletter</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Receba novos desafios e conteúdo direto no seu email!
                  </p>
                  <TrackedLink
                    href="/newsletter"
                    label="Assinar newsletter"
                    className="block w-full text-center px-4 py-3 rounded-xl bg-challenge text-white font-semibold hover:bg-challenge/90 transition-all hover:scale-105"
                  >
                    Assinar Newsletter
                  </TrackedLink>
                </div>

                {/* Ad Slot 2 - Skyscraper */}
                <div className="card-modern p-6 bg-gradient-to-br from-primary/5 to-purple-600/5 border-2 border-dashed border-primary/20">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">PUBLICIDADE</p>
                    <div className="h-[600px] bg-secondary/50 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Ad 300x600</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}


