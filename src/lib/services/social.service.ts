import { pbListWithPreview } from '@/lib/pocketbase-server';
import { SocialLink } from '@/lib/api';
import { getCached, cacheListKey } from '@/lib/cache/cache.service';

// Mapper PB -> SocialLink
function mapPbToSocialLink(rec: any): SocialLink {
  return {
    name: rec.name,
    url: rec.url,
    icon: rec.icon || '',
  };
}

export const socialService = {
  async getSocialLinks(): Promise<SocialLink[]> {
    // Buscar com cache
    const cacheKeyData = cacheListKey('social_links');

    return await getCached(
      cacheKeyData,
      async () => {
        const res = await pbListWithPreview('social_links', {
          sort: 'order',
          perPage: 50, // Social links geralmente são poucos
        });

        return (res.items || []).map(mapPbToSocialLink);
      },
      86400000 // 24 horas (social links mudam raramente)
    );
  },
};

