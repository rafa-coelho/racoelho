'use client';

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { readingFraction } from '@/hooks/use-reading-progress';
import { LikeButton } from './LikeButton';

// Aparece depois de 30% do artigo.
const SHOW_AFTER = 0.3;

interface PostActionBarProps {
  articleRef: RefObject<HTMLElement>;
  /** bloco de newsletter do fim: a barra some ao chegar nele */
  endRef?: RefObject<HTMLElement>;
  title: string;
  url: string;
  showShare: boolean;
  like: { liked: boolean; count: number; toggle: () => void };
}

// Barra de ação fixa no rodapé, só no mobile: curtir + compartilhar.
// "Salvar" fica de fora até existir a tela /salvos (DECIDIR, FEATURES §8).
export function PostActionBar({ articleRef, endRef, title, url, showShare, like }: PostActionBarProps) {
  const [visible, setVisible] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const article = articleRef.current;
      if (!article) return;
      const end = endRef?.current;
      const reachedEnd = end
        ? end.getBoundingClientRect().top < window.innerHeight
        : article.getBoundingClientRect().bottom < window.innerHeight;
      setVisible(readingFraction(article) >= SHOW_AFTER && !reachedEnd);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [articleRef, endRef]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch (error) {
        // usuário cancelou: não faz nada
        if ((error as Error)?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link copiado');
    } catch {
      showToast('Não foi possível copiar o link');
    }
  };

  return (
    <>
      <div
        aria-hidden={!visible}
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 flex items-center gap-2.5 border-t border-rc-border bg-rc-bg/[.93] px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-[transform,visibility] duration-200 ease-out motion-reduce:transition-none md:hidden',
          visible ? 'visible translate-y-0' : 'invisible translate-y-full',
        )}
      >
        <LikeButton
          liked={like.liked}
          count={like.count}
          onToggle={like.toggle}
          showLabel={!showShare}
          className={showShare ? 'shrink-0' : 'flex-1'}
        />
        {showShare && (
          <button
            type="button"
            onClick={handleShare}
            tabIndex={visible ? undefined : -1}
            className="h-12 flex-1 rounded-xl bg-rc-blue text-[15px] font-semibold text-white transition-colors hover:bg-rc-blue-hover"
          >
            Compartilhar
          </button>
        )}
      </div>

      <div
        role="status"
        aria-live="polite"
        className={cn(
          'pointer-events-none fixed inset-x-0 bottom-[calc(88px+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 md:hidden',
          toast ? 'opacity-100' : 'opacity-0',
        )}
      >
        {toast && (
          <span className="rounded-full border border-rc-border-card bg-rc-surface-2 px-4 py-2 font-mono text-xs text-rc-ink-2 shadow-lg">{toast}</span>
        )}
      </div>
    </>
  );
}
