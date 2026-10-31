'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';
import Layout from './Layout';
import { authorInfo } from '@/lib/config/constants';
import type { ProjectMeta } from '@/lib/types';
import { ButtonLink, Eyebrow, cardClasses } from '@/components/rc';
import { ProjectIcon } from '@/components/projects/ProjectIcon';

const SERVICES = [
  { title: 'Sistemas sob medida', text: 'Do processo que hoje vive em planilha ao sistema completo, com painel, usuários e relatórios.' },
  { title: 'SaaS e produtos digitais', text: 'Da primeira versão à cobrança: login, assinatura ou compra única, e-mails e painel.' },
  { title: 'Integrações e automações', text: 'Pagamentos, WhatsApp, e-mail e APIs de terceiros conectados ao que você já usa.' },
  { title: 'Apps para Windows', text: 'Apps nativos, leves e prontos para a Microsoft Store.' },
];

export default function HireContent({ projects }: { projects: ProjectMeta[] }) {
  const contactHref = `mailto:${authorInfo.email}?subject=${encodeURIComponent('Quero conversar sobre um projeto')}`;

  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-rc-border">
        <div className="rc-dots-bg hidden md:block" />
        <div className="rc-dots-fade hidden md:block" />
        <div className="rc-container relative pb-7 pt-6 md:pb-12 md:pt-[52px]">
          <Eyebrow className="text-rc-amber-num md:text-[11.5px] md:text-rc-amber">Trabalhe comigo</Eyebrow>
          <h1 className="mt-[9px] max-w-[22ch] text-rc-h1-m font-semibold text-rc-ink [text-wrap:balance] md:mt-3.5 md:text-[42px] md:leading-[1.12] md:tracking-[-.035em]">
            Tem uma ideia ou um processo para resolver? Eu construo.
          </h1>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-[1.6] text-rc-ink-3 md:text-[17.5px]">
            Sou dev fullstack e cuido do projeto inteiro, da conversa inicial ao sistema no ar. Me conta o que você precisa e eu respondo por e-mail.
          </p>
          <ButtonLink href={contactHref} size="lg" className="mt-5 rounded-xl md:mt-7 md:rounded-[10px]">
            <Mail className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
            Me conta sobre o projeto
          </ButtonLink>
        </div>
      </section>

      <div className="rc-container space-y-9 pb-7 pt-7 md:space-y-12 md:pb-14 md:pt-12">
        <section aria-labelledby="servicos-title">
          <h2 id="servicos-title" className="text-[18px] font-semibold tracking-[-.02em] text-rc-ink md:text-[22px]">O que eu faço</h2>
          <div className="mt-3 grid grid-cols-1 gap-2.5 md:mt-4 md:grid-cols-2 md:gap-3.5">
            {SERVICES.map((service) => (
              <div key={service.title} className={cardClasses({ className: 'p-[18px] md:p-5' })}>
                <h3 className="text-[16.5px] font-semibold tracking-[-.02em] text-rc-ink">{service.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-[1.55] text-rc-ink-3">{service.text}</p>
              </div>
            ))}
          </div>
        </section>

        {projects.length > 0 && (
          <section aria-labelledby="provas-title">
            <h2 id="provas-title" className="text-[18px] font-semibold tracking-[-.02em] text-rc-ink md:text-[22px]">O que eu já construí</h2>
            <div className="mt-3 grid grid-cols-1 gap-2.5 md:mt-4 md:grid-cols-3 md:gap-3.5">
              {projects.map((project) => (
                <Link key={project.slug} href={`/projetos/${project.slug}`} className={cardClasses({ interactive: true, className: 'flex items-center gap-3 p-4' })}>
                  <ProjectIcon project={project} size="lg" />
                  <span className="min-w-0 text-[15px] font-semibold leading-[1.3] tracking-[-.018em] text-rc-ink">{project.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col gap-4 rounded-rc-card-lg border border-rc-blue-border bg-rc-blue-surface px-[18px] py-[22px] md:flex-row md:items-center md:justify-between md:gap-7 md:p-7">
          <div>
            <h2 className="text-[19px] font-semibold tracking-[-.02em] text-rc-ink md:text-[21px]">Vamos conversar?</h2>
            <p className="mt-2 text-[14.5px] leading-[1.6] text-rc-ink-3 md:text-rc-body">Conta o problema, o prazo e o que já existe hoje.</p>
          </div>
          <ButtonLink href={contactHref} size="lg" className="min-w-0 shrink rounded-xl md:h-auto md:rounded-[10px] md:px-5 md:py-[13px]">
            <span className="truncate">{authorInfo.email}</span>
          </ButtonLink>
        </div>
      </div>
    </Layout>
  );
}
