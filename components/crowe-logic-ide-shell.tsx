'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Sun, 
  Moon, 
  Terminal, 
  Search, 
  FileText, 
  Folder, 
  FolderOpen,
  Settings,
  Activity,
  Cpu,
  Thermometer,
  Wifi,
  WifiOff,
  Command,
  ChevronLeft,
  ChevronRight,
  Plus,
  Send,
  MoreHorizontal,
  Code,
  Database,
  Beaker,
  QrCode,
  Download,
  Play,
  Square,
  Trash2
} from 'lucide-react'

// Theme Store (simplified Zustand-style)
interface UIState {
  theme: 'light' | 'dark' | 'system'
  activeTabRight: 'sops' | 'batches' | 'qr' | 'exports'
  explorerOpen: boolean
  rightSidebarOpen: boolean
  splitSizes: { left: number; center: number; right: number }
}

const useUIStore = () => {
  const [state, setState] = useState<UIState>({
    theme: 'dark',
    activeTabRight: 'sops',
    explorerOpen: true,
    rightSidebarOpen: true,
    splitSizes: { left: 20, center: 50, right: 30 }
  })

  const updateState = (updates: Partial<UIState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  const toggleTheme = () => {
    setState(prev => ({ 
      ...prev, 
      theme: prev.theme === 'dark' ? 'light' : 'dark' 
    }))
  }

  return { state, updateState, toggleTheme }
}

// Theme Provider Component
interface ThemeProviderProps {
  children: React.ReactNode
  theme: string
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, theme }) => {
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return <div className="min-h-screen">{children}</div>
}

