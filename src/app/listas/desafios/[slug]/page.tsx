import { ContentItem } from '@/lib/api';
import { challengeService } from '@/lib/services/challenge.service';
import ChallengeContent from '@/components/ChallengeContent';
import PreviewBanner from '@/components/PreviewBanner';
import { Metadata } from 'next';
import { BLOG_NAME } from '@/lib/config/constants';
import { SITE_URL } from '@/lib/config/constants';
import { notFound } from 'next/navigation';
import { isAdmin } from '@/lib/pocketbase-server';

interface ChallengePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ChallengePageProps): Promise<Metadata> {
  const { slug } = await params;
  const challenge = await challengeService.getChallengeBySlug(slug, [], false);
  
  if (!challenge || !challenge.content) {
    return {
      title: 'Desafio não encontrado',
    };
  }

  const description = challenge.excerpt || challenge.content.substring(0, 160);

  return {
    title: challenge.title,
    description,
    alternates: {
      canonical: `${SITE_URL}/listas/desafios/${challenge.slug}`,
    },
    openGraph: {
      title: challenge.title,
      description,
      url: `${SITE_URL}/listas/desafios/${challenge.slug}`,
      siteName: BLOG_NAME,
      locale: 'pt_BR',
      type: 'article',
      images: challenge.coverImage ? [
        {
          url: challenge.coverImage,
          alt: challenge.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: challenge.title,
      description,
      images: challenge.coverImage ? [challenge.coverImage] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const challenges = await challengeService.getAllChallenges();
  return challenges.map((challenge) => ({
    slug: challenge.slug,
  }));
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { slug } = await params;
  const adminStatus = await isAdmin();
  
  const challenge = await challengeService.getChallengeBySlug(slug, [
    'title',
    'date',
    'content',
    'coverImage',
    'tags',
    'excerpt',
    'slug',
    'status'
  ], adminStatus);
  
  if (!challenge || !challenge.content) {
    notFound();
  }

  const isDraft = challenge.status !== 'published';
  const showPreview = adminStatus && isDraft;

  return (
    <>
      {showPreview && <PreviewBanner />}
      {/* JSON-LD: CreativeWork + Breadcrumb */}
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: challenge.title,
          description: challenge.excerpt || '',
          image: challenge.coverImage ? [challenge.coverImage] : undefined,
          datePublished: challenge.date,
          mainEntityOfPage: `${SITE_URL}/listas/desafios/${challenge.slug}`,
        })}
      </script>
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Desafios', item: `${SITE_URL}/listas/desafios` },
            { '@type': 'ListItem', position: 3, name: challenge.title, item: `${SITE_URL}/listas/desafios/${challenge.slug}` },
          ],
        })}
      </script>
      <ChallengeContent challenge={challenge as ContentItem} />
    </>
  );
}
