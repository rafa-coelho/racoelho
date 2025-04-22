import { getChallengeBySlug, getAllChallenges, ContentItem } from '@/lib/api';
import ChallengeContent from '@/components/ChallengeContent';
import { Metadata } from 'next';
import { BLOG_NAME } from '@/lib/config/constants';
import { SITE_URL } from '@/lib/config/constants';
import { notFound } from 'next/navigation';

interface ChallengePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ChallengePageProps): Promise<Metadata> {
  const challenge = await getChallengeBySlug(params.slug);
  
  if (!challenge || !challenge.content) {
    return {
      title: 'Desafio não encontrado',
    };
  }

  const description = challenge.excerpt || challenge.content.substring(0, 160);

  return {
    title: challenge.title,
    description,
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
  const challenges = await getAllChallenges();
  return challenges.map((challenge) => ({
    slug: challenge.slug,
  }));
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const challenge = await getChallengeBySlug(params.slug, [
    'title',
    'date',
    'content',
    'coverImage',
    'tags',
    'excerpt',
    'slug'
  ]);
  
  if (!challenge || !challenge.content) {
    notFound();
  }

  return <ChallengeContent challenge={challenge as ContentItem} />;
}
