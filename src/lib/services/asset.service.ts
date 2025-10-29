import { pbFirstByFilterWithPreview, pbGetByIdWithPreview, pbListWithPreview } from '@/lib/pocketbase-server';
import { AssetPack } from '@/lib/types';
import { getCached, cacheKey, cacheListKey } from '@/lib/cache/cache.service';

function fileUrl(rec: any, filename: string): string {
  const base = process.env.NEXT_PUBLIC_PB_URL || '';
  return `${base}/api/files/${rec.collectionId || rec.collection}/${rec.id}/${filename}`;
}

function mapPbToAssetPack(rec: any): AssetPack {
  // Pocketbase retorna files como string quando é único arquivo
  // ou como array quando são múltiplos. Normalizamos sempre para array
  let files: string[] = [];
  if (rec.files) {
    if (typeof rec.files === 'string') {
      files = [rec.files];
    } else if (Array.isArray(rec.files)) {
      files = rec.files;
    }
  }

  return {
    id: rec.id,
    slug: rec.slug,
    title: rec.title,
    description: rec.description || undefined,
    files,
    metadata: rec.metadata || {},
    status: rec.status || undefined,
  };
}

export const assetService = {
  /**
   * Busca um asset pack pelo slug com cache
   */
  async getAssetPackBySlug(slug: string, isPreview: boolean = false): Promise<AssetPack | null> {
    const cacheKeyData = cacheKey('asset_packs', slug);

    return await getCached(
      cacheKeyData,
      async () => {
        const filter = isPreview
          ? `slug='${slug}'`
          : `slug='${slug}' && status='published'`;

        try {
          const rec = await pbFirstByFilterWithPreview('asset_packs', filter, undefined, isPreview);
          return rec ? mapPbToAssetPack(rec) : null;
        } catch (error) {
          return null;
        }
      },
      3600000 // 1 hora
    );
  },

  /**
   * Busca um asset pack pelo ID com cache
   */
  async getAssetPackById(id: string, isPreview: boolean = false): Promise<AssetPack | null> {
    const cacheKeyData = cacheKey('asset_packs', id);

    return await getCached(
      cacheKeyData,
      async () => {
        try {
          const rec = await pbGetByIdWithPreview('asset_packs', id, isPreview);
          return mapPbToAssetPack(rec);
        } catch (error) {
          return null;
        }
      },
      3600000 // 1 hora
    );
  },

  /**
   * Lista todos os asset packs com cache
   */
  async getAllAssetPacks(isPreview: boolean = false): Promise<AssetPack[]> {
    const cacheKeyData = cacheListKey('asset_packs');

    return await getCached(
      cacheKeyData,
      async () => {
        const res = await pbListWithPreview('asset_packs', {
          filter: isPreview ? undefined : "status='published'",
          sort: '-created',
        }, isPreview);

        return (res.items || []).map(mapPbToAssetPack);
      },
      3600000 // 1 hora
    );
  },

  /**
   * Gera URL de um arquivo específico de um asset pack
   */
  getAssetFileUrl(assetPack: AssetPack, filename: string): string {
    const base = process.env.NEXT_PUBLIC_PB_URL || '';
    return `${base}/api/files/asset_packs/${assetPack.id}/${filename}`;
  },

  /**
   * Busca um arquivo por tipo (extensão) em um asset pack
   */
  getAssetFileByType(assetPack: AssetPack, fileType: string): string | null {
    if (!assetPack.files || assetPack.files.length === 0) {
      return null;
    }

    const normalizedType = fileType.toLowerCase().replace('.', '');
    const file = assetPack.files.find(f => {
      const ext = f.split('.').pop()?.toLowerCase();
      return ext === normalizedType;
    });

    return file || null;
  },

  /**
   * Obtém a URL completa de um arquivo por tipo
   */
  getAssetFileUrlByType(assetPack: AssetPack, fileType: string): string | null {
    const filename = this.getAssetFileByType(assetPack, fileType);
    if (!filename) {
      return null;
    }
    return this.getAssetFileUrl(assetPack, filename);
  },
};

