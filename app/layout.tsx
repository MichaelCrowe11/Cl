import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/sonner"
import MetamaskPolyfill from "@/components/metamask-polyfill"
import "./globals.css"

export const metadata = {
  title: "Crowe Logic AI - Mycology Lab Assistant",
  description:
    "Professional mycology lab management and cultivation assistant powered by AI. Track batches, generate SOPs, and optimize your mushroom cultivation workflow.",
  keywords: "mycology, mushroom cultivation, lab management, AI assistant, batch tracking, cultivation protocols",
  authors: [{ name: "Crowe Logic AI" }],
  creator: "Crowe Logic AI",
  robots: "index, follow",
  openGraph: {
    title: "Crowe Logic AI - Mycology Lab Assistant",
    description: "Professional mycology lab management and cultivation assistant powered by AI",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crowe Logic AI - Mycology Lab Assistant",
    description: "Professional mycology lab management and cultivation assistant powered by AI",
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MetamaskPolyfill />
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
              {children}
              <Toaster position="top-right" />
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
