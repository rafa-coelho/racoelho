import { redirect } from 'next/navigation';
import Script from 'next/script';

interface EbookRedirectProps {
  params: {
    slug: string;
  };
}

export default function EbookRedirect({ params }: EbookRedirectProps) {
  // Redireciona para a nova rota /venda/[slug]
  return (
    <>
      <Script
        id="gtag-redirect"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            gtag('event', 'redirect', {
              'event_category': 'navigation',
              'event_label': 'ebooks-to-venda',
              'value': '${params.slug}'
            });
          `,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.location.href = '/venda/${params.slug}';
          `,
        }}
      />
    </>
  );
} 