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

// Função para enviar o email (simulada)
async function sendEmail(data: EmailData): Promise<boolean> {
  // Aqui você implementaria a lógica real de envio de email
  // usando serviços como SendGrid, Mailchimp, etc.
  
  console.log('Enviando email:', {
    to: data.to,
    subject: data.subject,
    from: data.from || 'noreply@seudominio.com',
    text: data.text,
    html: data.html
  });
  
  // Simulando envio bem-sucedido
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
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
      name: '',
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