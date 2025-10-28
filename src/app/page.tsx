import HomeContent from '@/components/HomeContent';
import { getAllPosts, getAllChallenges, getLatestYoutubeVideos, getLinkTreeData } from '@/lib/api';

export default async function Home() {
  // Busca todos para ter a contagem real
  const allPosts = await getAllPosts(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage']);
  const allChallenges = await getAllChallenges(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage']);
  
  // Mas passa apenas os primeiros 3 para exibir
  const posts = allPosts.slice(0, 3);
  const challenges = allChallenges.slice(0, 3);
  const videos = await getLatestYoutubeVideos(3);
  const { socialLinks, linkItems } = getLinkTreeData();

  return <HomeContent 
    posts={posts} 
    challenges={challenges} 
    videos={videos} 
    socialLinks={socialLinks} 
    linkItems={linkItems}
    totalPosts={allPosts.length}
    totalChallenges={allChallenges.length}
  />;
}


