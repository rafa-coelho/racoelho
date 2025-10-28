import { IFeatureFlagProvider } from './IFeatureFlagProvider';
import { FeatureFlagKey, FeatureFlag } from '@/lib/types/feature-flags';
import featureFlagsData from '@/../content/feature-flags.json';

/**
 * Provedor de feature flags a partir de arquivo JSON.
 * Implementa IFeatureFlagProvider seguindo SOLID.
 * Pode ser facilmente substituído por PocketBase, Firebase, ou outra solução.
 */
export class JsonFeatureFlagProvider implements IFeatureFlagProvider {
  private flags: FeatureFlag[];

  constructor() {
    this.flags = featureFlagsData.flags as FeatureFlag[];
  }

  /**
   * Verifica se uma feature flag está habilitada.
   */
  async isEnabled(key: FeatureFlagKey): Promise<boolean> {
    const flag = this.flags.find(f => f.key === key);
    return flag?.enabled ?? false;
  }

  /**
   * Retorna todas as feature flags.
   */
  async getAllFlags(): Promise<FeatureFlag[]> {
    return [...this.flags];
  }

  /**
   * Retorna uma feature flag específica.
   */
  async getFlag(key: FeatureFlagKey): Promise<FeatureFlag | null> {
    const flag = this.flags.find(f => f.key === key);
    return flag ? { ...flag } : null;
  }

  /**
   * Método helper para debug - lista todas as flags com seus estados.
   */
  async debugFlags(): Promise<Record<string, boolean>> {
    const debug: Record<string, boolean> = {};
    for (const flag of this.flags) {
      debug[flag.key] = flag.enabled;
    }
    return debug;
  }
}

