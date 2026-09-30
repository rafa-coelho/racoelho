'use client'

import React from 'react';
import Script from 'next/script';
import { analyticsService } from '@/lib/services/analytics.service'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Suspense } from 'react';
import { initAnalytics, pageview } from '@/lib/racoelho-analytics'

const Analytics = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Analytics próprio (roda junto com o GA). O init já registra o pageview da carga
  // inicial; as trocas de rota client-side são disparadas aqui (o SDK ignora a
  // repetição do mesmo path em sequência).
  useEffect(() => {
    initAnalytics()
    pageview()
  }, [pathname])

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