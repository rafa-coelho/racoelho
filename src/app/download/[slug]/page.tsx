import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEbookBySlug } from '@/lib/services/ebook.service';
import { validateEbookToken } from '@/lib/services/data.service';
import DownloadClient from '@/components/DownloadClient';

interface DownloadPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    token?: string;
  };
}

export async function generateMetadata({
  params,
}: DownloadPageProps): Promise<Metadata> {
  const ebook = getEbookBySlug(params.slug);

  if (!ebook) {
    return {
      title: 'Ebook não encontrado',
      description: 'O ebook que você está procurando não existe ou o link está inválido.',
    };
  }

  return {
    title: `Download: ${ebook.title}`,
    description: ebook.description,
  };
}

export default async function DownloadPage({
  params,
  searchParams,
}: DownloadPageProps) {
  const { slug } = params;
  const { token } = searchParams;

  if (!token) {
    notFound();
  }

  const ebook = getEbookBySlug(slug);

  if (!ebook) {
    notFound();
  }

  const isValid = await validateEbookToken({
    token,
    slug,
  });

  if (!isValid) {
    notFound();
  }

  const downloadUrl = `/assets/ebooks/${ebook.slug}/${ebook.slug}.pdf`;

  return <DownloadClient ebook={ebook} downloadUrl={downloadUrl} />;
} 