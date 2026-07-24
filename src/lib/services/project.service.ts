import { pbListWithPreview, pbFirstByFilterWithPreview } from '@/lib/pocketbase-server';
import { Project, ProjectMeta } from '@/lib/types';
import { getCached, cacheKey, cacheListKey } from '@/lib/cache/cache.service';

// Mappers PB -> tipos locais
function mapPbToProjectMeta(rec: any): ProjectMeta {
  return {
    title: rec.title,
    slug: rec.slug,
    date: rec.date || rec.created,
    excerpt: rec.excerpt || '',
    coverImage: rec.coverImage ? fileUrl(rec, rec.coverImage) : undefined,
    tags: rec.tags || [],
    role: rec.role || undefined,
    repoUrl: rec.repoUrl || undefined,
    liveUrl: rec.liveUrl || undefined,
    featured: !!rec.featured,
    order: typeof rec.order === 'number' ? rec.order : undefined,
    status: rec.status || undefined,
  };
}

function mapPbToProject(rec: any): Project {
  return {
    ...mapPbToProjectMeta(rec),
    content: rec.content || '',
  };
}

function fileUrl(rec: any, filename: string) {
  const base = process.env.NEXT_PUBLIC_PB_URL || '';
  return `${base}/api/files/${rec.collectionId || rec.collection}/${rec.id}/${filename}`;
}

export const projectService = {
  async getAllProjects(fields: string[] = [], isPreview: boolean = false): Promise<ProjectMeta[]> {
    const cacheKeyData = `${cacheListKey('projects')}:${isPreview ? 'preview' : 'public'}`;

    return await getCached(
      cacheKeyData,
      async () => {
        const res = await pbListWithPreview('projects', {
          filter: isPreview ? undefined : "status='published'",
          sort: '-featured,order,-date',
        }, isPreview);

        return (res.items || []).map(mapPbToProjectMeta);
      },
      3600000 // 1 hora
    );
  },

  async getFeaturedProjects(limit: number = 3): Promise<ProjectMeta[]> {
    const projects = await this.getAllProjects([], false);
    const featured = projects.filter(p => p.featured);
    // Se nenhum estiver marcado como destaque, usa os mais recentes
    return (featured.length > 0 ? featured : projects).slice(0, limit);
  },

  async getProjectBySlug(slug: string, fields: string[] = [], isPreview: boolean = false): Promise<Project | null> {
    const cacheKeyData = `${cacheKey('projects', slug)}:${isPreview ? 'preview' : 'public'}`;

    return await getCached(
      cacheKeyData,
      async () => {
        const filter = isPreview
          ? `slug='${slug}'`
          : `slug='${slug}' && status='published'`;

        try {
          const rec = await pbFirstByFilterWithPreview('projects', filter, undefined, isPreview);
          return rec ? mapPbToProject(rec) : null;
        } catch (error) {
          return null;
        }
      },
      3600000 // 1 hora
    );
  },
};
