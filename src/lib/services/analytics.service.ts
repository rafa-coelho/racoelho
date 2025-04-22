declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: {
        page_path?: string
        event_category?: string
        event_label?: string
        value?: number
      }
    ) => void
  }
}

import { GA_TRACKING_ID } from '../gtag'
import { analyticsConfig } from '../config/constants'

export class AnalyticsService {
  private static instance: AnalyticsService

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  public pageview(url: string): void {
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('config', GA_TRACKING_ID, {
          page_path: url,
        })
      } catch (error) {
        console.error('[Analytics] Error tracking pageview:', error)
      }
    } else {
      console.warn('[Analytics] gtag not available')
    }
  }

  public event(action: string, category: string, label?: string, value?: number): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }

  public trackLinkClick(href: string, label?: string): void {
    this.event(analyticsConfig.events.linkClick, analyticsConfig.categories.navigation, label || href)
  }
}

export const analyticsService = AnalyticsService.getInstance() 