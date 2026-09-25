import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import SaleContent from '@/components/SaleContent';
import PreviewBanner from '@/components/PreviewBanner';
import { salesService } from '@/lib/services/sales.service';
import type { SalesPage } from '@/lib/api';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isAdmin } from '@/lib/pocketbase-server';
interface SalesPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: SalesPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const adminStatus = await isAdmin();
    const salesPage = await salesService.getSalesPageBySlug(slug, adminStatus);
    
    if (!salesPage) {
      return {
        title: 'Página não encontrada',
        description: 'A página de vendas que você está procurando não existe ou foi removida.',
      };
    }
    
    const description = salesPage.blocks.find(block => block.type === 'text')?.content?.replace(/<[^>]*>/g, '').substring(0, 160) || ''
    return {
      title: salesPage.title,
      description,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/venda/${salesPage.slug}`,
      },
      openGraph: {
        title: salesPage.title,
        description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/venda/${salesPage.slug}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: salesPage.title,
        description,
      },
    };
  } catch (error) {
    return {
      title: 'Página não encontrada',
      description: 'A página de vendas que você está procurando não existe ou foi removida.',
    };
  }
}

export default async function SalesPage({ params }: SalesPageProps) {
  const { slug } = await params;
  const adminStatus = await isAdmin();
  
  try {
    const salesPage = await salesService.getSalesPageBySlug(slug, adminStatus);
    
    if (!salesPage) {
      notFound();
    }
    
    const isDraft = salesPage.status !== 'published';
    const showPreview = adminStatus && isDraft;
    
    return (
      <>
        {showPreview && <PreviewBanner />}
        {/* JSON-LD: Product (básico) */}
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: salesPage.title,
            description: salesPage.blocks.find((b:any) => b.type==='text')?.content?.replace(/<[^>]*>/g, '') || '',
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/venda/${salesPage.slug}`,
          })}
        </script>
        <Layout>
          <div className="rc-container py-8 md:py-14">
            <div className="mx-auto max-w-4xl">
              <SaleContent salesPage={salesPage} />
            </div>
          </div>
        </Layout>
      </>
    );
  } catch (error) {
    console.error('Error loading sales page:', error);
    return (
      <Layout>
        <div className="rc-container py-12 text-center">
          <h1 className="mb-4 text-rc-h1-m font-semibold text-rc-ink">Página não encontrada</h1>
          <p className="mb-6 text-rc-body text-rc-ink-4">
            A página de vendas que você está procurando não existe ou foi removida.
          </p>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center text-rc-blue-link hover:text-rc-blue-soft"
          >
            <ArrowLeft size={16} className="mr-2" /> Voltar para Home
          </Link>
        </div>
      </Layout>
    );
  }
}

export async function generateStaticParams() {
  const slugs = await salesService.getSalesPageSlugs();
  
  return slugs.map((slug) => ({
    slug,
  }));
} 