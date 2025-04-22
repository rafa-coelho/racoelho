import HomeContent from '@/components/HomeContent';
import { getAllPosts, getAllChallenges } from '@/lib/api';

export default async function Home() {
  const posts = await getAllPosts(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage'], 3);
  const challenges = await getAllChallenges(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage'], 3);

  return (
    <>
      <HomeContent posts={posts} challenges={challenges} />
    </>
  );
}


