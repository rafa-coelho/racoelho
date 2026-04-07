'use client';

import Layout from './Layout';
import { FaDiscord } from 'react-icons/fa';
import { Users, MessageSquare, Code2, Sparkles } from 'lucide-react';

const DISCORD_LINK = 'https://discord.gg/7dv2QWYA';

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

export default function ComunidadeContent() {
  return (
    <Layout>
      <div className="min-h-screen section-gradient-1">
        {/* Hero */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/15 via-purple-600/5 to-transparent" />

          <div className="content-container relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5865F2]/10 border border-[#5865F2]/20 mb-6 animate-fade-in">
              <FaDiscord className="text-[#5865F2]" />
              <span className="text-sm font-medium text-[#5865F2]">Discord</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight animate-fade-in-up">
              Comunidade{' '}
              <span className="bg-gradient-to-r from-[#5865F2] via-purple-400 to-[#5865F2] bg-clip-text text-transparent">
                Racoelho
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '100ms' }}>
              Teste o jogo que estou criando, jogue com a galera e troque uma ideia sobre dev, games e tech.
            </p>

            <a
              href={DISCORD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-[#5865F2]/25 animate-fade-in"
              style={{ animationDelay: '200ms' }}
            >
              <FaDiscord className="text-2xl" />
              Entrar no Discord
            </a>
          </div>
        </section>

        {/* Perks */}
        <section className="py-20 section-gradient-2">
          <div className="content-container max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Por que entrar?</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {perks.map((perk, index) => (
                <div
                  key={perk.title}
                  className="card-modern p-8 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#5865F2]/10 flex items-center justify-center mb-4 group-hover:bg-[#5865F2]/20 transition-colors">
                    <perk.icon size={24} className="text-[#5865F2]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{perk.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{perk.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-20 section-gradient-1">
          <div className="content-container max-w-2xl mx-auto text-center">
            <div className="card-modern p-12 border-2 border-[#5865F2]/20">
              <FaDiscord className="text-6xl text-[#5865F2] mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Bora trocar ideia?</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Gratuito e aberto pra todo mundo. Entra lá e vem jogar com a gente!
              </p>
              <a
                href={DISCORD_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-[#5865F2]/25"
              >
                <FaDiscord className="text-xl" />
                Entrar no Discord
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
