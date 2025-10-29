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
  const ebook = await getEbookBySlug(params.slug);

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

  const ebook = await getEbookBySlug(slug);

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

  // Gerar URL de download baseada no asset pack
  const { assetService } = await import('@/lib/services/asset.service');
  const assetPack = await assetService.getAssetPackBySlug(slug);
  
  let downloadUrl = '';
  if (assetPack) {
    const pdfFile = assetService.getAssetFileByType(assetPack, 'pdf');
    if (pdfFile) {
      // Usa o endpoint de download com o token e o nome do arquivo
      downloadUrl = `/api/download/${slug}?token=${token}&file=${encodeURIComponent(pdfFile)}`;
    } else if (assetPack.files && assetPack.files.length > 0) {
      // Se não tem PDF, usa o primeiro arquivo disponível
      downloadUrl = `/api/download/${slug}?token=${token}&file=${encodeURIComponent(assetPack.files[0])}`;
    }
  }

  return <DownloadClient ebook={ebook} downloadUrl={downloadUrl} />;
} 