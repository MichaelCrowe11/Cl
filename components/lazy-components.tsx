import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
)

// Lazy load heavy components for better performance
export const LazyMonacoEditor = dynamic(
  () => import('@/components/monaco-editor').then(mod => mod.MonacoEditor),
  {
    loading: LoadingSpinner,
    ssr: false, // Monaco doesn't support SSR
  }
)

export const LazyFileExplorer = dynamic(
  () => import('@/components/file-explorer').then(mod => mod.FileExplorer),
  {
    loading: LoadingSpinner,
  }
)

export const LazyUnifiedChatInterface = dynamic(
  () => import('@/components/unified-chat-interface').then(mod => mod.UnifiedChatInterface),
  {
    loading: LoadingSpinner,
  }
)

export const LazySecurityDashboard = dynamic(
  () => import('@/components/security-dashboard').then(mod => ({ default: mod.SecurityDashboard })),
  {
    loading: LoadingSpinner,
  }
)

export const LazyResearchTools = dynamic(
  () => import('@/components/research-tools').then(mod => ({ default: mod.ResearchTools })),
  {
    loading: LoadingSpinner,
  }
)

export const LazyFileUpload = dynamic(
  () => import('@/components/file-upload').then(mod => mod.FileUpload),
  {
    loading: LoadingSpinner,
  }
)

// Lazy load entire pages for code splitting
export const LazyIDEPage = dynamic(
  () => import('@/app/ide/page'),
  {
    loading: LoadingSpinner,
  }
)

export const LazyVisionPage = dynamic(
  () => import('@/app/vision/page'),
  {
    loading: LoadingSpinner,
  }
)

export const LazyDashboardPage = dynamic(
  () => import('@/app/dashboard/page'),
  {
    loading: LoadingSpinner,
  }
) 