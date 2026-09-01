import { NextRequest, NextResponse } from 'next/server';
import { getPocketBaseServer } from '@/lib/pocketbase-server';
import { sendRawMail } from '@/lib/services/mailer.service';
import { authorInfo } from '@/lib/config/constants';

export const runtime = 'nodejs';

const MAX_CV_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_CV = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esc(s: string): string {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    const vagaSlug = String(form.get('vagaSlug') || '').trim();
    const vagaTitle = String(form.get('vagaTitle') || '').trim();
    const referralId = String(form.get('referralId') || '').trim();
    const candidateName = String(form.get('candidateName') || '').trim();
    const candidateEmail = String(form.get('candidateEmail') || '').trim();
    const linkedinUrl = String(form.get('linkedinUrl') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const cv = form.get('cv');

    // Validações server-side (não confiar só no client)
    if (!vagaTitle || !vagaSlug) {
      return NextResponse.json({ error: 'Vaga inválida' }, { status: 400 });
    }
    if (candidateName.length < 2) {
      return NextResponse.json({ error: 'Nome do candidato é obrigatório' }, { status: 400 });
    }
    if (!emailRegex.test(candidateEmail)) {
      return NextResponse.json({ error: 'E-mail do candidato inválido' }, { status: 400 });
    }
    if (!/linkedin\.com/i.test(linkedinUrl)) {
      return NextResponse.json({ error: 'URL do LinkedIn inválida' }, { status: 400 });
    }

    // CV opcional — valida tipo/tamanho quando presente
    let cvFile: File | null = null;
    if (cv && cv instanceof File && cv.size > 0) {
      if (cv.size > MAX_CV_BYTES) {
        return NextResponse.json({ error: 'CV excede 10 MB' }, { status: 400 });
      }
      if (cv.type && !ACCEPTED_CV.includes(cv.type)) {
        return NextResponse.json({ error: 'CV deve ser PDF ou Word' }, { status: 400 });
      }
      cvFile = cv;
    }

    // 1) Salvar no PocketBase (com CV anexado, se houver)
    let recordId: string | null = null;
    try {
      const pb = await getPocketBaseServer();
      const data = new FormData();
      data.append('vagaSlug', vagaSlug);
      data.append('vagaTitle', vagaTitle);
      data.append('referralId', referralId);
      data.append('candidateName', candidateName);
      data.append('candidateEmail', candidateEmail);
      data.append('linkedinUrl', linkedinUrl);
      data.append('phone', phone);
      data.append('status', 'new');
      if (cvFile) data.append('cv', cvFile);

      const record = await pb.collection('job_referrals').create(data);
      recordId = record.id;
    } catch (pbErr) {
      console.error('[referrals] Falha ao salvar no PocketBase:', pbErr);
      // Não aborta: ainda tentamos notificar por email para não perder a indicação
    }

    // 2) Notificar por e-mail (com CV anexo, se houver)
    const notifyTo =
      process.env.REFERRALS_NOTIFY_EMAIL || authorInfo.email || process.env.MAILER_USER || '';

    if (notifyTo) {
      try {
        const html = `
          <div style="font-family: Arial, sans-serif; color:#111; line-height:1.6;">
            <h2 style="margin:0 0 12px;">Nova indicação de candidato</h2>
            <p style="margin:0 0 16px; color:#555;">Vaga: <strong>${esc(vagaTitle)}</strong></p>
            <table style="border-collapse:collapse; width:100%; max-width:560px;">
              <tbody>
                ${row('Candidato', esc(candidateName))}
                ${row('E-mail', `<a href="mailto:${esc(candidateEmail)}">${esc(candidateEmail)}</a>`)}
                ${row('LinkedIn', `<a href="${esc(linkedinUrl)}">${esc(linkedinUrl)}</a>`)}
                ${phone ? row('Telefone', esc(phone)) : ''}
                ${row('Vaga (slug)', esc(vagaSlug))}
                ${referralId ? row('Referral ID', esc(referralId)) : ''}
                ${row('CV', cvFile ? `Anexo: ${esc(cvFile.name)}` : 'Não enviado')}
                ${row('Registro PB', recordId || 'não salvo (ver logs)')}
              </tbody>
            </table>
          </div>
        `;

        const attachments = cvFile
          ? [
              {
                filename: cvFile.name,
                content: Buffer.from(await cvFile.arrayBuffer()),
                contentType: cvFile.type || undefined,
              },
            ]
          : undefined;

        await sendRawMail({
          to: notifyTo,
          replyTo: candidateEmail,
          subject: `Nova indicação: ${candidateName} — ${vagaTitle}`,
          html,
          attachments,
        });
      } catch (mailErr) {
        console.error('[referrals] Falha ao enviar e-mail de notificação:', mailErr);
        // Se salvou no PB, ainda consideramos sucesso; só logamos a falha de e-mail
        if (!recordId) {
          return NextResponse.json(
            { error: 'Não foi possível registrar a indicação. Tente novamente.' },
            { status: 500 }
          );
        }
      }
    }

    if (!recordId && !notifyTo) {
      return NextResponse.json(
        { error: 'Configuração de destino ausente. Tente novamente mais tarde.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[referrals] Erro inesperado:', error);
    return NextResponse.json({ error: 'Erro ao processar a indicação' }, { status: 500 });
  }
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 12px; border:1px solid #eee; background:#fafafa; font-weight:bold; white-space:nowrap;">${label}</td>
      <td style="padding:8px 12px; border:1px solid #eee;">${value}</td>
    </tr>
  `;
}
