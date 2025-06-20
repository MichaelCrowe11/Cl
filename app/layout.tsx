import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Ultra-aggressive MetaMask polyfill - prevents ALL wallet detection
              (function() {
                if (typeof window === 'undefined') return;
                
                // Override console methods to suppress MetaMask errors completely
                const originalError = console.error;
                const originalWarn = console.warn;
                const originalLog = console.log;
                
                console.error = function(...args) {
                  const message = String(args[0] || '');
                  if (message.includes('MetaMask') || 
                      message.includes('ChromeTransport') || 
                      message.includes('connectChrome') ||
                      message.includes('extension not found') ||
                      message.includes('inpage.js')) {
                    return; // Completely suppress
                  }
                  return originalError.apply(console, args);
                };
                
                console.warn = function(...args) {
                  const message = String(args[0] || '');
                  if (message.includes('MetaMask') || 
                      message.includes('ChromeTransport') || 
                      message.includes('connectChrome')) {
                    return; // Completely suppress
                  }
                  return originalWarn.apply(console, args);
                };
                
                // Comprehensive Chrome extension polyfill
                window.chrome = window.chrome || {};
                window.chrome.runtime = window.chrome.runtime || {
                  connect: function() {
                    // Return a mock port that doesn't throw errors
                    return {
                      postMessage: function() {},
                      onMessage: { 
                        addListener: function() {},
                        removeListener: function() {}
                      },
                      onDisconnect: { 
                        addListener: function() {},
                        removeListener: function() {}
                      },
                      disconnect: function() {},
                      name: 'mock-port',
                      sender: null
                    };
                  },
                  sendMessage: function() {
                    return Promise.resolve(null);
                  },
                  onMessage: { 
                    addListener: function() {},
                    removeListener: function() {}
                  },
                  onConnect: {
                    addListener: function() {},
                    removeListener: function() {}
                  },
                  id: 'mock-extension-id'
                };
                
                // Ethereum provider polyfill
                window.ethereum = window.ethereum || {
                  isMetaMask: false,
                  isConnected: function() { return false; },
                  request: function() { 
                    return Promise.reject(new Error('MetaMask not installed')); 
                  },
                  on: function() {},
                  removeListener: function() {},
                  removeAllListeners: function() {},
                  enable: function() {
                    return Promise.reject(new Error('MetaMask not installed'));
                  },
                  send: function() {
                    return Promise.reject(new Error('MetaMask not installed'));
                  },
                  sendAsync: function(payload, callback) {
                    if (callback) callback(new Error('MetaMask not installed'), null);
                  },
                  selectedAddress: null,
                  networkVersion: null,
                  chainId: null
                };
                
                // Web3 polyfill
                window.web3 = window.web3 || {
                  currentProvider: null,
                  eth: {
                    accounts: [],
                    defaultAccount: null,
                    getAccounts: function() { return Promise.resolve([]); }
                  },
                  version: { api: '1.0.0' }
                };
                
                // Additional wallet polyfills
                window.tronWeb = window.tronWeb || null;
                window.solana = window.solana || null;
                window.phantom = window.phantom || null;
                
                // Override any potential wallet detection
                Object.defineProperty(window, 'ethereum', {
                  value: window.ethereum,
                  writable: false,
                  configurable: false
                });
                
                // Prevent dynamic script injection that might load wallet connectors
                const originalCreateElement = document.createElement;
                document.createElement = function(tagName) {
                  const element = originalCreateElement.call(document, tagName);
                  if (tagName.toLowerCase() === 'script') {
                    const originalSetAttribute = element.setAttribute;
                    element.setAttribute = function(name, value) {
                      if (name === 'src' && typeof value === 'string') {
                        if (value.includes('metamask') || 
                            value.includes('wallet') || 
                            value.includes('web3') ||
                            value.includes('inpage')) {
                          console.log('Blocked wallet script:', value);
                          return; // Block wallet-related scripts
                        }
                      }
                      return originalSetAttribute.call(element, name, value);
                    };
                  }
                  return element;
                };
                
              })();
            `,
          }}
        />
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
