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
];

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

    // Invalidar cache em memória da coleção
    await invalidateCollection(collection);

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
    } else if (collection === 'challenges') {
      revalidatePath('/listas/desafios');
      
      // Buscar todos os desafios e revalidar cada rota individual
      const challenges = await challengeService.getAllChallenges([], false);
      for (const challenge of challenges) {
        revalidatePath(`/listas/desafios/${challenge.slug}`);
      }
    } else if (collection === 'sales_pages') {
      revalidatePath('/venda');
      
      // Buscar todas as páginas de venda e revalidar cada rota individual
      const salesPages = await salesService.getAllSalesPages(false);
      for (const salesPage of salesPages) {
        revalidatePath(`/venda/${salesPage.slug}`);
      }
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

