import { IAdProvider } from './IAdProvider';
import { AdPosition, Ad } from '@/lib/types/ads';
import { ADS_CLIENT_ID, ADS_AD_SLOT } from '@/lib/config/constants';

/**
 * Provedor de anúncios do Google Ads.
 * Retorna array vazio pois Google Ads são renderizados via script.
 * Implementa IAdProvider seguindo SOLID.
 */
export class GoogleAdProvider implements IAdProvider {
  private clientId: string | undefined;
  private defaultAdSlot: string | undefined;

  constructor() {
    this.clientId = ADS_CLIENT_ID;
    this.defaultAdSlot = ADS_AD_SLOT;
  }

  /**
   * Retorna array vazio pois Google Ads não são armazenados localmente.
   * O AdService usa este provider como indicador para usar Google Ads.
   */
  async getAds(position: AdPosition): Promise<Ad[]> {
    return [];
  }

  /**
   * Retorna o client ID do Google Ads.
   */
  getClientId(): string | undefined {
    return this.clientId;
  }

  /**
   * Retorna o Ad Slot padrão do Google Ads.
   */
  getDefaultAdSlot(): string | undefined {
    return this.defaultAdSlot;
  }

  /**
   * Verifica se Google Ads está configurado.
   */
  isConfigured(): boolean {
    return !!(this.clientId && this.defaultAdSlot);
  }
}

