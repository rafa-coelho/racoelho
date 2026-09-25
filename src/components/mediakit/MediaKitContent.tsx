import type { ReactNode } from 'react';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';
import { authorInfo } from '@/lib/config/constants';
import type { MediaKit, MediaKitBlock, MediaKitChannel, MediaKitFeatured, MediaKitFormat } from '@/lib/types';
import { formatCount } from '@/lib/services/community-stats.service';
import { RcImage, SocialIcon, buttonClasses, cardClasses, pad2 } from '@/components/rc';
import { TrackedAnchor } from './TrackedAnchor';

interface MediaKitContentProps {
  kit: MediaKit;
  // preview do admin (?preview=1): mostra seções não revisadas com o selo
  preview?: boolean;
}

// ── helpers ──

const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

function updatedLabel(value?: string) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return `atualizado em ${MONTHS[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

function networkKey(network: string) {
  return network.toLowerCase().trim();
}

// Rótulo da unidade do número por rede (só texto; o número vem do CMS).
function followersUnit(network: string) {
  const key = networkKey(network);
  if (key.includes('youtube')) return 'inscritos';
  if (key.includes('newsletter')) return 'assinantes';
  return 'seguidores';
}

function networkIconName(network: string) {
  const key = networkKey(network);
  if (key.includes('newsletter') || key.includes('email')) return 'email';
  return key;
}

function networkTone(network: string) {
  const key = networkKey(network);
  if (key.includes('youtube')) return 'text-rc-red';
  if (key.includes('newsletter') || key.includes('email')) return 'text-rc-green';
  return 'text-rc-blue-soft';
}

const FEATURED_LABEL: Record<MediaKitFeatured['type'], { label: string; tone: string }> = {
  video: { label: 'Vídeo', tone: 'text-rc-red' },
  post: { label: 'Artigo', tone: 'text-rc-blue-link' },
  challenge: { label: 'Desafio', tone: 'text-rc-green' },
  talk: { label: 'Palestra', tone: 'text-rc-amber' },
};

// ── blocos ──

function ReviewBadge() {
  return (
    <span className="whitespace-nowrap rounded-full border border-rc-amber-border bg-rc-amber-surface px-2.5 py-[5px] font-mono text-[10px] uppercase tracking-[.08em] text-rc-amber md:text-[10.5px]">
      texto proposto · revisar
    </span>
  );
}

function KitSection({
  id,
  number,
  title,
  aside,
  children,
}: {
  id?: string;
  number: number;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  const headingId = `mediakit-${id ?? number}`;
  return (
    <section id={id} aria-labelledby={headingId} className="rc-container pt-6 md:pt-16">
      <div className="mb-3.5 flex flex-wrap items-center gap-x-3 gap-y-2 md:mb-6 md:gap-x-4">
        <span className="font-mono text-[11px] text-rc-ink-6 md:text-xs">{pad2(number)}</span>
        <h2 id={headingId} className="text-[17px] font-semibold tracking-[-.02em] text-rc-ink md:text-[22px]">
          {title}
        </h2>
        <span className="h-px min-w-[24px] flex-1 bg-rc-border" aria-hidden="true" />
        {aside}
      </div>
      {children}
    </section>
  );
}

function ChannelCard({ channel }: { channel: MediaKitChannel }) {
  const hasFollowers = typeof channel.followers === 'number' && Number.isFinite(channel.followers);
  const value = hasFollowers ? formatCount(channel.followers as number) : '—';

  return (
    <div className={cardClasses({ className: 'flex flex-col rounded-[13px] p-[15px] md:rounded-rc-card-lg md:p-6' })}>
      <div className="flex items-center justify-between gap-2">
        <span className={cn('flex min-w-0 items-center gap-2', networkTone(channel.network))}>
          <SocialIcon name={networkIconName(channel.network)} className="h-[15px] w-[15px] shrink-0 md:hidden" />
          <span className="truncate font-mono text-[10.5px] text-rc-ink-5 md:font-sans md:text-[17px] md:font-semibold md:tracking-[-.018em] md:text-rc-ink">
            {channel.network}
          </span>
        </span>
        {channel.note && (
          <span className={cn('hidden truncate font-mono text-[10.5px] uppercase tracking-[.1em] md:inline', networkTone(channel.network))}>
            {channel.note}
          </span>
        )}
      </div>

      <div className="mt-[9px] flex items-baseline gap-2.5 md:mt-[18px]">
        <span className={cn('text-[22px] font-semibold tracking-[-.03em] md:text-[34px] md:tracking-[-.035em]', hasFollowers ? 'text-rc-ink' : 'text-rc-ink-empty')}>
          {value}
        </span>
        <span className="hidden font-mono text-xs text-rc-ink-5 md:inline">{followersUnit(channel.network)}</span>
      </div>

      {channel.handle && channel.url && (
        <a
          href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto hidden truncate border-t border-rc-border-card pt-3.5 font-mono text-xs text-rc-blue-link transition-colors hover:text-rc-blue-soft md:mt-[18px] md:block"
        >
          {channel.handle} ↗
        </a>
      )}
    </div>
  );
}

function FormatCard({ format, preview }: { format: MediaKitFormat; preview: boolean }) {
  return (
    <div className={cardClasses({ className: 'flex flex-col rounded-[13px] p-[15px] md:rounded-xl md:p-5' })}>
      {format.tag && <div className="font-mono text-[10px] uppercase tracking-[.1em] text-rc-ink-5">{format.tag}</div>}
      <h3 className="mt-2 text-[15.5px] font-semibold text-rc-ink md:mt-2.5 md:text-[16.5px] md:tracking-[-.015em]">{format.title}</h3>
      {format.description && <p className="mt-1.5 text-[13.5px] leading-[1.5] text-rc-ink-4 md:mt-[7px] md:leading-[1.55]">{format.description}</p>}
      {format.exampleUrl ? (
        <a
          href={format.exampleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block border-t border-rc-border-card pt-3 text-[12.5px] leading-[1.45] text-rc-blue-soft transition-colors hover:text-rc-ink md:mt-auto md:pt-3.5 md:text-[13px]"
        >
          {format.exampleLabel || 'Ver exemplo'} ↗
        </a>
      ) : (
        // "exemplo a preencher" só no preview do admin; no público, nada
        preview && (
          <div className="mt-3 border-t border-rc-border-card pt-3 text-[12.5px] leading-[1.45] text-rc-ink-empty md:mt-auto md:pt-3.5 md:text-[13px]">
            exemplo a preencher
          </div>
        )
      )}
    </div>
  );
}

function FeaturedCard({ item }: { item: MediaKitFeatured }) {
  const meta = FEATURED_LABEL[item.type] ?? { label: item.type, tone: 'text-rc-ink-5' };
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClasses({ interactive: true, className: 'flex items-center overflow-hidden sm:block' })}
    >
      <RcImage src={item.coverImage} alt="" ratio="16/9" className="ml-3 w-[108px] shrink-0 rounded-[8px] sm:ml-0 sm:w-full sm:rounded-none" />
      <div className="min-w-0 flex-1 p-3.5 md:p-[18px]">
        <span className={cn('font-mono text-[9.5px] uppercase tracking-[.1em]', meta.tone)}>{meta.label}</span>
        <div className="mt-2 line-clamp-2 text-[15px] font-semibold leading-[1.35] text-rc-ink md:mt-[9px] md:text-[15.5px]">{item.title}</div>
      </div>
    </a>
  );
}

function BlockGrid({ items, numbered }: { items: MediaKitBlock[]; numbered?: boolean }) {
  return (
    <div className={cn('grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:gap-4', items.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>
      {items.map((block, i) => (
        <div key={`${block.title}-${i}`} className={cardClasses({ className: 'rounded-[13px] p-[15px] md:rounded-rc-card md:p-[22px]' })}>
          {numbered && <div className="font-mono text-[11px] text-rc-blue-link md:text-xs">{pad2(i + 1)}</div>}
          <h3 className={cn('text-[15.5px] font-semibold text-rc-ink md:text-[17px] md:tracking-[-.018em]', numbered && 'mt-2 md:mt-3')}>{block.title}</h3>
          <p className="mt-1.5 text-[13.5px] leading-[1.55] text-rc-ink-4 md:mt-2 md:text-[14.5px] md:leading-[1.6]">{block.text}</p>
        </div>
      ))}
    </div>
  );
}

// ── página ──

export default function MediaKitContent({ kit, preview = false }: MediaKitContentProps) {
  const contactHref = `mailto:${kit.contactEmail}`;
  const channels = kit.channels.filter((c) => c && c.network);
  const formats = kit.formats.filter((f) => f && f.title);
  const featured = kit.featured.filter((f) => f && f.title && f.url).slice(0, 6);
  const brands = kit.brands.filter((b) => b && b.name);
  const process = kit.process.filter((b) => b && b.title);
  const principles = kit.principles.filter((b) => b && b.title);

  // Como funciona / Meu jeito de trabalhar: só com reviewed:true no público;
  // no preview do admin aparecem com o selo enquanto não revisados.
  const showReviewed = kit.reviewed || preview;
  const badge = !kit.reviewed ? <ReviewBadge /> : undefined;

  const year = new Date(kit.updatedAt || Date.now()).getUTCFullYear();
  const updated = updatedLabel(kit.updatedAt);

  // Numeração segue só as seções renderizadas
  let n = 0;
  const next = () => ++n;

  return (
    <Layout>
      {/* 1. Hero */}
      <section className="relative overflow-hidden border-b border-rc-border">
        <div className="rc-dots-bg" />
        <div className="rc-dots-fade" />
        <div className="rc-container relative grid grid-cols-1 items-center gap-8 pb-7 pt-[34px] md:grid-cols-[260px_1fr] md:gap-14 md:pb-14 md:pt-14 lg:grid-cols-[300px_1fr]">
          {/* Foto + disponibilidade (desktop) */}
          <div className="hidden flex-col gap-3.5 md:flex">
            <RcImage src={authorInfo.avatar} alt={authorInfo.name} ratio="1/1" className="rounded-rc-card-lg border border-rc-photo-border" />
            {kit.availability && (
              <div className={cardClasses({ className: 'rounded-xl border-rc-border-chip px-4 py-3.5 font-mono text-xs' })}>
                <div className="text-[10.5px] uppercase tracking-[.1em] text-rc-ink-5">Disponibilidade</div>
                <div className="mt-2 leading-[1.5] text-rc-ink-3">{kit.availability}</div>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <span className="font-mono text-[10.5px] uppercase tracking-[.12em] text-rc-ink-5 md:text-[11.5px]">Media kit · {year}</span>
            <h1 className="mt-3 text-[32px] font-semibold leading-[1.16] tracking-[-.034em] text-rc-ink [text-wrap:balance] md:mt-5 md:text-[46px] md:leading-[1.18] md:tracking-[-.04em] lg:text-[52px]">
              {kit.headline}
            </h1>
            {kit.summary && (
              <p className="mt-3 max-w-[56ch] text-base leading-[1.62] text-rc-ink-3 [text-wrap:pretty] md:mt-[18px] md:text-[19.5px] md:leading-[1.6]">
                {kit.summary}
              </p>
            )}
            {kit.availability && (
              <p className="mt-3 font-mono text-[11.5px] text-rc-ink-4 md:hidden">
                <span className="uppercase tracking-[.1em] text-rc-ink-5">Disponibilidade · </span>
                {kit.availability}
              </p>
            )}

            <div className={cn('mt-5 grid gap-[9px] md:mt-8 md:flex md:gap-3', kit.pdf ? 'grid-cols-2' : 'grid-cols-1')}>
              <TrackedAnchor
                href={contactHref}
                event="mediakit_contact_click"
                label="hero"
                className={buttonClasses({ size: 'lg', className: 'rounded-xl md:h-auto md:rounded-[10px] md:px-[22px] md:py-[14px] md:text-[15.5px]' })}
              >
                Falar comigo
              </TrackedAnchor>
              {kit.pdf && (
                <TrackedAnchor
                  href={kit.pdf}
                  event="mediakit_pdf_download"
                  label="hero"
                  external
                  className={buttonClasses({ variant: 'secondary', size: 'lg', className: 'rounded-xl md:h-auto md:rounded-[10px] md:px-[22px] md:py-[14px] md:text-[15.5px]' })}
                >
                  Baixar PDF
                </TrackedAnchor>
              )}
            </div>

            {channels.length > 0 && (
              <div className="mt-[26px] hidden flex-wrap gap-2.5 font-mono text-[12.5px] text-rc-ink-4 md:flex">
                {channels.map((c, i) => (
                  <span key={`${c.network}-${i}`} className="rounded-lg border border-rc-border-chip bg-rc-surface-2 px-3 py-2 lowercase">
                    {c.network}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Números por canal */}
      {channels.length > 0 && (
        <KitSection number={next()} title="Onde eu publico">
          <div className="grid grid-cols-2 gap-[9px] md:gap-[18px] lg:grid-cols-3">
            {channels.map((c, i) => (
              <ChannelCard key={`${c.network}-${i}`} channel={c} />
            ))}
          </div>
        </KitSection>
      )}

      {/* 3. O que eu produzo */}
      {formats.length > 0 && (
        <KitSection id="produzo" number={next()} title="O que eu produzo">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
            {formats.map((f, i) => (
              <FormatCard key={`${f.title}-${i}`} format={f} preview={preview} />
            ))}
          </div>
        </KitSection>
      )}

      {/* 4. Conteúdo em destaque */}
      {featured.length > 0 && (
        <KitSection
          number={next()}
          title="Conteúdo em destaque"
          aside={<span className="hidden font-mono text-[11px] text-rc-ink-5 md:inline">vídeos, artigos e desafios</span>}
        >
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:gap-[18px] lg:grid-cols-3">
            {featured.map((item, i) => (
              <FeaturedCard key={`${item.url}-${i}`} item={item} />
            ))}
          </div>
        </KitSection>
      )}

      {/* 5. Formatos de parceria: sem campo próprio no modelo, lista os formatos com preço "sob consulta" */}
      {formats.length > 0 && (
        <KitSection number={next()} title="Formatos de parceria">
          <ul className={cardClasses({ className: 'overflow-hidden md:rounded-rc-card-lg' })}>
            {formats.map((f, i) => (
              <li
                key={`${f.title}-${i}`}
                className={cn('flex min-h-[56px] items-center justify-between gap-4 px-[15px] py-3 md:px-6 md:py-4', i > 0 && 'border-t border-rc-border')}
              >
                <div className="min-w-0">
                  <div className="text-[15px] font-medium text-rc-ink md:text-base">{f.title}</div>
                  {f.tag && <div className="mt-0.5 font-mono text-[10.5px] lowercase text-rc-ink-5 md:text-[11px]">{f.tag}</div>}
                </div>
                <span className="shrink-0 font-mono text-[11.5px] text-rc-ink-4 md:text-[12.5px]">sob consulta</span>
              </li>
            ))}
          </ul>
        </KitSection>
      )}

      {/* 6. Marcas */}
      {brands.length > 0 && (
        <KitSection number={next()} title="Marcas com quem já trabalhei">
          <div className="grid grid-cols-3 gap-[9px] md:gap-[18px]">
            {brands.map((b, i) => {
              const inner = b.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.logo} alt={b.name} loading="lazy" className="h-7 max-w-full object-contain [filter:grayscale(1)_brightness(1.6)] md:h-10" />
              ) : (
                <span className="text-[13px] text-rc-ink-2 md:text-lg md:font-semibold md:tracking-[-.018em] md:text-rc-ink">{b.name}</span>
              );
              const classes = cardClasses({
                interactive: !!b.url,
                className: 'flex min-h-[56px] items-center justify-center rounded-xl px-2 py-4 text-center md:min-h-[96px] md:rounded-rc-card-lg md:p-[26px]',
              });
              return b.url ? (
                <a key={`${b.name}-${i}`} href={b.url} target="_blank" rel="noopener noreferrer" className={classes}>
                  {inner}
                </a>
              ) : (
                <div key={`${b.name}-${i}`} className={classes}>
                  {inner}
                </div>
              );
            })}
          </div>
        </KitSection>
      )}

      {/* 7. Como funciona */}
      {showReviewed && process.length > 0 && (
        <KitSection number={next()} title="Como funciona" aside={badge}>
          <BlockGrid items={process} numbered />
        </KitSection>
      )}

      {/* 8. Meu jeito de trabalhar */}
      {showReviewed && principles.length > 0 && (
        <KitSection number={next()} title="Meu jeito de trabalhar" aside={badge}>
          <BlockGrid items={principles} />
        </KitSection>
      )}

      {/* 9. CTA de contato */}
      <section className="rc-container pb-8 pt-7 md:pb-[88px] md:pt-16">
        <div className="relative overflow-hidden rounded-rc-card-lg border border-rc-blue-border bg-rc-blue-surface px-[18px] py-[22px] text-center md:rounded-[20px] md:p-11 md:text-left">
          <div className="pointer-events-none absolute inset-0 hidden bg-rc-dots-blue bg-rc-dots-m opacity-60 md:block" aria-hidden="true" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-10">
            <div>
              <h2 className="text-[21px] font-semibold tracking-[-.028em] text-rc-ink md:text-[32px] md:tracking-[-.03em]">Vamos conversar sobre a sua marca</h2>
              <p className="mt-2 font-mono text-[12.5px] text-rc-ink-4 md:mt-4">{kit.contactEmail}</p>
            </div>
            <TrackedAnchor
              href={contactHref}
              event="mediakit_contact_click"
              label="cta"
              className={buttonClasses({ size: 'lg', className: 'h-[50px] rounded-xl md:h-auto md:px-[26px] md:py-4 md:text-base' })}
            >
              Falar comigo
            </TrackedAnchor>
          </div>
        </div>
        {updated && <p className="mt-4 text-center font-mono text-[11px] text-rc-ink-6 md:text-right md:text-[11.5px]">{updated}</p>}
      </section>
    </Layout>
  );
}
