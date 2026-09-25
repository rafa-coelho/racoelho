import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
// import '@/styles/prism-theme.css';
import { AnalyticsWrapper } from '@/components/Analytics';
import { BLOG_NAME, SITE_TITLE, DESCRIPTION, SITE_URL } from '@/lib/config/constants';

// Geist vem do pacote `geist` (o next/font/google do Next 14.1 ainda não tem Geist).
// Ambiente de staging: nunca indexar e mostrar um selo para não confundir com produção.
const IS_STAGING = process.env.NEXT_PUBLIC_SITE_ENV === 'staging';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://racoelho.com.br'),
  title: {
    default: SITE_TITLE,
    template: `%s | ${BLOG_NAME}`,
  },
  description: DESCRIPTION,
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/raise.png' },
    ],
  },
  // manifest servido por src/app/manifest.ts em /manifest.webmanifest
  appleWebApp: {
    capable: true,
    title: `${BLOG_NAME} Admin`,
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: BLOG_NAME,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: BLOG_NAME,
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: BLOG_NAME,
    description: DESCRIPTION,
  },
  robots: IS_STAGING
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
      },
};

export const viewport: Viewport = {
  themeColor: '#0b0f1a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-br"
      className={`dark ${GeistSans.variable} ${jetbrainsMono.variable}`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="font-sans">
        <AnalyticsWrapper />
        {IS_STAGING && (
          <div className="pointer-events-none fixed bottom-3 left-3 z-[60] rounded-full border border-rc-amber-border bg-rc-amber-surface px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[.1em] text-rc-amber">
            staging
          </div>
        )}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
} 