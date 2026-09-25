'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Layout from './Layout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ContentItem } from '@/lib/api';
import { TrackedLink } from './TrackedLink';
import { authorInfo } from '@/lib/config/constants';
import AdSlot from './AdSlot';
import { useAds } from '@/hooks/use-ads';
import { SlotType } from '@/lib/services/adOrchestrator';
import { useFeatureFlags } from '@/hooks/use-feature-flag';
import ShareButtons from './ShareButtons';
import { useViewTracking } from '@/hooks/use-view-tracking';
import { Eyebrow, RcImage, cardClasses, formatShortDate } from '@/components/rc';

interface ChallengeContentProps {
  challenge: ContentItem;
}

export default function ChallengeContent({ challenge }: ChallengeContentProps) {
  const [challengeUrl, setChallengeUrl] = useState('');

  useEffect(() => {
    setChallengeUrl(`${window.location.origin}/listas/desafios/${challenge.slug}`);
  }, [challenge.slug]);

  // View Tracking
  useViewTracking({ challengeId: challenge.slug });

  // Feature Flags
  const { flags } = useFeatureFlags(['share', 'newsletter', 'ads']);
  // Slots que realmente existem na página de challenges
  const challengeSlots: SlotType[] = ['inline', 'footer'];
  const { placements, loading: adsLoading } = useAds('challenges', challengeSlots);

  const mailto = `mailto:${authorInfo.email}?subject=${encodeURIComponent(`Solução do Desafio: ${challenge.title}`)}&body=${encodeURIComponent(`Olá! Conclui o desafio "${challenge.title}" e gostaria de compartilhar minha solução.\n\nLink do projeto: `)}`;

  return (
    <Layout>
      <div className="rc-container pt-5 md:pt-8">
        <TrackedLink
          href="/listas/desafios"
          label="Voltar para desafios"
          className="-ml-2 inline-flex h-11 items-center px-2 font-mono text-xs text-rc-ink-4 transition-colors hover:text-rc-green md:h-auto"
        >
          ← voltar para desafios
        </TrackedLink>
      </div>

      <div className="rc-container grid grid-cols-1 items-start gap-12 pb-2 pt-3 md:pt-[26px] lg:grid-cols-[minmax(0,1fr)_320px] lg:pb-14">
        <article className="min-w-0 max-w-[72ch]">
          <span className="inline-flex items-center rounded-full border border-rc-green-border-strong bg-rc-green-surface px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[.1em] text-rc-green md:text-[11px]">
            Desafio prático
          </span>
          <h1 className="mt-4 max-w-[22ch] text-rc-h1-article-m font-semibold text-rc-ink [text-wrap:balance] md:mt-5 md:text-[50px] md:leading-[1.14] md:tracking-[-.04em]">
            {challenge.title}
          </h1>
          <div className="mt-4 font-mono text-[11.5px] text-rc-ink-5 md:mt-5 md:text-xs">
            <time dateTime={challenge.date}>{formatShortDate(challenge.date)}</time>
          </div>

          {challenge.tags && challenge.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 md:mt-[18px]">
              {challenge.tags.map((tag) => (
                <TrackedLink
                  key={tag}
                  href={`/listas/desafios?tag=${tag}`}
                  label={`Filtrar desafios por tag: ${tag}`}
                  className="rounded-full border border-rc-green-border-strong bg-rc-green-surface px-3 py-1.5 font-mono text-[11px] text-rc-green transition-colors hover:border-rc-green md:text-[11.5px]"
                >
                  {tag}
                </TrackedLink>
              ))}
            </div>
          )}

          {challenge.excerpt && (
            <p className="mt-6 max-w-[60ch] text-[17.5px] leading-[1.7] text-rc-ink-2 [text-wrap:pretty] md:mt-[30px] md:text-rc-lead md:leading-[1.7]">{challenge.excerpt}</p>
          )}

          {challenge.coverImage && (
            <RcImage src={challenge.coverImage} alt="" ratio="16/9" className="mt-6 rounded-rc-card border border-rc-border-card" />
          )}

          <MarkdownRenderer
            content={challenge.content}
            className="[&_blockquote]:border-rc-green [&_blockquote]:bg-rc-green-surface"
          />

          {/* Enviar solução (mesmo fluxo por email de hoje) */}
          <div className="mt-10 flex flex-col gap-4 rounded-rc-card-lg border border-rc-green-border-strong bg-rc-green-surface p-5 md:mt-11 md:flex-row md:items-start md:gap-5 md:p-7">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-rc-green-border-strong bg-rc-green-chip text-rc-green" aria-hidden="true">
              <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold tracking-[-.022em] text-rc-ink md:text-[22px]">Envie o link do seu projeto</h2>
              <p className="mt-2.5 max-w-[56ch] text-[15px] leading-[1.65] text-rc-ink-3 md:text-base">
                Concluiu o desafio? Compartilhe sua solução! Envie o link do seu projeto (GitHub, deploy, etc.) para o email abaixo. Adoraria ver como você resolveu.
              </p>
              <a
                href={mailto}
                className="mt-4 inline-flex h-12 max-w-full items-center justify-center truncate rounded-[10px] bg-rc-green px-5 text-[15px] font-semibold text-rc-canvas transition-colors hover:bg-rc-green-hover md:h-auto md:py-3"
              >
                {authorInfo.email}
              </a>
            </div>
          </div>

          {flags.share && (
            <ShareButtons title={challenge.title} url={challengeUrl} variant="inline" className="mt-8 border-t border-rc-border pt-6 lg:hidden" />
          )}
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-4">
            <div className={cardClasses({ className: 'p-5' })}>
              <Eyebrow>Sobre o autor</Eyebrow>
              <div className="mt-3.5 flex items-center gap-3.5">
                <RcImage src={authorInfo.avatar} alt="" ratio="1/1" className="w-12 shrink-0 rounded-full border border-rc-green-border-strong" />
                <div>
                  <div className="text-base font-semibold text-rc-ink">{authorInfo.name}</div>
                  <div className="mt-0.5 text-[13px] text-rc-ink-4">{authorInfo.title}</div>
                </div>
              </div>
              <p className="mt-3.5 text-sm leading-[1.6] text-rc-ink-4">{authorInfo.bio}</p>
              <TrackedLink href={authorInfo.profileUrl} label="Ver perfil completo" className="mt-3 inline-block text-[13.5px] font-medium text-rc-green hover:text-rc-green-hover">
                Ver perfil completo →
              </TrackedLink>
            </div>

            {flags.share && <ShareButtons title={challenge.title} url={challengeUrl} variant="sidebar" />}

            {/* Ad Inline (conteúdo curto para desafios) */}
            {flags.ads && !adsLoading && placements['inline'] && (
              <AdSlot placement={placements['inline']} size="300x300" />
            )}

            {flags.newsletter && (
              <div className="rounded-rc-card border border-rc-green-border-strong bg-rc-green-surface p-5">
                <div className="text-[17px] font-semibold tracking-[-.02em] text-rc-ink">Newsletter</div>
                <p className="mt-2.5 text-sm leading-[1.6] text-rc-ink-3">Receba novos desafios e conteúdo direto no seu email.</p>
                <TrackedLink
                  href="/newsletter"
                  label="Assinar newsletter"
                  className="mt-3.5 flex h-11 w-full items-center justify-center rounded-[10px] bg-rc-green text-[14.5px] font-semibold text-rc-canvas transition-colors hover:bg-rc-green-hover"
                >
                  Assinar newsletter
                </TrackedLink>
              </div>
            )}

            {/* Ad Footer */}
            {flags.ads && !adsLoading && placements['footer'] && (
              <AdSlot placement={placements['footer']} size="300x600" />
            )}
          </div>
        </aside>
      </div>
    </Layout>
  );
}
