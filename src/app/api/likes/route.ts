import { NextRequest, NextResponse } from 'next/server';
import { getPocketBaseServer } from '@/lib/pocketbase-server';
import { featureFlagService } from '@/lib/services/feature-flag.service';
import { clientIp, rateLimit } from '@/lib/utils/rate-limit';
import { createHash } from 'crypto';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG_RE = /^[a-z0-9-]{1,200}$/i;

// Curtidas por post. `postId` é o slug do post (mesma chave usada em /api/views).
// Idempotente: o índice único (post, viewerId) impede duplicatas.
async function parse(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const postId = String(body?.postId || '');
  const viewerId = String(body?.viewerId || '');
  if (!SLUG_RE.test(postId) || !UUID_RE.test(viewerId)) return null;
  return { postId, viewerId };
}

async function findPost(pb: any, slug: string) {
  return pb.collection('posts').getFirstListItem(`slug="${slug}"`, { fields: 'id,likes' });
}

async function recount(pb: any, postRecordId: string): Promise<number> {
  const res = await pb.collection('post_likes').getList(1, 1, { filter: `post="${postRecordId}"`, fields: 'id' });
  const count = res.totalItems || 0;
  // contador desnormalizado em posts.likes
  await pb.collection('posts').update(postRecordId, { likes: count }).catch(() => undefined);
  return count;
}

async function guard(request: NextRequest) {
  if (!(await featureFlagService.isEnabled('likes'))) {
    return NextResponse.json({ error: 'Indisponível' }, { status: 404 });
  }
  if (!rateLimit(`likes:${clientIp(request.headers)}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Muitas requisições' }, { status: 429 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId') || '';
  const viewerId = searchParams.get('viewerId') || '';
  if (!SLUG_RE.test(postId)) return NextResponse.json({ error: 'postId inválido' }, { status: 400 });
  try {
    const pb = await getPocketBaseServer();
    const post = await findPost(pb, postId);
    let liked = false;
    if (UUID_RE.test(viewerId)) {
      liked = !!(await pb.collection('post_likes').getFirstListItem(`post="${post.id}" && viewerId="${viewerId}"`).catch(() => null));
    }
    return NextResponse.json({ liked, count: post.likes || 0 });
  } catch {
    return NextResponse.json({ liked: false, count: 0 });
  }
}

export async function POST(request: NextRequest) {
  const blocked = await guard(request);
  if (blocked) return blocked;
  const input = await parse(request);
  if (!input) return NextResponse.json({ error: 'Entrada inválida' }, { status: 400 });
  try {
    const pb = await getPocketBaseServer();
    const post = await findPost(pb, input.postId);
    const existing = await pb.collection('post_likes').getFirstListItem(`post="${post.id}" && viewerId="${input.viewerId}"`).catch(() => null);
    if (!existing) {
      const ua = request.headers.get('user-agent') || '';
      const sessionId = createHash('sha256').update(`${clientIp(request.headers)}-${ua}`).digest('hex');
      await pb.collection('post_likes').create({ post: post.id, viewerId: input.viewerId, sessionId }).catch(() => undefined);
    }
    const count = await recount(pb, post.id);
    return NextResponse.json({ liked: true, count });
  } catch (error) {
    console.error('[likes] erro:', error);
    return NextResponse.json({ error: 'Erro ao curtir' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const blocked = await guard(request);
  if (blocked) return blocked;
  const input = await parse(request);
  if (!input) return NextResponse.json({ error: 'Entrada inválida' }, { status: 400 });
  try {
    const pb = await getPocketBaseServer();
    const post = await findPost(pb, input.postId);
    const existing = await pb.collection('post_likes').getFirstListItem(`post="${post.id}" && viewerId="${input.viewerId}"`).catch(() => null);
    if (existing) await pb.collection('post_likes').delete(existing.id);
    const count = await recount(pb, post.id);
    return NextResponse.json({ liked: false, count });
  } catch (error) {
    console.error('[likes] erro:', error);
    return NextResponse.json({ error: 'Erro ao descurtir' }, { status: 500 });
  }
}
