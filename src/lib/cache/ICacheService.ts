/**
 * Interface para serviço de cache
 * Segue princípios SOLID - Dependency Inversion
 * Permite trocar implementação (MemoryCache, RedisCache, etc) sem modificar código que usa cache
 */
export interface ICacheService {
  /**
   * Busca um valor do cache
   * @param key - Chave do cache
   * @returns Valor em cache ou null se não encontrado/expirado
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Armazena um valor no cache
   * @param key - Chave do cache
   * @param value - Valor a ser armazenado
   * @param ttl - Time to live em milissegundos (opcional)
   */
  set<T>(key: string, value: T, ttl?: number): Promise<void>;

  /**
   * Remove um item específico do cache
   * @param key - Chave do cache
   */
  delete(key: string): Promise<void>;

  /**
   * Remove todos os itens do cache que correspondem ao padrão
   * @param pattern - Padrão de chave (ex: "pb:posts:*")
   */
  invalidate(pattern: string): Promise<void>;

  /**
   * Limpa todo o cache
   */
  clear(): Promise<void>;

  /**
   * Verifica se uma chave existe no cache
   */
  has(key: string): Promise<boolean>;

  /**
   * Retorna informações de debug sobre o cache
   */
  getDebugInfo(): Promise<{
    size: number;
    keys: string[];
    memoryUsage?: number;
  }>;
}

