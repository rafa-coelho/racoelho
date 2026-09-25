'use client';

import React, { ReactNode } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaEnvelope } from 'react-icons/fa';
import {
  Briefcase,
  ChevronRight,
  Code2,
  FileText,
  Github,
  Globe,
  Link2,
  Linkedin,
  Mail,
  Megaphone,
  MessageCircle,
  Monitor,
  Newspaper,
  Rocket,
  Trophy,
  Youtube,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import Layout from './Layout';
import { SocialLink, LinkTreeItem, ContentMeta, YoutubeVideo } from '@/lib/api';
import { cn } from '@/lib/utils';
import { RcImage, SocialIcon, Tag, cardClasses, formatShortDate } from '@/components/rc';

interface LinksContentProps {
  socialLinks: SocialLink[];
  linkItems: LinkTreeItem[];
  videos?: YoutubeVideo[];
  posts?: ContentMeta[];
  challenges?: ContentMeta[];
}

// Mantido: usado por RedirectPage.
export const GetSocialIcon = (iconName: string): ReactNode => {
  switch (iconName.toLowerCase()) {
    case 'github':
      return <FaGithub />;
    case 'linkedin':
      return <FaLinkedin />;
    case 'twitter':
      return <FaTwitter />;
    case 'instagram':
      return <FaInstagram />;
    case 'tiktok':
      return <FaTiktok />;
    case 'youtube':
      return <FaYoutube />;
    case 'email':
      return <FaEnvelope />;
    default:
      return <FaGithub />;
  }
};

// Ícone + cor do quadrado de 34px por destino (campo `icon` do LinkTreeItem, com fallback pela URL).
type IconTone = 'blue' | 'green' | 'red' | 'amber' | 'neutral';

const iconToneClasses: Record<IconTone, string> = {
  blue: 'bg-rc-blue-chip text-rc-blue-soft',
  green: 'bg-rc-green-surface text-rc-green',
  red: 'bg-rc-nav-hover text-rc-red',
  amber: 'bg-rc-amber-surface text-rc-amber',
  neutral: 'bg-rc-nav-hover text-rc-blue-soft',
};

const linkIcons: Record<string, { icon: LucideIcon; tone: IconTone }> = {
  mail: { icon: Mail, tone: 'blue' },
  email: { icon: Mail, tone: 'blue' },
  newsletter: { icon: Mail, tone: 'blue' },
  trophy: { icon: Trophy, tone: 'green' },
  desafios: { icon: Trophy, tone: 'green' },
  code: { icon: Code2, tone: 'green' },
  youtube: { icon: Youtube, tone: 'red' },
  'message-circle': { icon: MessageCircle, tone: 'neutral' },
  discord: { icon: MessageCircle, tone: 'neutral' },
  briefcase: { icon: Briefcase, tone: 'amber' },
  rocket: { icon: Rocket, tone: 'amber' },
  monitor: { icon: Monitor, tone: 'neutral' },
  setup: { icon: Monitor, tone: 'neutral' },
  newspaper: { icon: Newspaper, tone: 'blue' },
  blog: { icon: FileText, tone: 'blue' },
  'file-text': { icon: FileText, tone: 'blue' },
  // media kit para marcas
  megaphone: { icon: Megaphone, tone: 'amber' },
  mediakit: { icon: Megaphone, tone: 'amber' },
  github: { icon: Github, tone: 'neutral' },
  linkedin: { icon: Linkedin, tone: 'blue' },
  globe: { icon: Globe, tone: 'neutral' },
};

function resolveLinkIcon(item: LinkTreeItem): { icon: LucideIcon; tone: IconTone } {
  const key = (item.icon || '').toLowerCase().trim();
  if (key && linkIcons[key]) return linkIcons[key];
  const url = item.url.toLowerCase();
  if (url.includes('youtube')) return linkIcons.youtube;
  if (url.includes('newsletter')) return linkIcons.mail;
  if (url.includes('desafios')) return linkIcons.trophy;
  if (url.includes('discord') || url.includes('comunidade')) return linkIcons.discord;
  if (url.includes('mediakit')) return linkIcons.megaphone;
  if (url.includes('vagas') || url.includes('projetos')) return linkIcons.briefcase;
  if (url.includes('setup')) return linkIcons.setup;
  if (url.includes('/posts')) return linkIcons.blog;
  return { icon: Link2, tone: 'neutral' };
}

const isExternal = (url: string) => /^(https?:|mailto:)/.test(url);

function SmartLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function LinksContent({ socialLinks, linkItems, videos = [], posts = [], challenges = [] }: LinksContentProps) {
  const highlightItems = linkItems.filter(item => item.type === 'highlight');
  const regularLinks = linkItems.filter(item => item.type === 'link');
  // Destaques primeiro; o primeiro destaque recebe o tratamento azul.
  const buttons = [...highlightItems, ...regularLinks];
  const blueTitle = highlightItems[0]?.title;

  // Ordenar conteúdos por score: prioridade de tipo + bonus por recência
  const typePriority = { video: 3, post: 2, challenge: 1 };
  const now = Date.now();
  const DAY_MS = 86400000;

  const contentItems: Array<{ kind: 'post' | 'challenge' | 'video'; data: ContentMeta | YoutubeVideo }> = [
    ...posts.map(p => ({ kind: 'post' as const, data: p })),
    ...challenges.map(c => ({ kind: 'challenge' as const, data: c })),
    ...videos.map(v => ({ kind: 'video' as const, data: v })),
  ];

  contentItems.sort((a, b) => {
    const dateA = new Date(a.kind === 'video' ? (a.data as YoutubeVideo).published : (a.data as ContentMeta).date).getTime();
    const dateB = new Date(b.kind === 'video' ? (b.data as YoutubeVideo).published : (b.data as ContentMeta).date).getTime();
    // Recência: 0-1 (1 = hoje, decai ao longo de 30 dias)
    const recencyA = Math.max(0, 1 - (now - dateA) / (30 * DAY_MS));
    const recencyB = Math.max(0, 1 - (now - dateB) / (30 * DAY_MS));
    const scoreA = typePriority[a.kind] + recencyA * 2;
    const scoreB = typePriority[b.kind] + recencyB * 2;
    return scoreB - scoreA;
  });

  const hasContent = contentItems.length > 0;

  return (
    <Layout>
      {/* ── Bio ── */}
      <section className="relative overflow-hidden">
        <div className="rc-dots-bg" />
        <div className="rc-dots-fade" />
        <div className="relative mx-auto flex max-w-[560px] flex-col items-center px-5 pb-[34px] pt-10 text-center md:px-8 md:pb-10 md:pt-14">
          <RcImage
            src="https://github.com/rafa-coelho.png"
            alt=""
            ratio="1/1"
            className="w-[92px] rounded-full border border-rc-photo-border"
          />
          <h1 className="mt-4 text-2xl font-semibold tracking-[-.028em] text-rc-ink">Rafael Coelho</h1>
          <div className="mt-1.5 font-mono text-[12.5px] text-rc-blue-link">@racoelhoo</div>
          <p className="mt-[11px] max-w-[32ch] text-[15px] leading-[1.6] text-rc-ink-3 [text-wrap:pretty]">
            Fullstack Developer • Tech Content Creator
          </p>

          {socialLinks.length > 0 && (
            <div className="mt-5 flex flex-wrap justify-center gap-[9px]">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="grid h-[46px] w-[46px] place-items-center rounded-[13px] border border-rc-border-chip bg-rc-surface-2 text-rc-ink-3 transition-colors duration-150 hover:border-rc-border-hover hover:text-rc-ink"
                >
                  <SocialIcon name={social.icon || social.name} className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          )}

          {buttons.length > 0 && (
            <div className="mt-6 flex w-full flex-col gap-2.5">
              {buttons.map((item) => {
                const { icon: Icon, tone } = resolveLinkIcon(item);
                const blue = item.title === blueTitle;
                return (
                  <SmartLink
                    key={`${item.type}-${item.title}`}
                    href={item.url}
                    className={cardClasses({
                      tone: blue ? 'blue' : 'neutral',
                      interactive: true,
                      className: 'flex min-h-[56px] items-center gap-[13px] px-4 py-2.5 text-left',
                    })}
                  >
                    {item.image ? (
                      <RcImage src={item.image} alt="" ratio="1/1" className="w-[34px] shrink-0 rounded-[10px]" imgClassName="object-contain" />
                    ) : (
                      <span className={cn('grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[10px]', iconToneClasses[tone])}>
                        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15.5px] font-medium text-rc-ink">{item.title}</span>
                      {item.type === 'highlight' && item.description && (
                        <span className="mt-0.5 block text-[13px] leading-[1.45] text-rc-ink-4">{item.description}</span>
                      )}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-rc-ink-6" aria-hidden="true" />
                  </SmartLink>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Conteúdos recentes ── */}
      {hasContent && (
        <section className="mx-auto max-w-[720px] px-4 pb-10 md:px-8 md:pb-14">
          <div className="mb-3.5 flex items-center gap-3 md:mb-4 md:gap-4">
            <h2 className="text-[17px] font-semibold tracking-[-.02em] text-rc-ink md:text-[19px]">Confira meus conteúdos</h2>
            <span className="h-px flex-1 bg-rc-border" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:gap-3">
            {contentItems.map((item) => {
              if (item.kind === 'video') {
                const video = item.data as YoutubeVideo;
                return (
                  <a
                    key={`video-${video.id}`}
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardClasses({ interactive: true, className: 'flex items-center overflow-hidden sm:flex-col sm:items-stretch' })}
                  >
                    <RcImage src={video.thumbnail} alt="" ratio="16/9" className="ml-3 w-[108px] shrink-0 rounded-[8px] sm:ml-0 sm:w-full sm:rounded-none" />
                    <div className="min-w-0 flex-1 p-3.5 sm:p-4">
                      <span className="font-mono text-[9.5px] uppercase tracking-[.1em] text-rc-red">YouTube</span>
                      <p className="mt-2 line-clamp-2 text-[15.5px] font-semibold leading-[1.35] text-rc-ink">{video.title}</p>
                    </div>
                  </a>
                );
              }
              const content = item.data as ContentMeta;
              const isPost = item.kind === 'post';
              const tags = content.tags || [];
              return (
                <Link
                  key={`${item.kind}-${content.slug}`}
                  href={`/${isPost ? 'posts' : 'listas/desafios'}/${content.slug}`}
                  className={cardClasses({ interactive: true, className: 'flex items-center overflow-hidden sm:flex-col sm:items-stretch' })}
                >
                  <RcImage src={content.coverImage} alt="" ratio="16/9" className="ml-3 w-[108px] shrink-0 rounded-[8px] sm:ml-0 sm:w-full sm:rounded-none" />
                  <div className="min-w-0 flex-1 p-3.5 sm:p-4">
                    <span className={cn('font-mono text-[9.5px] uppercase tracking-[.1em]', isPost ? 'text-rc-blue-link' : 'text-rc-green')}>
                      {isPost ? 'Post' : 'Desafio'}
                    </span>
                    <p className="mt-2 line-clamp-2 text-[15.5px] font-semibold leading-[1.35] text-rc-ink">{content.title}</p>
                    {content.date && <div className="mt-2 font-mono text-[10.5px] text-rc-ink-5">{formatShortDate(content.date)}</div>}
                    {tags.length > 0 && (
                      <div className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
                        {tags.slice(0, 2).map((tag) => (
                          <Tag key={tag} className={isPost ? undefined : 'border-rc-green-border-strong text-rc-green'}>
                            {tag}
                          </Tag>
                        ))}
                        {tags.length > 2 && <Tag className="text-rc-ink-5">+{tags.length - 2}</Tag>}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div className="pb-8 text-center font-mono text-[11px] text-rc-ink-6">racoelho.com.br</div>
    </Layout>
  );
}
