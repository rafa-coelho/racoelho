import { contentService } from '@/lib/services/content.service';
import BlogContent from '@/components/BlogContent';

export default async function Blog() {
  const posts = await contentService.getAllPosts(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage', 'content']);
  const tags = Array.from(new Set(posts.flatMap(post => post.tags || [])));
  return <BlogContent posts={posts} tags={tags} />;
}
