import { NextRequest, NextResponse } from 'next/server';
import { getPublicPocketBaseClient } from '@/lib/auth';
import { getViewData, isValidViewerId } from '@/lib/analytics';
import PocketBase from 'pocketbase';

/**
 * Retorna um cliente PocketBase autenticado como admin
 * TEMPORÁRIO: Usado porque as permissões não foram configuradas corretamente no PB
 * TODO: Configurar permissões públicas no PocketBase Admin UI e remover isso
 * Inclui retry para lidar com timeouts
 */
async function getAdminPocketBaseClient(retries = 3) {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await pb.admins.authWithPassword(
        process.env.PB_ADMIN_EMAIL!,
        process.env.PB_ADMIN_PASSWORD!
      );
      return pb;
    } catch (error: any) {
      const isTimeout = error?.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || error?.status === 0;
      const isLastAttempt = attempt === retries;
      
      if (isTimeout && !isLastAttempt) {
        console.warn(`[Views API] Auth timeout (attempt ${attempt}/${retries}), retrying...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }
      
      console.error('[Views API] Failed to auth as admin:', error);
      return getPublicPocketBaseClient();
    }
  }
  
  return getPublicPocketBaseClient();
}

/**
 * API Route para registrar visualizações de posts e desafios
 * 
 * POST /api/views
 * Body: { postId?: string, challengeId?: string, viewerId: string }
 * 
 * Registra view única baseada em:
 * - sessionId (hash de IP + UserAgent)
 * - viewerId (UUID do localStorage)
 * 
 * Se a combinação já existir, não registra novamente (view única)
 * 
 * IMPORTANTE: Temporariamente usa credenciais admin porque as collections
 * ainda não têm createRule=null configurado no PocketBase Admin UI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, challengeId, viewerId } = body;

    // Validação básica
    if (!viewerId || !isValidViewerId(viewerId)) {
      return NextResponse.json(
        { error: 'viewerId inválido' },
        { status: 400 }
      );
    }

    if (!postId && !challengeId) {
      return NextResponse.json(
        { error: 'postId ou challengeId é obrigatório' },
        { status: 400 }
      );
    }

    // Extrai dados de analytics da requisição
    const viewData = await getViewData(viewerId);

    // TEMPORÁRIO: Usa cliente admin até configurar permissões públicas no PB
    const pb = await getAdminPocketBaseClient();

    // Registra view do post
    if (postId) {
      try {
        // Verifica se já existe essa combinação
        const existing = await pb.collection('post_views').getFirstListItem(
          `postId="${postId}" && sessionId="${viewData.sessionId}" && viewerId="${viewData.viewerId}"`,
          { requestKey: null } // Disable auto cancellation
        ).catch(() => null);

        if (!existing) {
          // Só cria se não existir
          await pb.collection('post_views').create({
            postId,
            ...viewData,
          });
        }
      } catch (error: any) {
        // Ignora erros silenciosamente para não impactar UX
        console.error('[Views API] Error tracking post view:', error);
      }
    }

    // Registra view do desafio
    if (challengeId) {
      try {
        const existing = await pb.collection('challenge_views').getFirstListItem(
          `challengeId="${challengeId}" && sessionId="${viewData.sessionId}" && viewerId="${viewData.viewerId}"`,
          { requestKey: null }
        ).catch(() => null);

        if (!existing) {
          await pb.collection('challenge_views').create({
            challengeId,
            ...viewData,
          });
        }
      } catch (error: any) {
        console.error('[Views API] Error tracking challenge view:', error);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error('[Views API] Error tracking view:', error);
    
    // Retorna sucesso mesmo com erro para não impactar UX
    // Apenas loga o erro para monitoramento
    return NextResponse.json(
      { success: true }, // Retorna sucesso para não afetar experiência do usuário
      { status: 200 }
    );
  }
}

/**
 * GET /api/views?postId=xxx ou ?challengeId=xxx
 * Retorna estatísticas de views de um post ou desafio
 * 
 * Usa cliente público pois listRule deveria ser null (permissão pública de leitura)
 * Se falhar, tenta com credenciais admin
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const challengeId = searchParams.get('challengeId');

    if (!postId && !challengeId) {
      return NextResponse.json(
        { error: 'postId ou challengeId é obrigatório' },
        { status: 400 }
      );
    }

    // Tenta primeiro com cliente público, se falhar usa admin
    let pb = getPublicPocketBaseClient();

    let stats = {
      total: 0,
      unique: 0,
      bySessions: 0,
    };

    try {
      if (postId) {
        const views = await pb.collection('post_views').getFullList({
          filter: `postId="${postId}"`,
        });
        
        stats.total = views.length;
        stats.unique = new Set(views.map((v: any) => v.viewerId)).size;
        stats.bySessions = new Set(views.map((v: any) => v.sessionId)).size;
      }

      if (challengeId) {
        const views = await pb.collection('challenge_views').getFullList({
          filter: `challengeId="${challengeId}"`,
        });
        
        stats.total = views.length;
        stats.unique = new Set(views.map((v: any) => v.viewerId)).size;
        stats.bySessions = new Set(views.map((v: any) => v.sessionId)).size;
      }
    } catch (error: any) {
      // Se falhar com público, tenta com admin
      if (error.status === 403) {
        console.log('[Views API] Public access failed, trying with admin credentials');
        pb = await getAdminPocketBaseClient();
        
        if (postId) {
          const views = await pb.collection('post_views').getFullList({
            filter: `postId="${postId}"`,
          });
          
          stats.total = views.length;
          stats.unique = new Set(views.map((v: any) => v.viewerId)).size;
          stats.bySessions = new Set(views.map((v: any) => v.sessionId)).size;
        }

        if (challengeId) {
          const views = await pb.collection('challenge_views').getFullList({
            filter: `challengeId="${challengeId}"`,
          });
          
          stats.total = views.length;
          stats.unique = new Set(views.map((v: any) => v.viewerId)).size;
          stats.bySessions = new Set(views.map((v: any) => v.sessionId)).size;
        }
      } else {
        throw error;
      }
    }

    return NextResponse.json(stats, { status: 200 });
    
  } catch (error) {
    console.error('[Views API] Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
}
