import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SITE_URL } from '@/lib/config/constants';

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Receba conteúdos sobre desenvolvimento, tecnologia e programação direto no seu e-mail.',
  alternates: { canonical: `${SITE_URL}/newsletter` },
};

export default function NewsletterLayout({ children }: { children: ReactNode }) {
  return children;
}
