'use client';

import { useEffect, useState } from 'react';
import { getPublicPocketBaseClient } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Users, Monitor, Smartphone, Tablet, Globe } from 'lucide-react';

interface ViewStats {
  postId: string;
  title?: string;
  total: number;
  unique: number;
  sessions: number;
  byDevice: Record<string, number>;
  byCountry: Record<string, number>;
}

/**
 * Componente de estatísticas de views para o dashboard admin
 * 
 * Mostra:
 * - Total de views
 * - Views únicas
 * - Sessões únicas
 * - Top posts mais vistos
 * - Breakdown por device
 * - Breakdown por país
 * 
 * @example
 * ```tsx
 * <ViewsStatsCard />
 * ```
 */
export default function ViewsStatsCard() {
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  const [uniqueViewers, setUniqueViewers] = useState(0);
  const [topPosts, setTopPosts] = useState<ViewStats[]>([]);
  const [deviceStats, setDeviceStats] = useState<Record<string, number>>({});
  const [countryStats, setCountryStats] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadStats() {
      try {
        // Usa cliente público pois listRule=null permite leitura pública
        const pb = getPublicPocketBaseClient();
        
        // Busca todas as views de posts
        const postViews = await pb.collection('post_views').getFullList({
          sort: '-created',
        });

        // Busca todas as views de desafios
        const challengeViews = await pb.collection('challenge_views').getFullList({
          sort: '-created',
        });

        const allViews = [...postViews, ...challengeViews];

        // Estatísticas gerais
        setTotalViews(allViews.length);
        setUniqueViewers(new Set(allViews.map((v: any) => v.viewerId)).size);

        // Agrupa views por postId
        const postStats: Record<string, { viewers: Set<string>; sessions: Set<string>; total: number; byDevice: Record<string, number>; byCountry: Record<string, number> }> = {};
        
        allViews.forEach((view: any) => {
          const id = view.postId || view.challengeId;
          if (!postStats[id]) {
            postStats[id] = {
              viewers: new Set(),
              sessions: new Set(),
              total: 0,
              byDevice: {},
              byCountry: {},
            };
          }

          postStats[id].viewers.add(view.viewerId);
          postStats[id].sessions.add(view.sessionId);
          postStats[id].total++;
          
          // Device
          const device = view.device || 'unknown';
          postStats[id].byDevice[device] = (postStats[id].byDevice[device] || 0) + 1;
          
          // Country
          const country = view.country || 'Unknown';
          postStats[id].byCountry[country] = (postStats[id].byCountry[country] || 0) + 1;
        });

        // Top 10 posts
        const sortedPosts = Object.entries(postStats)
          .map(([postId, data]) => ({
            postId,
            total: data.total,
            unique: data.viewers.size,
            sessions: data.sessions.size,
            byDevice: data.byDevice,
            byCountry: data.byCountry,
          }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 10);

        setTopPosts(sortedPosts);

        // Estatísticas globais por device
        const globalDevices: Record<string, number> = {};
        const globalCountries: Record<string, number> = {};

        allViews.forEach((view: any) => {
          const device = view.device || 'unknown';
          globalDevices[device] = (globalDevices[device] || 0) + 1;

          const country = view.country || 'Unknown';
          globalCountries[country] = (globalCountries[country] || 0) + 1;
        });

        setDeviceStats(globalDevices);
        setCountryStats(globalCountries);
        
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Views</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      case 'desktop': return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Todas as visualizações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueViewers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Usuários diferentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Retorno</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uniqueViewers > 0 ? ((totalViews / uniqueViewers).toFixed(1)) : '0'}x
            </div>
            <p className="text-xs text-muted-foreground">
              Views por visitante
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Posts Mais Vistos</CardTitle>
          <CardDescription>Posts com mais visualizações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={post.postId} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-semibold text-muted-foreground w-6">
                    #{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{post.postId}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      <span>Total: {post.total}</span>
                      <span>Únicos: {post.unique}</span>
                      <span>Sessões: {post.sessions}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Views por Device */}
        <Card>
          <CardHeader>
            <CardTitle>Por Dispositivo</CardTitle>
            <CardDescription>Distribuição de views por tipo de device</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(deviceStats)
                .sort(([, a], [, b]) => b - a)
                .map(([device, count]) => (
                  <div key={device} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device)}
                      <span className="text-sm capitalize">{device}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-muted-foreground">
                        ({((count / totalViews) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Views por País */}
        <Card>
          <CardHeader>
            <CardTitle>Por País</CardTitle>
            <CardDescription>Top países por visualizações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(countryStats)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([country, count]) => (
                  <div key={country} className="flex items-center justify-between">
                    <span className="text-sm">{country}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-muted-foreground">
                        ({((count / totalViews) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
