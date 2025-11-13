'use client';

import PostAnalytics from './PostAnalytics';

interface ChallengeAnalyticsProps {
  challengeSlug: string;
}

/**
 * Wrapper para analytics de desafios
 * Usa o mesmo componente de PostAnalytics mas busca de challenge_views
 */
export default function ChallengeAnalytics({ challengeSlug }: ChallengeAnalyticsProps) {
  // Por enquanto, vamos apenas reutilizar o PostAnalytics
  // mas você pode criar uma versão customizada se precisar
  // O componente PostAnalytics já está preparado para isso
  
  return <PostAnalytics postSlug={challengeSlug} isChallenge={true} />;
}
