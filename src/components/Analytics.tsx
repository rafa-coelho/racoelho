'use client'

import React from 'react';
import Script from 'next/script';
import { analyticsService } from '@/lib/services/analytics.service'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Suspense } from 'react';

const Analytics = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    // Evita track no admin
    if (!pathname?.startsWith('/admin')) {
      analyticsService.pageview(url)
    }
  }, [pathname, searchParams])

  return null
}

export const AnalyticsWrapper = () => {
  return (
    <Suspense fallback={null}>
      <Analytics />
    </Suspense>
  );
};

export default Analytics; 