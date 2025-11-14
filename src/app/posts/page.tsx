import { contentService } from '@/lib/services/content.service';
import BlogContent from '@/components/BlogContent';
import { isAdmin } from '@/lib/pocketbase-server';

export const revalidate = 0; // Sempre buscar dados atualizados (pode ser invalidado via revalidatePath)

export default async function Blog() {
  const adminStatus = await isAdmin();
  
  const posts = await contentService.getAllPosts(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage', 'content'], adminStatus);
  const tags = Array.from(new Set(posts.flatMap(post => post.tags || [])));
  return <BlogContent posts={posts} tags={tags} />;
}
