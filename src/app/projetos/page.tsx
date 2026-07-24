import type { Metadata } from 'next';
import { projectService } from '@/lib/services/project.service';
import ProjectsContent from '@/components/ProjectsContent';
import { isAdmin } from '@/lib/pocketbase-server';
import { BLOG_NAME, SITE_URL } from '@/lib/config/constants';

export const revalidate = 0; // Sempre buscar dados atualizados (pode ser invalidado via revalidatePath)

export const metadata: Metadata = {
  title: `Projetos | ${BLOG_NAME}`,
  description: 'Portfólio de projetos com especificação, arquitetura e decisões técnicas por trás de cada um.',
  alternates: { canonical: `${SITE_URL}/projetos` },
  openGraph: {
    title: `Projetos | ${BLOG_NAME}`,
    description: 'Portfólio de projetos com especificação, arquitetura e decisões técnicas por trás de cada um.',
    url: `${SITE_URL}/projetos`,
    siteName: BLOG_NAME,
    locale: 'pt_BR',
    type: 'website',
  },
};

export default async function Projects() {
  const adminStatus = await isAdmin();

  const projects = await projectService.getAllProjects([], adminStatus);
  const tags = Array.from(new Set(projects.flatMap(project => project.tags || [])));

  return <ProjectsContent projects={projects} tags={tags} />;
}
