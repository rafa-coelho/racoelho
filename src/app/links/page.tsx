import LinksContent from '@/components/LinksContent';
import { getLatestYoutubeVideos } from '@/lib/services/youtube.service';
import { contentService } from '@/lib/services/content.service';
import { socialService } from '@/lib/services/social.service';
import { linkService } from '@/lib/services/link.service';
import { Metadata } from 'next';
import { BLOG_NAME } from '@/lib/config/constants';

export const metadata: Metadata = {
  title: 'Links',
  description: 'Todos os meus links e redes sociais em um só lugar',
};

export default async function LinksPage() {
  const allPosts = await contentService.getAllPosts(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage']);
  const allChallenges = await contentService.getAllChallenges(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage']);
  const posts = allPosts.slice(0, 2);
  const challenges = allChallenges.slice(0, 2);
  const videos = await getLatestYoutubeVideos(2);
  const socialLinks = await socialService.getSocialLinks();
  const linkItems = await linkService.getLinkItems();

  return <LinksContent socialLinks={socialLinks} linkItems={linkItems} posts={posts} challenges={challenges} videos={videos} />;
}
