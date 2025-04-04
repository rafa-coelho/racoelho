import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@/components/Analytics';
import { BLOG_NAME, DESCRIPTION } from '@/lib/config/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: BLOG_NAME,
    template: `%s | ${BLOG_NAME}`,
  },
  description: DESCRIPTION,
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/favicon/favicon.ico' },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  openGraph: {
    title: BLOG_NAME,
    description: DESCRIPTION,
    url: process.env.NEXT_PUBLIC_SITE_URL,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Analytics />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
} 