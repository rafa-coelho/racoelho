'use client';

import { useEffect, useState } from 'react';
import { GetSocialIcon } from '@/components/LinksContent';
import { Button, cardClasses } from '@/components/rc';
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
      <div className="rc-container flex min-h-[80vh] items-center justify-center">
        <div className={cardClasses({ size: 'lg', className: 'w-full max-w-md p-6 text-center md:p-8' })}>
          <h1 className="text-rc-h2 font-semibold text-rc-ink">Carregando...</h1>
          <p className="mt-1.5 text-rc-small text-rc-ink-4">Preparando redirecionamento</p>
          <div className="mx-auto mt-6 h-10 w-10 animate-spin rounded-full border-2 border-rc-border-strong border-t-rc-blue-link" />
        </div>
      </div>
    );
  }

  if (error || !redirectData) {
    return (
      <div className="rc-container flex min-h-[80vh] items-center justify-center">
        <div className={cardClasses({ size: 'lg', className: 'w-full max-w-md p-6 text-center md:p-8' })}>
          <h1 className="text-rc-h2 font-semibold text-rc-ink">Link não encontrado</h1>
          <p className="mt-1.5 text-rc-small text-rc-ink-4">Este link pode ter expirado ou não existe.</p>
          <Button onClick={() => window.location.href = '/'} className="mt-6 h-12">
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rc-container flex min-h-[80vh] items-center justify-center">
      <div className={cardClasses({ size: 'lg', className: 'w-full max-w-md p-6 text-center md:p-8' })}>
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-rc-card border border-rc-blue-border bg-rc-blue-chip text-xl text-rc-blue-link">
          {GetSocialIcon(redirectData.type)}
        </div>
        <h1 className="text-rc-h2 font-semibold text-rc-ink">Redirecionando para {redirectData.type}</h1>
        <p className="mt-1.5 text-rc-small text-rc-ink-4">
          Você será redirecionado em {countdown} segundos
        </p>
        <div
          className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-rc-surface-2"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.max(0, Math.round(progress))}
        >
          <div className="h-full bg-rc-blue transition-[width] duration-1000 ease-linear" style={{ width: `${Math.max(0, progress)}%` }} />
        </div>
        <p className="mt-4 break-all font-mono text-rc-meta text-rc-ink-5">{redirectData.url}</p>
        <Button onClick={handleRedirectNow} className="mt-6 h-12">
          Redirecionar agora
        </Button>
      </div>
    </div>
  );
}
