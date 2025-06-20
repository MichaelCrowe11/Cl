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
        {/* -- Wallet shim: injected before any other client JS ---------------- */}
        <Script id="wallet-shim" strategy="beforeInteractive">
          {`
        /* Crowe Logic AI – wallet noise silencer */
        (function () {
          if (typeof window === 'undefined') return;

          // Stub chrome.runtime to keep wallet helpers quiet
          window.chrome = window.chrome || {};
          window.chrome.runtime = window.chrome.runtime || {
            connect() { return { postMessage() {}, disconnect() {}, onMessage:{addListener(){}}, onDisconnect:{addListener(){}} } },
            sendMessage() { return Promise.resolve(null); },
            onMessage:{ addListener(){} },
            onConnect:{ addListener(){} },
          };

          // Stub ethereum provider
          window.ethereum = window.ethereum || {
            isMetaMask: false,
            isConnected: () => false,
            request: () => Promise.reject(new Error('MetaMask not installed')),
            enable: () => Promise.reject(new Error('MetaMask not installed')),
            send:   () => Promise.reject(new Error('MetaMask not installed')),
            sendAsync: (_p, cb) => cb && cb(new Error('MetaMask not installed')),
            on() {}, removeListener() {}, removeAllListeners() {},
          };

          // Filter console noise
          const noisy = /MetaMask|ChromeTransport|connectChrome|extension not found|inpage\\.js/;
          ['error','warn'].forEach(level => {
            const orig = console[level]?.bind(console);
            console[level] = (...a) => (noisy.test(String(a[0])) ? undefined : orig(...a));
          });
        })();
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
