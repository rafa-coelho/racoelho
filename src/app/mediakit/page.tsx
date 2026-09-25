import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mediakitService } from '@/lib/services/mediakit.service';
import { featureFlagService } from '@/lib/services/feature-flag.service';
import MediaKitContent from '@/components/mediakit/MediaKitContent';
import { PreviewRedirect } from '@/components/mediakit/PreviewRedirect';
import { mediaKitMetadata } from '@/components/mediakit/metadata';

// ISR: 1h. Sem cookies/searchParams aqui para a página continuar estática;
// o preview do admin fica em /mediakit/preview.
export const revalidate = 3600;

async function loadKit() {
  if (!(await featureFlagService.isEnabled('mediakit'))) return null;
  return mediakitService.get();
}

export async function generateMetadata(): Promise<Metadata> {
  return mediaKitMetadata(await loadKit());
}

export default async function MediaKitPage() {
  const kit = await loadKit();
  if (!kit) notFound();

  return (
    <>
      <PreviewRedirect />
      <MediaKitContent kit={kit} />
    </>
  );
}
