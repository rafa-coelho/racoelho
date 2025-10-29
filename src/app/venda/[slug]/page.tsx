import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import SaleContent from '@/components/SaleContent';
import PreviewBanner from '@/components/PreviewBanner';
import { salesService } from '@/lib/services/sales.service';
import type { SalesPage } from '@/lib/api';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isAdmin } from '@/lib/services/auth.service';
interface SalesPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ preview?: string }>;
}

export async function generateMetadata({ params, searchParams }: SalesPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { preview } = await searchParams;
    const adminStatus = await isAdmin();
    const isPreview = adminStatus || preview === 'true';
    const salesPage = await salesService.getSalesPageBySlug(slug, isPreview);
    
    if (!salesPage) {
      return {
        title: 'Página não encontrada',
        description: 'A página de vendas que você está procurando não existe ou foi removida.',
      };
    }
    
    return {
      title: salesPage.title,
      description: salesPage.blocks.find(block => block.type === 'text')?.content?.replace(/<[^>]*>/g, '').substring(0, 160) || '',
    };
  } catch (error) {
    return {
      title: 'Página não encontrada',
      description: 'A página de vendas que você está procurando não existe ou foi removida.',
    };
  }
}

export default async function SalesPage({ params, searchParams }: SalesPageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const adminStatus = await isAdmin();
  // Preview se for admin OU se tiver ?preview=true na URL
  const isPreview = adminStatus || preview === 'true';
  
  try {
    const salesPage = await salesService.getSalesPageBySlug(slug, isPreview);
    
    if (!salesPage) {
      notFound();
    }
    
    return (
      <>
        {isPreview && <PreviewBanner />}
        <Layout>
          <div className="content-container py-12">
            <div className="max-w-4xl mx-auto">
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
        <div className="content-container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Página não encontrada</h1>
          <p className="text-muted-foreground mb-6">
            A página de vendas que você está procurando não existe ou foi removida.
          </p>
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:text-primary/80"
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