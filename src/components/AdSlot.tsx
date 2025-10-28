'use client';

import { useAd } from '@/hooks/use-ad';
import { AdPosition } from '@/lib/types/ads';
import { adService } from '@/lib/services/ads';
import { cn } from '@/lib/utils';

interface AdSlotProps {
  position: AdPosition;
  size?: '300x300' | '728x90' | '300x600';
  className?: string;
}

/**
 * Componente para renderizar anúncios.
 * Alterna automaticamente entre ads mockados e Google Ads.
 * 
 * @example
 * ```tsx
 * <AdSlot position="post:sidebar-left" size="300x300" />
 * ```
 */
export default function AdSlot({ position, size = '300x300', className }: AdSlotProps) {
  const { adConfig, loading, error } = useAd(position);

  // Determina dimensões baseado no tamanho
  const dimensions = {
    '300x300': { width: 300, height: 300 },
    '728x90': { width: 728, height: 90 },
    '300x600': { width: 300, height: 600 }
  }[size];

  // Classes base para o container - mais discreto
  const baseClasses = 'rounded-lg bg-card/30 backdrop-blur-sm border border-white/5';

  // Loading state
  if (loading) {
    return (
      <div className={cn(baseClasses, 'p-3', className)}>
        <div className="text-center">
          <p className="text-[10px] text-muted-foreground/60 mb-2 uppercase tracking-wider">Publicidade</p>
          <div 
            className="bg-secondary/30 rounded flex items-center justify-center animate-pulse"
            style={{ height: dimensions.height }}
          >
            <p className="text-xs text-muted-foreground/40">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !adConfig) {
    return (
      <div className={cn(baseClasses, 'p-3', className)}>
        <div className="text-center">
          <p className="text-[10px] text-muted-foreground/60 mb-2 uppercase tracking-wider">Publicidade</p>
          <div 
            className="bg-secondary/30 rounded flex items-center justify-center"
            style={{ height: dimensions.height }}
          >
            <p className="text-xs text-muted-foreground/40">Ad {size}</p>
          </div>
        </div>
      </div>
    );
  }

  // Custom Ad (mockado)
  if (adConfig.type === 'custom' && adConfig.data) {
    const ad = adConfig.data;

    const handleClick = () => {
      adService.trackAdClick(ad);
    };

    return (
      <div className={cn(baseClasses, 'overflow-hidden', className)}>
        <p className="text-[10px] text-muted-foreground/50 text-center pt-2 pb-1 uppercase tracking-wider">Publicidade</p>
        <a
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className="block hover:opacity-90 transition-opacity"
          title={ad.title}
        >
          <img
            src={ad.image}
            alt={ad.altText}
            className="w-full h-auto object-cover"
            style={{ maxHeight: dimensions.height }}
            onError={(e) => {
              // Fallback se imagem não carregar
              e.currentTarget.src = `https://via.placeholder.com/${size}?text=${encodeURIComponent(ad.title)}`;
            }}
          />
        </a>
      </div>
    );
  }

  // Google Ads
  if (adConfig.type === 'google') {
    return (
      <div className={cn(baseClasses, 'p-3', className)}>
        <div className="text-center">
          <p className="text-[10px] text-muted-foreground/60 mb-2 uppercase tracking-wider">Publicidade</p>
          <div 
            className="bg-secondary/30 rounded flex items-center justify-center"
            style={{ height: dimensions.height }}
          >
            {/* Placeholder para Google Ads */}
            {/* Aqui você pode integrar o script do Google AdSense futuramente */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground/50 mb-1">Google Ads</p>
              <p className="text-[10px] text-muted-foreground/40">{size}</p>
              {adConfig.googleAdSlot && (
                <p className="text-[10px] text-muted-foreground/30 mt-1">Slot: {adConfig.googleAdSlot}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback (não deve acontecer)
  return null;
}

