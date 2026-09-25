'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { analyticsService } from '@/lib/services/analytics.service';

// Mesma chave de localStorage usada em use-view-tracking (/api/views).
const VIEWER_KEY = 'viewerId';

function getViewerId(): string | null {
  try {
    let viewerId = localStorage.getItem(VIEWER_KEY) || '';
    if (!viewerId) {
      viewerId = crypto.randomUUID();
      localStorage.setItem(VIEWER_KEY, viewerId);
    }
    return viewerId;
  } catch {
    return null;
  }
}

interface LikeState {
  liked: boolean;
  count: number;
}

/**
 * Curtir post (/api/likes). Atualização otimista; reverte se a API falhar.
 * `postId` é o slug do post.
 */
export function useLike(postId: string, { enabled = true, initialCount = 0 }: { enabled?: boolean; initialCount?: number } = {}) {
  const [state, setState] = useState<LikeState>({ liked: false, count: initialCount });
  const [ready, setReady] = useState(false);
  const pending = useRef(false);
  const viewerId = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !postId) return;
    let mounted = true;
    viewerId.current = getViewerId();
    const params = new URLSearchParams({ postId });
    if (viewerId.current) params.set('viewerId', viewerId.current);

    fetch(`/api/likes?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && data && typeof data.count === 'number') {
          setState({ liked: !!data.liked, count: data.count });
        }
      })
      .catch(() => undefined)
      .finally(() => mounted && setReady(true));

    return () => {
      mounted = false;
    };
  }, [postId, enabled]);

  const toggle = useCallback(async () => {
    if (pending.current || !viewerId.current) return;
    pending.current = true;
    const previous = state;
    const nextLiked = !previous.liked;
    // otimista
    setState({ liked: nextLiked, count: Math.max(0, previous.count + (nextLiked ? 1 : -1)) });

    try {
      const res = await fetch('/api/likes', {
        method: nextLiked ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, viewerId: viewerId.current }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (typeof data.count === 'number') setState({ liked: !!data.liked, count: data.count });
      if (nextLiked) analyticsService.event('post_like', 'posts', postId);
    } catch {
      // rollback
      setState(previous);
    } finally {
      pending.current = false;
    }
  }, [postId, state]);

  return { liked: state.liked, count: state.count, ready, toggle };
}
