/**
 * Types e interfaces para sistema de feature flags
 */

export type FeatureFlagKey = 
  | 'share'
  | 'newsletter'
  | 'ads'
  | 'comments'
  | 'analytics';

export interface FeatureFlag {
  key: FeatureFlagKey;
  enabled: boolean;
  description?: string;
  metadata?: Record<string, any>;
}

export interface FeatureFlagsConfig {
  flags: FeatureFlag[];
}

export interface IFeatureFlagProvider {
  /**
   * Retorna o estado de uma feature flag específica
   */
  isEnabled(key: FeatureFlagKey): Promise<boolean>;
  
  /**
   * Retorna todas as feature flags
   */
  getAllFlags(): Promise<FeatureFlag[]>;
  
  /**
   * Retorna uma feature flag específica com seus metadados
   */
  getFlag(key: FeatureFlagKey): Promise<FeatureFlag | null>;
}

