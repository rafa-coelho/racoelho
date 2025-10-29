'use client';

import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Linkedin, Copy, Check, Zap, Mail, Send, AtSign } from 'lucide-react';
import Layout from './Layout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ContentItem } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { TrackedLink } from './TrackedLink';
import { authorInfo } from '@/lib/config/constants';
import AdSlot from './AdSlot';
import { useAds } from '@/hooks/use-ads';
import { SlotType } from '@/lib/services/adOrchestrator';
import { generateShareLinks } from '@/lib/utils/share';
import { useFeatureFlags, useFeatureFlagWithMetadata } from '@/hooks/use-feature-flag';
import ShareButtons from './ShareButtons';

// Ícone customizado para X (Twitter)
const XIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Ícone customizado para WhatsApp
const WhatsAppIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

interface ChallengeContentProps {
  challenge: ContentItem;
}

export default function ChallengeContent({ challenge }: ChallengeContentProps) {
  const [copied, setCopied] = useState(false);

  const challengeUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/listas/desafios/${challenge.slug}`
    : '';

  // Feature Flags
  const { flags, loading: flagsLoading } = useFeatureFlags(['share', 'newsletter', 'ads']);
  // Slots que realmente existem na página de challenges
  const challengeSlots: SlotType[] = ['inline', 'footer'];
  const { placements, loading: adsLoading } = useAds('challenges', challengeSlots);
  const { flag: shareFlag } = useFeatureFlagWithMetadata('share');
  const allowedNetworks: string[] = Array.isArray(shareFlag?.metadata?.networks)
    ? (shareFlag!.metadata!.networks as string[])
    : ['threads', 'x', 'linkedin', 'whatsapp'];
  const showThreads = allowedNetworks.includes('threads');
  const showX = allowedNetworks.includes('x');
  const showLinkedin = allowedNetworks.includes('linkedin');
  const showWhatsapp = allowedNetworks.includes('whatsapp');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(challengeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const shareLinks = generateShareLinks(challenge.title, challengeUrl);

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
              {flags.share && (
                <ShareButtons title={challenge.title} url={challengeUrl} variant="inline" className="lg:hidden mb-8" />
              )}


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

                {/* Share Buttons */}
                {flags.share && (
                  <ShareButtons title={challenge.title} url={challengeUrl} variant="sidebar" />
                )}

                {/* Ad Inline (conteúdo curto para desafios) */}
                {flags.ads && !adsLoading && <AdSlot placement={placements['inline']} size="300x300" />}

                {/* Newsletter CTA */}
                {flags.newsletter && (
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
                )}

                {/* Ad Footer */}
                {flags.ads && !adsLoading && <AdSlot placement={placements['footer']} size="300x600" />}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}


