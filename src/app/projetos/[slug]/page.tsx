import { Project } from '@/lib/types';
import { projectService } from '@/lib/services/project.service';
import ProjectContent from '@/components/ProjectContent';
import PreviewBanner from '@/components/PreviewBanner';
import { Metadata } from 'next';
import { BLOG_NAME, SITE_URL } from '@/lib/config/constants';
import { notFound } from 'next/navigation';
import { isAdmin } from '@/lib/pocketbase-server';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await projectService.getProjectBySlug(slug, [], false);

  if (!project || !project.content) {
    return {
      title: 'Projeto não encontrado',
    };
  }

  const description = project.excerpt || project.content.substring(0, 160);

  return {
    title: project.title,
    description,
    alternates: {
      canonical: `${SITE_URL}/projetos/${project.slug}`,
    },
    openGraph: {
      title: project.title,
      description,
      url: `${SITE_URL}/projetos/${project.slug}`,
      siteName: BLOG_NAME,
      locale: 'pt_BR',
      type: 'article',
      images: project.coverImage ? [
        {
          url: project.coverImage,
          alt: project.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description,
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const projects = await projectService.getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const adminStatus = await isAdmin();

  const project = await projectService.getProjectBySlug(slug, [], adminStatus);

  if (!project || !project.content) {
    notFound();
  }

  const isDraft = project.status !== 'published';
  const showPreview = adminStatus && isDraft;

  return (
    <>
      {showPreview && <PreviewBanner />}
      {/* JSON-LD: CreativeWork + Breadcrumb */}
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: project.excerpt || '',
          image: project.coverImage ? [project.coverImage] : undefined,
          datePublished: project.date,
          author: {
            '@type': 'Person',
            name: 'Rafael Coelho',
            url: SITE_URL,
          },
          mainEntityOfPage: `${SITE_URL}/projetos/${project.slug}`,
        })}
      </script>
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Projetos', item: `${SITE_URL}/projetos` },
            { '@type': 'ListItem', position: 3, name: project.title, item: `${SITE_URL}/projetos/${project.slug}` },
          ],
        })}
      </script>
      <ProjectContent project={project as Project} />
    </>
  );
}
