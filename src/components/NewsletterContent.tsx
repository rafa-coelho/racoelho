'use client';

import Layout from './Layout';
import { Eyebrow, NewsletterForm, cardClasses, formatShortDate, pad2 } from '@/components/rc';
import type { NewsletterIssue } from '@/lib/services/newsletter-archive.service';

const benefits = [
  { title: 'Conteúdo exclusivo', text: 'Receba conteúdos que não são publicados no blog ou redes sociais.' },
  { title: 'Prioridade em novidades', text: 'Seja o primeiro a saber sobre novos cursos, eventos e projetos.' },
  { title: 'Sem spam', text: 'Apenas conteúdo relevante, sem flood de emails desnecessários.' },
];

export default function NewsletterContent({ issues = [] }: { issues?: NewsletterIssue[] }) {
  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className="rc-dots-bg" />
        <div className="rc-dots-fade" />
        <div className="rc-container relative grid grid-cols-1 gap-y-7 pb-10 pt-[34px] md:grid-cols-[1fr_460px] md:items-start md:gap-x-14 md:gap-y-0 md:pb-16 md:pt-16">
          {/* Título */}
          <div className="md:col-start-1 md:row-start-1">
            <Eyebrow className="text-rc-blue-soft md:text-[11.5px]">Newsletter</Eyebrow>
            <h1 className="mt-2.5 text-[32px] font-semibold leading-[1.12] tracking-[-.034em] text-rc-ink md:mt-3.5 md:text-rc-h1">
              Conteúdo de dev direto no seu email
            </h1>
            <p className="mt-3 max-w-[46ch] text-base leading-[1.62] text-rc-ink-3 [text-wrap:pretty] md:mt-3.5 md:text-[18.5px] md:leading-[1.6]">
              Receba conteúdos exclusivos sobre desenvolvimento, tecnologia e programação diretamente no seu email.
            </p>
          </div>

          {/* Formulário: cartão azul no desktop, direto no hero no mobile */}
          <div className="md:col-start-2 md:row-span-2 md:row-start-1 md:rounded-[18px] md:border md:border-rc-blue-border md:bg-rc-blue-surface md:p-8">
            <NewsletterForm withName layout="stacked" submitLabel="Assinar newsletter" source="newsletter_page" />
            <p className="mt-3 font-mono text-[11px] leading-[1.6] text-rc-ink-6 md:mt-4 md:text-center md:text-xs">
              Sem spam. Cancelamento em um clique.
            </p>
          </div>

          {/* Benefícios numerados */}
          <ol className="flex flex-col gap-3.5 md:col-start-1 md:row-start-2 md:mt-[34px]">
            {benefits.map((b, i) => (
              <li key={b.title} className="grid grid-cols-[30px_1fr] items-start gap-4">
                <span className="pt-0.5 font-mono text-[13px] text-rc-blue-link">{pad2(i + 1)}</span>
                <div>
                  <h2 className="text-[16.5px] font-semibold text-rc-ink">{b.title}</h2>
                  <p className="mt-[5px] text-[15px] leading-[1.6] text-rc-ink-4">{b.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Arquivo de edições (flag newsletter_archive) */}
      {issues.length > 0 && (
        <section aria-labelledby="newsletter-edicoes" className="rc-container pb-10 md:pb-16">
          <div className="mb-3.5 flex items-center gap-3 md:mb-4 md:gap-4">
            <h2 id="newsletter-edicoes" className="text-[17px] font-semibold tracking-[-.02em] text-rc-ink md:text-[19px]">
              Edições recentes
            </h2>
            <span className="h-px flex-1 bg-rc-border" aria-hidden="true" />
          </div>
          <ul className="flex flex-col gap-2.5 md:max-w-[720px] md:gap-3">
            {issues.map((issue) => (
              <li key={issue.id}>
                <a
                  href={issue.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClasses({ interactive: true, className: 'block rounded-[13px] p-[15px] md:rounded-rc-card md:px-5 md:py-4' })}
                >
                  <div className="font-mono text-[10.5px] text-rc-ink-5 md:text-[11px]">
                    {issue.number !== null && <>#{pad2(issue.number)} · </>}
                    <time dateTime={issue.date}>{formatShortDate(issue.date)}</time>
                  </div>
                  <div className="mt-1.5 text-[15.5px] font-medium leading-[1.35] text-rc-ink md:text-base">{issue.subject}</div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Layout>
  );
}
