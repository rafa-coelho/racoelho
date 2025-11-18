import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { invalidateCollection } from '@/lib/cache/cache.service';
import { isAdmin } from '@/lib/pocketbase-server';
import { contentService } from '@/lib/services/content.service';
import { challengeService } from '@/lib/services/challenge.service';
import { salesService } from '@/lib/services/sales.service';

// Coleções válidas que podem ter cache invalidado
const VALID_COLLECTIONS = [
  'posts',
  'challenges',
  'sales_pages',
  'setup',
  'links',
  'social_links',
  'assets',
  'ads',
  'feature_flags',
];

// Mapeamento entre coleções do admin e chaves de cache reais
const COLLECTION_TO_CACHE_KEY: Record<string, string[]> = {
  'links': ['link_items'], // A coleção 'links' usa a chave 'link_items'
  'social_links': ['social_links'],
  'setup': ['setup_items'],
  'assets': ['asset_packs'],
  'ads': ['ads'],
  'posts': ['posts'],
  'challenges': ['challenges'],
  'sales_pages': ['sales_pages'],
  'feature_flags': ['feature_flags'],
};

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação de admin
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Não autenticado como admin' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { collection } = body;

    if (!collection) {
      return NextResponse.json(
        { error: 'Coleção não especificada' },
        { status: 400 }
      );
    }

    if (!VALID_COLLECTIONS.includes(collection)) {
      return NextResponse.json(
        { error: 'Coleção inválida' },
        { status: 400 }
      );
    }

    // Invalidar cache em memória - usar mapeamento para chaves corretas
    const cacheKeys = COLLECTION_TO_CACHE_KEY[collection] || [collection];
    for (const cacheKey of cacheKeys) {
      await invalidateCollection(cacheKey);
    }

    // Invalidar cache do Next.js (ISR/estático)
    // Revalidar rotas relacionadas à coleção
    if (collection === 'posts') {
      // Revalidar página de lista
      revalidatePath('/posts');
      
      // Buscar todos os posts e revalidar cada rota individual
      const posts = await contentService.getAllPosts([], false);
      for (const post of posts) {
        revalidatePath(`/posts/${post.slug}`);
      }
      
      // Revalidar home e links que também mostram posts
      revalidatePath('/');
      revalidatePath('/links');
    } else if (collection === 'challenges') {
      revalidatePath('/listas/desafios');
      
      // Buscar todos os desafios e revalidar cada rota individual
      const challenges = await challengeService.getAllChallenges([], false);
      for (const challenge of challenges) {
        revalidatePath(`/listas/desafios/${challenge.slug}`);
      }
      
      // Revalidar home e links que também mostram challenges
      revalidatePath('/');
      revalidatePath('/links');
    } else if (collection === 'sales_pages') {
      revalidatePath('/venda');
      
      // Buscar todas as páginas de venda e revalidar cada rota individual
      const salesPages = await salesService.getAllSalesPages(false);
      for (const salesPage of salesPages) {
        revalidatePath(`/venda/${salesPage.slug}`);
      }
    } else if (collection === 'links') {
      // Revalidar página de links e home (que também usa linkItems)
      revalidatePath('/links');
      revalidatePath('/');
    } else if (collection === 'social_links') {
      // Revalidar home e links (que usam socialLinks)
      revalidatePath('/');
      revalidatePath('/links');
    } else if (collection === 'setup') {
      // Revalidar página de setup e home
      revalidatePath('/setup');
      revalidatePath('/');
    } else if (collection === 'assets') {
      // Assets aparecem em download e ebooks
      // Revalidar todas as rotas dinâmicas de assets
      revalidatePath('/download');
      revalidatePath('/ebooks');
      revalidatePath('/');
      
      // Buscar todos os asset packs e revalidar rotas individuais
      const { assetService } = await import('@/lib/services/asset.service');
      const assetPacks = await assetService.getAllAssetPacks();
      for (const pack of assetPacks) {
        revalidatePath(`/download/${pack.slug}`);
        revalidatePath(`/ebooks/${pack.slug}`);
      }
    } else if (collection === 'ads') {
      // Ads aparecem em posts e challenges, mas não precisa revalidar tudo
      // O cache de memória já é suficiente
    } else if (collection === 'feature_flags') {
      // Feature flags são usadas em várias páginas, mas o cache é curto (1 min)
      // Revalidar todas as páginas principais que podem usar feature flags
      revalidatePath('/');
      revalidatePath('/posts');
      revalidatePath('/listas/desafios');
      revalidatePath('/links');
    }
    
    // Revalidar feed e sitemap também (sempre que qualquer coleção for invalidada)
    revalidatePath('/feed.xml');
    revalidatePath('/sitemap.xml');

    return NextResponse.json({
      success: true,
      message: `Cache da coleção "${collection}" foi limpo com sucesso`,
    });
  } catch (error: any) {
    console.error('Erro ao invalidar cache:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao invalidar cache' },
      { status: 500 }
    );
  }
}

