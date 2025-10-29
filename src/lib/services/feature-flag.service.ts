import { pbList, pbFirstByFilter } from '@/lib/pocketbase';
import { FeatureFlagKey, FeatureFlag } from '@/lib/types/feature-flags';
import { getCached, cacheKey, cacheListKey } from '@/lib/cache/cache.service';

// Mapper PB -> FeatureFlag
function mapPbToFeatureFlag(rec: any): FeatureFlag {
  return {
    key: rec.key as FeatureFlagKey,
    enabled: !!rec.enabled,
    description: rec.description || undefined,
    metadata: rec.metadata || undefined,
  };
}

export const featureFlagService = {
  async isEnabled(key: FeatureFlagKey): Promise<boolean> {
    const cacheKeyData = cacheKey('feature_flags', key);

    return await getCached(
      cacheKeyData,
      async () => {
        try {
          const rec = await pbFirstByFilter('feature_flags', `key='${key}'`);
          return !!rec?.enabled;
        } catch (error) {
          console.error(`[FeatureFlagService] Error checking flag "${key}":`, error);
          return false;
        }
      },
      60000 // 1 minuto
    );
  },

  async getAllFlags(): Promise<FeatureFlag[]> {
    const cacheKeyData = cacheListKey('feature_flags');

    return await getCached(
      cacheKeyData,
      async () => {
        try {
          const res = await pbList('feature_flags', {
            sort: 'key',
            perPage: 50,
          });

          return (res.items || []).map(mapPbToFeatureFlag);
        } catch (error) {
          console.error('[FeatureFlagService] Error getting all flags:', error);
          return [];
        }
      },
      60000 // 1 minuto
    );
  },

  async getFlag(key: FeatureFlagKey): Promise<FeatureFlag | null> {
    const cacheKeyData = cacheKey('feature_flags', key);

    return await getCached(
      cacheKeyData,
      async () => {
        try {
          const rec = await pbFirstByFilter('feature_flags', `key='${key}'`);
          return rec ? mapPbToFeatureFlag(rec) : null;
        } catch (error) {
          console.error(`[FeatureFlagService] Error getting flag "${key}":`, error);
          return null;
        }
      },
      60000 // 1 minuto
    );
  },
};

