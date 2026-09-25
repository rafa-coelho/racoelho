'use client';

import { useCallback, useEffect, useState } from 'react';
import { analyticsService } from '@/lib/services/analytics.service';

// Progresso dos desafios só no navegador (não há conta de visitante).
export const CHALLENGES_DONE_KEY = 'rc:challenges:done';
const SYNC_EVENT = 'rc:challenges:done-change';

function read(): string[] {
  try {
    const raw = localStorage.getItem(CHALLENGES_DONE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((s) => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

function write(list: string[]) {
  try {
    localStorage.setItem(CHALLENGES_DONE_KEY, JSON.stringify(list));
  } catch {
    /* sem storage: fica só em memória */
  }
  window.dispatchEvent(new Event(SYNC_EVENT));
}

// Marca fora de um componente (ex.: após enviar solução).
export function markChallengeDone(slug: string) {
  const list = read();
  if (!list.includes(slug)) {
    write([...list, slug]);
    analyticsService.event('challenge_complete', 'challenges', slug);
  }
}

export function useChallengeProgress() {
  const [done, setDone] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setDone(read());
    sync();
    setReady(true);
    // outras abas (storage) e outros componentes da mesma página (evento próprio)
    const onStorage = (e: StorageEvent) => {
      if (e.key === CHALLENGES_DONE_KEY) sync();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener(SYNC_EVENT, sync);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(SYNC_EVENT, sync);
    };
  }, []);

  const isDone = useCallback((slug: string) => done.includes(slug), [done]);
  const markDone = useCallback((slug: string) => markChallengeDone(slug), []);
  const unmarkDone = useCallback((slug: string) => write(read().filter((s) => s !== slug)), []);

  return { done, ready, isDone, markDone, unmarkDone };
}
