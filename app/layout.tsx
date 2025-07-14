import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"
import { GlobalNavigation } from "@/components/global-navigation"
import { AccessibilityProvider } from "@/components/accessibility-provider"
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
        {/* Accessibility: Skip links */}
        <a 
          href="#main-content" 
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-br-md"
        >
          Skip to main content
        </a>
        <a 
          href="#navigation" 
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-32 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-br-md"
        >
          Skip to navigation
        </a>
        
        <AccessibilityProvider>
          <ErrorBoundary>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              {/* Global Navigation */}
              <div id="navigation">
                <GlobalNavigation />
              </div>
              
              {/* Main Content */}
              <main 
                id="main-content" 
                className="min-h-screen"
                tabIndex={-1}
                role="main"
                aria-label="Main content"
              >
                {children}
              </main>
              
              {/* Global Toast Notifications */}
              <Toaster />
            </ThemeProvider>
          </ErrorBoundary>
        </AccessibilityProvider>
      </body>
    </html>
  )
}
