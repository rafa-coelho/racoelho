import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import SaleContent from '@/components/SaleContent';
import { getSalesPageBySlug, getSalesPageSlugs } from '@/lib/api';
import type { SalesPage } from '@/lib/api';
import { Metadata } from 'next';

interface SalesPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: SalesPageProps): Promise<Metadata> {
  try {
    const salesPage = getSalesPageBySlug(params.slug);
    
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

export default function SalesPage({ params }: SalesPageProps) {
  const { slug } = params;
  
  try {
    const salesPage = getSalesPageBySlug(slug);
    
    return (
      <Layout>
        <div className="content-container py-12">
          <div className="max-w-4xl mx-auto">
            <SaleContent salesPage={salesPage} />
          </div>
        </div>
      </Layout>
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
  const slugs = getSalesPageSlugs();
  
  return slugs.map((slug) => ({
    slug,
  }));
} 