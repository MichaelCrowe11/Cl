import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// Polyfill global `self` for Node.js environment to satisfy libraries that expect a browser-like global
if (typeof (globalThis as any).self === 'undefined') {
  ;(globalThis as any).self = globalThis
}
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/auth-context'
import { PerformanceProvider } from '@/components/performance-provider'
import Sidebar from '@/components/Sidebar'
import ToolsPanel from '@/components/ToolsPanel'
import { CroweBackdrop } from '@/components/ui/loading'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Crowe Logic GPT - Mycology Research Platform',
  description: 'AI-powered mycology research platform with advanced fungal biotechnology analysis and laboratory management',
  keywords: 'mycology, AI, research, fungal biotechnology, substrate optimization, laboratory management, Crowe Logic',
  authors: [{ name: 'Crowe Logic' }],
  openGraph: {
    title: 'Crowe Logic GPT - Mycology Research Platform',
    description: 'The leading AI-powered mycology research platform for advanced fungal biotechnology',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PerformanceProvider>
            <AuthProvider>
              <CroweBackdrop opacity={0.02} />
              <div className="flex h-screen relative bg-white dark:bg-gray-900">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                  {children}
                </main>
                <ToolsPanel />
              </div>
            </AuthProvider>
          </PerformanceProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}