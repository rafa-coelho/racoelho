'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageProps {
  src?: string;
  alt: string;
  ratio?: '1/1' | '16/9' | 'auto';
  className?: string;
  imgClassName?: string;
}

const ratios = { '1/1': 'aspect-square', '16/9': 'aspect-video', auto: '' };

// Imagem com fallback hachurado (placeholder do design) quando não há src.
export function RcImage({ src, alt, ratio = '16/9', className, imgClassName }: ImageProps) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn('relative overflow-hidden bg-rc-placeholder', ratios[ratio], className)}>
      {src && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={cn('absolute inset-0 h-full w-full object-cover', imgClassName)} />
      )}
    </div>
  );
}
