import LinksContent from '@/components/LinksContent';
import { getAllPosts, getAllChallenges, getLatestYoutubeVideos, getLinkTreeData } from '@/lib/api';
import { Metadata } from 'next';
import { BLOG_NAME } from '@/lib/config/constants';

export const metadata: Metadata = {
  title: 'Links',
  description: 'Todos os meus links e redes sociais em um só lugar',
};

export default async function LinksPage() {
  const posts = await getAllPosts(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage'], 2);
  const challenges = await getAllChallenges(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage'], 2);
  const videos = await getLatestYoutubeVideos(2);
  const { socialLinks, linkItems } = getLinkTreeData();

  return <LinksContent socialLinks={socialLinks} linkItems={linkItems} posts={posts} challenges={challenges} videos={videos} />;
}
