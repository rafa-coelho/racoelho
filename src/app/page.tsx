import HomeContent from '@/components/HomeContent';
import { getLatestYoutubeVideos } from '@/lib/services/youtube.service';
import { contentService } from '@/lib/services/content.service';
import { socialService } from '@/lib/services/social.service';
import { linkService } from '@/lib/services/link.service';

export default async function Home() {
  // Busca todos para ter a contagem real
  const allPosts = await contentService.getAllPosts(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage']);
  const allChallenges = await contentService.getAllChallenges(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage']);
  
  // Mas passa apenas os primeiros 3 para exibir
  const posts = allPosts.slice(0, 3);
  const challenges = allChallenges.slice(0, 3);
  const videos = await getLatestYoutubeVideos(3);
  const socialLinks = await socialService.getSocialLinks();
  const linkItems = await linkService.getLinkItems();

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


