import { contentService } from '@/lib/services/content.service';
import BlogContent from '@/components/BlogContent';
import { isAdmin } from '@/lib/pocketbase-server';
import { parsePage } from '@/components/posts/search';

export const revalidate = 0; // Sempre buscar dados atualizados (pode ser invalidado via revalidatePath)

interface BlogProps {
  searchParams?: { tag?: string | string[]; page?: string | string[] };
}

export default async function Blog({ searchParams }: BlogProps) {
  const adminStatus = await isAdmin();

  // A página recebe todos os posts; busca, tag e paginação são filtrados no cliente.
  const posts = await contentService.getAllPosts(['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage'], adminStatus);
  const tags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

  // ?tag= e ?page= para o link ser compartilhável (e o "Carregar mais" funcionar sem JS)
  const rawTag = Array.isArray(searchParams?.tag) ? searchParams?.tag[0] : searchParams?.tag;
  const initialTag = rawTag && tags.includes(rawTag) ? rawTag : null;
  const rawPage = Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page;
  const initialPage = parsePage(rawPage);

  return <BlogContent posts={posts} tags={tags} initialTag={initialTag} initialPage={initialPage} />;
}
