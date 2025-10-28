import { useState, useEffect } from 'react';
import { AdPosition, AdConfig } from '@/lib/types/ads';
import { adService } from '@/lib/services/ads';

/**
 * Hook customizado para gerenciar carregamento de anúncios.
 * 
 * @param position - Posição do anúncio (ex: "post:sidebar-left")
 * @returns Objeto com configuração do ad e estado de loading
 * 
 * @example
 * ```tsx
 * const { adConfig, loading } = useAd('post:sidebar-left');
 * 
 * if (loading) return <div>Carregando...</div>;
 * if (!adConfig) return null;
 * 
 * if (adConfig.type === 'custom') {
 *   return <img src={adConfig.data.image} alt={adConfig.data.altText} />;
 * }
 * ```
 */
export function useAd(position: AdPosition) {
  const [adConfig, setAdConfig] = useState<AdConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadAd = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const config = await adService.getAdConfig(position);
        
        if (mounted) {
          setAdConfig(config);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load ad'));
          console.error('[useAd] Error loading ad:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAd();

    return () => {
      mounted = false;
    };
  }, [position]);

  return { adConfig, loading, error };
}

