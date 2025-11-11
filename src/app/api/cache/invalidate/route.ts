import { NextRequest, NextResponse } from 'next/server';
import { invalidateCollection } from '@/lib/cache/cache.service';
import { isAdmin } from '@/lib/pocketbase-server';

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

    // Invalidar cache da coleção
    await invalidateCollection(collection);

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

