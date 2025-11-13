'use client';

import { useEffect, useState } from 'react';
import { getPublicPocketBaseClient } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, TrendingUp, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PostAnalytics {
  postId: string;
  title?: string;
  views: {
    total: number;
    unique: number;
    sessions: number;
    trend?: string;
  };
  lastView?: string;
  devices: Record<string, number>;
  countries: Record<string, number>;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostAnalytics[]>([]);
  const [challenges, setChallenges] = useState<PostAnalytics[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  useEffect(() => {
    async function loadAnalytics() {
      try {
        // Usa cliente público pois listRule=null permite leitura pública
        const pb = getPublicPocketBaseClient();
        
        // Calcula data inicial baseado no range
        let dateFilter = '';
        if (timeRange !== 'all') {
          const days = timeRange === '7d' ? 7 : 30;
          const date = new Date();
          date.setDate(date.getDate() - days);
          dateFilter = ` && created >= "${date.toISOString()}"`;
        }

        // Busca views de posts
        const postViews = await pb.collection('post_views').getFullList({
          filter: `postId != ""${dateFilter}`,
          sort: '-created',
        });

        // Busca views de desafios
        const challengeViews = await pb.collection('challenge_views').getFullList({
          filter: `challengeId != ""${dateFilter}`,
          sort: '-created',
        });

        // Agrupa posts
        const postStats = groupAnalytics(postViews, 'postId');
        const challengeStats = groupAnalytics(challengeViews, 'challengeId');

        setPosts(postStats);
        setChallenges(challengeStats);
        
      } catch (error) {
        console.error('Erro ao carregar analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [timeRange]);

  function groupAnalytics(views: any[], idField: string): PostAnalytics[] {
    const grouped: Record<string, any> = {};

    views.forEach((view: any) => {
      const id = view[idField];
      if (!grouped[id]) {
        grouped[id] = {
          viewers: new Set(),
          sessions: new Set(),
          total: 0,
          devices: {},
          countries: {},
          lastView: view.created,
        };
      }

      grouped[id].viewers.add(view.viewerId);
      grouped[id].sessions.add(view.sessionId);
      grouped[id].total++;
      
      const device = view.device || 'unknown';
      grouped[id].devices[device] = (grouped[id].devices[device] || 0) + 1;
      
      const country = view.country || 'Unknown';
      grouped[id].countries[country] = (grouped[id].countries[country] || 0) + 1;

      if (view.created > grouped[id].lastView) {
        grouped[id].lastView = view.created;
      }
    });

    return Object.entries(grouped)
      .map(([id, data]) => ({
        postId: id,
        views: {
          total: data.total,
          unique: data.viewers.size,
          sessions: data.sessions.size,
        },
        lastView: data.lastView,
        devices: data.devices,
        countries: data.countries,
      }))
      .sort((a, b) => b.views.total - a.views.total);
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4"></div>
          <div className="h-4 bg-muted rounded w-64 mb-8"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalViews = posts.reduce((sum, p) => sum + p.views.total, 0) + 
                     challenges.reduce((sum, c) => sum + c.views.total, 0);
  const totalUnique = new Set([
    ...posts.flatMap(p => Array(p.views.unique).fill(0)),
    ...challenges.flatMap(c => Array(c.views.unique).fill(0))
  ]).size;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Analytics Detalhado</h1>
        <p className="text-muted-foreground">Análise completa de visualizações e engajamento</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={timeRange === '7d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('7d')}
        >
          Últimos 7 dias
        </Button>
        <Button
          variant={timeRange === '30d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('30d')}
        >
          Últimos 30 dias
        </Button>
        <Button
          variant={timeRange === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('all')}
        >
          Todo o período
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conteúdos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length + challenges.length}</div>
            <p className="text-xs text-muted-foreground">
              {posts.length} posts, {challenges.length} desafios
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Conteúdo</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totalViews / (posts.length + challenges.length || 1))}
            </div>
            <p className="text-xs text-muted-foreground">views por item</p>
          </CardContent>
        </Card>
      </div>

      {/* Posts Analytics */}
      {posts.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Posts</CardTitle>
            <CardDescription>Desempenho dos artigos do blog</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.slice(0, 20).map((post) => (
                <div key={post.postId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{post.postId}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span>{post.views.total} views</span>
                      <span>{post.views.unique} únicos</span>
                      <span>{post.views.sessions} sessões</span>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-medium">{Object.keys(post.countries).length} países</div>
                    <div className="text-muted-foreground">
                      {Object.entries(post.devices).map(([device, count]) => (
                        <span key={device} className="ml-2">{device}: {count}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Challenges Analytics */}
      {challenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Desafios</CardTitle>
            <CardDescription>Desempenho dos desafios de programação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {challenges.slice(0, 20).map((challenge) => (
                <div key={challenge.postId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{challenge.postId}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span>{challenge.views.total} views</span>
                      <span>{challenge.views.unique} únicos</span>
                      <span>{challenge.views.sessions} sessões</span>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-medium">{Object.keys(challenge.countries).length} países</div>
                    <div className="text-muted-foreground">
                      {Object.entries(challenge.devices).map(([device, count]) => (
                        <span key={device} className="ml-2">{device}: {count}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {posts.length === 0 && challenges.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Nenhuma visualização registrada</p>
            <p className="text-sm text-muted-foreground">
              Aguarde usuários visualizarem posts ou desafios para ver os dados aqui
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
