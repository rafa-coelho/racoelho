import { getAllPosts } from '@/lib/api';
import BlogContent from '@/components/BlogContent';

export default async function Blog() {
  const posts = await getAllPosts(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage']);
  const tags = Array.from(new Set(posts.flatMap(post => post.tags || [])));
  return <BlogContent posts={posts} tags={tags} />;
}
