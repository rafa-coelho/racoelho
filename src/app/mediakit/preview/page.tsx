import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { mediakitService } from '@/lib/services/mediakit.service';
import { featureFlagService } from '@/lib/services/feature-flag.service';
import { isAdmin } from '@/lib/pocketbase-server';
import MediaKitContent from '@/components/mediakit/MediaKitContent';
import PreviewBanner from '@/components/PreviewBanner';
import { mediaKitMetadata } from '@/components/mediakit/metadata';

// Preview do admin (/mediakit?preview=1 redireciona pra cá): sempre dinâmico.
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  // nunca indexar o preview
  return mediaKitMetadata(await mediakitService.get(), true);
}

export default async function MediaKitPreviewPage() {
  if (!(await featureFlagService.isEnabled('mediakit'))) notFound();

  const kit = await mediakitService.get();
  if (!kit) notFound();

  // Sem sessão de admin, volta para a versão pública
  if (!(await isAdmin())) redirect('/mediakit');

  return (
    <>
      <PreviewBanner />
      <MediaKitContent kit={kit} preview />
    </>
  );
}
