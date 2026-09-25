'use client';

import type { ReactNode } from 'react';
import { analyticsService } from '@/lib/services/analytics.service';

// Link com evento de analytics (mediakit_contact_click, mediakit_pdf_download).
export function TrackedAnchor({
  href,
  event,
  label,
  className,
  download,
  external,
  children,
}: {
  href: string;
  event: string;
  label?: string;
  className?: string;
  download?: boolean;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      download={download || undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={() => analyticsService.event(event, 'mediakit', label)}
    >
      {children}
    </a>
  );
}
