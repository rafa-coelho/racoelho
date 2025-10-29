import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  );

  // Limpar cookie
  response.cookies.delete('pb_auth');

  return response;
}

