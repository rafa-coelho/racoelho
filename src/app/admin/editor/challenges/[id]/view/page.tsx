"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { pbGetById } from "@/lib/pocketbase";
import { getPublicPocketBaseClient } from '@/lib/auth';
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Eye, Users, Monitor, Smartphone, Tablet, Globe, Calendar, TrendingUp, MapPin, ExternalLink, FileText, BarChart3 } from 'lucide-react';

interface ViewRecord {
  id: string;
  viewerId: string;
  sessionId: string;
  ip: string;
  userAgent: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
  created: string;
}

export default function ViewChallengePage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [rec, setRec] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState<ViewRecord[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'content' | 'analytics'>('content');

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const r = await pbGetById("challenges", id);
        if (!mounted) return;
        setRec(r);

        // Busca views do desafio - usa cliente público pois listRule=null
        const pb = getPublicPocketBaseClient();
        
        // Calcula filtro de data
        let dateFilter = '';
        if (timeRange !== 'all') {
          const days = timeRange === '7d' ? 7 : 30;
          const date = new Date();
          date.setDate(date.getDate() - days);
          dateFilter = ` && created >= "${date.toISOString()}"`;
        }

        try {
          const viewsData = await pb.collection('challenge_views').getFullList({
            filter: `challengeId="${r.slug}"${dateFilter}`
          });

          if (mounted) setViews(viewsData as any);
        } catch (error: any) {
          console.error('[Challenge Views] Error fetching views:', error);
          // Se a collection não existir ou não tiver schema, apenas não mostra views
          if (mounted) setViews([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, timeRange]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
          <div className="grid gap-4 md:grid-cols-3 mt-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!rec) return <div className="container mx-auto px-4 py-10">Não encontrado.</div>;

  // Cálculos de analytics (mesma lógica dos posts)
  const uniqueViewers = new Set(views.map(v => v.viewerId)).size;
  const uniqueSessions = new Set(views.map(v => v.sessionId)).size;
  
  const deviceStats = views.reduce((acc, v) => {
    const device = v.device || 'unknown';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const browserStats = views.reduce((acc, v) => {
    const browser = v.browser || 'unknown';
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const osStats = views.reduce((acc, v) => {
    const os = v.os || 'unknown';
    acc[os] = (acc[os] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const countryStats = views.reduce((acc, v) => {
    const country = v.country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cityStats = views.reduce((acc, v) => {
    const city = v.city || 'Unknown';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const viewsByDay = views.reduce((acc, v) => {
    const date = new Date(v.created).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedDates = Object.entries(viewsByDay).sort(([a], [b]) => b.localeCompare(a));

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/editor">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Desafios
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{rec.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Slug: <code className="bg-muted px-2 py-0.5 rounded">{rec.slug}</code></span>
              <span>Status: <span className={rec.status === 'published' ? 'text-green-500' : 'text-yellow-500'}>{rec.status}</span></span>
              <span>Dificuldade: <span className="capitalize">{rec.difficulty}</span></span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/editor/challenges/${id}`}>
              <Button variant="outline" size="sm">Editar Desafio</Button>
            </Link>
            <a href={`/listas/desafios/${rec.slug}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                Ver Público <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'content' | 'analytics')} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Conteúdo
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
            {views.length > 0 && (
              <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded">
                {views.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Desafio</CardTitle>
              <CardDescription>Informações e preview do conteúdo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Slug</div>
              <code className="text-sm bg-muted px-2 py-1 rounded">{rec.slug}</code>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Status</div>
              <span className={`text-sm font-medium ${rec.status === 'published' ? 'text-green-500' : 'text-yellow-500'}`}>
                {rec.status}
              </span>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Dificuldade</div>
              <span className="text-sm font-medium capitalize">{rec.difficulty}</span>
            </div>
            {rec.category && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Categoria</div>
                <span className="text-sm">{rec.category}</span>
              </div>
            )}
            {rec.tags && rec.tags.length > 0 && (
              <div className="md:col-span-2">
                <div className="text-sm text-muted-foreground mb-1">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {rec.tags.map((tag: string) => (
                    <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {rec.excerpt && (
              <div className="md:col-span-2">
                <div className="text-sm text-muted-foreground mb-1">Resumo</div>
                <p className="text-sm">{rec.excerpt}</p>
              </div>
            )}
            {rec.publishedAt && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Publicado em</div>
                <p className="text-sm">{new Date(rec.publishedAt).toLocaleDateString('pt-BR')}</p>
              </div>
            )}
            {rec.estimatedTime && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Tempo estimado</div>
                <p className="text-sm">{rec.estimatedTime}</p>
              </div>
            )}
          </div>
          {rec.content && (
            <div className="mt-6 pt-6 border-t">
              <div className="text-sm text-muted-foreground mb-2">Conteúdo</div>
              <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-xs">{rec.content}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
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
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{views.length.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Todas as visualizações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueViewers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Browsers diferentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões Únicas</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">IPs + UAs únicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Retorno</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uniqueViewers > 0 ? (views.length / uniqueViewers).toFixed(1) : '0'}x
            </div>
            <p className="text-xs text-muted-foreground">Views por visitante</p>
          </CardContent>
        </Card>
      </div>

      {views.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Nenhuma visualização registrada</p>
            <p className="text-sm text-muted-foreground">
              {timeRange !== 'all' 
                ? `Nenhuma view nos ${timeRange === '7d' ? '7' : '30'} dias selecionados`
                : 'Este desafio ainda não foi visualizado'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Views por Dia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Views por Dia
              </CardTitle>
              <CardDescription>Últimos {sortedDates.length} dias com atividade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sortedDates.slice(0, 10).map(([date, count]) => {
                  const percentage = (count / views.length) * 100;
                  return (
                    <div key={date} className="flex items-center justify-between">
                      <span className="text-sm">{new Date(date).toLocaleDateString('pt-BR')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary rounded-full h-2" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Dispositivos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Por Dispositivo
              </CardTitle>
              <CardDescription>Distribuição por tipo de device</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(deviceStats)
                  .sort(([, a], [, b]) => b - a)
                  .map(([device, count]) => {
                    const percentage = (count / views.length) * 100;
                    return (
                      <div key={device} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(device)}
                          <span className="text-sm capitalize">{device}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{count}</span>
                          <span className="text-xs text-muted-foreground w-12 text-right">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Browsers */}
          <Card>
            <CardHeader>
              <CardTitle>Por Browser</CardTitle>
              <CardDescription>Navegadores utilizados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(browserStats)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 6)
                  .map(([browser, count]) => {
                    const percentage = (count / views.length) * 100;
                    return (
                      <div key={browser} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{browser}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{count}</span>
                          <span className="text-xs text-muted-foreground w-12 text-right">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Sistema Operacional */}
          <Card>
            <CardHeader>
              <CardTitle>Por Sistema Operacional</CardTitle>
              <CardDescription>Distribuição de OS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(osStats)
                  .sort(([, a], [, b]) => b - a)
                  .map(([os, count]) => {
                    const percentage = (count / views.length) * 100;
                    return (
                      <div key={os} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{os}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{count}</span>
                          <span className="text-xs text-muted-foreground w-12 text-right">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Países */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Por País
              </CardTitle>
              <CardDescription>Top países por visualizações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(countryStats)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([country, count]) => {
                    const percentage = (count / views.length) * 100;
                    return (
                      <div key={country} className="flex items-center justify-between">
                        <span className="text-sm">{country}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{count}</span>
                          <span className="text-xs text-muted-foreground w-12 text-right">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Cidades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Por Cidade
              </CardTitle>
              <CardDescription>Top cidades por visualizações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(cityStats)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([city, count]) => {
                    const percentage = (count / views.length) * 100;
                    return (
                      <div key={city} className="flex items-center justify-between">
                        <span className="text-sm">{city}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{count}</span>
                          <span className="text-xs text-muted-foreground w-12 text-right">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Views */}
      {views.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Visualizações Recentes</CardTitle>
            <CardDescription>Últimas 20 views registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {views.slice(0, 20).map((view) => (
                <div key={view.id} className="flex items-center justify-between p-3 border rounded-lg text-sm">
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <span className="text-muted-foreground">Data:</span>{' '}
                      {new Date(view.created).toLocaleString('pt-BR')}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Device:</span>{' '}
                      <span className="capitalize">{view.device || 'unknown'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Local:</span>{' '}
                      {view.city ? `${view.city}, ${view.country}` : view.country || 'Unknown'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Browser:</span>{' '}
                      <span className="capitalize">{view.browser || 'unknown'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
        </TabsContent>
      </Tabs>
    </div>
  );
}


