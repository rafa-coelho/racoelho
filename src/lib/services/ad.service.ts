import { pbList } from '@/lib/pocketbase';
import { AdPosition, AdConfig, Ad } from '@/lib/types/ads';
import { getCached } from '@/lib/cache/cache.service';
import { analyticsService } from './analytics.service';
import { ADS_CLIENT_ID, ADS_AD_SLOT } from '@/lib/config/constants';

// Mapper PB -> Ad
function mapPbToAd(rec: any): Ad {
  const base = process.env.NEXT_PUBLIC_PB_URL || '';
  const imageUrl = rec.image ? `${base}/api/files/${rec.collectionId || rec.collection}/${rec.id}/${rec.image}` : '';
  
  return {
    id: rec.id,
    position: rec.position as AdPosition,
    image: imageUrl,
    link: rec.link,
    title: rec.title,
    altText: rec.altText || rec.title,
    trackingLabel: rec.trackingLabel,
  };
}

function getGoogleAdSlot(): string | undefined {
  return ADS_AD_SLOT;
}

function isGoogleAdsConfigured(): boolean {
  return !!(ADS_CLIENT_ID && ADS_AD_SLOT);
}

export const adService = {
  /**
   * Retorna configuração de anúncio para uma posição específica.
   * Implementa lógica de priorização:
   * - Busca ads custom do PocketBase para a posição
   * - Se houver ads custom e aleatoriamente escolhido: usa custom (70% de chance)
   * - Caso contrário: usa Google Ads
   */
  async getAdConfig(position: AdPosition, customAdsPriority: number = 0.7): Promise<AdConfig> {
    try {
      // Buscar ads custom do PocketBase para esta posição
      const customAds = await this.getCustomAds(position);

      // Se houver ads custom e random < priority, usar custom
      if (customAds.length > 0 && Math.random() < customAdsPriority) {
        const selectedAd = this.selectRandomAd(customAds);
        
        // Tracking
        this.trackAdImpression(selectedAd, 'custom', position);
        
        return {
          type: 'custom',
          data: selectedAd
        };
      }

      // Fallback para Google Ads
      const googleAdSlot = getGoogleAdSlot();
      
      // Tracking
      this.trackAdImpression(null, 'google', position);
      
      return {
        type: 'google',
        googleAdSlot
      };
    } catch (error) {
      console.error('[AdService] Error getting ad config:', error);
      
      // Em caso de erro, retorna Google Ads
      return {
        type: 'google',
        googleAdSlot: getGoogleAdSlot()
      };
    }
  },

  /**
   * Busca ads custom do PocketBase para uma posição específica.
   */
  async getCustomAds(position: AdPosition): Promise<Ad[]> {
    const cacheKeyData = `ads:position:${position}`;

    return await getCached(
      cacheKeyData,
      async () => {
        try {
          const res = await pbList('ads', {
            filter: `position='${position}' && enabled=true`,
            sort: 'created',
            perPage: 50,
          });

          return (res.items || []).map(mapPbToAd);
        } catch (error) {
          console.error('[AdService] Error fetching custom ads:', error);
          return [];
        }
      },
      3600000 // 1 hora
    );
  },

  /**
   * Busca todos os ads custom (útil para admin).
   */
  async getAllCustomAds(): Promise<Ad[]> {
    const cacheKeyData = 'ads:all';

    return await getCached(
      cacheKeyData,
      async () => {
        try {
          const res = await pbList('ads', {
            sort: '-created',
            perPage: 100,
          });

          return (res.items || []).map(mapPbToAd);
        } catch (error) {
          console.error('[AdService] Error fetching all ads:', error);
          return [];
        }
      },
      3600000 // 1 hora
    );
  },

  /**
   * Seleciona um anúncio aleatório de uma lista.
   */
  selectRandomAd(ads: Ad[]): Ad {
    const randomIndex = Math.floor(Math.random() * ads.length);
    return ads[randomIndex];
  },

  /**
   * Registra impressão de anúncio no Analytics.
   */
  trackAdImpression(ad: Ad | null, type: 'custom' | 'google', position?: AdPosition): void {
    try {
      if (type === 'custom' && ad) {
        analyticsService.event(
          'ad_impression',
          'ads',
          ad.trackingLabel || ad.id
        );
      } else if (type === 'google' && position) {
        analyticsService.event(
          'ad_impression',
          'ads',
          `google_ads_${position}`
        );
      }
    } catch (error) {
      console.error('[AdService] Error tracking ad impression:', error);
    }
  },

  /**
   * Registra clique em anúncio no Analytics.
   */
  trackAdClick(ad: Ad): void {
    try {
      analyticsService.event(
        'ad_click',
        'ads',
        ad.trackingLabel || ad.id
      );
    } catch (error) {
      console.error('[AdService] Error tracking ad click:', error);
    }
  },

  /**
   * Retorna informações de debug sobre o serviço.
   */
  async getDebugInfo(): Promise<{
    customAdsCount: number;
    googleAdsConfigured: boolean;
    googleAdSlot?: string;
  }> {
    const allAds = await this.getAllCustomAds();
    
    return {
      customAdsCount: allAds.length,
      googleAdsConfigured: isGoogleAdsConfigured(),
      googleAdSlot: getGoogleAdSlot()
    };
  },
};

