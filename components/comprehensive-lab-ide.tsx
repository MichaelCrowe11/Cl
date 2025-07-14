"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import CroweLogicGPTInterface from "@/components/crowe-logic-enhanced-chat"
import { 
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  FlaskConical,
  Microscope,
  Activity,
  Terminal,
  Search,
  Plus,
  Trash2,
  Upload,
  Play,
  Square,
  Cpu,
  BarChart3,
  Calendar,
  Beaker,
  Zap
} from "lucide-react"

interface FileNode {
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  size?: string
  modified?: string
}

const fileStructure: FileNode[] = [
  {
    name: "lab-data",
    type: "folder",
    children: [
      {
        name: "batches",
        type: "folder", 
        children: [
          { name: "batch-001-lions-mane.json", type: "file", size: "2.4 KB", modified: "2h ago" },
          { name: "batch-002-shiitake.json", type: "file", size: "1.8 KB", modified: "1d ago" },
          { name: "batch-003-oyster.json", type: "file", size: "3.1 KB", modified: "3d ago" }
        ]
      },
      {
        name: "protocols",
        type: "folder",
        children: [
          { name: "sterilization-sop.md", type: "file", size: "4.2 KB", modified: "1h ago" },
          { name: "agar-preparation.md", type: "file", size: "2.8 KB", modified: "2d ago" },
          { name: "contamination-protocol.md", type: "file", size: "3.5 KB", modified: "1d ago" }
        ]
      },
      {
        name: "analysis",
        type: "folder",
        children: [
          { name: "contamination-reports.json", type: "file", size: "5.6 KB", modified: "30m ago" },
          { name: "yield-analysis.csv", type: "file", size: "12.3 KB", modified: "4h ago" }
        ]
      }
    ]
  },
  {
    name: "projects", 
    type: "folder",
    children: [
      { name: "substrate-optimization.py", type: "file", size: "8.7 KB", modified: "1h ago" },
      { name: "growth-monitoring.js", type: "file", size: "6.2 KB", modified: "3h ago" },
      { name: "harvest-scheduler.py", type: "file", size: "4.9 KB", modified: "1d ago" }
    ]
  },
  {
    name: "environment",
    type: "folder", 
    children: [
      { name: "temperature-logs.json", type: "file", size: "45.8 KB", modified: "5m ago" },
      { name: "humidity-data.csv", type: "file", size: "32.1 KB", modified: "10m ago" },
      { name: "co2-measurements.json", type: "file", size: "28.4 KB", modified: "15m ago" }
    ]
  }
]

