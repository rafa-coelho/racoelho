import { useEffect, useState } from 'react';
import { PageType, SlotType, Placement } from '@/lib/services/adOrchestrator';
import { useFeatureFlagWithMetadata } from './use-feature-flag';
import { getAdsConfig, filterEnabledSlots, AdsMetadata } from '@/lib/types/ads-config';

export function useAds(pageType: PageType, slots: SlotType[], options?: { maxPerPage?: number }) {
  const [placements, setPlacements] = useState<Record<string, Placement>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Busca configuração da feature flag 'ads'
  const { flag: adsFlag, loading: flagLoading } = useFeatureFlagWithMetadata('ads');
  
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Se a flag não está habilitada, não carrega anúncios
        if (!flagLoading && (!adsFlag || !adsFlag.enabled)) {
          if (mounted) {
            setPlacements({});
            setLoading(false);
          }
          return;
        }
        
        // Aguarda carregamento da flag
        if (flagLoading) {
          return;
        }
        
        // Obtém configuração de anúncios com fallback
        const adsMetadata = (adsFlag?.metadata || {}) as AdsMetadata;
        const config = getAdsConfig(pageType, adsMetadata);
        
        // Filtra slots baseado na configuração
        const enabledSlots = filterEnabledSlots(slots, config.enabledSlots);
        
        // Se não houver slots habilitados, não faz requisição
        if (enabledSlots.length === 0) {
          if (mounted) {
            setPlacements({});
            setLoading(false);
          }
          return;
        }
        
        // Usa maxPerPage da configuração ou das options (options tem prioridade)
        const maxPerPage = options?.maxPerPage ?? config.maxPerPage;
        
        const params = new URLSearchParams({
          pageType,
          slots: JSON.stringify(enabledSlots),
        });
        if (maxPerPage !== undefined) {
          params.append('maxPerPage', maxPerPage.toString());
        }

        const res = await fetch(`/api/ads/placements?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        
        if (mounted) setPlacements(data);
      } catch (err) {
        console.error('[useAds] Error loading ads:', err);
        if (mounted) {
          setError(err as Error);
          // Fallback: preencher slots habilitados com Google Ads
          const fallback: Record<string, Placement> = {};
          const adsMetadata = (adsFlag?.metadata || {}) as AdsMetadata;
          const config = getAdsConfig(pageType, adsMetadata);
          const enabledSlots = filterEnabledSlots(slots, config.enabledSlots);
          for (const s of enabledSlots) {
            fallback[s] = { kind: 'google', slotType: s } as Placement;
          }
          setPlacements(fallback);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [pageType, JSON.stringify(slots), options?.maxPerPage, adsFlag, flagLoading]);

  return { placements, loading, error };
}


