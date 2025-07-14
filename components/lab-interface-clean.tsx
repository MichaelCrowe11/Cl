"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import ChatInterface from "@/components/ChatInterface"
import { 
  Plus, 
  Search, 
  FileText,
  FlaskConical,
  QrCode,
  Download,
  Terminal,
  Minimize2,
  Maximize2
} from "lucide-react"

export default function LabInterface() {
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalOutput, setTerminalOutput] = useState([
    'Crowe Logic AI Terminal v1.0.0',
    'Type "help" for available commands',
    ''
  ])
  const [activeRightTab, setActiveRightTab] = useState<'sop' | 'batch' | 'qr' | 'export'>('sop')
  const { toast } = useToast()

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!terminalInput.trim()) return

    setTerminalOutput(prev => [...prev, `$ ${terminalInput}`, 'Command executed successfully', ''])
    setTerminalInput('')
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Header Bar */}
      <div className="h-8 bg-muted/50 border-b flex items-center px-4 text-xs">
        <span className="font-semibold">Crowe Logic AI</span>
        <div className="ml-auto flex items-center gap-4">
          <span>Lab Assistant v1.0.0</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Lab Explorer */}
        <div className="w-80 border-r bg-muted/20 flex flex-col">
          <div className="h-12 border-b px-4 flex items-center justify-between">
            <h2 className="font-semibold text-sm">Lab Explorer</h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Search className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1 p-2">
            {/* File explorer content would go here */}
            <div className="text-sm text-muted-foreground text-center py-8">
              Lab files and projects
            </div>
          </ScrollArea>
        </div>

        {/* Center Panel - Chat & Terminal */}
        <div className="flex-1 flex flex-col">
          {/* Chat Interface */}
          <ChatInterface />

          {/* Terminal Section */}
          <div className="border-t bg-black text-green-400 font-mono">
            <div className="h-8 border-b border-gray-700 px-3 flex items-center justify-between bg-gray-800">
              <div className="flex items-center gap-2 text-xs">
                <Terminal className="h-3 w-3" />
                <span>Crowe Logic Terminal</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 hover:text-white">
                  <Minimize2 className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 hover:text-white">
                  <Maximize2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <ScrollArea className="h-32 p-3">
              <div className="space-y-1 text-xs">
                {terminalOutput.map((line, index) => (
                  <div key={index} className="font-mono">{line}</div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t border-gray-700 p-2">
              <form onSubmit={handleTerminalSubmit} className="flex gap-2">
                <span className="text-green-400 text-xs">$</span>
                <Input
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Enter command..."
                  className="bg-transparent border-none text-green-400 text-xs p-0 h-auto focus-visible:ring-0"
                />
              </form>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Tools Panel */}
        <div className="w-96 border-l bg-muted/20 flex flex-col">
          {/* Tab Headers */}
          <div className="h-12 border-b flex">
            <Button
              variant={activeRightTab === 'sop' ? 'secondary' : 'ghost'}
              onClick={() => setActiveRightTab('sop')}
              className="px-3 flex-1 h-full rounded-none text-xs"
            >
              <FileText className="h-3 w-3 mr-1" />
              SOPs
            </Button>
            <Button
              variant={activeRightTab === 'batch' ? 'secondary' : 'ghost'}
              onClick={() => setActiveRightTab('batch')}
              className="px-3 flex-1 h-full rounded-none text-xs"
            >
              <FlaskConical className="h-3 w-3 mr-1" />
              Batches
            </Button>
            <Button
              variant={activeRightTab === 'qr' ? 'secondary' : 'ghost'}
              onClick={() => setActiveRightTab('qr')}
              className="px-3 flex-1 h-full rounded-none text-xs"
            >
              <QrCode className="h-3 w-3 mr-1" />
              QR
            </Button>
            <Button
              variant={activeRightTab === 'export' ? 'secondary' : 'ghost'}
              onClick={() => setActiveRightTab('export')}
              className="px-3 flex-1 h-full rounded-none text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>

          {/* Tab Content */}
          <ScrollArea className="flex-1 p-4">
            {activeRightTab === 'sop' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">SOP Generation</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-xs">
                    <FileText className="h-3 w-3 mr-2" />
                    Sterilization Protocol
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs">
                    <FileText className="h-3 w-3 mr-2" />
                    Substrate Preparation
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs">
                    <FileText className="h-3 w-3 mr-2" />
                    Contamination Check
                  </Button>
                </div>
              </div>
            )}

            {activeRightTab === 'batch' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Active Batches</h3>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-xs">Lions Mane #001</span>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Active</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Started: Jan 8, 2025</div>
                      <div>Day 12 of 16</div>
                    </div>
                  </div>
                </div>
                <Button className="w-full text-xs">
                  <Plus className="h-3 w-3 mr-2" />
                  Start New Batch
                </Button>
              </div>
            )}

            {activeRightTab === 'qr' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">QR Code Generation</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-xs">
                    <QrCode className="h-3 w-3 mr-2" />
                    Batch Tracking QR
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs">
                    <QrCode className="h-3 w-3 mr-2" />
                    Equipment QR
                  </Button>
                </div>
              </div>
            )}

            {activeRightTab === 'export' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Data Exports</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-xs">
                    <Download className="h-3 w-3 mr-2" />
                    Batch Reports (CSV)
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs">
                    <Download className="h-3 w-3 mr-2" />
                    Lab Logs (PDF)
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
