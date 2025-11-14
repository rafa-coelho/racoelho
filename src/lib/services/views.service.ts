import { getPocketBaseClient } from '@/lib/auth';

export interface ViewsStats {
  total: number;
  unique: number;
  sessions: number;
  byDevice: Record<string, number>;
  byBrowser: Record<string, number>;
  byOS: Record<string, number>;
  byCountry: Record<string, number>;
  byDate?: Record<string, number>;
}

export interface ContentViewStats extends ViewsStats {
  contentId: string;
  contentType: 'post' | 'challenge';
}

/**
 * Serviço para queries de analytics de views
 */
export class ViewsService {
  /**
   * Busca estatísticas de um post específico
   */
  static async getPostStats(postId: string): Promise<ViewsStats> {
    const pb = getPocketBaseClient();
    const views = await pb.collection('post_views').getFullList({
      filter: `postId="${postId}"`,
    });

    return this.aggregateViews(views);
  }

  /**
   * Busca estatísticas de um desafio específico
   */
  static async getChallengeStats(challengeId: string): Promise<ViewsStats> {
    const pb = getPocketBaseClient();
    const views = await pb.collection('challenge_views').getFullList({
      filter: `challengeId="${challengeId}"`,
    });

    return this.aggregateViews(views);
  }

  /**
   * Busca top N posts mais vistos
   */
  static async getTopPosts(limit: number = 10): Promise<ContentViewStats[]> {
    const pb = getPocketBaseClient();
    const views = await pb.collection('post_views').getFullList();

    const grouped = this.groupByContent(views, 'postId', 'post');
    return grouped
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
  }

  /**
   * Busca top N desafios mais vistos
   */
  static async getTopChallenges(limit: number = 10): Promise<ContentViewStats[]> {
    const pb = getPocketBaseClient();
    const views = await pb.collection('challenge_views').getFullList();

    const grouped = this.groupByContent(views, 'challengeId', 'challenge');
    return grouped
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
  }

  /**
   * Busca estatísticas gerais de todo o site
   */
  static async getGlobalStats(): Promise<ViewsStats & { postCount: number; challengeCount: number }> {
    const pb = getPocketBaseClient();
    
    const [postViews, challengeViews] = await Promise.all([
      pb.collection('post_views').getFullList(),
      pb.collection('challenge_views').getFullList(),
    ]);

    const allViews = [...postViews, ...challengeViews];
    const stats = this.aggregateViews(allViews);

    const postCount = new Set(postViews.map((v: any) => v.postId)).size;
    const challengeCount = new Set(challengeViews.map((v: any) => v.challengeId)).size;

    return {
      ...stats,
      postCount,
      challengeCount,
    };
  }

  /**
   * Busca estatísticas por período
   */
  static async getStatsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<ViewsStats> {
    const pb = getPocketBaseClient();
    
    const filter = `created >= "${startDate.toISOString()}" && created <= "${endDate.toISOString()}"`;
    
    const [postViews, challengeViews] = await Promise.all([
      pb.collection('post_views').getFullList({ filter }),
      pb.collection('challenge_views').getFullList({ filter }),
    ]);

    const allViews = [...postViews, ...challengeViews];
    return this.aggregateViews(allViews);
  }

  /**
   * Busca views por dia (últimos N dias)
   */
  static async getViewsByDay(days: number = 30): Promise<Record<string, number>> {
    const pb = getPocketBaseClient();
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const filter = `created >= "${startDate.toISOString()}"`;
    
    const [postViews, challengeViews] = await Promise.all([
      pb.collection('post_views').getFullList({ filter }),
      pb.collection('challenge_views').getFullList({ filter }),
    ]);

    const allViews = [...postViews, ...challengeViews];
    const byDate: Record<string, number> = {};

    allViews.forEach((view: any) => {
      const date = new Date(view.created).toISOString().split('T')[0];
      byDate[date] = (byDate[date] || 0) + 1;
    });

    return byDate;
  }

  /**
   * Agrega estatísticas de um array de views
   */
  private static aggregateViews(views: any[]): ViewsStats {
    const uniqueViewers = new Set<string>();
    const uniqueSessions = new Set<string>();
    const byDevice: Record<string, number> = {};
    const byBrowser: Record<string, number> = {};
    const byOS: Record<string, number> = {};
    const byCountry: Record<string, number> = {};

    views.forEach((view) => {
      uniqueViewers.add(view.viewerId);
      uniqueSessions.add(view.sessionId);

      const device = view.device || 'unknown';
      byDevice[device] = (byDevice[device] || 0) + 1;

      const browser = view.browser || 'unknown';
      byBrowser[browser] = (byBrowser[browser] || 0) + 1;

      const os = view.os || 'unknown';
      byOS[os] = (byOS[os] || 0) + 1;

      const country = view.country || 'Unknown';
      byCountry[country] = (byCountry[country] || 0) + 1;
    });

    return {
      total: views.length,
      unique: uniqueViewers.size,
      sessions: uniqueSessions.size,
      byDevice,
      byBrowser,
      byOS,
      byCountry,
    };
  }

  /**
   * Agrupa views por conteúdo
   */
  private static groupByContent(
    views: any[],
    idField: 'postId' | 'challengeId',
    type: 'post' | 'challenge'
  ): ContentViewStats[] {
    const grouped: Record<string, any[]> = {};

    views.forEach((view) => {
      const id = view[idField];
      if (!grouped[id]) {
        grouped[id] = [];
      }
      grouped[id].push(view);
    });

    return Object.entries(grouped).map(([id, contentViews]) => ({
      contentId: id,
      contentType: type,
      ...this.aggregateViews(contentViews),
    }));
  }
}
