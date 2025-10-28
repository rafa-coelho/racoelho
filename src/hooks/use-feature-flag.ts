import { useState, useEffect } from 'react';
import { FeatureFlagKey, FeatureFlag } from '@/lib/types/feature-flags';
import { featureFlagService } from '@/lib/services/feature-flags';

/**
 * Hook para verificar se uma feature flag está habilitada.
 * 
 * @param key - Chave da feature flag
 * @returns Objeto com estado enabled e loading
 * 
 * @example
 * ```tsx
 * const { enabled, loading } = useFeatureFlag('share');
 * 
 * if (loading) return <div>Carregando...</div>;
 * if (!enabled) return null;
 * 
 * return <ShareButtons />;
 * ```
 */
export function useFeatureFlag(key: FeatureFlagKey) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkFlag = async () => {
      try {
        setLoading(true);
        const isEnabled = await featureFlagService.isEnabled(key);
        
        if (mounted) {
          setEnabled(isEnabled);
        }
      } catch (error) {
        console.error(`[useFeatureFlag] Error checking flag "${key}":`, error);
        if (mounted) {
          setEnabled(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkFlag();

    return () => {
      mounted = false;
    };
  }, [key]);

  return { enabled, loading };
}

/**
 * Hook para obter uma feature flag completa com metadados.
 * 
 * @param key - Chave da feature flag
 * @returns Objeto com flag completa e loading
 * 
 * @example
 * ```tsx
 * const { flag, loading } = useFeatureFlagWithMetadata('ads');
 * 
 * if (!flag?.enabled) return null;
 * 
 * const mockPriority = flag.metadata?.mockPriority ?? 0.7;
 * ```
 */
export function useFeatureFlagWithMetadata(key: FeatureFlagKey) {
  const [flag, setFlag] = useState<FeatureFlag | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadFlag = async () => {
      try {
        setLoading(true);
        const featureFlag = await featureFlagService.getFlag(key);
        
        if (mounted) {
          setFlag(featureFlag);
        }
      } catch (error) {
        console.error(`[useFeatureFlagWithMetadata] Error loading flag "${key}":`, error);
        if (mounted) {
          setFlag(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadFlag();

    return () => {
      mounted = false;
    };
  }, [key]);

  return { flag, loading };
}

/**
 * Hook para obter múltiplas feature flags de uma vez.
 * 
 * @param keys - Array de chaves de feature flags
 * @returns Objeto com mapa de flags e loading
 * 
 * @example
 * ```tsx
 * const { flags, loading } = useFeatureFlags(['share', 'newsletter', 'ads']);
 * 
 * if (loading) return <div>Carregando...</div>;
 * 
 * return (
 *   <>
 *     {flags.share && <ShareButtons />}
 *     {flags.newsletter && <NewsletterCTA />}
 *     {flags.ads && <AdSlot />}
 *   </>
 * );
 * ```
 */
export function useFeatureFlags(keys: FeatureFlagKey[]) {
  const [flags, setFlags] = useState<Record<FeatureFlagKey, boolean>>({} as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkFlags = async () => {
      try {
        setLoading(true);
        const flagsMap: Record<string, boolean> = {};
        
        await Promise.all(
          keys.map(async (key) => {
            const isEnabled = await featureFlagService.isEnabled(key);
            flagsMap[key] = isEnabled;
          })
        );
        
        if (mounted) {
          setFlags(flagsMap as Record<FeatureFlagKey, boolean>);
        }
      } catch (error) {
        console.error('[useFeatureFlags] Error checking flags:', error);
        if (mounted) {
          const defaultFlags: Record<string, boolean> = {};
          keys.forEach(key => { defaultFlags[key] = false; });
          setFlags(defaultFlags as Record<FeatureFlagKey, boolean>);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkFlags();

    return () => {
      mounted = false;
    };
  }, [keys.join(',')]); // Use join para dependência estável

  return { flags, loading };
}

