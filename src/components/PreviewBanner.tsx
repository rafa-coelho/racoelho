'use client';

import { AlertTriangle } from 'lucide-react';

export default function PreviewBanner() {
  return (
    <div className="bg-yellow-500 text-yellow-950 border-b border-yellow-600 px-4 py-2">
      <div className="container mx-auto flex items-center gap-2 text-sm font-medium">
        <AlertTriangle size={16} />
        <span>Você está visualizando um preview. Este conteúdo ainda não está publicado.</span>
      </div>
    </div>
  );
}

