'use client';

import { useEffect, useState } from 'react';
import { getPublicPocketBaseClient } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, TrendingUp, Calendar, ArrowLeft, FileText, Code2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

interface PageAnalytics {
  id: string;
  title: string;
  slug: string;
  type: 'post' | 'challenge';
  views: {
    total: number;
    unique: number;
    sessions: number;
  };
  lastView?: string;
  devices: Record<string, number>;
  countries: Record<string, number>;
}

type TimeRange = 'today' | 'yesterday' | '7d' | '14d' | '30d' | 'custom' | 'all';

// Cache em memória
interface CacheEntry {
  data: PageAnalytics[];
  expiresAt: number;
}

const analyticsCache = new Map<string, CacheEntry>();

// TTLs em milissegundos
const TTL_SHORT = 30 * 60 * 1000; // 30 minutos - para dados que mudam (hoje, últimos X dias)
const TTL_LONG = 4 * 60 * 60 * 1000; // 4 horas - para dados fixos (ontem, intervalo específico)

function getCacheKey(timeRange: TimeRange, customDateRange?: { from?: Date; to?: Date }): string {
  if (timeRange === 'custom' && customDateRange) {
    const from = customDateRange.from ? customDateRange.from.toISOString().split('T')[0] : '';
    const to = customDateRange.to ? customDateRange.to.toISOString().split('T')[0] : '';
    return `analytics:custom:${from}:${to}`;
  }
  return `analytics:${timeRange}`;
}

function getTTL(timeRange: TimeRange): number {
  // Dados que podem mudar: hoje, últimos X dias
  if (timeRange === 'today' || timeRange === '7d' || timeRange === '14d' || timeRange === '30d') {
    return TTL_SHORT;
  }
  // Dados fixos: ontem, intervalo específico, todo o período
  return TTL_LONG;
}

function getCachedData(cacheKey: string): PageAnalytics[] | null {
  const entry = analyticsCache.get(cacheKey);
  if (!entry) return null;
  
  if (Date.now() > entry.expiresAt) {
    analyticsCache.delete(cacheKey);
    return null;
  }
  
  return entry.data;
}

