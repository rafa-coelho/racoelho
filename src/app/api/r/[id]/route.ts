import { getRedirectionUrls } from '@/lib/services/shortener.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    console.log("id", id);
    const [deepLink, fallbackUrl] = await getRedirectionUrls(id);
    console.log("deepLink", deepLink, "fallbackUrl", fallbackUrl);
    console.log("fallbackUrl", fallbackUrl);

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Redirecionando...</title>
          <script>
            ${deepLink ? `
              window.location.href = '${deepLink}';
              setTimeout(() => {
                window.location.href = '${fallbackUrl}';
              }, 1000);
            ` : `
              window.location.href = '${fallbackUrl}';
            `}
          </script>
        </head>
        <body>Redirecionando...</body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'content-type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error fetching link data:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados do link' },
      { status: 500 }
    );
  }
} 