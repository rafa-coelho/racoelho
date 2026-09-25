import { NextRequest, NextResponse } from 'next/server';
import { registerToForm } from '@/lib/services/convert-kit.service';

// Interface para os dados do email
interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

// Função para validar os dados do email
function validateEmailData(data: EmailData): string | null {
  if (!data.to) return 'O campo "to" é obrigatório';
  if (!data.subject) return 'O campo "subject" é obrigatório';
  if (!data.text && !data.html) return 'É necessário fornecer "text" ou "html"';
  
  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.to)) return 'Email inválido';
  
  return null;
}


const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX = 100;

export async function POST(request: NextRequest) {
  try {
    let body: { email?: unknown; name?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Corpo inválido' }, { status: 400 });
    }

    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    // Nome opcional (repassado como first_name ao ConvertKit)
    if (body.name !== undefined && body.name !== null && typeof body.name !== 'string') {
      return NextResponse.json({ error: 'Nome inválido' }, { status: 400 });
    }
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (name.length > NAME_MAX) {
      return NextResponse.json({ error: `Nome deve ter no máximo ${NAME_MAX} caracteres` }, { status: 400 });
    }

    const formId = process.env.CONVERTKIT_FORM_ID;
    const tagId = process.env.CONVERTKIT_TECH_ARTICLE_TAG_ID;

    if (!formId || !tagId) {
      return NextResponse.json(
        { error: 'Configuração do ConvertKit não encontrada' },
        { status: 500 }
      );
    }

    await registerToForm({
      name,
      email,
      formId,
      tagId
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar requisição de email:', error);
    return NextResponse.json(
      { error: 'Erro ao processar sua solicitação' },
      { status: 500 }
    );
  }
} 