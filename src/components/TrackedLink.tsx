'use client'

import Link from 'next/link'
import { analyticsService } from '@/lib/services/analytics.service'
import { ComponentProps } from 'react'

type TrackedLinkProps = ComponentProps<typeof Link> & {
  label?: string
}

export function TrackedLink({ href, label, children, ...props }: TrackedLinkProps) {
  const handleClick = () => {
    const linkLabel = label || (typeof children === 'string' ? children : href.toString())
    analyticsService.trackLinkClick(href.toString(), linkLabel)
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
} 