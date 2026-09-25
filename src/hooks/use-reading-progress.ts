'use client';

import { RefObject, useEffect, useState } from 'react';

// Fração do elemento já rolada: topo do elemento no topo da viewport = 0,
// fim do elemento no fundo da viewport = 1.
export function readingFraction(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  if (total <= 0) return rect.top <= 0 ? 1 : 0;
  return Math.min(1, Math.max(0, -rect.top / total));
}

/**
 * Acompanha o progresso de leitura de um elemento (normalmente o <article>).
 * Atualiza no máximo uma vez por frame (requestAnimationFrame).
 */
export function useReadingProgress(ref: RefObject<HTMLElement>, enabled = true) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (ref.current) setProgress(readingFraction(ref.current));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // O conteúdo muda de altura (imagens, mermaid); recalcula quando isso acontece
    const observer = typeof ResizeObserver !== 'undefined' && ref.current ? new ResizeObserver(schedule) : null;
    if (observer && ref.current) observer.observe(ref.current);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer?.disconnect();
    };
  }, [ref, enabled]);

  return progress;
}
