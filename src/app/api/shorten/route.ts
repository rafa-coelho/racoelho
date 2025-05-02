import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, type } = body;

    if (!url || !type) {
      return NextResponse.json(
        { error: 'URL e tipo são obrigatórios' },
        { status: 400 }
      );
    }

    // Gera um ID único para o link
    const shortId = nanoid(8);

    // Aqui você implementaria a lógica para salvar o link no banco de dados
    // Por enquanto, vamos apenas retornar o ID gerado
    const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL}/l/${shortId}`;

    return NextResponse.json({ shortUrl });
  } catch (error) {
    console.error('Erro ao encurtar link:', error);
    return NextResponse.json(
      { error: 'Erro ao encurtar o link' },
      { status: 500 }
    );
  }
} 