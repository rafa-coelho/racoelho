'use client';

import { redirect, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function RedirectHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/r/')) {
      redirect(`${process.env.NEXT_PUBLIC_API_URL}/r/${pathname.slice(3)}`);
    }
  }, [pathname]);

  return null;
} 