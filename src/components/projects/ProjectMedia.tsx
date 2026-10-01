'use client';

import type { ProjectMeta } from '@/lib/types';
import { cn } from '@/lib/utils';
import { RcImage } from '@/components/rc';
import { resolveProjectIcon } from '@/components/projects/ProjectIcon';

// As cores do tema são var(--rc-*) puras (sem canal alfa), então o brilho da
// arte usa color-mix em vez do modificador de opacidade do Tailwind.
const ART_TONE: Record<NonNullable<ProjectMeta['accent']>, { color: string; icon: string }> = {
  blue: { color: 'var(--rc-blue-link)', icon: 'text-rc-blue-link' },
  green: { color: 'var(--rc-green)', icon: 'text-rc-green' },
  amber: { color: 'var(--rc-amber)', icon: 'text-rc-amber' },
};

/**
 * Mídia do card de projeto: o print do produto (coverImage) dentro de uma
 * moldura de navegador com o domínio, ou — para projeto privado/sem capa —
 * uma arte gerada com a cor e o ícone do projeto, para a grade nunca ter
 * buracos.
 */
export function ProjectMedia({
  project,
  chrome = true,
  className,
}: {
  project: Pick<ProjectMeta, 'title' | 'coverImage' | 'liveUrl' | 'icon' | 'accent'>;
  chrome?: boolean;
  className?: string;
}) {
  const host = project.liveUrl ? project.liveUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : null;

  if (project.coverImage) {
    return (
      <div className={cn('overflow-hidden border-b border-rc-border-card bg-rc-surface-2', className)}>
        {chrome && (
          <div aria-hidden="true" className="flex h-6 items-center gap-1.5 border-b border-rc-border-card px-3">
            <span className="h-1.5 w-1.5 rounded-full bg-rc-border-strong" />
            <span className="h-1.5 w-1.5 rounded-full bg-rc-border-strong" />
            <span className="h-1.5 w-1.5 rounded-full bg-rc-border-strong" />
            {host && <span className="ml-2 truncate font-mono text-[10px] text-rc-ink-5">{host}</span>}
          </div>
        )}
        <RcImage
          src={project.coverImage}
          alt={`Tela de ${project.title}`}
          ratio="16/9"
          imgClassName="object-top transition-transform duration-300 ease-out group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  const Icon = resolveProjectIcon(project.icon);
  const tone = ART_TONE[project.accent ?? 'amber'];

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative grid place-items-center overflow-hidden border-b border-rc-border-card bg-rc-surface-2',
        'aspect-video',
        className,
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 0% 0%, color-mix(in srgb, ${tone.color} 24%, transparent), transparent 60%), radial-gradient(90% 80% at 100% 100%, color-mix(in srgb, ${tone.color} 10%, transparent), transparent 70%)`,
        }}
      />
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:16px_16px] text-rc-border-strong" />
      <span className={cn('relative grid h-14 w-14 place-items-center rounded-2xl border border-rc-border-card bg-rc-surface md:h-16 md:w-16', tone.icon)}>
        {Icon ? (
          <Icon className="h-7 w-7 md:h-8 md:w-8" strokeWidth={1.5} />
        ) : (
          <span className="font-mono text-2xl">{project.title.charAt(0).toUpperCase()}</span>
        )}
      </span>
    </div>
  );
}
