'use client';

import { AlertTriangle } from 'lucide-react';

export default function PreviewBanner() {
  return (
    <div className="border-b border-rc-amber-border bg-rc-amber-surface px-4 py-2 text-rc-amber">
      <div className="rc-container flex items-center gap-2 font-mono text-[12px]">
        <AlertTriangle size={15} strokeWidth={1.75} aria-hidden="true" />
        <span>Você está visualizando um preview. Este conteúdo ainda não está publicado.</span>
      </div>
    </div>
  );
}
