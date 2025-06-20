import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Crowe Logic AI - Advanced Mycology Lab Assistant",
  description:
    "Professional AI-powered mycology lab management and consultation platform powered by advanced ecological intelligence and fungal biotechnology data.",
  keywords: "mycology, mushroom cultivation, lab management, AI assistant, fungal biotechnology",
  authors: [{ name: "Crowe Logic AI" }],
  creator: "Crowe Logic AI",
  publisher: "Crowe Logic AI",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://crowelogic.ai",
    title: "Crowe Logic AI - Advanced Mycology Lab Assistant",
    description: "Professional AI-powered mycology lab management and consultation platform",
    siteName: "Crowe Logic AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crowe Logic AI - Advanced Mycology Lab Assistant",
    description: "Professional AI-powered mycology lab management and consultation platform",
    creator: "@crowelogicai",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="metamask-polyfill" strategy="beforeInteractive">
          {`
            if (typeof window !== 'undefined' && !window.ethereum) {
              window.ethereum = {
                isMetaMask: false,
                request: () => Promise.reject(new Error('MetaMask not installed')),
                on: () => {},
                removeListener: () => {},
              };
            }
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
