import { NextRequest, NextResponse } from 'next/server';
import { assetService } from '@/lib/services/asset.service';

interface RouteParams {
  params: {
    slug: string;
    filename: string;
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { slug, filename } = params;

  try {
    const assetPack = await assetService.getAssetPackBySlug(slug);
    if (!assetPack || !assetPack.files || !assetPack.files.includes(filename)) {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 });
    }

    const fileUrl = assetService.getAssetFileUrl(assetPack, filename);
    const response = await fetch(fileUrl, { next: { revalidate: 3600 } });

    if (!response.ok) {
      return NextResponse.json({ error: 'Falha ao obter arquivo' }, { status: 502 });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const buffer = Buffer.from(await response.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro no proxy' }, { status: 500 });
  }
}


