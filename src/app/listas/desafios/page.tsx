import { challengeService } from '@/lib/services/challenge.service';
import ChallengesContent from '@/components/ChallengesContent';

export default async function Challenges() {
  // Trilha inclui os "em breve" (comingSoon), que aparecem sem link.
  const challenges = await challengeService.getChallengeTrail(false);
  const tags = Array.from(new Set(challenges.flatMap(challenge => challenge.tags || [])));

  return <ChallengesContent challenges={challenges} tags={tags} />;
}
