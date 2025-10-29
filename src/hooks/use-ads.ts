import { useEffect, useState } from 'react';
import { PageType, SlotType, Placement } from '@/lib/services/adOrchestrator';

export function useAds(pageType: PageType, slots: SlotType[], options?: { maxPerPage?: number }) {
  const [placements, setPlacements] = useState<Record<string, Placement>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams({
          pageType,
          slots: JSON.stringify(slots),
        });
        if (options?.maxPerPage) {
          params.append('maxPerPage', options.maxPerPage.toString());
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
          // Fallback: preencher todos os slots com Google Ads
          const fallback: Record<string, Placement> = {};
          for (const s of slots) {
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
  }, [pageType, JSON.stringify(slots), options?.maxPerPage]);

  return { placements, loading, error };
}


