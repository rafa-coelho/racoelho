'use client';

import Layout from './Layout';
import { FaDiscord } from 'react-icons/fa';
import { Users, MessageSquare, Code2, Sparkles, HelpCircle, Trophy, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { accentIconBox, cardClasses, type Accent } from '@/components/rc';

const DISCORD_LINK = 'https://discord.gg/zK6jeB2R5b';

const perks = [
  {
    icon: Sparkles,
    title: 'Testar em primeira mão',
    description: 'Jogue antes de todo mundo e ajude a moldar o jogo que estou criando.',
  },
  {
    icon: MessageSquare,
    title: 'Jogar e resenhar',
    description: 'Bata um papo sobre games, compartilhe suas experiências e dê feedback direto.',
  },
  {
    icon: Code2,
    title: 'Trocar uma ideia',
    description: 'Converse sobre dev, tech, games e o que mais rolar. Sem frescura.',
  },
  {
    icon: Users,
    title: 'Networking',
    description: 'Conecte-se com devs e gamers de todos os níveis.',
  },
];

// Lista de canais: conteúdo estático (FEATURES §3.9), não vem do Discord.
const channels: { icon: typeof HelpCircle; name: string; description: string; accent: Accent }[] = [
  { icon: HelpCircle, name: '#dúvidas', description: 'Pergunta sem medo. Ninguém julga pergunta básica.', accent: 'blue' },
  { icon: Trophy, name: '#desafios', description: 'Soluções, revisões de código e discussão de abordagem.', accent: 'green' },
  { icon: Briefcase, name: '#vagas', description: 'Oportunidades da galera, antes de virarem post.', accent: 'amber' },
];

const discordBtn =
  'inline-flex h-[50px] items-center justify-center gap-2.5 whitespace-nowrap rounded-[10px] bg-rc-discord px-6 text-[15.5px] font-semibold text-white shadow-rc-discord transition-colors duration-150 ease-out hover:bg-rc-discord-hover';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-[18px] flex items-center gap-3 md:mb-[22px] md:gap-4">
      <h2 className="text-rc-h2-m font-semibold text-rc-ink md:text-rc-h2">{children}</h2>
      <span className="h-px flex-1 bg-rc-border" aria-hidden="true" />
    </div>
  );
}

// Estatísticas já formatadas no servidor (formatCount).
export interface CommunityStatsView {
  members: string;
  online: string;
  channels: string | null;
}

function StatsGrid({ stats }: { stats: CommunityStatsView }) {
  const items: { label: string; value: string | null; tone?: string }[] = [
    { label: 'membros', value: stats.members },
    { label: 'online', value: stats.online, tone: 'text-rc-green' },
    { label: 'canais', value: stats.channels },
  ];
  return (
    <section aria-label="Comunidade em números" className="rc-container pt-[22px] md:pt-[52px]">
      <dl className="grid grid-cols-3 gap-[9px] text-center font-mono md:gap-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col-reverse rounded-[11px] border border-rc-border-chip bg-rc-surface-2 py-[13px] md:rounded-rc-card md:py-6">
            <dt className="text-[11px] text-rc-ink-4 md:mt-1 md:text-[12.5px]">{item.label}</dt>
            <dd className={cn('text-[20px] leading-tight md:text-[32px] md:tracking-[-.02em]', item.value ? item.tone ?? 'text-rc-ink' : 'text-rc-ink-empty')}>
              {item.value ?? '—'}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function ComunidadeContent({ stats = null }: { stats?: CommunityStatsView | null }) {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-rc-border">
        <div className="rc-dots-bg" />
        <div className="rc-dots-fade" />
        <div className="rc-container relative pb-[26px] pt-[30px] md:pb-14 md:pt-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-rc-discord-border bg-rc-discord-chip px-[11px] py-1.5 font-mono text-[10.5px] uppercase tracking-[.08em] text-rc-discord-soft md:px-[13px] md:py-[7px] md:text-[11.5px]">
            <span className="h-1.5 w-1.5 rounded-full bg-rc-discord" aria-hidden="true" />
            Discord
          </span>
          <h1 className="mt-4 max-w-[20ch] text-[31px] font-semibold leading-[1.12] tracking-[-.034em] text-rc-ink md:mt-5 md:text-[48px] md:leading-[1.16] md:tracking-[-.04em]">
            Comunidade Racoelho
          </h1>
          <p className="mt-3 max-w-[48ch] text-[16px] leading-[1.6] text-rc-ink-3 [text-wrap:pretty] md:mt-4 md:text-[19px]">
            Teste o jogo que estou criando, jogue com a galera e troque uma ideia sobre dev, games e tech.
          </p>
          <a
            href={DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(discordBtn, 'mt-[18px] w-full md:mt-8 md:w-auto')}
          >
            <FaDiscord className="text-[19px]" aria-hidden="true" />
            Entrar no Discord
          </a>
        </div>
      </section>

      {/* Estatísticas (flag community_stats) */}
      {stats && <StatsGrid stats={stats} />}

      {/* Por que entrar */}
      <section className="rc-container pt-[22px] md:pt-[52px]">
        <SectionTitle>Por que entrar?</SectionTitle>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-4">
          {perks.map((perk) => (
            <div key={perk.title} className={cardClasses({ className: 'flex items-start gap-3 p-[15px] md:block md:p-6' })}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-rc-discord-border bg-rc-discord-chip text-rc-discord-soft md:h-[38px] md:w-[38px]">
                <perk.icon size={17} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-[15.5px] font-semibold text-rc-ink md:mt-4 md:text-[19px] md:tracking-[-.018em]">{perk.title}</h3>
                <p className="mt-[5px] text-[13.5px] leading-[1.5] text-rc-ink-4 md:mt-[9px] md:text-[15px] md:leading-[1.6]">{perk.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Canais */}
      <section className="rc-container pt-7 md:pt-12">
        <SectionTitle>Canais</SectionTitle>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3 md:gap-4">
          {channels.map((ch) => (
            <div key={ch.name} className={cardClasses({ className: 'flex items-start gap-3 p-[15px] md:p-5' })}>
              <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border', accentIconBox[ch.accent])}>
                <ch.icon size={17} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-[15.5px] font-semibold text-rc-ink">{ch.name}</h3>
                <p className="mt-[5px] text-[13.5px] leading-[1.5] text-rc-ink-4">{ch.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="rc-container pb-10 pt-7 md:pb-14 md:pt-9">
        <div className="flex flex-col gap-5 rounded-rc-card-lg border border-rc-discord-border bg-rc-discord-surface px-[18px] py-5 md:flex-row md:items-center md:justify-between md:gap-8 md:p-8">
          <div>
            <h2 className="text-[18px] font-semibold tracking-[-.025em] text-rc-ink md:text-[24px]">Bora trocar ideia?</h2>
            <p className="mt-2 max-w-[48ch] text-[14.5px] leading-[1.55] text-rc-discord-ink md:mt-2.5 md:text-[16px] md:leading-[1.6]">
              Gratuito e aberto pra todo mundo. Entra lá e vem jogar com a gente!
            </p>
          </div>
          <a
            href={DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(discordBtn, 'w-full md:w-auto')}
          >
            <FaDiscord className="text-[19px]" aria-hidden="true" />
            Entrar no Discord
          </a>
        </div>
      </section>
    </Layout>
  );
}