function setCachedData(cacheKey: string, data: PageAnalytics[], ttl: number): void {
  analyticsCache.set(cacheKey, {
    data,
    expiresAt: Date.now() + ttl,
  });
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<PageAnalytics[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        // Verifica cache primeiro
        const cacheKey = getCacheKey(timeRange, customDateRange);
        const cachedData = getCachedData(cacheKey);
        
        if (cachedData) {
          setPages(cachedData);
          setLoading(false);
          return;
        }

        setLoading(true);
        const pb = getPublicPocketBaseClient();
        
        // Calcula data inicial baseado no range
        let dateFilter = '';
        if (timeRange !== 'all' && timeRange !== 'custom') {
          let days = 0;
          let endDate: Date | null = null;
          
          if (timeRange === 'today') {
            days = 0;
          } else if (timeRange === 'yesterday') {
            days = 1;
            endDate = new Date();
            endDate.setDate(endDate.getDate() - 1);
            endDate.setHours(23, 59, 59, 999);
          } else {
            days = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
          }
          
          const date = new Date();
          date.setDate(date.getDate() - days);
          date.setHours(0, 0, 0, 0);
          dateFilter = ` && created >= "${date.toISOString()}"`;
          
          if (endDate) {
            dateFilter += ` && created <= "${endDate.toISOString()}"`;
          }
        } else if (timeRange === 'custom' && customDateRange.from) {
          const fromDate = new Date(customDateRange.from);
          fromDate.setHours(0, 0, 0, 0);
          let filter = ` && created >= "${fromDate.toISOString()}"`;
          
          if (customDateRange.to) {
            const toDate = new Date(customDateRange.to);
            toDate.setHours(23, 59, 59, 999);
            filter += ` && created <= "${toDate.toISOString()}"`;
          }
          dateFilter = filter;
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

        // Busca títulos dos posts e desafios
        const postIds = Array.from(new Set(postViews.map((v: any) => v.postId)));
        const challengeIds = Array.from(new Set(challengeViews.map((v: any) => v.challengeId)));

        const postsMap = new Map<string, { title: string; slug: string }>();
        const challengesMap = new Map<string, { title: string; slug: string }>();

        // Buscar posts
        for (const postId of postIds) {
          try {
            // Tenta buscar pelo ID primeiro (se for ID do PocketBase)
            try {
              const post = await pb.collection('posts').getOne(postId);
              postsMap.set(postId, { title: post.title || postId, slug: post.slug || postId });
            } catch {
              // Se não encontrar pelo ID, tenta buscar pelo slug (postId pode ser slug)
              try {
                const post = await pb.collection('posts').getFirstListItem(`slug="${postId}"`);
                postsMap.set(postId, { title: post.title || postId, slug: post.slug || postId });
              } catch {
                postsMap.set(postId, { title: postId, slug: postId });
              }
            }
          } catch (error) {
            postsMap.set(postId, { title: postId, slug: postId });
          }
        }

        // Buscar desafios
        for (const challengeId of challengeIds) {
          try {
            try {
              const challenge = await pb.collection('challenges').getOne(challengeId);
              challengesMap.set(challengeId, { title: challenge.title || challengeId, slug: challenge.slug || challengeId });
            } catch {
              try {
                const challenge = await pb.collection('challenges').getFirstListItem(`slug="${challengeId}"`);
                challengesMap.set(challengeId, { title: challenge.title || challengeId, slug: challenge.slug || challengeId });
              } catch {
                challengesMap.set(challengeId, { title: challengeId, slug: challengeId });
              }
            }
          } catch (error) {
            challengesMap.set(challengeId, { title: challengeId, slug: challengeId });
          }
        }

        // Agrupa analytics
        const postStats = groupAnalytics(postViews, 'postId', 'post', postsMap);
        const challengeStats = groupAnalytics(challengeViews, 'challengeId', 'challenge', challengesMap);

        // Combina e ordena por views
        const allPages = [...postStats, ...challengeStats].sort((a, b) => b.views.total - a.views.total);

        // Armazena no cache
        const ttl = getTTL(timeRange);
        setCachedData(cacheKey, allPages, ttl);
        
        setPages(allPages);
        
      } catch (error) {
        console.error('Erro ao carregar analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [timeRange, customDateRange]);

  function groupAnalytics(
    views: any[], 
    idField: string, 
    type: 'post' | 'challenge',
    titlesMap: Map<string, { title: string; slug: string }>
  ): PageAnalytics[] {
    const grouped: Record<string, any> = {};

    views.forEach((view: any) => {
      const id = view[idField];
      if (!grouped[id]) {
        const pageInfo = titlesMap.get(id) || { title: id, slug: id };
        grouped[id] = {
          id,
          title: pageInfo.title,
          slug: pageInfo.slug,
          type,
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

    return Object.values(grouped).map((data: any) => ({
      id: data.id,
      title: data.title,
      slug: data.slug,
      type: data.type,
      views: {
        total: data.total,
        unique: data.viewers.size,
        sessions: data.sessions.size,
      },
      lastView: data.lastView,
      devices: data.devices,
      countries: data.countries,
    }));
  }

  const getTimeRangeLabel = () => {
    if (timeRange === 'today') return 'Hoje';
    if (timeRange === 'yesterday') return 'Ontem';
    if (timeRange === '7d') return 'Últimos 7 dias';
    if (timeRange === '14d') return 'Últimos 14 dias';
    if (timeRange === '30d') return 'Últimos 30 dias';
    if (timeRange === 'custom') {
      if (customDateRange.from && customDateRange.to) {
        return `${format(customDateRange.from, 'dd/MM/yyyy', { locale: ptBR })} - ${format(customDateRange.to, 'dd/MM/yyyy', { locale: ptBR })}`;
      }
      if (customDateRange.from) {
        return `A partir de ${format(customDateRange.from, 'dd/MM/yyyy', { locale: ptBR })}`;
      }
      return 'Selecionar período';
    }
    return 'Todo o período';
  };

  const handleCustomDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range) {
      setCustomDateRange(range);
      if (range.from && range.to) {
        setShowCalendar(false);
      }
    }
  };

  const totalViews = pages.reduce((sum, p) => sum + p.views.total, 0);
  const totalUnique = pages.reduce((sum, p) => sum + p.views.unique, 0);
  const totalSessions = pages.reduce((sum, p) => sum + p.views.sessions, 0);

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
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Páginas acessadas e quantidade de views</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-3 mb-6">
        <Select value={timeRange} onValueChange={(value) => {
          if (value === 'custom') {
            setShowCalendar(true);
            setTimeRange('custom');
          } else {
            setTimeRange(value as TimeRange);
          }
        }}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Selecione o período">
              {timeRange === 'custom' && customDateRange.from 
                ? getTimeRangeLabel()
                : getTimeRangeLabel()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="yesterday">Ontem</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="14d">Últimos 14 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="custom">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Selecionar período manualmente
              </span>
            </SelectItem>
            <SelectItem value="all">Todo o período</SelectItem>
          </SelectContent>
        </Select>
        
        {timeRange === 'custom' && (
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                {customDateRange.from && customDateRange.to
                  ? `${format(customDateRange.from, 'dd/MM/yyyy', { locale: ptBR })} - ${format(customDateRange.to, 'dd/MM/yyyy', { locale: ptBR })}`
                  : customDateRange.from
                  ? `A partir de ${format(customDateRange.from, 'dd/MM/yyyy', { locale: ptBR })}`
                  : 'Selecionar datas'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="range"
                defaultMonth={customDateRange.from}
                selected={customDateRange.from && customDateRange.to ? { from: customDateRange.from, to: customDateRange.to } : customDateRange.from ? { from: customDateRange.from, to: customDateRange.from } : undefined}
                onSelect={(range) => {
                  handleCustomDateSelect(range);
                  if (range?.from && range?.to) {
                    setTimeRange('custom');
                  }
                }}
                numberOfMonths={2}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-20 mb-2 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-32 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {pages.length} {pages.length === 1 ? 'página' : 'páginas'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUnique.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalSessions.toLocaleString()} sessões
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média por Página</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pages.length > 0 ? Math.round(totalViews / pages.length) : 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">views por página</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pages Analytics */}
      {loading ? (
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted rounded w-40 mb-2 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
                    <div className="flex-1 min-w-0">
                      <div className="h-5 bg-muted rounded w-48 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-32 mb-2 animate-pulse"></div>
                      <div className="flex gap-4">
                        <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-muted rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : pages.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Páginas Acessadas</CardTitle>
            <CardDescription>
              Lista de todas as páginas com suas estatísticas de visualização
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pages.map((page) => (
                <div
                  key={`${page.type}-${page.id}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="mt-1">
                      {page.type === 'post' ? (
                        <FileText className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Code2 className="w-5 h-5 text-purple-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{page.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {page.type === 'post' ? 'Post' : 'Desafio'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        /{page.type === 'post' ? 'posts' : 'desafios'}/{page.slug}
                      </p>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                        <span className="font-medium text-foreground">{page.views.total}</span>
                        <span>views</span>
                        <span className="font-medium text-foreground">{page.views.unique}</span>
                        <span>únicos</span>
                        <span className="font-medium text-foreground">{page.views.sessions}</span>
                        <span>sessões</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm ml-4">
                    <div className="font-medium mb-1">
                      {Object.keys(page.countries).length} {Object.keys(page.countries).length === 1 ? 'país' : 'países'}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {Object.entries(page.devices)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([device, count]) => (
                          <div key={device}>
                            {device}: {count}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Nenhuma visualização registrada</p>
            <p className="text-sm text-muted-foreground">
              Aguarde usuários visualizarem páginas para ver os dados aqui
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
