'use client'

import { useEffect } from 'react'
import { initializePerformanceMonitoring } from '@/lib/performance'

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializePerformanceMonitoring()
  }, [])

  return <>{children}</>
} 