// Left Sidebar - File Explorer
const SidebarLeft: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({ isOpen, onToggle }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [files] = useState([
    { name: 'protocols', type: 'folder', expanded: true, children: [
      { name: 'cultivation.md', type: 'file' },
      { name: 'sterilization.py', type: 'file' },
      { name: 'quality_control.json', type: 'file' }
    ]},
    { name: 'research', type: 'folder', expanded: false, children: [
      { name: 'papers', type: 'folder', children: [] },
      { name: 'datasets', type: 'folder', children: [] }
    ]},
    { name: 'batches', type: 'folder', expanded: true, children: [
      { name: 'batch_001.json', type: 'file' },
      { name: 'batch_002.json', type: 'file' }
    ]},
    { name: 'config.py', type: 'file' },
    { name: 'main.py', type: 'file' }
  ])

  if (!isOpen) {
    return (
      <div className="w-12 bg-background border-r border-border flex flex-col items-center py-4">
        <Button variant="ghost" size="icon" onClick={onToggle} className="mb-4">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="mb-2">
          <Folder className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="mb-2">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  const renderFileTree = (items: any[], level = 0) => {
    return items.map((item, index) => (
      <div key={index} style={{ marginLeft: `${level * 16}px` }}>
        <div className="flex items-center px-2 py-1 hover:bg-accent rounded-sm cursor-pointer group">
          {item.type === 'folder' ? (
            item.expanded ? <FolderOpen className="h-4 w-4 mr-2 text-foreground" /> : <Folder className="h-4 w-4 mr-2 text-foreground" />
          ) : (
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
          )}
          <span className="text-sm font-mono truncate">{item.name}</span>
        </div>
        {item.expanded && item.children && renderFileTree(item.children, level + 1)}
      </div>
    ))
  }

  return (
    <div className="w-80 bg-background border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">EXPLORER</h2>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onToggle}>
              <ChevronLeft className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-muted rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 p-2 overflow-y-auto">
        {renderFileTree(files)}
      </div>

      {/* Stats */}
      <div className="p-4 border-t border-border">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>12 files</span>
          <span>3 folders</span>
        </div>
      </div>
    </div>
  )
}

// Chat Pane
const ChatPane: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Welcome to Crowe Logic AI! I\'m here to help with your mycology research and cultivation protocols.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      role: 'user' as const,
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant' as const,
        content: `I understand you're asking about: "${input}". Let me help you with that mycology query...`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  return (
    <Card className="flex flex-col h-full rounded-none border-0 border-b">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-sm">C</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Crowe Logic AI</h3>
              <p className="text-xs text-muted-foreground">Mycology Research Assistant</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            Online
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              message.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}>
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask about mycology, protocols, or research..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 px-4 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button onClick={sendMessage} size="icon" className="rounded-full bg-primary hover:bg-primary/80">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

// Terminal Pane
const TerminalPane: React.FC = () => {
  const [output, setOutput] = useState([
    '╭─ Crowe Logic Terminal v2.0 ─╮',
    '│ Mycology Research Platform  │',
    '╰─────────────────────────────╯',
    '',
    'crowe@mycology:~$ Welcome to the Crowe Logic research environment',
    'crowe@mycology:~$ Type "help" for available commands',
    ''
  ])
  const [input, setInput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  const executeCommand = async (cmd: string) => {
    setIsRunning(true)
    setOutput(prev => [...prev, `crowe@mycology:~$ ${cmd}`])
    
    // Simulate command execution
    setTimeout(() => {
      let response = ''
      switch (cmd.toLowerCase().trim()) {
        case 'help':
          response = `Available commands:
  help          - Show this help message
  protocols     - List cultivation protocols
  batches       - Show batch information
  analysis      - Run data analysis
  sterilize     - Sterilization procedures
  clear         - Clear terminal`
          break
        case 'protocols':
          response = `📋 Available Protocols:
  • oyster_cultivation.md
  • shiitake_growing.md
  • sterilization_sop.py
  • quality_control.json`
          break
        case 'batches':
          response = `🧫 Active Batches:
  • Batch-001: Oyster (Day 14) - 98% success
  • Batch-002: Shiitake (Day 7) - 95% success
  • Batch-003: Lion's Mane (Day 3) - 100% success`
          break
        case 'analysis':
          response = `🔬 Running analysis...
  ✓ Temperature: 24°C (optimal)
  ✓ Humidity: 85% (optimal)  
  ✓ Contamination: 0% detected
  ✓ Growth rate: 12% above average`
          break
        case 'clear':
          setOutput([])
          setIsRunning(false)
          return
        default:
          response = `Command not found: ${cmd}. Type "help" for available commands.`
      }
      
      setOutput(prev => [...prev, response, ''])
      setIsRunning(false)
    }, 1500)
  }

  const handleSubmit = () => {
    if (!input.trim()) return
    executeCommand(input)
    setInput('')
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  return (
    <Card className="flex flex-col h-full rounded-none border-0 bg-black text-green-400">
      {/* Header */}
      <div className="p-3 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            <span className="text-sm font-mono text-gray-300">Terminal</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-200">
              <Square className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-200">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-sm leading-relaxed"
      >
        {output.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
        {isRunning && (
          <div className="flex items-center gap-2 text-yellow-400">
            <div className="animate-spin h-3 w-3 border border-yellow-400 border-t-transparent rounded-full"></div>
            Processing...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="text-green-400">crowe@mycology:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="flex-1 bg-transparent text-green-400 focus:outline-none"
            placeholder="Type a command..."
          />
        </div>
      </div>
    </Card>
  )
}

// Right Sidebar
const SidebarRight: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({ isOpen, onToggle }) => {
  const { state, updateState } = useUIStore()

  if (!isOpen) {
    return (
      <div className="w-12 bg-background border-l border-border flex flex-col items-center py-4">
        <Button variant="ghost" size="icon" onClick={onToggle} className="mb-4">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="mb-2">
          <FileText className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="mb-2">
          <Beaker className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="mb-2">
          <QrCode className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-80 bg-background border-l border-border">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm">WORKSPACE</h2>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onToggle}>
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>

        <Tabs value={state.activeTabRight} onValueChange={(value) => updateState({ activeTabRight: value as any })}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sops" className="text-xs">SOPs</TabsTrigger>
            <TabsTrigger value="batches" className="text-xs">Batches</TabsTrigger>
            <TabsTrigger value="qr" className="text-xs">QR</TabsTrigger>
            <TabsTrigger value="exports" className="text-xs">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="sops" className="mt-4">
            <div className="space-y-3">
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-foreground" />
                  <span className="font-medium text-sm">Sterilization SOP</span>
                </div>
                <p className="text-xs text-muted-foreground">Updated 2 hours ago</p>
              </Card>
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-foreground" />
                  <span className="font-medium text-sm">Inoculation Protocol</span>
                </div>
                <p className="text-xs text-muted-foreground">Updated 1 day ago</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="batches" className="mt-4">
            <div className="space-y-3">
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Batch-001</span>
                  <Badge variant="outline" className="text-xs">Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Oyster mushrooms - Day 14</p>
              </Card>
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Batch-002</span>
                  <Badge variant="outline" className="text-xs">Growing</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Shiitake - Day 7</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="qr" className="mt-4">
            <div className="text-center py-8">
              <QrCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Generate QR codes for batch tracking</p>
              <Button className="mt-4" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New QR Code
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="exports" className="mt-4">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Batch Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Protocols
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Analysis
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Status Bar
const StatusBar: React.FC = () => {
  const [metrics] = useState({
    temperature: 24,
    humidity: 85,
    cpu: 45,
    isOnline: true
  })

  return (
    <div className="h-8 bg-muted border-t border-border px-4 flex items-center justify-between text-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Thermometer className="h-3 w-3" />
          <span>{metrics.temperature}°C</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity className="h-3 w-3" />
          <span>{metrics.humidity}% RH</span>
        </div>
        <div className="flex items-center gap-1">
          <Cpu className="h-3 w-3" />
          <span>{metrics.cpu}% CPU</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {metrics.isOnline ? (
            <Wifi className="h-3 w-3 text-foreground" />
          ) : (
            <WifiOff className="h-3 w-3 text-red-500" />
          )}
          <span className={metrics.isOnline ? 'text-foreground' : 'text-red-500'}>
            {metrics.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <span className="text-muted-foreground">Crowe Logic v2.0</span>
      </div>
    </div>
  )
}

// Command Palette
const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void; onToggleTheme: () => void }> = ({ isOpen, onClose, onToggleTheme }) => {
  const [query, setQuery] = useState('')
  const { updateState } = useUIStore()

  const commands = [
    { id: 'toggle-theme', label: 'Toggle Theme', icon: Sun },
    { id: 'new-batch', label: 'New Batch', icon: Plus },
    { id: 'open-sop', label: 'Open SOP', icon: FileText },
    { id: 'run-analysis', label: 'Run Analysis', icon: Activity },
    { id: 'search-explorer', label: 'Search Explorer', icon: Search },
  ]

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  )

  const executeCommand = (commandId: string) => {
    switch (commandId) {
      case 'toggle-theme':
        onToggleTheme()
        break
      // Add other command handlers
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50">
      <Card className="w-full max-w-lg">
        <div className="p-4">
          <div className="relative mb-4">
            <Command className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Type a command..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>
          
          <div className="space-y-1">
            {filteredCommands.map((command) => (
              <button
                key={command.id}
                onClick={() => executeCommand(command.id)}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent rounded-md"
              >
                <command.icon className="h-4 w-4" />
                <span>{command.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

// Main App Shell
const CroweLogicIDE: React.FC = () => {
  const { state, updateState, toggleTheme } = useUIStore()
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <ThemeProvider theme={state.theme}>
      <div className="h-screen flex flex-col bg-background text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Top Header */}
        <div className="h-12 bg-background border-b border-border px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center">
                <span className="text-white dark:text-black font-bold text-xs">C</span>
              </div>
              <span className="font-semibold text-lg">Crowe Logic IDE</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Terminal</span>
              <span>Help</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCommandPaletteOpen(true)}
              className="h-8 w-8"
            >
              <Command className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8"
            >
              {state.theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Left Sidebar */}
          <SidebarLeft
            isOpen={state.explorerOpen}
            onToggle={() => updateState({ explorerOpen: !state.explorerOpen })}
          />

          {/* Center Panes */}
          <div className="flex-1 flex flex-col">
            {/* Chat Pane (Top) */}
            <div className="h-1/2">
              <ChatPane />
            </div>
            
            {/* Terminal Pane (Bottom) */}
            <div className="h-1/2">
              <TerminalPane />
            </div>
          </div>

          {/* Right Sidebar */}
          <SidebarRight
            isOpen={state.rightSidebarOpen}
            onToggle={() => updateState({ rightSidebarOpen: !state.rightSidebarOpen })}
          />
        </div>

        {/* Status Bar */}
        <StatusBar />

        {/* Command Palette */}
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onToggleTheme={toggleTheme}
        />
      </div>
    </ThemeProvider>
  )
}

export default CroweLogicIDE