export default function ComprehensiveLabIDE() {
  const leftPanelWidth = 280
  const rightPanelWidth = 320
  const [leftActiveTab, setLeftActiveTab] = useState<'files' | 'search' | 'tools' | 'batches'>('files')
  const [rightActiveTab, setRightActiveTab] = useState<'terminal' | 'output' | 'problems' | 'debug'>('terminal')
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['lab-data', 'projects']))
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    '🍄 CroweOS Lab Terminal v3.0.0',
    '📊 All systems operational • Environment stable',
    '🧪 Mycology lab environment initialized',
    '💡 Type "help" for available commands',
    ''
  ])
  const [isResizingLeft, setIsResizingLeft] = useState(false)
  const [isResizingRight, setIsResizingRight] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath)
    } else {
      newExpanded.add(folderPath)
    }
    setExpandedFolders(newExpanded)
  }

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!terminalInput.trim()) return

    const newHistory = [...terminalHistory, `$ ${terminalInput}`]
    
    // Simulate command responses
    switch (terminalInput.toLowerCase().trim()) {
      case 'help':
        newHistory.push('Available commands:', 'batch - manage cultivation batches', 'monitor - view environment status', 'analyze - run contamination analysis', 'export - export lab data', 'clear - clear terminal', '')
        break
      case 'batch':
        newHistory.push('📊 Active Batches:', '• Lions Mane (Batch-001) - Day 14 - Fruiting', '• Shiitake (Batch-002) - Day 8 - Colonizing', '• Oyster (Batch-003) - Day 21 - Ready for harvest', '')
        break
      case 'monitor':
        newHistory.push('🌡️ Environment Status:', 'Temperature: 22.5°C (optimal)', 'Humidity: 85% (good)', 'CO2: 450ppm (normal)', 'Air Flow: Active', '')
        break
      case 'analyze':
        newHistory.push('🔬 Running contamination analysis...', '✅ All batches clean', '⚠️ Batch-002: Monitor for trichoderma', '📈 Overall contamination risk: LOW', '')
        break
      case 'clear':
        setTerminalHistory(['🍄 CroweOS Lab Terminal v3.0.0', ''])
        setTerminalInput('')
        return
      default:
        newHistory.push(`Command not found: ${terminalInput}`, 'Type "help" for available commands', '')
    }

    setTerminalHistory(newHistory)
    setTerminalInput('')
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalHistory])

  const renderFileTree = (files: FileNode[], level = 0, parentPath = '') => {
    return files.map((file) => {
      const fullPath = parentPath ? `${parentPath}/${file.name}` : file.name
      const isExpanded = expandedFolders.has(fullPath)
      const isSelected = selectedFile === fullPath

      return (
        <div key={fullPath}>
          <div
            className={`flex items-center gap-2 py-1 px-2 hover:bg-muted/50 cursor-pointer text-sm ${
              isSelected ? 'bg-primary/10 text-primary' : 'text-foreground'
            }`}
            style={{ paddingLeft: `${8 + level * 16}px` }}
            onClick={() => {
              if (file.type === 'folder') {
                toggleFolder(fullPath)
              } else {
                setSelectedFile(fullPath)
              }
            }}
          >
            {file.type === 'folder' ? (
              <>
                {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                {isExpanded ? <FolderOpen className="h-4 w-4 text-blue-500" /> : <Folder className="h-4 w-4 text-blue-500" />}
              </>
            ) : (
              <>
                <div className="w-3" />
                <File className="h-4 w-4 text-muted-foreground" />
              </>
            )}
            <span className="truncate">{file.name}</span>
            {file.size && (
              <span className="text-xs text-muted-foreground ml-auto">{file.size}</span>
            )}
          </div>
          {file.type === 'folder' && isExpanded && file.children && (
            <div>
              {renderFileTree(file.children, level + 1, fullPath)}
            </div>
          )}
        </div>
      )
    })
  }

  const LeftPanel = () => (
    <div className="bg-muted/30 border-r border-border flex flex-col" style={{ width: leftPanelWidth }}>
      {/* Left Panel Tabs */}
      <div className="flex border-b border-border">
        <Button
          variant={leftActiveTab === 'files' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setLeftActiveTab('files')}
          className="rounded-none border-r"
        >
          <Folder className="h-4 w-4" />
        </Button>
        <Button
          variant={leftActiveTab === 'search' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setLeftActiveTab('search')}
          className="rounded-none border-r"
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button
          variant={leftActiveTab === 'tools' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setLeftActiveTab('tools')}
          className="rounded-none border-r"
        >
          <FlaskConical className="h-4 w-4" />
        </Button>
        <Button
          variant={leftActiveTab === 'batches' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setLeftActiveTab('batches')}
          className="rounded-none"
        >
          <Beaker className="h-4 w-4" />
        </Button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden">
        {leftActiveTab === 'files' && (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Explorer</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Upload className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {renderFileTree(fileStructure)}
              </div>
            </ScrollArea>
          </div>
        )}

        {leftActiveTab === 'search' && (
          <div className="p-3">
            <h3 className="font-semibold text-sm mb-3">Search</h3>
            <Input placeholder="Search lab files..." className="mb-3" />
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-muted/50 rounded">
                <div className="font-medium">batch-001-lions-mane.json</div>
                <div className="text-xs text-muted-foreground">Line 15: "contamination": false</div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <div className="font-medium">sterilization-sop.md</div>
                <div className="text-xs text-muted-foreground">Line 8: Temperature must reach 121°C</div>
              </div>
            </div>
          </div>
        )}

        {leftActiveTab === 'tools' && (
          <div className="p-3">
            <h3 className="font-semibold text-sm mb-3">Lab Tools</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Microscope className="h-4 w-4 mr-2" />
                Contamination Scanner
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Yield Calculator
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Harvest Scheduler
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                Environment Monitor
              </Button>
            </div>
          </div>
        )}

        {leftActiveTab === 'batches' && (
          <div className="p-3">
            <h3 className="font-semibold text-sm mb-3">Active Batches</h3>
            <div className="space-y-3">
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Batch-001</Badge>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm font-medium">Lions Mane</div>
                <div className="text-xs text-muted-foreground">Day 14 • Fruiting stage</div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Batch-002</Badge>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
                <div className="text-sm font-medium">Shiitake</div>
                <div className="text-xs text-muted-foreground">Day 8 • Colonizing</div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const RightPanel = () => (
    <div className="bg-muted/30 border-l border-border flex flex-col" style={{ width: rightPanelWidth }}>
      {/* Right Panel Tabs */}
      <div className="flex border-b border-border">
        <Button
          variant={rightActiveTab === 'terminal' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setRightActiveTab('terminal')}
          className="rounded-none border-r"
        >
          <Terminal className="h-4 w-4" />
        </Button>
        <Button
          variant={rightActiveTab === 'output' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setRightActiveTab('output')}
          className="rounded-none border-r"
        >
          <Activity className="h-4 w-4" />
        </Button>
        <Button
          variant={rightActiveTab === 'problems' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setRightActiveTab('problems')}
          className="rounded-none border-r"
        >
          <Zap className="h-4 w-4" />
        </Button>
        <Button
          variant={rightActiveTab === 'debug' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setRightActiveTab('debug')}
          className="rounded-none"
        >
          <Cpu className="h-4 w-4" />
        </Button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden">
        {rightActiveTab === 'terminal' && (
          <div className="h-full flex flex-col">
            <div className="p-2 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Crowe Logic Terminal</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Play className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Square className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-black text-green-400 font-mono text-sm overflow-hidden">
              <ScrollArea className="h-full" ref={terminalRef}>
                <div className="p-3">
                  {terminalHistory.map((line, index) => (
                    <div key={index} className="whitespace-pre-wrap">
                      {line}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <form onSubmit={handleTerminalSubmit} className="border-t border-border bg-black">
              <div className="flex items-center p-2">
                <span className="text-green-400 font-mono text-sm mr-2">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent text-green-400 font-mono text-sm outline-none"
                  placeholder="Enter command..."
                />
              </div>
            </form>
          </div>
        )}

        {rightActiveTab === 'output' && (
          <div className="p-3">
            <h3 className="font-semibold text-sm mb-3">Lab Output</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-muted/50 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Environment Check</span>
                  <span className="text-xs text-muted-foreground ml-auto">2 min ago</span>
                </div>
                <div className="text-xs text-muted-foreground">All parameters within optimal range</div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Batch Update</span>
                  <span className="text-xs text-muted-foreground ml-auto">5 min ago</span>
                </div>
                <div className="text-xs text-muted-foreground">Batch-001 entering fruiting phase</div>
              </div>
            </div>
          </div>
        )}

        {rightActiveTab === 'problems' && (
          <div className="p-3">
            <h3 className="font-semibold text-sm mb-3">Issues</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-3 w-3 text-yellow-600" />
                  <span className="font-medium">Warning</span>
                </div>
                <div className="text-xs">Batch-002: Monitor for contamination signs</div>
              </div>
            </div>
          </div>
        )}

        {rightActiveTab === 'debug' && (
          <div className="p-3">
            <h3 className="font-semibold text-sm mb-3">System Debug</h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 bg-muted/50 rounded">
                <div>CPU: 15% • Memory: 2.1GB</div>
                <div>Sensors: 24 active</div>
                <div>Network: Connected</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="h-full flex bg-background">
      <LeftPanel />
      
      {/* Left Resize Handle */}
      <div
        className="w-1 bg-border hover:bg-primary/50 cursor-col-resize"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Main Editor/Chat Area */}
        <div className="flex-1 overflow-hidden">
          <CroweLogicGPTInterface />
        </div>
      </div>

      {/* Right Resize Handle */}
      <div
        className="w-1 bg-border hover:bg-primary/50 cursor-col-resize"
      />

      <RightPanel />
    </div>
  )
}
