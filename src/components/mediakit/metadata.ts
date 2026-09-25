import type { Metadata } from 'next';
import type { MediaKit } from '@/lib/types';
import { BLOG_NAME, SITE_URL } from '@/lib/config/constants';

// Metadata do media kit: noindex até o primeiro reviewed:true; OG com o headline.
export function mediaKitMetadata(kit: MediaKit | null, forceNoIndex = false): Metadata {
  if (!kit) return { title: 'Media kit', robots: { index: false, follow: false } };

  const title = `Media kit | ${BLOG_NAME}`;
  const description = kit.summary || kit.headline;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/mediakit` },
    robots: kit.reviewed && !forceNoIndex ? undefined : { index: false, follow: false },
    openGraph: {
      title: kit.headline || title,
      description,
      url: `${SITE_URL}/mediakit`,
      siteName: BLOG_NAME,
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: kit.headline || title,
      description,
    },
  };
}
