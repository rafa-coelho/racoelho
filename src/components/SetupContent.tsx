'use client';

import { useMemo, useState, type ComponentType } from 'react';
import { SetupItem } from '@/lib/api';
import { ChevronRight, Code2, Keyboard, Lamp, Mic, Monitor, Video, type LucideProps } from 'lucide-react';
import Layout from './Layout';
import { cn } from '@/lib/utils';
import { Chip, EmptyState, Eyebrow, RcImage, cardClasses, pad2 } from '@/components/rc';

interface SetupContentProps {
  items: SetupItem[];
  categories: string[];
}

// Ordena por `order` (sem order vai para o fim, mantendo a ordem original).
function sortByOrder(list: SetupItem[]): SetupItem[] {
  return list
    .map((item, i) => ({ item, i }))
    .sort((a, b) => (a.item.order ?? Number.MAX_SAFE_INTEGER) - (b.item.order ?? Number.MAX_SAFE_INTEGER) || a.i - b.i)
    .map(({ item }) => item);
}

// Link externo: afiliado ganha rel="sponsored noopener".
function linkRel(item: SetupItem) {
  return item.affiliate ? 'sponsored noopener' : 'noopener noreferrer';
}

export default function SetupContent({ items: rawItems, categories }: SetupContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const items = useMemo(() => sortByOrder(rawItems), [rawItems]);
  const hasAffiliate = items.some(item => item.affiliate);

  const countBy = (category: string) => items.filter(item => item.category === category).length;

  const visibleCategories = selectedCategory ? [selectedCategory] : categories;
  const groups = visibleCategories
    .map(category => ({ category, items: items.filter(item => item.category === category) }))
    .filter(group => group.items.length > 0);

  return (
    <Layout>
      {/* Cabeçalho */}
      <section className="relative overflow-hidden border-b border-rc-border">
        <div className="rc-dots-bg hidden md:block" />
        <div className="rc-dots-fade hidden md:block" />
        <div className="rc-container relative pb-5 pt-6 md:pb-8 md:pt-[52px]">
          <Eyebrow className="md:text-[11.5px] md:text-rc-blue-soft">
            Setup<span className="hidden md:inline"> · {items.length} itens</span>
          </Eyebrow>
          <h1 className="mt-[9px] text-rc-h1-m font-semibold text-rc-ink md:mt-3.5 md:text-[42px] md:leading-[1.12] md:tracking-[-.035em]">Meu setup</h1>
          <p className="mt-[9px] max-w-[54ch] text-[15px] leading-[1.6] text-rc-ink-3 md:mt-3 md:text-[17.5px]">
            Equipamentos e ferramentas que utilizo no meu dia a dia como desenvolvedor.
            {hasAffiliate && ' Alguns links são de afiliado.'}
          </p>

          {categories.length > 1 && (
            <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:mt-6 md:flex-wrap md:overflow-visible md:px-0">
              <Chip active={selectedCategory === null} onClick={() => setSelectedCategory(null)} className="h-11 md:h-9">
                todos · {items.length}
              </Chip>
              {categories.map((category) => (
                <Chip
                  key={category}
                  active={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  className="h-11 lowercase md:h-9"
                >
                  {category} · {countBy(category)}
                </Chip>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="rc-container pb-7 pt-[22px] md:pb-14 md:pt-9">
        {groups.length > 0 ? (
          <div className="flex flex-col gap-[26px] md:gap-8">
            {groups.map(group => (
              <section key={group.category} aria-labelledby={`setup-${slugify(group.category)}`}>
                <CategoryHeader category={group.category} count={group.items.length} />

                <SetupGroup items={group.items} />
              </section>
            ))}
          </div>
        ) : (
          <EmptyState message="Nenhum item encontrado. Tente selecionar outra categoria." />
        )}
      </div>
    </Layout>
  );
}

// Grupo: software vira chip; hardware e itens sem kind seguem lista (mobile) / grade (desktop).
function SetupGroup({ items }: { items: SetupItem[] }) {
  const listItems = items.filter(item => item.kind !== 'software');
  const softwareItems = items.filter(item => item.kind === 'software');

  return (
    <div className="flex flex-col gap-3">
      {listItems.length > 0 && (
        <>
          {/* Mobile: lista única dentro de um cartão */}
          <div className={cardClasses({ className: 'overflow-hidden md:hidden' })}>
            {listItems.map((item, i) => (
              <SetupRow key={`${item.name}-${i}`} item={item} last={i === listItems.length - 1} />
            ))}
          </div>

          {/* Desktop: grade de 2 colunas */}
          <div className="hidden grid-cols-2 gap-3 md:grid">
            {listItems.map((item, i) => (
              <SetupCard key={`${item.name}-${i}`} item={item} />
            ))}
          </div>
        </>
      )}

      {softwareItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {softwareItems.map((item, i) => (
            <SoftwareChip key={`${item.name}-${i}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function SoftwareChip({ item }: { item: SetupItem }) {
  const classes = 'inline-flex min-h-[44px] items-center rounded-[11px] border border-rc-border-card bg-rc-surface px-3.5 py-[11px] text-[14px] leading-tight text-rc-ink md:min-h-0';
  const title = item.detail || item.description || undefined;

  if (item.url) {
    return (
      <a href={item.url} target="_blank" rel={linkRel(item)} title={title} className={cn(classes, 'transition-colors duration-150 hover:border-rc-border-hover')}>
        {item.name}
      </a>
    );
  }
  return (
    <span title={title} className={classes}>
      {item.name}
    </span>
  );
}

function slugify(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-');
}

// Ícone por categoria (só visual). Sem correspondência, usa a inicial em mono.
const CATEGORY_ICONS: Array<[RegExp, ComponentType<LucideProps>]> = [
  [/audio|som|microfone/, Mic],
  [/video|camera|webcam/, Video],
  [/perifer|teclado|mouse/, Keyboard],
  [/ilumina|luz/, Lamp],
  [/software|app|ferrament|editor/, Code2],
  [/mesa|escritorio|monitor|hardware|computador/, Monitor],
];

function CategoryHeader({ category, count }: { category: string; count: number }) {
  const key = slugify(category);
  const Icon = CATEGORY_ICONS.find(([re]) => re.test(key))?.[1];

  return (
    <div className="mb-3 flex items-center gap-2.5 md:mb-4 md:gap-4">
      {Icon ? (
        <Icon className="h-4 w-4 shrink-0 text-rc-blue-soft md:h-[18px] md:w-[18px]" strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <span aria-hidden="true" className="w-4 shrink-0 text-center font-mono text-sm text-rc-blue-soft">
          {category.charAt(0).toUpperCase()}
        </span>
      )}
      <h2 id={`setup-${key}`} className="text-[16.5px] font-semibold tracking-[-.02em] text-rc-ink md:text-[19px]">
        {category}
      </h2>
      <span className="h-px flex-1 bg-rc-border" aria-hidden="true" />
      <span className="font-mono text-[11px] text-rc-ink-6 md:text-[11.5px]">{pad2(count)}</span>
    </div>
  );
}

function SetupRow({ item, last }: { item: SetupItem; last: boolean }) {
  const content = (
    <>
      <RcImage src={item.image} alt={item.name} ratio="1/1" className="w-[42px] shrink-0 rounded-[10px]" />
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-medium leading-[1.3] text-rc-ink">{item.name}</div>
        {(item.detail || item.description) && (
          <div className="mt-[3px] truncate font-mono text-[10.5px] text-rc-ink-5">{item.detail || item.description}</div>
        )}
      </div>
      {item.url && <ChevronRight className="h-4 w-4 shrink-0 text-rc-ink-6" aria-hidden="true" />}
    </>
  );
  const classes = cn('flex min-h-[68px] items-center gap-[13px] px-[15px] py-[13px]', !last && 'border-b border-rc-border');

  if (item.url) {
    return (
      <a href={item.url} target="_blank" rel={linkRel(item)} className={cn(classes, 'transition-colors duration-150 active:bg-rc-surface-2')}>
        {content}
      </a>
    );
  }
  return <div className={classes}>{content}</div>;
}

function SetupCard({ item }: { item: SetupItem }) {
  const content = (
    <>
      <RcImage src={item.image} alt={item.name} ratio="1/1" className="w-16 rounded-lg" />
      <div className="min-w-0">
        <div className="text-base font-semibold tracking-[-.015em] text-rc-ink">{item.name}</div>
        {item.detail && <div className="mt-1 font-mono text-[11px] text-rc-ink-5">{item.detail}</div>}
        {item.description && <p className="mt-[5px] line-clamp-3 text-[13.5px] leading-[1.5] text-rc-ink-4">{item.description}</p>}
      </div>
      {item.url ? (
        <span className="whitespace-nowrap font-mono text-[11px] text-rc-blue-link">detalhes ↗</span>
      ) : (
        <span />
      )}
    </>
  );
  const classes = 'grid grid-cols-[64px_1fr_auto] items-center gap-4 rounded-xl px-4 py-3.5';

  if (item.url) {
    return (
      <a href={item.url} target="_blank" rel={linkRel(item)} className={cardClasses({ interactive: true, className: classes })}>
        {content}
      </a>
    );
  }
  return <div className={cardClasses({ className: classes })}>{content}</div>;
}
