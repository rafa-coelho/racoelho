import { IAdProvider } from './IAdProvider';
import { AdPosition, Ad } from '@/lib/types/ads';
import adsData from '@/../content/ads.json';

/**
 * Provedor de anúncios mockados a partir de arquivo JSON.
 * Implementa IAdProvider seguindo SOLID.
 */
export class JsonAdProvider implements IAdProvider {
  private ads: Ad[];

  constructor() {
    this.ads = adsData.ads as Ad[];
  }

  /**
   * Retorna anúncios mockados filtrados por posição.
   * @param position - Posição do anúncio (ex: "post:sidebar-left")
   * @returns Promise com array de anúncios para essa posição
   */
  async getAds(position: AdPosition): Promise<Ad[]> {
    return this.ads.filter(ad => ad.position === position);
  }

  /**
   * Retorna todos os anúncios disponíveis.
   * Útil para debug e testes.
   */
  async getAllAds(): Promise<Ad[]> {
    return [...this.ads];
  }
}

