import { ICacheService } from './ICacheService';

interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

/**
 * Implementação de cache em memória
 * Usa Map para armazenar dados em memória com suporte a TTL
 */
export class MemoryCache implements ICacheService {
  private cache: Map<string, CacheItem<any>>;
  private defaultTTL: number;

  constructor(defaultTTL: number = 3600000) { // 1 hora padrão
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * Busca um valor do cache
   */
  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Verificar expiração
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  /**
   * Armazena um valor no cache
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    
    this.cache.set(key, {
      value,
      expiresAt,
    });
  }

  /**
   * Remove um item específico do cache
   */
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  /**
   * Remove todos os itens que correspondem ao padrão
   * Suporta wildcards: * para qualquer string
   */
  async invalidate(pattern: string): Promise<void> {
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*') + '$'
    );

    const keysToDelete: string[] = [];

    // Evita iteração de MapIterator para compatibilidade com targets < ES2015
    Array.from(this.cache.keys()).forEach((key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });

    for (const key of keysToDelete) {
      this.cache.delete(key);
    }
  }

  /**
   * Limpa todo o cache
   */
  async clear(): Promise<void> {
    this.cache.clear();
  }

  /**
   * Verifica se uma chave existe no cache
   */
  async has(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    // Verificar se expirou
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Retorna informações de debug
   */
  async getDebugInfo(): Promise<{
    size: number;
    keys: string[];
    memoryUsage?: number;
  }> {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      memoryUsage: this.estimateMemoryUsage(),
    };
  }

  /**
   * Estima uso de memória do cache
   */
  private estimateMemoryUsage(): number {
    let totalSize = 0;

    Array.from(this.cache.entries()).forEach(([key, item]) => {
      // Estimativa aproximada
      totalSize += key.length * 2; // Unicode chars
      totalSize += JSON.stringify(item).length * 2;
    });

    return totalSize;
  }
}

