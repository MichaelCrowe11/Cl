import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"
import './globals.css'

export const metadata: Metadata = {
  title: 'Crowe Logic AI - Mycology Lab Assistant',
  description: 'Professional mycology lab management and cultivation assistant powered by AI. Track batches, generate SOPs, and optimize your mushroom cultivation workflow.',
  keywords: ['mycology', 'mushroom cultivation', 'lab management', 'AI assistant', 'batch tracking', 'cultivation protocols'],
  authors: [{ name: 'Crowe Logic AI' }],
  creator: 'Crowe Logic AI',
  robots: 'index, follow',
  openGraph: {
    title: 'Crowe Logic AI - Mycology Lab Assistant',
    description: 'Professional mycology lab management and cultivation assistant powered by AI',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crowe Logic AI - Mycology Lab Assistant',
    description: 'Professional mycology lab management and cultivation assistant powered by AI',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Accessibility: Skip link */}
        <a href="#main-content" className="sr-only focus:not-sr-only px-4 py-2 bg-accent text-accent-foreground">
          Skip to main content
        </a>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
