import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals'

// Global type augmentation for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}

// Types for metrics
interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  navigationType: string
}

// Send analytics to your analytics provider
const sendToAnalytics = (metric: PerformanceMetric) => {
  // Google Analytics example
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
    })
  }

  // Send to custom analytics endpoint
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    }).catch(console.error)
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    })
  }
}

// Initialize web vitals reporting
export function reportWebVitals() {
  if (typeof window === 'undefined') return

  onCLS(sendToAnalytics)
  onFCP(sendToAnalytics)
  onLCP(sendToAnalytics)
  onTTFB(sendToAnalytics)
  onINP(sendToAnalytics)
}

// Performance observer for custom metrics
export function observePerformance() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return

  // Observe long tasks
  try {
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('[Performance] Long task detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name,
          })
        }
      }
    })
    longTaskObserver.observe({ entryTypes: ['longtask'] })
  } catch (e) {
    // Long task observer not supported
  }

  // Observe resource timing
  try {
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 1000) {
          console.warn('[Performance] Slow resource:', {
            name: entry.name,
            duration: entry.duration,
            transferSize: (entry as any).transferSize,
          })
        }
      }
    })
    resourceObserver.observe({ entryTypes: ['resource'] })
  } catch (e) {
    // Resource timing observer not supported
  }
}

// Utility to measure component render time
export function measureComponentPerformance(componentName: string) {
  const startMark = `${componentName}-start`
  const endMark = `${componentName}-end`
  const measureName = `${componentName}-render`

  return {
    start: () => performance.mark(startMark),
    end: () => {
      performance.mark(endMark)
      performance.measure(measureName, startMark, endMark)
      
      const measure = performance.getEntriesByName(measureName)[0]
      if (measure && process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} render time: ${measure.duration.toFixed(2)}ms`)
      }
      
      // Clean up marks and measures
      performance.clearMarks(startMark)
      performance.clearMarks(endMark)
      performance.clearMeasures(measureName)
    },
  }
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Intersection Observer for lazy loading
export function createLazyLoadObserver(
  onIntersect: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onIntersect(entry)
      }
    })
  }, {
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  })
}

// Resource hints for performance
export function addResourceHints() {
  if (typeof window === 'undefined') return

  const head = document.head

  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    'https://api.openai.com',
    'https://api.anthropic.com',
  ].filter(Boolean)

  preconnectDomains.forEach((domain) => {
    if (!domain) return
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = domain
    link.crossOrigin = 'anonymous'
    head.appendChild(link)
  })

  // DNS prefetch for potential external resources
  const dnsPrefetchDomains = [
    'https://www.google-analytics.com',
    'https://vitals.vercel-insights.com',
  ]

  dnsPrefetchDomains.forEach((domain) => {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = domain
    head.appendChild(link)
  })
}

// Initialize all performance monitoring
export function initializePerformanceMonitoring() {
  if (typeof window === 'undefined') return

  // Report web vitals
  reportWebVitals()

  // Observe performance
  observePerformance()

  // Add resource hints
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addResourceHints)
  } else {
    addResourceHints()
  }
} 