import type { MetadataRoute } from 'next';
import { BLOG_NAME } from '@/lib/config/constants';

// PWA "app do admin": instalável na tela inicial, abre direto em /admin
// em tela cheia (standalone). Ícone reaproveita /raise.png (512x512).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BLOG_NAME} Admin`,
    short_name: `${BLOG_NAME} Admin`,
    description: 'Painel administrativo do Racoelho',
    start_url: '/admin',
    scope: '/admin',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0b0f1a',
    theme_color: '#0b0f1a',
    icons: [
      {
        src: '/raise.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/raise.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/raise.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
