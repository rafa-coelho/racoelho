import { FeatureFlagKey, FeatureFlag } from '@/lib/types/feature-flags';

/**
 * Interface para provedores de feature flags.
 * Segue o princípio de Inversão de Dependência (SOLID).
 * Permite trocar a implementação facilmente (JSON, PocketBase, Firebase, etc.)
 */
export interface IFeatureFlagProvider {
  /**
   * Retorna o estado de uma feature flag específica.
   * @param key - Chave da feature flag
   * @returns Promise com boolean indicando se está habilitada
   */
  isEnabled(key: FeatureFlagKey): Promise<boolean>;
  
  /**
   * Retorna todas as feature flags.
   * @returns Promise com array de todas as flags
   */
  getAllFlags(): Promise<FeatureFlag[]>;
  
  /**
   * Retorna uma feature flag específica com seus metadados.
   * @param key - Chave da feature flag
   * @returns Promise com a flag completa ou null se não encontrada
   */
  getFlag(key: FeatureFlagKey): Promise<FeatureFlag | null>;
}

