import { contentService } from '@/lib/services/content.service';
import BlogContent from '@/components/BlogContent';

export default async function Blog() {
  // Busca com suporte a preview
  const searchParams = await import('next/navigation').then(m => m).catch(() => null);
  const isPreview = false; // TODO: Implementar detecção de preview via query params ou headers
  
  const posts = await contentService.getAllPosts(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage', 'content'], isPreview);
  const tags = Array.from(new Set(posts.flatMap(post => post.tags || [])));
  return <BlogContent posts={posts} tags={tags} />;
}
