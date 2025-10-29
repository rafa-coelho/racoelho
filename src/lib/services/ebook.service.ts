import type { Ebook } from '@/lib/types';
import { assetService } from './asset.service';

export async function getEbookBySlug(slug: string): Promise<Ebook | null> {
  const assetPack = await assetService.getAssetPackBySlug(slug);
  if (!assetPack) {
    return null;
  }

  // Filtrar apenas assets do tipo ebook se houver metadata
  if (assetPack.metadata?.type && assetPack.metadata.type !== 'ebook') {
    return null;
  }

  // Buscar banner (prioridade: png, svg, qualquer imagem)
  const bannerUrl = assetService.getAssetFileUrlByType(assetPack, 'png') ||
                    assetService.getAssetFileUrlByType(assetPack, 'svg') ||
                    assetService.getAssetFileUrlByType(assetPack, 'jpg');

  // Buscar PDF para download
  const pdfFile = assetService.getAssetFileByType(assetPack, 'pdf');
  const downloadUrl = pdfFile || '';

  return {
    slug: assetPack.slug,
    title: assetPack.title,
    description: assetPack.description || '',
    coverImage: bannerUrl || '',
    downloadUrl,
  };
}


