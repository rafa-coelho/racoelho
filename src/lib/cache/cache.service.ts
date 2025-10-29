import { ICacheService } from './ICacheService';
import { MemoryCache } from './MemoryCache';

/**
 * Serviço de cache centralizado
 * Singleton que gerencia instância única do cache
 * Pode ser facilmente substituído para Redis no futuro
 */
export class CacheService {
  private static instance: ICacheService;

  /**
   * Retorna instância do cache
   * Por padrão usa MemoryCache, mas pode ser configurado para Redis
   */
  static getInstance(): ICacheService {
    if (!CacheService.instance) {
      // Por enquanto usa MemoryCache
      // No futuro pode ler de env: CACHE_TYPE=redis
      CacheService.instance = new MemoryCache();
    }

    return CacheService.instance;
  }

  /**
   * Substitui a instância do cache
   * Útil para testes ou troca de implementação
   */
  static setInstance(instance: ICacheService): void {
    CacheService.instance = instance;
  }

  /**
   * Limpa cache e reseta instância
   */
  static reset(): void {
    if (CacheService.instance) {
      CacheService.instance.clear();
    }
    CacheService.instance = new MemoryCache();
  }
}

/**
 * Funções helper para facilitar uso do cache
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cache = CacheService.getInstance();
  
  // Tentar buscar do cache
  const cached = await cache.get<T>(key);
  
  if (cached !== null) {
    return cached;
  }

  // Se não estiver em cache, buscar dados
  const data = await fetcher();
  
  // Armazenar em cache
  await cache.set(key, data, ttl);

  return data;
}

/**
 * Limpa cache de uma coleção específica
 */
export async function invalidateCollection(collection: string): Promise<void> {
  const cache = CacheService.getInstance();
  await cache.invalidate(`pb:${collection}:*`);
}

/**
 * Gera chave de cache para um item específico
 */
export function cacheKey(collection: string, identifier: string | number): string {
  return `pb:${collection}:${identifier}`;
}

/**
 * Gera chave de cache para lista de uma coleção
 */
export function cacheListKey(collection: string): string {
  return `pb:${collection}:list`;
}

/**
 * Gera chave de cache para busca por filtro
 */
export function cacheFilterKey(collection: string, filter: string): string {
  // Hash do filtro para criar chave válida
  const hash = filter.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `pb:${collection}:filter:${hash}`;
}

// Export singleton instance
export const cacheService = CacheService.getInstance();

