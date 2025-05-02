import { NextResponse } from 'next/server';
import { getRedirectionUrls } from '@/lib/services/shortener.service';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const [deepLink, fallbackUrl] = await getRedirectionUrls(params.id);

        if (!fallbackUrl) {
            return NextResponse.json(
                { error: 'URL não encontrada' },
                { status: 404, headers: { 'Cache-Control': 'public, max-age=60' } }
            );
        }

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

        const response = new NextResponse(html, {
            headers: {
                'content-type': 'text/html',
                'Cache-Control': 'public, max-age=600, stale-while-revalidate=60',
            },
        });

        return response;
    } catch (error) {
        console.error('Erro ao redirecionar:', error);
        return NextResponse.json(
            { error: 'Erro ao processar o redirecionamento' },
            { status: 500, headers: { 'Cache-Control': 'public, max-age=60' } }
        );
    }
} 