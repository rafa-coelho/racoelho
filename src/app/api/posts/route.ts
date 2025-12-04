import { NextRequest, NextResponse } from 'next/server';
import { contentService } from '@/lib/services/content.service';
import { isAdmin } from '@/lib/pocketbase-server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const tag = searchParams.get('tag') || '';

  try {
    const adminStatus = await isAdmin();

    // Buscar todos os posts (com cache)
    const allPosts = await contentService.getAllPosts(
      ['title', 'slug', 'date', 'excerpt', 'tags', 'coverImage', 'content'],
      adminStatus
    );

    // Filtrar posts baseado nos parâmetros
    let filteredPosts = allPosts;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower)
      );
    }

    if (tag) {
      filteredPosts = filteredPosts.filter(post =>
        post.tags?.includes(tag)
      );
    }

    // Calcular paginação
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
