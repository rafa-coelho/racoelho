import { NextRequest, NextResponse } from 'next/server';
import { getEbookEmailTemplate } from '@/lib/utils/mail-builder';
import { sendMail } from '@/lib/services/mailer.service';
import { registerEbookToken } from '@/lib/services/data.service';
import { convertKitConfig } from '@/lib/config/constants';
import { registerToForm } from '@/lib/services/convert-kit.service';

// Interface para os dados do formulário
interface FormData {
  name: string;
  email: string;
  slug: string;
}

// Função para validar os dados do formulário
function validateFormData(data: FormData): boolean {
  return !!(data.name && data.email && data.slug);
}

// Função para gerar a URL de download do ebook
function generateDownloadUrl(token: string, slug: string): string {
  return `${process.env.NEXT_PUBLIC_SITE_URL}/download/${slug}?token=${token}`;
}

export async function POST(request: NextRequest) {
  try {
    const data: FormData = await request.json();

    if (!validateFormData(data)) {
      return NextResponse.json(
        { error: 'Dados inválidos. Nome, email e slug são obrigatórios.' },
        { status: 400 }
      );
    }

    // Registra no ConvertKit
    await registerToForm({
      name: data.name,
      email: data.email,
      formId: convertKitConfig.ebook.formId || '',
      tagId: convertKitConfig.ebook.tagId || ''
    });

    // Registra o token para download
    const token = await registerEbookToken({
      name: data.name,
      email: data.email,
      slug: data.slug
    });

    // Gera a URL de download
    const downloadUrl = generateDownloadUrl(token, data.slug);

    // Gera o HTML do email
    const emailHtml = getEbookEmailTemplate({
      name: data.name,
      tituloEbook: 'Melhorando seu LinkedIn',
      downloadUrl
    });

    // Envia o email
    await sendMail({
      name: data.name,
      email: data.email,
      subject: 'Seu eBook está pronto para download!',
      message: emailHtml
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar solicitação:', error);
    return NextResponse.json(
      { error: 'Erro ao processar sua solicitação. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
} 