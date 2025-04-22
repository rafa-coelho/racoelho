import { getAllChallenges } from '@/lib/api';
import ChallengesContent from '@/components/ChallengesContent';

export default async function Challenges() {
  const challenges = await getAllChallenges(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage']);
  const tags = Array.from(new Set(challenges.flatMap(challenge => challenge.tags || [])));

  return <ChallengesContent challenges={challenges} tags={tags} />;
}
