import { ContentItem } from '@/lib/api';
import { contentService } from '@/lib/services/content.service';
import BlogPostContent from '@/components/BlogPostContent';
import PreviewBanner from '@/components/PreviewBanner';
import { Metadata } from 'next';
import { BLOG_NAME } from '@/lib/config/constants';
import { SITE_URL } from '@/lib/config/constants';
import { notFound } from 'next/navigation';
import { isAdmin } from '@/lib/pocketbase-server';

// Permitir rotas dinâmicas não pré-geradas (necessário para posts em rascunho)
export const dynamicParams = true;
export const revalidate = 0; // Sempre buscar dados atualizados (pode ser invalidado via revalidatePath)

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  // Verificar se é admin para incluir posts em rascunho nos metadados
  const adminStatus = await isAdmin();
  const post = await contentService.getPostBySlug(slug, [], adminStatus);
  
  if (!post || !post.content) {
    return {
      title: 'Post não encontrado',
    };
  }

  const description = post.excerpt || post.content.substring(0, 160);

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `${SITE_URL}/posts/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      url: `${SITE_URL}/posts/${post.slug}`,
      siteName: BLOG_NAME,
      locale: 'pt_BR',
      type: 'article',
      images: post.coverImage ? [
        {
          url: post.coverImage,
          alt: post.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const posts = await contentService.getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const adminStatus = await isAdmin();
  
  const post = await contentService.getPostBySlug(slug, [
    'title',
    'date',
    'content',
    'coverImage',
    'tags',
    'excerpt',
    'slug',
    'status'
  ], adminStatus);
  
  if (!post) {
    notFound();
  }
  
  // Para posts em rascunho, permitir mesmo sem conteúdo (pode estar sendo editado)
  // Para posts publicados, exigir conteúdo
  if (post.status === 'published' && !post.content) {
    notFound();
  }

  const isDraft = post.status !== 'published';
  const showPreview = adminStatus && isDraft;

  return (
    <>
      {showPreview && <PreviewBanner />}
      {/* JSON-LD: BlogPosting + Breadcrumb */}
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          image: post.coverImage ? [post.coverImage] : undefined,
          datePublished: post.date,
          dateModified: post.date,
          author: { '@type': 'Person', name: BLOG_NAME },
          mainEntityOfPage: `${SITE_URL}/posts/${post.slug}`,
        })}
      </script>
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Posts', item: `${SITE_URL}/posts` },
            { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/posts/${post.slug}` },
          ],
        })}
      </script>
      <BlogPostContent post={post as ContentItem} />
    </>
  );
}
