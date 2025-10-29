import { challengeService } from '@/lib/services/challenge.service';
import ChallengesContent from '@/components/ChallengesContent';

export default async function Challenges() {
  const challenges = await challengeService.getAllChallenges(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage'], false);
  const tags = Array.from(new Set(challenges.flatMap(challenge => challenge.tags || [])));

  return <ChallengesContent challenges={challenges} tags={tags} />;
}
