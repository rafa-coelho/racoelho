import type { Metadata } from 'next';
import HireContent from '@/components/HireContent';
import { BLOG_NAME, SITE_URL } from '@/lib/config/constants';
import { projectService } from '@/lib/services/project.service';

const description = 'Sistemas sob medida, SaaS, integrações e apps para Windows. Me conta o que você precisa.';

export const metadata: Metadata = {
  title: 'Trabalhe comigo',
  description,
  alternates: { canonical: `${SITE_URL}/trabalhe-comigo` },
  openGraph: {
    title: `Trabalhe comigo | ${BLOG_NAME}`,
    description,
    url: `${SITE_URL}/trabalhe-comigo`,
    siteName: BLOG_NAME,
    locale: 'pt_BR',
    type: 'website',
  },
};

export default async function HirePage() {
  const projects = await projectService.getAllProjects([], false);
  // Trabalho para cliente primeiro; depois os produtos no ar.
  const proof = [
    ...projects.filter((p) => p.kind === 'cliente'),
    ...projects.filter((p) => p.kind !== 'cliente' && p.liveUrl && p.stage === 'live' && (p.kind === 'saas' || p.kind === 'app')),
  ].slice(0, 6);

  return <HireContent projects={proof} />;
}
