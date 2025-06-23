import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Crowe Logic AI - Mycology Lab Assistant',
  description: 'AI-powered mycology lab management platform with advanced fungal biotechnology data',
  keywords: 'mycology, AI, lab management, fungal biotechnology, substrate optimization',
  authors: [{ name: 'Crowe Logic AI' }],
  openGraph: {
    title: 'Crowe Logic AI - Mycology Lab Assistant',
    description: 'AI-powered mycology lab management platform',
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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 