'use client'

import { analyticsService } from '@/lib/services/analytics.service'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    analyticsService.pageview(url)
  }, [pathname, searchParams])

  return null
} 