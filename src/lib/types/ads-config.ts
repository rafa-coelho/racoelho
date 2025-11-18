import { PageType, SlotType } from '@/lib/services/adOrchestrator';

export interface AdsPageConfig {
  maxPerPage?: number;
  enabledSlots?: SlotType[];
}

export interface AdsMetadata {
  // Configuração global (fallback)
  global?: AdsPageConfig;
  // Configuração específica para posts
  posts?: AdsPageConfig;
  // Configuração específica para challenges
  challenges?: AdsPageConfig;
}

export interface AdsConfig {
  maxPerPage: number | undefined;
  enabledSlots: SlotType[] | undefined;
}

/**
 * Obtém a configuração de anúncios para um tipo de página específico,
 * com fallback para configuração global se não houver configuração específica.
 */
export function getAdsConfig(pageType: PageType, metadata: AdsMetadata | undefined): AdsConfig {
  if (!metadata) {
    return {
      maxPerPage: undefined,
      enabledSlots: undefined,
    };
  }

  // Tenta obter configuração específica do tipo de página
  const pageConfig = pageType === 'posts' ? metadata.posts : metadata.challenges;
  
  // Se não houver configuração específica, usa global
  const config = pageConfig || metadata.global;

  return {
    maxPerPage: config?.maxPerPage,
    enabledSlots: config?.enabledSlots,
  };
}

/**
 * Filtra slots disponíveis baseado na configuração de slots habilitados.
 * Se não houver configuração, retorna todos os slots.
 */
export function filterEnabledSlots(
  requestedSlots: SlotType[],
  enabledSlots: SlotType[] | undefined
): SlotType[] {
  if (!enabledSlots || enabledSlots.length === 0) {
    return requestedSlots;
  }
  
  return requestedSlots.filter(slot => enabledSlots.includes(slot));
}

