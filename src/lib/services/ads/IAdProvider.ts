import { AdPosition, Ad } from '@/lib/types/ads';

/**
 * Interface para provedores de anúncios.
 * Segue o princípio de Inversão de Dependência (SOLID).
 */
export interface IAdProvider {
  /**
   * Retorna uma lista de anúncios para a posição especificada.
   * @param position - Identificador da posição (ex: "post:sidebar-left")
   * @returns Promise com array de anúncios disponíveis
   */
  getAds(position: AdPosition): Promise<Ad[]>;
}

