import { IAdProvider } from './IAdProvider';
import { JsonAdProvider } from './JsonAdProvider';
import { GoogleAdProvider } from './GoogleAdProvider';
import { AdPosition, AdConfig, Ad } from '@/lib/types/ads';
import { analyticsService } from '../analytics.service';

/**
 * Serviço principal de gerenciamento de anúncios.
 * Implementa lógica de priorização entre ads mockados e Google Ads.
 * Segue princípios SOLID - Open/Closed e Dependency Inversion.
 */
export class AdService {
  private static instance: AdService;
  private providers: IAdProvider[];
  private jsonProvider: JsonAdProvider;
  private googleProvider: GoogleAdProvider;
  private mockPriority: number;

  private constructor(mockPriority: number = 0.7) {
    this.jsonProvider = new JsonAdProvider();
    this.googleProvider = new GoogleAdProvider();
    this.providers = [this.jsonProvider, this.googleProvider];
    this.mockPriority = mockPriority;
  }

  /**
   * Singleton pattern para garantir única instância do serviço.
   */
  public static getInstance(mockPriority?: number): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService(mockPriority);
    }
    return AdService.instance;
  }

  /**
   * Adiciona um novo provider ao serviço.
   * Permite extensão sem modificar o código existente (Open/Closed Principle).
   */
  public addProvider(provider: IAdProvider): void {
    this.providers.push(provider);
  }

  /**
   * Retorna configuração de anúncio para uma posição específica.
   * Implementa lógica de priorização:
   * - Se houver ads mockados: 70% chance mockado, 30% Google Ads
   * - Se não houver mockados: 100% Google Ads
   * - Se múltiplos mockados: escolhe aleatoriamente
   */
  async getAdConfig(position: AdPosition): Promise<AdConfig> {
    try {
      // Busca ads mockados para a posição
      const mockAds = await this.jsonProvider.getAds(position);

      // Se houver ads mockados disponíveis
      if (mockAds.length > 0) {
        const random = Math.random();
        
        // mockPriority% de chance de usar ad mockado
        if (random < this.mockPriority) {
          // Se múltiplos ads, escolhe aleatoriamente
          const selectedAd = this.selectRandomAd(mockAds);
          
          // Tracking
          this.trackAdImpression(selectedAd, 'custom');
          
          return {
            type: 'custom',
            data: selectedAd
          };
        }
      }

      // Fallback para Google Ads
      const googleAdSlot = this.googleProvider.getDefaultAdSlot();
      
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
        googleAdSlot: this.googleProvider.getDefaultAdSlot()
      };
    }
  }

  /**
   * Seleciona um anúncio aleatório de uma lista.
   */
  private selectRandomAd(ads: Ad[]): Ad {
    const randomIndex = Math.floor(Math.random() * ads.length);
    return ads[randomIndex];
  }

  /**
   * Registra impressão de anúncio no Analytics.
   */
  private trackAdImpression(ad: Ad | null, type: 'custom' | 'google', position?: AdPosition): void {
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
  }

  /**
   * Registra clique em anúncio no Analytics.
   */
  public trackAdClick(ad: Ad): void {
    try {
      analyticsService.event(
        'ad_click',
        'ads',
        ad.trackingLabel || ad.id
      );
    } catch (error) {
      console.error('[AdService] Error tracking ad click:', error);
    }
  }

  /**
   * Retorna informações de debug sobre o serviço.
   */
  public async getDebugInfo(): Promise<{
    providersCount: number;
    mockAdsCount: number;
    googleAdsConfigured: boolean;
    mockPriority: number;
  }> {
    const allMockAds = await this.jsonProvider.getAllAds();
    
    return {
      providersCount: this.providers.length,
      mockAdsCount: allMockAds.length,
      googleAdsConfigured: this.googleProvider.isConfigured(),
      mockPriority: this.mockPriority
    };
  }
}

// Export singleton instance
export const adService = AdService.getInstance();

