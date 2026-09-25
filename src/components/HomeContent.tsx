'use client';

import { ContentMeta, ProjectMeta, YoutubeVideo, SocialLink, LinkTreeItem } from '@/lib/api';
import Link from 'next/link';
import Layout from './Layout';
import { useFeatureFlag } from '@/hooks/use-feature-flag';
import { DIFFICULTY_LABEL, type SiteStatus } from '@/lib/types';
import { NowCard } from '@/components/home/NowCard';
import {
  ButtonLink,
  Eyebrow,
  NewsletterForm,
  RcImage,
  SectionHeader,
  SectionMobileLink,
  StatusDot,
  Tag,
  cardClasses,
  formatShortDate,
  pad2,
} from '@/components/rc';

interface HomeContentProps {
  posts: ContentMeta[];
  challenges: ContentMeta[];
  projects?: ProjectMeta[];
  videos?: YoutubeVideo[];
  socialLinks?: SocialLink[];
  linkItems?: LinkTreeItem[];
  totalPosts?: number;
  totalChallenges?: number;
  nowStatus?: SiteStatus | null;
}

export default function HomeContent({
  posts,
  challenges,
  projects = [],
  videos = [],
  totalPosts = posts.length,
  totalChallenges = challenges.length,
  nowStatus = null,
}: HomeContentProps) {
  const [featuredPost, ...otherPosts] = posts;
  const latestVideo = videos[0];

  // Feature Flags
  const { enabled: newsletterEnabled } = useFeatureFlag('newsletter');
  const { enabled: projectsEnabled } = useFeatureFlag('projects');

  let sectionIndex = 0;
  const nextNumber = () => pad2(++sectionIndex);

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-rc-border">
        <div className="rc-dots-bg" />
        <div className="rc-dots-fade" />
        <div className="rc-container relative grid grid-cols-1 gap-[18px] pb-8 pt-7 md:grid-cols-[300px_1fr] md:items-center md:gap-14 md:pb-14 md:pt-[76px]">
          <div className="flex flex-col gap-[18px] md:block">
            {/* mobile: foto 84px ao lado do badge */}
            <div className="flex items-center gap-3.5 md:block">
              <RcImage
                src="https://github.com/rafa-coelho.png"
                alt="Rafael Coelho"
                ratio="1/1"
                className="w-[84px] shrink-0 rounded-rc-card-lg border border-rc-photo-border md:hidden"
              />
              <div className="flex flex-col gap-[9px]">
                <div className="inline-flex items-center gap-2 self-start rounded-full border border-rc-blue-border bg-rc-badge px-[11px] py-1.5 font-mono text-[10px] uppercase tracking-[.06em] text-rc-blue-soft md:gap-[9px] md:px-[13px] md:py-[7px] md:text-[11.5px]">
                  <StatusDot />
                  Aberto a projetos<span className="hidden md:inline"> · Dev Fullstack</span>
                </div>
                <span className="font-mono text-xs text-rc-ink-4 md:hidden">Dev Fullstack · @racoelhoo</span>
              </div>
            </div>

            <h1 className="text-rc-hero-m font-semibold text-rc-ink md:mt-6 md:text-rc-hero">
              Oi, eu sou <span className="text-rc-blue-link">Rafael Coelho</span>
            </h1>
            <p className="max-w-[52ch] text-[16.5px] leading-[1.6] text-rc-ink-3 [text-wrap:pretty] md:mt-5 md:text-[19.5px]">
              Compartilho o que aprendo sobre{' '}
              <span className="font-medium text-rc-ink">programação</span>,{' '}
              <span className="font-medium text-rc-ink">desafios práticos</span> e{' '}
              <span className="font-medium text-rc-ink">dicas de carreira</span> em tech
            </p>

            <div className="grid grid-cols-2 gap-2.5 md:mt-8 md:flex md:gap-3">
              <ButtonLink href="#conteudo" className="h-12 rounded-[11px] px-3 text-[15px] md:h-auto md:rounded-[10px] md:px-[22px] md:text-[15.5px]">
                Explorar conteúdo
              </ButtonLink>
              <ButtonLink href="/links" variant="secondary" className="h-12 rounded-[11px] px-3 text-[15px] md:h-auto md:rounded-[10px] md:px-[22px] md:text-[15.5px]">
                Minhas redes
              </ButtonLink>
            </div>

            <div className="flex gap-2 font-mono text-xs md:mt-[30px] md:gap-2.5 md:text-[12.5px]">
              <HeroCount value={totalPosts} label="artigos" valueClass="text-rc-ink" />
              <HeroCount value={totalChallenges} label="desafios" valueClass="text-rc-green" />
              {videos.length > 0 && <HeroCount value={`${videos.length}+`} label="vídeos" valueClass="text-rc-red" />}
            </div>

            {/* mobile: card "Agora" no fim do hero */}
            <NowCard status={nowStatus} className="md:hidden" />
          </div>

          {/* desktop: coluna da foto à esquerda */}
          <div className="hidden md:order-first md:flex md:flex-col md:gap-3.5">
            <RcImage
              src="https://github.com/rafa-coelho.png"
              alt="Rafael Coelho"
              ratio="1/1"
              className="rounded-rc-card-lg border border-rc-photo-border"
            />
            <NowCard status={nowStatus} />
          </div>
        </div>
      </section>

      {/* ── 01 Conteúdo recente ── */}
      {featuredPost && (
        <section id="conteudo" className="rc-container scroll-mt-20 pt-[26px] md:pt-16">
          <SectionHeader number={nextNumber()} title="Conteúdo recente" accent="blue" href="/posts" linkLabel="Ver todos os posts →" />

          {/* desktop: bento */}
          <div className="hidden grid-cols-3 gap-[18px] md:grid">
            <Link
              href={`/posts/${featuredPost.slug}`}
              className={cardClasses({ interactive: true, size: 'lg', className: 'col-span-2 row-span-2 flex flex-col overflow-hidden' })}
            >
              <div className="relative">
                <RcImage src={featuredPost.coverImage} alt="" ratio="16/9" />
                <span className="absolute left-3.5 top-3.5 rounded-md bg-rc-blue px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[.1em] text-white">
                  Destaque
                </span>
              </div>
              <div className="flex flex-1 flex-col px-7 pb-[26px] pt-7">
                <PostMeta post={featuredPost} />
                <h3 className="mt-3 text-[31px] font-semibold leading-[1.16] tracking-[-.03em] text-rc-ink [text-wrap:balance]">
                  {featuredPost.title}
                </h3>
                {featuredPost.excerpt && (
                  <p className="mt-3.5 line-clamp-3 text-base leading-[1.65] text-rc-ink-3">{featuredPost.excerpt}</p>
                )}
                <div className="mt-auto flex items-center gap-2 pt-[22px]">
                  {featuredPost.tags?.slice(0, 3).map((tag) => <Tag key={tag}>{tag}</Tag>)}
                  <span className="ml-auto text-[14.5px] font-medium text-rc-blue-link">Ler artigo →</span>
                </div>
              </div>
            </Link>

            {otherPosts.slice(0, 2).map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className={cardClasses({ interactive: true, size: 'lg', className: 'flex min-h-[172px] flex-col gap-[11px] p-[22px]' })}
              >
                <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[.1em]">
                  <span className="text-rc-blue-link">Post</span>
                  {post.readingTime ? <span className="text-rc-ink-5">{post.readingTime} min</span> : null}
                </div>
                <h3 className="text-[19px] font-semibold leading-[1.32] tracking-[-.015em] text-rc-ink">{post.title}</h3>
                {post.excerpt && <p className="line-clamp-2 text-[14.5px] leading-[1.6] text-rc-ink-4">{post.excerpt}</p>}
                {post.tags && post.tags.length > 0 && (
                  <span className="mt-auto font-mono text-[11px] text-rc-ink-5">{post.tags.slice(0, 2).join(' · ')}</span>
                )}
              </Link>
            ))}

            {latestVideo && (
              <a
                href={latestVideo.link}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClasses({ interactive: true, size: 'lg', className: 'col-span-3 grid grid-cols-[260px_1fr_auto] items-center gap-6 p-[18px]' })}
              >
                <RcImage src={latestVideo.thumbnail} alt="" ratio="16/9" className="rounded-[10px]" />
                <div>
                  <Eyebrow className="tracking-[.1em] text-rc-red">YouTube · novo vídeo</Eyebrow>
                  <h3 className="mt-2.5 text-[22px] font-semibold tracking-[-.02em] text-rc-ink">{latestVideo.title}</h3>
                </div>
                <span className="pr-3.5 text-[14.5px] font-medium text-rc-red">Assistir →</span>
              </a>
            )}
          </div>

          {/* mobile: primeiro com capa, demais em linha com thumb 64px */}
          <div className="flex flex-col gap-3 md:hidden">
            <Link href={`/posts/${featuredPost.slug}`} className={cardClasses({ className: 'block overflow-hidden' })}>
              <RcImage src={featuredPost.coverImage} alt="" ratio="16/9" />
              <div className="px-[15px] pb-4 pt-3.5">
                <PostMeta post={featuredPost} compact />
                <h3 className="mt-2 text-[17.5px] font-semibold leading-[1.28] tracking-[-.02em] text-rc-ink">{featuredPost.title}</h3>
                {featuredPost.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-[1.55] text-rc-ink-4">{featuredPost.excerpt}</p>}
              </div>
            </Link>
            {otherPosts.slice(0, 2).map((post) => (
              <Link key={post.slug} href={`/posts/${post.slug}`} className={cardClasses({ className: 'flex items-start gap-[13px] p-[15px]' })}>
                <RcImage src={post.coverImage} alt="" ratio="1/1" className="w-16 shrink-0 rounded-[10px]" />
                <div className="min-w-0">
                  <PostMeta post={post} compact />
                  <h3 className="mt-1.5 text-[15.5px] font-semibold leading-[1.3] tracking-[-.018em] text-rc-ink">{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
          <SectionMobileLink href="/posts" label="Ver todos os posts →" accent="blue" />
        </section>
      )}

      {/* ── 02 Desafios práticos ── */}
      {challenges.length > 0 && (
        <section className="rc-container pt-[26px] md:pt-16">
          <SectionHeader number={nextNumber()} title="Desafios práticos" accent="green" href="/listas/desafios" linkLabel="Ver todos os desafios →" />

          <div className="hidden grid-cols-3 gap-4 md:grid">
            {challenges.slice(0, 3).map((challenge, idx) => (
              <Link
                key={challenge.slug}
                href={`/listas/desafios/${challenge.slug}`}
                className={cardClasses({ interactive: true, className: 'flex min-h-[206px] flex-col gap-3 p-[22px]' })}
              >
                <span className="font-mono text-[26px] tracking-[-.03em] text-rc-green">#{challengeNumber(challenge, totalChallenges - idx)}</span>
                <h3 className="text-[19.5px] font-semibold tracking-[-.018em] text-rc-ink">{challenge.title}</h3>
                {challenge.excerpt && <p className="line-clamp-3 text-[14.5px] leading-[1.6] text-rc-ink-4">{challenge.excerpt}</p>}
                <div className="mt-auto flex items-center justify-between font-mono text-[11.5px] text-rc-ink-5">
                  <span>{challenge.difficulty ? DIFFICULTY_LABEL[challenge.difficulty] : challenge.tags?.slice(0, 2).join(' · ')}</span>
                  <span className="text-rc-green">começar →</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 md:hidden">
            {challenges.slice(0, 2).map((challenge, idx) => (
              <Link
                key={challenge.slug}
                href={`/listas/desafios/${challenge.slug}`}
                className={cardClasses({ tone: idx === 0 ? 'green' : 'neutral', className: 'flex items-center gap-[13px] p-[15px]' })}
              >
                <span
                  className={
                    idx === 0
                      ? 'grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] border border-rc-green-border-strong bg-rc-green-chip font-mono text-[13px] text-rc-green'
                      : 'grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] border border-rc-border-chip bg-rc-nav-hover font-mono text-[13px] text-rc-ink-4'
                  }
                >
                  {pad2(challengeNumber(challenge, totalChallenges - idx))}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15.5px] font-semibold tracking-[-.018em] text-rc-ink">{challenge.title}</h3>
                  {challenge.tags && challenge.tags.length > 0 && (
                    <div className="mt-[5px] font-mono text-[10.5px] text-rc-ink-5">{challenge.tags.slice(0, 3).join(' · ')}</div>
                  )}
                </div>
                {challenge.difficulty && (
                  <span
                    className={
                      idx === 0
                        ? 'shrink-0 rounded-full border border-rc-green-border-strong px-[9px] py-1 font-mono text-[10px] uppercase tracking-[.06em] text-rc-green'
                        : 'shrink-0 rounded-full border border-rc-border-chip px-[9px] py-1 font-mono text-[10px] uppercase tracking-[.06em] text-rc-ink-4'
                    }
                  >
                    {DIFFICULTY_LABEL[challenge.difficulty]}
                  </span>
                )}
              </Link>
            ))}
          </div>
          <SectionMobileLink href="/listas/desafios" label="Ver todos os desafios →" accent="green" />
        </section>
      )}

      {/* ── 03 Projetos em destaque ── */}
      {projectsEnabled && projects.length > 0 && (
        <section className="rc-container pt-[26px] md:pt-16">
          <SectionHeader number={nextNumber()} title="Projetos em destaque" accent="amber" href="/projetos" linkLabel="Ver todos os projetos →" />

          <div className="hidden grid-cols-3 gap-[18px] md:grid">
            {projects.slice(0, 3).map((project) => (
              <Link
                key={project.slug}
                href={`/projetos/${project.slug}`}
                className={cardClasses({ interactive: true, size: 'lg', className: 'flex min-h-[238px] flex-col gap-3 p-6' })}
              >
                <Eyebrow className="tracking-[.1em] text-rc-amber">{project.role || 'Projeto'}</Eyebrow>
                <h3 className="text-[22px] font-semibold tracking-[-.02em] text-rc-ink">{project.title}</h3>
                {project.excerpt && <p className="line-clamp-3 text-[14.5px] leading-[1.6] text-rc-ink-4">{project.excerpt}</p>}
                {project.tags && project.tags.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-[7px]">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-md border border-rc-border-chip px-2 py-1 font-mono text-[11px] text-rc-ink-4">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2.5 md:hidden">
            {projects.slice(0, 2).map((project) => (
              <Link key={project.slug} href={`/projetos/${project.slug}`} className={cardClasses({ className: 'flex flex-col gap-2 rounded-[13px] p-3.5' })}>
                <span className="grid h-[30px] w-[30px] place-items-center rounded-[9px] border border-rc-amber-border bg-rc-amber-surface font-mono text-sm text-rc-amber">
                  {project.title.charAt(0).toUpperCase()}
                </span>
                <h3 className="text-[14.5px] font-semibold leading-[1.3] tracking-[-.018em] text-rc-ink">{project.title}</h3>
                {project.excerpt && <p className="line-clamp-2 text-[12.5px] leading-[1.45] text-rc-ink-4">{project.excerpt}</p>}
              </Link>
            ))}
          </div>
          <SectionMobileLink href="/projetos" label="Ver todos os projetos →" accent="amber" />
        </section>
      )}

      {/* ── Setup + Newsletter ── */}
      <section className="rc-container pt-[26px] md:pt-16">
        <div className={newsletterEnabled ? 'grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.15fr] md:gap-[18px]' : 'grid grid-cols-1'}>
          <Link
            href="/setup"
            className={cardClasses({ interactive: true, size: 'lg', className: 'flex flex-col px-[18px] py-[22px] md:rounded-[18px] md:p-8' })}
          >
            <Eyebrow>Setup</Eyebrow>
            <h2 className="mt-2.5 text-[21px] font-semibold tracking-[-.025em] text-rc-ink md:mt-3.5 md:text-rc-h2-card">Meu setup de desenvolvimento</h2>
            <p className="mt-[9px] max-w-[36ch] text-[14.5px] leading-[1.55] text-rc-ink-3 md:mt-3 md:text-rc-body">
              Ferramentas, equipamentos e configurações que uso no dia a dia.
            </p>
            <span className="mt-auto hidden pt-[22px] text-[15px] font-medium text-rc-blue-link md:block">Ver setup completo →</span>
          </Link>

          {newsletterEnabled && (
            <div className="relative overflow-hidden rounded-rc-card-lg border border-rc-blue-border bg-rc-blue-surface px-[18px] py-[22px] md:rounded-[18px] md:p-8">
              <div className="pointer-events-none absolute inset-0 bg-rc-dots-blue bg-rc-dots-sm opacity-60 md:bg-rc-dots-m" />
              <div className="relative">
                <Eyebrow className="text-rc-blue-soft">Newsletter</Eyebrow>
                <h2 className="mt-2.5 text-[21px] font-semibold tracking-[-.025em] text-rc-ink md:mt-3.5 md:text-rc-h2-card">Não perca nenhum conteúdo</h2>
                <p className="mt-[9px] max-w-[42ch] text-[14.5px] leading-[1.55] text-rc-ink-3 md:mt-3 md:text-rc-body">
                  Receba novos artigos, desafios e dicas diretamente no seu email.
                </p>
                <NewsletterForm className="mt-4 md:mt-[22px]" source="home" />
                <div className="mt-3.5 flex items-center gap-2 font-mono text-[11.5px] text-rc-ink-5">
                  <StatusDot pulse={false} />
                  sem spam, cancele quando quiser
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

// Número do desafio: o do PocketBase quando existir, senão a posição na lista.
function challengeNumber(challenge: ContentMeta, fallback: number) {
  return typeof challenge.number === 'number' && challenge.number > 0 ? challenge.number : fallback;
}

function HeroCount({ value, label, valueClass }: { value: number | string; label: string; valueClass: string }) {
  if (typeof value === 'number' && value < 1) return null;
  return (
    <span className="flex-1 rounded-[9px] border border-rc-border-chip bg-rc-surface-2 py-[9px] text-center text-rc-ink-3 md:flex-none md:rounded-lg md:px-3 md:py-2">
      <b className={`font-medium ${valueClass}`}>{value}</b> {label}
    </span>
  );
}

function PostMeta({ post, compact = false }: { post: ContentMeta; compact?: boolean }) {
  const parts = [formatShortDate(post.date), post.readingTime ? (compact ? `${post.readingTime} min` : `${post.readingTime} min de leitura`) : null].filter(Boolean);
  return (
    <div className={compact ? 'flex gap-2 font-mono text-[10.5px] text-rc-ink-5' : 'flex gap-3.5 font-mono text-rc-meta text-rc-ink-5'}>
      {parts.map((part, i) => (
        <span key={i} className="flex gap-2 md:gap-3.5">
          {i > 0 && <span aria-hidden="true">·</span>}
          {part}
        </span>
      ))}
    </div>
  );
}
