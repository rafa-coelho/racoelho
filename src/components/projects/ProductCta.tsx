'use client';

import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { buttonClasses } from '@/components/rc';
import { analyticsConfig } from '@/lib/config/constants';
import { analyticsService } from '@/lib/services/analytics.service';
import { withUtm } from '@/lib/utils/projects';
import type { ProjectMeta } from '@/lib/types';

interface ProductCtaProps {
  project: Pick<ProjectMeta, 'slug' | 'title' | 'liveUrl' | 'ctaLabel'>;
  // Onde o botão está (home, projetos, projeto, post): vira utm_campaign e rótulo do evento.
  placement: string;
  size?: 'sm' | 'lg';
  className?: string;
  children?: ReactNode;
}

export function ProductCta({ project, placement, size = 'sm', className, children }: ProductCtaProps) {
  if (!project.liveUrl) return null;

  return (
    <a
      href={withUtm(project.liveUrl, placement)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => analyticsService.event(analyticsConfig.events.productCtaClick, analyticsConfig.categories.navigation, `${project.slug}:${placement}`)}
      className={buttonClasses({ size, className })}
    >
      {children ?? project.ctaLabel ?? 'Abrir'}
      <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      <span className="sr-only">{project.title} (abre em nova aba)</span>
    </a>
  );
}
