import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import '@/styles/prism-theme.css';
import { AnalyticsWrapper } from '@/components/Analytics';
import { BLOG_NAME, SITE_TITLE, DESCRIPTION, SITE_URL } from '@/lib/config/constants';

const inter = Inter({ subsets: ['latin'] });

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
  robots: {
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
    <html lang="pt-br" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={inter.className}>
        <AnalyticsWrapper />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
} 