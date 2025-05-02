// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/r/') && !pathname.startsWith('/api')) {
    const slug = pathname.split('/r/')[1];

    const url = request.nextUrl.clone();
    url.pathname = `/api/r/${slug}`;

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
