import { IFeatureFlagProvider } from './IFeatureFlagProvider';
import { JsonFeatureFlagProvider } from './JsonFeatureFlagProvider';
import { FeatureFlagKey, FeatureFlag } from '@/lib/types/feature-flags';

/**
 * Serviço principal de gerenciamento de feature flags.
 * Implementa cache em memória para melhor performance.
 * Segue princípios SOLID - Open/Closed e Dependency Inversion.
 */
export class FeatureFlagService {
  private static instance: FeatureFlagService;
  private provider: IFeatureFlagProvider;
  private cache: Map<FeatureFlagKey, boolean>;
  private cacheExpiry: number;
  private lastCacheUpdate: number;

  private constructor(provider?: IFeatureFlagProvider, cacheExpiryMs: number = 60000) {
    this.provider = provider || new JsonFeatureFlagProvider();
    this.cache = new Map();
    this.cacheExpiry = cacheExpiryMs;
    this.lastCacheUpdate = 0;
  }

  /**
   * Singleton pattern para garantir única instância do serviço.
   */
  public static getInstance(provider?: IFeatureFlagProvider): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService(provider);
    }
    return FeatureFlagService.instance;
  }

  /**
   * Define um novo provider (útil para testes ou troca de implementação).
   */
  public setProvider(provider: IFeatureFlagProvider): void {
    this.provider = provider;
    this.clearCache();
  }

  /**
   * Verifica se uma feature está habilitada (com cache).
   */
  async isEnabled(key: FeatureFlagKey): Promise<boolean> {
    // Verifica se o cache expirou
    const now = Date.now();
    if (now - this.lastCacheUpdate > this.cacheExpiry) {
      this.clearCache();
    }

    // Tenta buscar do cache
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    // Busca do provider e armazena em cache
    try {
      const enabled = await this.provider.isEnabled(key);
      this.cache.set(key, enabled);
      this.lastCacheUpdate = now;
      return enabled;
    } catch (error) {
      console.error(`[FeatureFlagService] Error checking flag "${key}":`, error);
      return false; // Padrão: desabilitado em caso de erro
    }
  }

  /**
   * Retorna todas as flags.
   */
  async getAllFlags(): Promise<FeatureFlag[]> {
    try {
      return await this.provider.getAllFlags();
    } catch (error) {
      console.error('[FeatureFlagService] Error getting all flags:', error);
      return [];
    }
  }

  /**
   * Retorna uma flag específica com metadados.
   */
  async getFlag(key: FeatureFlagKey): Promise<FeatureFlag | null> {
    try {
      return await this.provider.getFlag(key);
    } catch (error) {
      console.error(`[FeatureFlagService] Error getting flag "${key}":`, error);
      return null;
    }
  }

  /**
   * Limpa o cache de feature flags.
   */
  public clearCache(): void {
    this.cache.clear();
    this.lastCacheUpdate = 0;
  }

  /**
   * Força atualização de uma flag específica no cache.
   */
  async refreshFlag(key: FeatureFlagKey): Promise<boolean> {
    try {
      const enabled = await this.provider.isEnabled(key);
      this.cache.set(key, enabled);
      return enabled;
    } catch (error) {
      console.error(`[FeatureFlagService] Error refreshing flag "${key}":`, error);
      return false;
    }
  }

  /**
   * Retorna o estado do cache (útil para debug).
   */
  public getCacheStatus(): {
    size: number;
    lastUpdate: number;
    expiresIn: number;
    flags: Record<string, boolean>;
  } {
    const flags: Record<string, boolean> = {};
    this.cache.forEach((value, key) => {
      flags[key] = value;
    });

    const now = Date.now();
    const expiresIn = Math.max(0, this.cacheExpiry - (now - this.lastCacheUpdate));

    return {
      size: this.cache.size,
      lastUpdate: this.lastCacheUpdate,
      expiresIn,
      flags
    };
  }
}

// Export singleton instance
export const featureFlagService = FeatureFlagService.getInstance();

