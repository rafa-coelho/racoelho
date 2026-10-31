import type { Metadata } from 'next';
import { projectService } from '@/lib/services/project.service';
import ProjectsContent from '@/components/ProjectsContent';
import { isAdmin } from '@/lib/pocketbase-server';
import { BLOG_NAME, SITE_URL } from '@/lib/config/constants';

export const revalidate = 0; // Sempre buscar dados atualizados (pode ser invalidado via revalidatePath)

export const metadata: Metadata = {
  title: 'Produtos e projetos',
  description: 'Apps que você pode testar agora e o portfólio técnico por trás deles, com arquitetura e decisões de cada projeto.',
  alternates: { canonical: `${SITE_URL}/projetos` },
  openGraph: {
    title: `Produtos e projetos | ${BLOG_NAME}`,
    description: 'Apps que você pode testar agora e o portfólio técnico por trás deles, com arquitetura e decisões de cada projeto.',
    url: `${SITE_URL}/projetos`,
    siteName: BLOG_NAME,
    locale: 'pt_BR',
    type: 'website',
  },
};

export default async function Projects({ searchParams }: { searchParams?: { tipo?: string | string[] } }) {
  const adminStatus = await isAdmin();

  const projects = await projectService.getAllProjects([], adminStatus);
  const tags = Array.from(new Set(projects.flatMap(project => project.tags || [])));

  const tipo = typeof searchParams?.tipo === 'string' ? searchParams.tipo : undefined;

  return <ProjectsContent projects={projects} tags={tags} initialKind={tipo} />;
}
