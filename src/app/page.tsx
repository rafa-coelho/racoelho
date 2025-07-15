import HomeContent from '@/components/HomeContent';
import LinksContent from '@/components/LinksContent';
import { getAllPosts, getAllChallenges, getLatestYoutubeVideos, getLinkTreeData } from '@/lib/api';

export default async function Home() {
  const posts = await getAllPosts(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage'], 2);
  const challenges = await getAllChallenges(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage'], 2);
  const videos = await getLatestYoutubeVideos(2);
  const { socialLinks, linkItems } = getLinkTreeData();

  return <LinksContent socialLinks={socialLinks} linkItems={linkItems} posts={posts} challenges={challenges} videos={videos} />;
  // <HomeContent posts={posts} challenges={challenges} videos={videos} socialLinks={socialLinks} linkItems={linkItems} />;
}


