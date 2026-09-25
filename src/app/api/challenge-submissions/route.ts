import { NextRequest, NextResponse } from 'next/server';
import { getPocketBaseServer, isAdmin } from '@/lib/pocketbase-server';
import { sendRawMail } from '@/lib/services/mailer.service';
import { authorInfo } from '@/lib/config/constants';
import { featureFlagService } from '@/lib/services/feature-flag.service';
import { challengeSubmissionService, EMAIL_RE, isValidRepoUrl, isValidUrl } from '@/lib/services/challenge-submission.service';
import { clientIp, rateLimit } from '@/lib/utils/rate-limit';
import type { ChallengeSubmissionStatus } from '@/lib/types';

export const runtime = 'nodejs';

function esc(s: string): string {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// POST (form): challengeId, name, email, repoUrl, demoUrl?, notes?, website (honeypot)
export async function POST(request: NextRequest) {
  if (!(await featureFlagService.isEnabled('challenge_submissions'))) {
    return NextResponse.json({ error: 'Indisponível' }, { status: 404 });
  }
  try {
    const form = await request.formData();
    const get = (k: string) => String(form.get(k) || '').trim();

    // honeypot: robô preencheu, fingimos sucesso
    if (get('website')) return NextResponse.json({ success: true });

    if (!rateLimit(`submissions:${clientIp(request.headers)}`, 3, 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Muitos envios. Tenta de novo em uma hora.' }, { status: 429 });
    }

    const challengeSlug = get('challengeId');
    const name = get('name');
    const email = get('email');
    const repoUrl = get('repoUrl');
    const demoUrl = get('demoUrl');
    const notes = get('notes');

    if (!/^[a-z0-9-]{1,200}$/i.test(challengeSlug)) return NextResponse.json({ error: 'Desafio inválido' }, { status: 400 });
    if (name.length < 2) return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    if (!isValidRepoUrl(repoUrl)) return NextResponse.json({ error: 'Repositório precisa ser do GitHub, GitLab ou Bitbucket' }, { status: 400 });
    if (demoUrl && !isValidUrl(demoUrl)) return NextResponse.json({ error: 'URL de demo inválida' }, { status: 400 });
    if (notes.length > 1000) return NextResponse.json({ error: 'Observações: máximo de 1000 caracteres' }, { status: 400 });

    // 1) salvar no PocketBase
    let saved = false;
    let challengeTitle = challengeSlug;
    try {
      const pb = await getPocketBaseServer();
      const challenge = await pb.collection('challenges').getFirstListItem(`slug="${challengeSlug}"`, { fields: 'id,title' });
      challengeTitle = challenge.title;
      await challengeSubmissionService.upsert({ challenge: challenge.id, name, email, repoUrl, demoUrl: demoUrl || undefined, notes: notes || undefined });
      saved = true;
    } catch (pbErr) {
      console.error('[challenge-submissions] falha ao salvar:', pbErr);
    }

    // 2) notificar por email; só falha se as duas coisas falharem
    const notifyTo = process.env.SUBMISSIONS_NOTIFY_EMAIL || authorInfo.email || process.env.MAILER_USER || '';
    let mailed = false;
    if (notifyTo) {
      try {
        await sendRawMail({
          to: notifyTo,
          replyTo: email,
          subject: `Solução de desafio: ${challengeTitle} — ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; color:#111; line-height:1.6;">
              <h2 style="margin:0 0 12px;">Nova solução de desafio</h2>
              <p><strong>Desafio:</strong> ${esc(challengeTitle)}</p>
              <p><strong>Nome:</strong> ${esc(name)}<br><strong>Email:</strong> ${esc(email)}</p>
              <p><strong>Repositório:</strong> <a href="${esc(repoUrl)}">${esc(repoUrl)}</a></p>
              ${demoUrl ? `<p><strong>Demo:</strong> <a href="${esc(demoUrl)}">${esc(demoUrl)}</a></p>` : ''}
              ${notes ? `<p><strong>Observações:</strong><br>${esc(notes).replace(/\n/g, '<br>')}</p>` : ''}
              <p style="color:#666">Registro PB: ${saved ? 'salvo' : 'não salvo (ver logs)'}</p>
            </div>`,
        });
        mailed = true;
      } catch (mailErr) {
        console.error('[challenge-submissions] falha ao enviar email:', mailErr);
      }
    }

    if (!saved && !mailed) {
      return NextResponse.json({ error: 'Não foi possível registrar o envio. Tente novamente.' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[challenge-submissions] erro:', error);
    return NextResponse.json({ error: 'Erro ao processar envio' }, { status: 500 });
  }
}

// GET (admin): lista com filtro ?challenge=&status=
export async function GET(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Não autenticado como admin' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as ChallengeSubmissionStatus | null;
  const items = await challengeSubmissionService.list({
    challenge: searchParams.get('challenge') || undefined,
    status: status && ['new', 'reviewed', 'featured', 'rejected'].includes(status) ? status : undefined,
  });
  return NextResponse.json({ items });
}
