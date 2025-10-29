import { NextRequest, NextResponse } from 'next/server';
import { getEbookEmailTemplate } from '@/lib/utils/mail-builder';
import { sendMail } from '@/lib/services/mailer.service';
import { registerEbookToken } from '@/lib/services/data.service';
import { convertKitConfig } from '@/lib/config/constants';
import { registerToForm } from '@/lib/services/convert-kit.service';
import { assetService } from '@/lib/services/asset.service';

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
async function generateDownloadUrl(token: string, slug: string): Promise<string> {
  // Busca o asset pack para identificar qual arquivo baixar
  const assetPack = await assetService.getAssetPackBySlug(slug);
  
  if (assetPack) {
    // Tenta encontrar PDF primeiro
    const pdfFile = assetService.getAssetFileByType(assetPack, 'pdf');
    if (pdfFile) {
      // URL direta para download do arquivo específico
      return `${process.env.NEXT_PUBLIC_SITE_URL}/api/download/${slug}?token=${token}&file=${encodeURIComponent(pdfFile)}`;
    } else if (assetPack.files && assetPack.files.length > 0) {
      // Se não tem PDF, usa o primeiro arquivo disponível
      return `${process.env.NEXT_PUBLIC_SITE_URL}/api/download/${slug}?token=${token}&file=${encodeURIComponent(assetPack.files[0])}`;
    }
  }
  
  // Fallback: URL para página de download (que gerencia o download automaticamente)
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

    // Busca o asset pack primeiro para validar e obter informações
    const assetPack = await assetService.getAssetPackBySlug(data.slug);
    
    if (!assetPack) {
      return NextResponse.json(
        { error: `Asset pack com slug "${data.slug}" não encontrado.` },
        { status: 404 }
      );
    }

    // Valida que há arquivos disponíveis
    if (!assetPack.files || assetPack.files.length === 0) {
      return NextResponse.json(
        { error: `Asset pack "${data.slug}" não possui arquivos disponíveis.` },
        { status: 400 }
      );
    }

    // Registra o token para download
    const token = await registerEbookToken({
      name: data.name,
      email: data.email,
      slug: data.slug
    });

    // Gera a URL de download (agora inclui o arquivo específico)
    const downloadUrl = await generateDownloadUrl(token, data.slug);
    
    // Usa o título do asset pack
    const ebookTitle = assetPack.title || 'Ebook';

    // Gera o HTML do email
    const emailHtml = getEbookEmailTemplate({
      name: data.name,
      tituloEbook: ebookTitle,
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