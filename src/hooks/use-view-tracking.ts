'use client';

import { useEffect, useState } from 'react';

interface UseViewTrackingOptions {
  /** ID do post a ser trackeado */
  postId?: string;
  /** ID do desafio a ser trackeado */
  challengeId?: string;
  /** Delay em ms antes de registrar a view (anti-bounce) */
  delay?: number;
  /** Se deve trackear automaticamente */
  enabled?: boolean;
}

/**
 * Hook para tracking automático de visualizações de posts e desafios
 * 
 * Funcionalidades:
 * - Gera/recupera viewerId do localStorage (identifica usuário único)
 * - Delay de 3s antes de registrar (evita bounces)
 * - Registra apenas uma vez por sessão
 * - Não bloqueia a UI (fire-and-forget)
 * 
 * @example
 * ```tsx
 * function PostPage({ post }) {
 *   useViewTracking({ postId: post.id });
 *   return <article>{post.content}</article>
 * }
 * ```
 */
export function useViewTracking(options: UseViewTrackingOptions) {
  const { 
    postId, 
    challengeId, 
    delay = 3000, 
    enabled = true 
  } = options;

  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    // Não faz nada se:
    // - Já foi trackeado
    // - Está desabilitado
    // - Não tem nem postId nem challengeId
    if (tracked || !enabled || (!postId && !challengeId)) {
      return;
    }

    // Gera ou recupera viewerId do localStorage
    let viewerId = '';
    try {
      viewerId = localStorage.getItem('viewerId') || '';
      
      if (!viewerId) {
        // Gera novo UUID para identificar este browser/usuário
        viewerId = crypto.randomUUID();
        localStorage.setItem('viewerId', viewerId);
      }
    } catch (error) {
      console.error('[useViewTracking] Erro ao acessar localStorage:', error);
      return;
    }

    // Aguarda o delay antes de registrar (evita bounces)
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId,
            challengeId,
            viewerId,
          }),
        });

        if (response.ok) {
          setTracked(true);
        }
      } catch (error) {
        // Ignora erros silenciosamente para não impactar UX
        console.error('[useViewTracking] Erro ao registrar view:', error);
      }
    }, delay);

    // Cleanup: cancela o timer se o componente desmontar antes
    return () => clearTimeout(timer);
  }, [postId, challengeId, delay, enabled, tracked]);

  return { tracked };
}
