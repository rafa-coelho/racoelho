import { pbListWithPreview, pbFirstByFilterWithPreview } from '@/lib/pocketbase-server';
import { SalesPage } from '@/lib/api';
import { getCached, cacheKey, cacheListKey } from '@/lib/cache/cache.service';

// Mapper PB -> SalesPage
function mapPbToSalesPage(rec: any): SalesPage {
  return {
    title: rec.title,
    slug: rec.slug,
    blocks: rec.blocks || [],
    ctaText: rec.ctaText || '',
    ctaUrl: rec.ctaUrl || '',
    paymentUrl: rec.paymentUrl || '',
    status: rec.status || 'draft',
  };
}

export const salesService = {
  async getSalesPageBySlug(slug: string, isPreview: boolean = false): Promise<SalesPage | null> {
    // Usar chave de cache diferente para preview (não cachear previews)
    const cacheKeyData = isPreview 
      ? cacheKey('sales_pages', `${slug}:preview`)
      : cacheKey('sales_pages', slug);

    return await getCached(
      cacheKeyData,
      async () => {
        // Quando é preview, busca sem filtro de status para pegar drafts também
        const filter = isPreview
          ? `slug='${slug}'`
          : `slug='${slug}' && status='published'`;

        try {
          const rec = await pbFirstByFilterWithPreview('sales_pages', filter, undefined, isPreview);
          return rec ? mapPbToSalesPage(rec) : null;
        } catch (error) {
          console.error('[SalesService] Error fetching sales page:', error);
          return null;
        }
      },
      isPreview ? 0 : 3600000 // Preview sem cache, publicado com cache de 1 hora
    );
  },

  async getAllSalesPages(isPreview: boolean = false): Promise<SalesPage[]> {
    // Usar chave de cache diferente para preview
    const cacheKeyData = isPreview 
      ? `sales_pages:list:preview`
      : cacheListKey('sales_pages');

    return await getCached(
      cacheKeyData,
      async () => {
        const res = await pbListWithPreview('sales_pages', {
        }, isPreview);

        // Filtrar apenas se não for preview
        const items = (res.items || []).filter((rec: any) => {
          if (isPreview) return true; // Preview mostra tudo
          // Aceita published=true ou status='published'
          if (typeof rec.published === 'boolean') return rec.published === true;
          if (typeof rec.status === 'string') return rec.status === 'published';
          return false; // Se não houver campos de status, não mostrar
        });

        return items.map(mapPbToSalesPage);
      },
      isPreview ? 0 : 3600000 // Preview sem cache
    );
  },

  async getSalesPageSlugs(): Promise<string[]> {
    const pages = await this.getAllSalesPages();
    return pages.map(page => page.slug);
  },
};

