import type React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  Settings,
  Layers,
  ClipboardList,
  Archive,
  FlaskConical,
  Sparkles,
  BrainCircuit,
  Database,
  LayoutDashboard,
  FileText,
  Info,
  Wrench,
  X,
} from "lucide-react"
import Image from "next/image"
import './globals.css'

export const metadata = {
  title: 'Crowe Logic AI - Mycology Lab Assistant',
  description: 'Professional mycology lab management and cultivation assistant powered by AI. Track batches, generate SOPs, and optimize your mushroom cultivation workflow.',
  keywords: 'mycology, mushroom cultivation, lab management, AI assistant, batch tracking, cultivation protocols',
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
    <html lang="en">
      <body>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex h-screen bg-background text-foreground">
              {/* Sidebar */}
              <div className="w-72 border-r bg-muted/20 flex flex-col">
                <div className="p-4 border-b h-16 flex items-center">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/crowe-avatar.png"
                      alt="Crowe Logic AI Logo"
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    <span className="font-semibold text-lg">Crowe Logic AI</span>
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <div className="space-y-2 p-4">
                    <nav className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start text-sm h-9">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm h-9">
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Protocols
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm h-9">
                        <Archive className="mr-2 h-4 w-4" />
                        Batch Logs
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm h-9">
                        <FlaskConical className="mr-2 h-4 w-4" />
                        R&D / Experiments
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm h-9">
                        <BrainCircuit className="mr-2 h-4 w-4" />
                        Simulations & Trees
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm h-9">
                        <FileText className="mr-2 h-4 w-4" />
                        Generated Reports
                      </Button>
                    </nav>
                    <div className="pt-3 mt-3 border-t">
                      <Button variant="ghost" className="w-full justify-start text-sm h-9">
                        <Sparkles className="mr-2 h-4 w-4" />
                        AI Coach
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm h-9">
                        <Database className="mr-2 h-4 w-4" />
                        Knowledge Base
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm h-9">
                        <Layers className="mr-2 h-4 w-4" />
                        Integrations
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm h-9">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex">
                <div className="flex-1 flex flex-col">
                  {/* Header */}
                  <header className="h-16 border-b px-6 flex items-center justify-between bg-background">
                    <h1 className="text-lg font-medium">Mycology Lab Assistant</h1>
                    <div className="flex items-center gap-2">
                      <ThemeToggle />
                      <Button variant="outline" size="sm">
                        Save Session
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </header>
                  {children}
                </div>

                {/* Right Panel */}
                <div className="w-80 border-l bg-muted/20 flex flex-col">
                  <div className="h-16 border-b px-4 flex items-center">
                    <h2 className="font-semibold text-md">Context & Tools</h2>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-2 border-b pb-3 mb-3">
                      <Button variant="secondary" size="sm" className="flex-1 text-xs">
                        <FileText className="mr-1.5 h-3.5 w-3.5" /> Generated Docs
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 text-xs">
                        <Info className="mr-1.5 h-3.5 w-3.5" /> Context
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 text-xs">
                        <Wrench className="mr-1.5 h-3.5 w-3.5" /> Tools
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Select a tab to view details. For example, generated SOPs or batch reports would appear under "Generated
                      Docs".
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
