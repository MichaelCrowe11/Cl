"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  Send, 
  Plus, 
  MoreHorizontal, 
  Bot,
  User,
  FileText,
  FlaskConical,
  Folder,
  FolderOpen,
  File,
  Search,
  Terminal,
  Download,
  QrCode,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Minimize2
} from "lucide-react"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface FileItem {
  name: string
  type: 'file' | 'folder'
  children?: FileItem[]
  isExpanded?: boolean
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Crowe Logic AI, your mycology lab assistant. I can help you with substrate optimization, environmental monitoring, contamination prevention, and protocol development. What can I help you with today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [terminalInput, setTerminalInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeRightPanel, setActiveRightPanel] = useState<'sop' | 'batch' | 'qr' | 'export'>('sop')
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'Crowe Logic AI Terminal v1.0.0',
    'Type "help" for available commands',
    ''
  ])
  const { toast } = useToast()

  // Mock file structure
  const [fileStructure, setFileStructure] = useState<FileItem[]>([
    {
      name: 'Lab Projects',
      type: 'folder',
      isExpanded: true,
      children: [
        { name: 'substrate-optimization.json', type: 'file' },
        { name: 'batch-001-lions-mane.json', type: 'file' },
        { name: 'contamination-analysis.json', type: 'file' }
      ]
    },
    {
      name: 'SOPs',
      type: 'folder',
      isExpanded: false,
      children: [
        { name: 'sterilization-protocol.md', type: 'file' },
        { name: 'inoculation-procedure.md', type: 'file' },
        { name: 'harvest-guidelines.md', type: 'file' }
      ]
    },
    {
      name: 'Batch Records',
      type: 'folder',
      isExpanded: false,
      children: [
        { name: '2025-01-batch-logs.csv', type: 'file' },
        { name: 'yield-analysis.xlsx', type: 'file' }
      ]
    }
  ])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(m => ({
            role: m.role,
            content: m.content
          })),
          model: 'gpt-4',
          temperature: 0.3,
          maxTokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Sorry, I could not generate a response.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const executeTerminalCommand = () => {
    if (!terminalInput.trim()) return

    const command = terminalInput.trim()
    setTerminalOutput(prev => [...prev, `> ${command}`])
    
    // Mock command responses
    switch (command.toLowerCase()) {
      case 'help':
        setTerminalOutput(prev => [...prev, 
          'Available commands:',
          '  analyze <batch_id> - Analyze batch data',
          '  generate sop <type> - Generate SOP document',
          '  export data <format> - Export lab data',
          '  check contamination - Run contamination analysis',
          '  optimize substrate - Get substrate recommendations',
          ''
        ])
        break
      case 'analyze batch-001':
        setTerminalOutput(prev => [...prev, 
          'Analyzing batch-001-lions-mane...',
          'Substrate: HWFP/Soy 60/40',
          'Yield: 2.3kg (96% efficiency)',
          'Growth rate: 14 days',
          'Contamination: None detected',
          'Status: ✅ Successful harvest',
          ''
        ])
        break
      case 'check contamination':
        setTerminalOutput(prev => [...prev, 
          'Running contamination analysis...',
          'Scanning active batches...',
          'Batch-001: ✅ Clean',
          'Batch-002: ✅ Clean', 
          'Batch-003: ⚠️ Monitor - slight discoloration',
          'Overall contamination rate: 2.1% (excellent)',
          ''
        ])
        break
      default:
        setTerminalOutput(prev => [...prev, `Command not found: ${command}`, ''])
    }
    
    setTerminalInput('')
  }

  const toggleFolder = (folderName: string) => {
    setFileStructure(prev => prev.map(item => {
      if (item.name === folderName && item.type === 'folder') {
        return { ...item, isExpanded: !item.isExpanded }
      }
      return item
    }))
  }

  const FileExplorer = () => (
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
        {fileStructure.map((item, index) => (
          <div key={index} className="mb-1">
            <div 
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-accent cursor-pointer text-sm"
              onClick={() => item.type === 'folder' ? toggleFolder(item.name) : null}
            >
              {item.type === 'folder' ? (
                <>
                  {item.isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  {item.isExpanded ? <FolderOpen className="h-3 w-3" /> : <Folder className="h-3 w-3" />}
                </>
              ) : (
                <>
                  <span className="w-3" />
                  <File className="h-3 w-3" />
                </>
              )}
              <span className="truncate">{item.name}</span>
            </div>
            {item.type === 'folder' && item.isExpanded && item.children && (
              <div className="ml-4">
                {item.children.map((child, childIndex) => (
                  <div key={childIndex} className="flex items-center gap-1 px-2 py-1 rounded hover:bg-accent cursor-pointer text-sm">
                    <span className="w-3" />
                    <File className="h-3 w-3" />
                    <span className="truncate">{child.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  )

  const ChatPanel = () => (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="h-12 border-b px-4 flex items-center justify-between bg-background">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
            <AvatarFallback><Bot className="h-3 w-3" /></AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm">Crowe Logic AI</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" role="log" aria-live="polite">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Avatar className="h-6 w-6 flex-shrink-0">
                {message.role === 'user' ? (
                  <>
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
                    <AvatarFallback><Bot className="h-3 w-3" /></AvatarFallback>
                  </>
                )}
              </Avatar>
              <div
                className={`rounded px-3 py-2 max-w-[80%] text-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
                <div className="text-xs opacity-50 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
                <AvatarFallback><Bot className="h-3 w-3" /></AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded px-3 py-2">
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="border-t p-3">
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about cultivation, contamination, protocols..."
            className="text-sm"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-3 w-3" />
          </Button>
        </form>
      </div>

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
              <div key={index} className="font-mono">
                {line}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t border-gray-700 p-2">
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); executeTerminalCommand(); }}>
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
  )

  const RightPanel = () => (
    <div className="w-96 border-l bg-muted/20 flex flex-col">
      {/* Panel Tabs */}
      <div className="h-12 border-b flex">
        {[
          { key: 'sop', label: 'SOPs', icon: FileText },
          { key: 'batch', label: 'Batches', icon: FlaskConical },
          { key: 'qr', label: 'QR Codes', icon: QrCode },
          { key: 'export', label: 'Exports', icon: Download }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={activeRightPanel === key ? 'secondary' : 'ghost'}
            size="sm"
            className="flex-1 h-full rounded-none text-xs"
            onClick={() => setActiveRightPanel(key as 'sop' | 'batch' | 'qr' | 'export')}
          >
            <Icon className="h-3 w-3 mr-1" />
            {label}
          </Button>
        ))}
      </div>

      {/* Panel Content */}
      <ScrollArea className="flex-1 p-4">
        {activeRightPanel === 'sop' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">SOP Generation</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-xs">
                <FileText className="h-3 w-3 mr-2" />
                Sterilization Protocol
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs">
                <FileText className="h-3 w-3 mr-2" />
                Inoculation Procedure
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs">
                <FileText className="h-3 w-3 mr-2" />
                Harvest Guidelines
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs">
                <FileText className="h-3 w-3 mr-2" />
                Quality Control
              </Button>
            </div>
            <Button className="w-full text-xs">
              <Plus className="h-3 w-3 mr-2" />
              Generate New SOP
            </Button>
          </div>
        )}

        {activeRightPanel === 'batch' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Batch Management</h3>
            <div className="space-y-3">
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-xs">Lions Mane #001</span>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Started: Jan 8, 2025</div>
                  <div>Substrate: HWFP/Soy</div>
                  <div>Day 12 of 16</div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-xs">Oyster #012</span>
                  <Badge variant="outline" className="text-xs">Harvested</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Completed: Jan 5, 2025</div>
                  <div>Yield: 2.3kg</div>
                  <div>Success Rate: 96%</div>
                </div>
              </Card>
            </div>
            <Button className="w-full text-xs">
              <Plus className="h-3 w-3 mr-2" />
              Start New Batch
            </Button>
          </div>
        )}

        {activeRightPanel === 'qr' && (
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
              <Button variant="outline" className="w-full justify-start text-xs">
                <QrCode className="h-3 w-3 mr-2" />
                SOP Access QR
              </Button>
            </div>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-32 flex items-center justify-center">
              <div className="text-center text-xs text-muted-foreground">
                <QrCode className="h-8 w-8 mx-auto mb-2" />
                Generate QR Code
              </div>
            </div>
          </div>
        )}

        {activeRightPanel === 'export' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Data Exports</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-xs">
                <Download className="h-3 w-3 mr-2" />
                Batch Reports (CSV)
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs">
                <Download className="h-3 w-3 mr-2" />
                Yield Analysis (Excel)
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs">
                <Download className="h-3 w-3 mr-2" />
                Lab Logs (PDF)
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs">
                <Download className="h-3 w-3 mr-2" />
                Full Database Backup
              </Button>
            </div>
            <div className="border rounded-lg p-3 bg-muted/50">
              <div className="text-xs text-muted-foreground mb-2">Last Export</div>
              <div className="text-xs">batch-logs-2025-01-12.csv</div>
              <div className="text-xs text-muted-foreground">2 hours ago</div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Menu Bar */}
      <div className="h-8 bg-muted/50 border-b flex items-center px-4 text-xs">
        <span className="font-semibold">Crowe Logic AI</span>
        <div className="ml-auto flex items-center gap-4">
          <span>Lab Assistant v1.0.0</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        <FileExplorer />
        <ChatPanel />
        <RightPanel />
      </div>
    </div>
  )
}
