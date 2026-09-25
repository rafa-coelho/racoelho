'use client';

import { useAd } from '@/hooks/use-ad';
import { adService } from '@/lib/services/ad.service';
import { cn } from '@/lib/utils';
import { Placement } from '@/lib/services/adOrchestrator';
import { useEffect } from 'react';
import { analyticsService } from '@/lib/services/analytics.service';

interface AdSlotProps {
  // legado
  position?: string;
  // novo fluxo: quando fornecer placement, ignora o hook legado
  placement?: Placement;
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
export default function AdSlot({ position, placement, size = '300x300', className }: AdSlotProps) {
  const useLegacy = !!position && !placement;
  const { adConfig, loading, error } = useLegacy ? useAd(position as any) : { adConfig: null as any, loading: false, error: null } as any;

  // Determina dimensões baseado no tamanho
  const dimensions = {
    '300x300': { width: 300, height: 300 },
    '728x90': { width: 728, height: 90 },
    '300x600': { width: 300, height: 600 }
  }[size];

  // Slot de anúncio (rebranding): borda tracejada, fundo rc-ad, rótulo mono uppercase
  const baseClasses = 'rounded-rc-card bg-rc-ad border border-dashed border-rc-border-strong';
  const labelClasses = 'font-mono text-[10.5px] uppercase tracking-[.1em] text-rc-ink-6';

  // track impressão para novo fluxo
  useEffect(() => {
    if (placement) {
      const label = placement.kind === 'internal' ? `${placement.adId}:${placement.slotType}` : `google:${placement.slotType}`;
      analyticsService.event('ad_impression', 'ads', label);
    }
  }, [placement?.kind, (placement as any)?.adId, (placement as any)?.slotType]);

  // Loading state
  if (useLegacy && loading) {
    return (
      <div className={cn(baseClasses, 'p-3', className)}>
        <div className="text-center">
          <p className={cn(labelClasses, 'mb-2')}>Publicidade</p>
          <div 
            className="bg-rc-surface-2 rounded-lg flex items-center justify-center animate-pulse"
            style={{ height: dimensions.height }}
          >
            <p className="text-xs text-rc-ink-6">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (useLegacy && (error || !adConfig)) {
    return (
      <div className={cn(baseClasses, 'p-3', className)}>
        <div className="text-center">
          <p className={cn(labelClasses, 'mb-2')}>Publicidade</p>
          <div 
            className="bg-rc-surface-2 rounded-lg flex items-center justify-center"
            style={{ height: dimensions.height }}
          >
            <p className="text-xs text-rc-ink-6">Ad {size}</p>
          </div>
        </div>
      </div>
    );
  }

  // Custom Ad (mockado)
  if (useLegacy && adConfig.type === 'custom' && adConfig.data) {
    const ad = adConfig.data;

    const handleClick = () => {
      adService.trackAdClick(ad);
    };

    return (
      <div className={cn(baseClasses, 'overflow-hidden', className)}>
        <p className={cn(labelClasses, 'text-center pt-2 pb-1')}>Publicidade</p>
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

  // Google Ads - only render if actually configured
  if (useLegacy && adConfig.type === 'google') {
    if (!adConfig.googleClientId && !adConfig.googleAdSlot) return null;
    return (
      <div className={cn(baseClasses, 'p-3', className)}>
        <div className="text-center">
          <p className={cn(labelClasses, 'mb-2')}>Publicidade</p>
          <div
            className="bg-rc-surface-2 rounded-lg flex items-center justify-center"
            style={{ height: dimensions.height }}
          >
            {/* Google AdSense integration placeholder */}
            <div className="text-center">
              <p className="text-xs text-rc-ink-6 mb-1">Google Ads</p>
              <p className="text-[10px] text-rc-ink-6">{size}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Novo fluxo via placement
  if (placement) {
    if (placement.kind === 'none') {
      return null;
    }

    if (placement.kind === 'internal') {
      const clickLabel = `${placement.adId}:${placement.slotType}`;
      return (
        <div className={cn(baseClasses, 'overflow-hidden', className)}>
          <p className={cn(labelClasses, 'text-center pt-2 pb-1')}>Publicidade</p>
          <a
            href={placement.clickUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block hover:opacity-90 transition-opacity"
            title={placement.title}
            onClick={() => analyticsService.event('ad_click', 'ads', clickLabel)}
          >
            <img
              src={placement.imageUrl}
              alt={placement.title}
              className="w-full h-auto object-cover"
              style={{ maxHeight: dimensions.height }}
            />
          </a>
        </div>
      );
    }

    // google fallback - don't render empty placeholder
    return null;
  }

  return null;
}

