import { NextRequest, NextResponse } from 'next/server';
import PocketBase from 'pocketbase';

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || '';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const pb = new PocketBase(PB_URL);
    
    // Fazer login como admin
    const authData = await pb.admins.authWithPassword(email, password);

    if (!authData.token) {
      return NextResponse.json(
        { error: 'Falha na autenticação' },
        { status: 401 }
      );
    }

    // Criar cookie no formato que PocketBase espera
    // O exportToCookie retorna uma string completa, mas precisamos apenas do valor
    // Vamos usar a serialização direta do authStore
    const serialized = pb.authStore.exportToCookie();
    // Extrair apenas o valor (formato: "pb_auth=valor; expires=...")
    const cookieValue = serialized.split(';')[0].split('=')[1];

    const response = NextResponse.json(
      { success: true, token: authData.token },
      { status: 200 }
    );

    // Salvar cookie httpOnly
    // O cookie será lido pelo getAdminSession que usa loadFromCookie
    response.cookies.set('pb_auth', cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (error: any) {
    console.error('[Auth API] Login error:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro ao fazer login' },
      { status: 401 }
    );
  }
}

