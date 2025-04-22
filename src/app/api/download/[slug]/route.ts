import { NextRequest, NextResponse } from 'next/server';
import { validateEbookToken } from '@/lib/services/data.service';
import path from 'path';
import fs from 'fs/promises';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params;
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 400 }
      );
    }

    // Valida o token
    const isValid = await validateEbookToken({ token, slug });
    if (!isValid) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }

    // Define o caminho do arquivo
    const filePath = path.join(process.cwd(), 'public', 'assets', 'ebooks', `${slug}.pdf`);

    try {
      // Verifica se o arquivo existe
      await fs.access(filePath);

      // Lê o arquivo
      const fileBuffer = await fs.readFile(filePath);

      // Retorna o arquivo
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${slug}.pdf"`,
        },
      });
    } catch (error) {
      console.error('Erro ao acessar arquivo:', error);
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Erro ao processar download:', error);
    return NextResponse.json(
      { error: 'Erro ao processar download' },
      { status: 500 }
    );
  }
} 