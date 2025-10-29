import { NextRequest, NextResponse } from 'next/server';
import { validateEbookToken } from '@/lib/services/data.service';
import { assetService } from '@/lib/services/asset.service';
import { getPocketBaseServer } from '@/lib/pocketbase-server';
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

    // Busca asset pack
    const assetPack = await assetService.getAssetPackBySlug(slug);
    
    if (!assetPack) {
      console.error(`Asset pack não encontrado para slug: ${slug}`);
      // Continua para fallback do filesystem
    } else {
      // Define qual arquivo baixar
      const requestedFile = request.nextUrl.searchParams.get('file');
      let filename: string | null = null;

      if (requestedFile) {
        // Arquivo específico solicitado - valida se existe no pack
        // Pode ser nome completo, parcial, ou só extensão
        const normalizedRequest = requestedFile.toLowerCase();
        const foundFile = assetPack.files?.find(f => {
          const normalized = f.toLowerCase();
          return normalized === normalizedRequest || 
                 normalized.endsWith(normalizedRequest) || 
                 normalized.includes(normalizedRequest) ||
                 normalized.endsWith(`.${normalizedRequest}`);
        });
        
        if (foundFile) {
          filename = foundFile;
        } else {
          console.error(`Arquivo "${requestedFile}" não encontrado no asset pack. Arquivos disponíveis:`, assetPack.files);
          return NextResponse.json(
            { 
              error: `Arquivo "${requestedFile}" não encontrado.`, 
              availableFiles: assetPack.files || []
            },
            { status: 404 }
          );
        }
      } else {
        // Tenta encontrar PDF automaticamente
        filename = assetService.getAssetFileByType(assetPack, 'pdf');
        if (!filename && assetPack.files && assetPack.files.length > 0) {
          // Se não tem PDF, pega o primeiro arquivo
          filename = assetPack.files[0];
          console.warn(`PDF não encontrado, usando primeiro arquivo disponível: ${filename}`);
        }
      }

      // Valida que o arquivo foi encontrado e está na lista
      if (!filename) {
        console.error(`Nenhum arquivo disponível para download no asset pack`);
        return NextResponse.json(
          { error: 'Nenhum arquivo disponível para download' },
          { status: 404 }
        );
      }

      if (!assetPack.files?.includes(filename)) {
        console.error(`Arquivo "${filename}" não está na lista de arquivos do asset pack. Arquivos:`, assetPack.files);
        return NextResponse.json(
          { error: `Arquivo "${filename}" não encontrado no pack` },
          { status: 404 }
        );
      }

      // Se encontrou arquivo no asset pack
      if (filename && assetPack.files.includes(filename)) {
        try {
          // Gera URL do arquivo no Pocketbase
          const pbUrl = process.env.NEXT_PUBLIC_PB_URL || '';
          const fileUrl = `${pbUrl}/api/files/asset_packs/${assetPack.id}/${filename}`;

          // Faz fetch do arquivo com autenticação admin
          const pb = await getPocketBaseServer();
          const authToken = pb.authStore.token;
          
          console.log(`Tentando baixar arquivo: ${fileUrl}`);
          
          const response = await fetch(fileUrl, {
            headers: authToken ? {
              Authorization: `Bearer ${authToken}`
            } : {}
          });

          if (response.ok) {
            const fileBuffer = Buffer.from(await response.arrayBuffer());

            // Detecta Content-Type baseado na extensão
            const ext = filename.split('.').pop()?.toLowerCase() || '';
            const contentTypes: Record<string, string> = {
              pdf: 'application/pdf',
              png: 'image/png',
              jpg: 'image/jpeg',
              jpeg: 'image/jpeg',
              svg: 'image/svg+xml',
              gif: 'image/gif',
              webp: 'image/webp',
            };
            const contentType = contentTypes[ext] || response.headers.get('content-type') || 'application/octet-stream';

            return new NextResponse(fileBuffer, {
              headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
              },
            });
          } else {
            console.error(`Erro ao buscar arquivo: ${response.status} ${response.statusText}`);
          }
        } catch (error) {
          console.error('Erro ao buscar arquivo do Pocketbase:', error);
          // Continua para fallback do filesystem
        }
      } else {
        console.error(`Arquivo "${filename}" não está na lista de arquivos do asset pack. Arquivos:`, assetPack.files);
      }
    }

    // Fallback: tenta buscar do filesystem (compatibilidade)
    const filePath = path.join(process.cwd(), 'public', 'assets', 'ebooks', `${slug}.pdf`);
    
    try {
      // Verifica se o arquivo existe
      await fs.access(filePath);

      // Lê o arquivo
      const fileBuffer = await fs.readFile(filePath);

      // Retorna o arquivo (converter para Uint8Array para compatibilidade de tipos)
      const byteArray = new Uint8Array(fileBuffer.buffer, fileBuffer.byteOffset, fileBuffer.byteLength);
      return new NextResponse(byteArray as any, {
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