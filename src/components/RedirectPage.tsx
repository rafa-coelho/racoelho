'use client';

import { useEffect, useState } from 'react';
import { GetSocialIcon } from '@/components/LinksContent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { analyticsService } from '@/lib/services/analytics.service';

interface RedirectPageProps {
  shortId: string;
  countdownSeconds?: number;
}

export default function RedirectPage({ 
  shortId, 
  countdownSeconds = 5 
}: RedirectPageProps) {
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [progress, setProgress] = useState(100);
  const [redirectData, setRedirectData] = useState<{url: string, type: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Buscar informações do link da API externa
    const fetchRedirectData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/redirect/${shortId}`);
        
        if (!response.ok) {
          throw new Error('Link não encontrado');
        }
        
        const data = await response.json();
        setRedirectData(data);
        
        // Registrar evento de visualização
        analyticsService.event('short_link_viewed', 'links', data.type);
      } catch (err) {
        setError('Link não encontrado ou expirado');
        console.error('Erro ao buscar dados do link:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRedirectData();
  }, [shortId]);

  useEffect(() => {
    if (!redirectData) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = redirectData.url;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressTimer);
          return 0;
        }
        return prev - (100 / countdownSeconds);
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, [redirectData, countdownSeconds]);

  const handleRedirectNow = () => {
    if (redirectData) {
      // Registrar evento de clique
      analyticsService.event('short_link_clicked', 'links', redirectData.type);
      window.location.href = redirectData.url;
    }
  };

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Carregando...</CardTitle>
            <CardDescription>
              Preparando redirecionamento
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !redirectData) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Link não encontrado</CardTitle>
            <CardDescription>
              Este link pode ter expirado ou não existe.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.location.href = '/'}>
              Voltar para a página inicial
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10">
              {GetSocialIcon(redirectData.type)}
            </div>
          </div>
          <CardTitle>Redirecionando para {redirectData.type}</CardTitle>
          <CardDescription>
            Você será redirecionado em {countdown} segundos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-4" />
          <p className="text-sm text-muted-foreground text-center">
            {redirectData.url}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleRedirectNow}>
            Redirecionar agora
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 