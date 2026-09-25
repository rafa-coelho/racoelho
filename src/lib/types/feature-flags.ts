/**
 * Types e interfaces para sistema de feature flags
 */

export type FeatureFlagKey = 
  | 'share'
  | 'newsletter'
  | 'ads'
  | 'comments'
  | 'analytics'
  | 'projects'
  // rebranding — features novas, todas começam desligadas
  | 'now_status'            // card "Agora" na home
  | 'reading_progress'      // barra de progresso de leitura
  | 'likes'                 // curtir post
  | 'challenge_progress'    // progresso local dos desafios
  | 'challenge_submissions' // envio de solução de desafio
  | 'community_stats'       // estatísticas do Discord
  | 'newsletter_archive'    // arquivo de edições da newsletter
  | 'mediakit';             // /mediakit

export const REBRANDING_FLAGS: { key: FeatureFlagKey; description: string }[] = [
  { key: 'now_status', description: 'Card "Agora" na home (site_status)' },
  { key: 'reading_progress', description: 'Barra de progresso de leitura nos posts' },
  { key: 'likes', description: 'Curtir posts (post_likes)' },
  { key: 'challenge_progress', description: 'Progresso local e estados na trilha de desafios' },
  { key: 'challenge_submissions', description: 'Formulário de envio de solução de desafio' },
  { key: 'community_stats', description: 'Estatísticas do Discord em /comunidade' },
  { key: 'newsletter_archive', description: 'Arquivo de edições em /newsletter' },
  { key: 'mediakit', description: 'Página /mediakit para marcas' },
];

export interface FeatureFlag {
  key: FeatureFlagKey;
  enabled: boolean;
  description?: string;
  metadata?: Record<string, any>;
}

export interface FeatureFlagsConfig {
  flags: FeatureFlag[];
}

export interface IFeatureFlagProvider {
  /**
   * Retorna o estado de uma feature flag específica
   */
  isEnabled(key: FeatureFlagKey): Promise<boolean>;
  
  /**
   * Retorna todas as feature flags
   */
  getAllFlags(): Promise<FeatureFlag[]>;
  
  /**
   * Retorna uma feature flag específica com seus metadados
   */
  getFlag(key: FeatureFlagKey): Promise<FeatureFlag | null>;
}

