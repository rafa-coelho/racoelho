'use client';

import { useState } from 'react';
import { AtSign, Linkedin, Copy, Check } from 'lucide-react';
import { generateShareLinks, openSharePopup } from '@/lib/utils/share';
import { useFeatureFlags, useFeatureFlagWithMetadata } from '@/hooks/use-feature-flag';

type ShareVariant = 'sidebar' | 'inline';

interface ShareButtonsProps {
  title: string;
  url: string;
  variant?: ShareVariant; // sidebar: lista vertical; inline: ícones alinhados
  className?: string;
}

// Ícone customizado para X (Twitter)
const XIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Ícone customizado para WhatsApp
const WhatsAppIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function ShareButtons({ title, url, variant = 'sidebar', className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Flags
  const { flags } = useFeatureFlags(['share']);
  const { flag: shareFlag } = useFeatureFlagWithMetadata('share');
  if (!flags.share) return null;

  const allowedNetworks: string[] = Array.isArray(shareFlag?.metadata?.networks)
    ? (shareFlag!.metadata!.networks as string[])
    : ['threads', 'x', 'linkedin', 'whatsapp'];

  const links = generateShareLinks(title, url);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const chip =
    'inline-flex h-10 items-center gap-2 rounded-lg border border-rc-border-chip bg-rc-surface px-3 font-mono text-xs text-rc-nav-ink transition-colors duration-150 hover:border-rc-border-hover hover:text-rc-ink md:h-9';

  const buttons = (
    <>
      {allowedNetworks.includes('x') && (
        <button type="button" onClick={() => openSharePopup(links.x)} className={chip} aria-label="Compartilhar no X">
          <XIcon size={13} /> x / twitter
        </button>
      )}
      {allowedNetworks.includes('linkedin') && (
        <button type="button" onClick={() => openSharePopup(links.linkedin)} className={chip} aria-label="Compartilhar no LinkedIn">
          <Linkedin size={14} strokeWidth={1.75} /> linkedin
        </button>
      )}
      {allowedNetworks.includes('threads') && (
        <button type="button" onClick={() => openSharePopup(links.threads)} className={chip} aria-label="Compartilhar no Threads">
          <AtSign size={14} strokeWidth={1.75} /> threads
        </button>
      )}
      {allowedNetworks.includes('whatsapp') && (
        <button type="button" onClick={() => openSharePopup(links.whatsapp, 600, 600)} className={chip} aria-label="Compartilhar no WhatsApp">
          <WhatsAppIcon size={13} /> whatsapp
        </button>
      )}
      <button type="button" onClick={handleCopy} className={chip} aria-label="Copiar link">
        {copied ? <Check size={14} className="text-rc-green" /> : <Copy size={14} strokeWidth={1.75} />}
        {copied ? 'copiado' : 'copiar link'}
      </button>
    </>
  );

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-2 md:gap-3 ${className || ''}`}>
        <span className="w-full font-mono text-xs text-rc-ink-5 md:w-auto">compartilhar:</span>
        {buttons}
      </div>
    );
  }

  // sidebar
  return (
    <div className={`rounded-rc-card border border-rc-border-card bg-rc-surface p-5 ${className || ''}`}>
      <div className="font-mono text-rc-eyebrow uppercase text-rc-ink-5">Compartilhar</div>
      <div className="mt-3.5 flex flex-wrap gap-2">{buttons}</div>
    </div>
  );
}
