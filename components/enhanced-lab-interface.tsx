"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import CroweLogicGPTInterface from "@/components/crowe-logic-enhanced-chat"
import MiniSidebar from "@/components/mini-sidebar"
import { streamCompletion } from "@/lib/ai"
import { 
  IDEPanel, 
  IDEHeader, 
  IDETabs, 
  StatusIndicator, 
  FileTreeItem, 
  IDETerminal 
} from "@/components/ui/ide-components"
import { 
  Plus, 
  Search, 
  FileText,
  FlaskConical,
  QrCode,
  Download,
  Folder,
  FolderOpen,
  File,
  Activity,
  Zap,
  Beaker,
  TreePine,
  Target,
  Settings,
  Code,
  Cpu,
  Database,
  GitBranch,
  Play,
  Save,
  Copy
} from "lucide-react"

export default function EnhancedLabInterface() {
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalOutput, setTerminalOutput] = useState([
    '🍄 Crowe Logic AI Terminal v2.0.0',
    '📊 Lab systems online • Environment stable',
    '🧪 Ready for mycology operations',
    ''
  ])
  const [activeRightTab, setActiveRightTab] = useState<'sop' | 'batch' | 'qr' | 'export' | 'coder'>('sop')
  const [activeMiniTab, setActiveMiniTab] = useState('explorer')
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [coderInput, setCoderInput] = useState('')
  const [coderResponse, setCoderResponse] = useState('')
  const [isCoderLoading, setIsCoderLoading] = useState(false)
  const [activeCodeProject, setActiveCodeProject] = useState('data-analyzer')
  const { toast } = useToast()

  const handleTerminalSubmit = () => {
    if (!terminalInput.trim()) return

    const responses: Record<string, string[]> = {
      'help': [
        'Available commands:',
        '  status     - Check lab environment status',
        '  batches    - List active cultivation batches', 
        '  temp       - Show temperature readings',
        '  humidity   - Show humidity levels',
        '  clear      - Clear terminal output'
      ],
      'status': [
        '🌡️  Temperature: 22.3°C (optimal)',
        '💧 Humidity: 85% (good)',
        '🔬 Sterile field: Active',
        '⚡ Systems: All operational'
      ],
      'batches': [
        '📋 Active Batches:',
        '  • Lions Mane #001 - Day 12/16 - 96% success rate',
        '  • Oyster #012 - Day 8/14 - 100% clean',
        '  • Shiitake #003 - Day 4/21 - Monitoring'
      ]
    }

    const response = responses[terminalInput.toLowerCase()] || [`Command executed: ${terminalInput}`]
    
    setTerminalOutput(prev => [
      ...prev,
      `$ ${terminalInput}`,
      ...response,
      ''
    ])
    setTerminalInput('')
  }

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(folder)) {
        newSet.delete(folder)
      } else {
        newSet.add(folder)
      }
      return newSet
    })
  }

  const labFiles = [
    { name: 'lab-data', type: 'folder' as const, children: [
      { name: 'sterilization.txt', type: 'file' as const },
      { name: 'batch-logs', type: 'folder' as const }
    ]},
    { name: 'protocols', type: 'folder' as const, children: [
      { name: 'sterilization-sop.md', type: 'file' as const },
      { name: 'substrate-prep.md', type: 'file' as const }
    ]},
    { name: 'batches', type: 'folder' as const, children: [
      { name: 'lions-mane-001.json', type: 'file' as const },
      { name: 'oyster-012.json', type: 'file' as const }
    ]}
  ]

  const handleCoderSubmit = async () => {
    if (!coderInput.trim() || isCoderLoading) return
    
    setIsCoderLoading(true)
    setCoderResponse('')
    
    try {
      let fullResponse = ''
      
      const systemPrompt = `You are Crowe Logic Coder, an expert AI programming assistant specialized in mycology research tools and lab automation. You excel at:

• Python data analysis scripts for mushroom cultivation data
• Lab automation and IoT sensor integration
• Database schemas for cultivation tracking
• Web dashboards for lab management
• Statistical analysis and machine learning for yield optimization
• Computer vision for contamination detection
• API integrations for lab equipment
• Research data processing and visualization

Always provide complete, production-ready code with proper error handling, documentation, and best practices. Focus on mycology and lab research applications.`

      await streamCompletion(
        {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: coderInput }
          ],
          model: 'gpt-4o',
          temperature: 0.3,
          maxTokens: 3000
        },
        (chunk) => {
          fullResponse += chunk
          setCoderResponse(fullResponse)
        }
      )
      
      toast({
        title: "Code Generated",
        description: "Crowe Logic Coder has generated your code"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate code",
        variant: "destructive"
      })
    } finally {
      setIsCoderLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Enhanced Status Bar */}
      <div className="ide-toolbar flex items-center justify-between px-4">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Beaker className="h-3 w-3" />
            <span>3 Active Batches</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>All Systems Operational</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span>Last Update: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mini Sidebar */}
        <MiniSidebar 
          activeTab={activeMiniTab}
          onTabChange={setActiveMiniTab}
        />
        
        {/* Enhanced Left Panel - Lab Explorer */}
        <IDEPanel position="left" width="w-80">
          <IDEHeader 
            title={activeMiniTab === 'explorer' ? 'Lab Explorer' : 
                   activeMiniTab === 'search' ? 'Search' :
                   activeMiniTab === 'git' ? 'Source Control' :
                   activeMiniTab === 'lab' ? 'Lab Tools' :
                   activeMiniTab === 'protocols' ? 'Protocols' :
                   activeMiniTab === 'terminal' ? 'Terminal' :
                   activeMiniTab === 'activity' ? 'Activity' : 'Settings'}
            actions={
              <>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Search className="h-3 w-3" />
                </Button>
              </>
            }
          />
          
          <div className="flex-1 p-2 overflow-y-auto ide-scrollbar">
            {activeMiniTab === 'explorer' && (
              <>
                {labFiles.map((item) => (
                  <div key={item.name}>
                    <FileTreeItem
                      name={item.name}
                      type={item.type}
                      isExpanded={expandedFolders.has(item.name)}
                      icon={item.type === 'folder' ? 
                        (expandedFolders.has(item.name) ? <FolderOpen className="h-3 w-3" /> : <Folder className="h-3 w-3" />) :
                        <File className="h-3 w-3" />
                      }
                      onToggle={() => toggleFolder(item.name)}
                    />
                    {item.type === 'folder' && expandedFolders.has(item.name) && item.children && (
                      <div className="ml-4">
                        {item.children.map((child) => (
                          <FileTreeItem
                            key={child.name}
                            name={child.name}
                            type={child.type}
                            level={1}
                            icon={child.type === 'folder' ? <Folder className="h-3 w-3" /> : <File className="h-3 w-3" />}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
            
            {activeMiniTab === 'search' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search files and folders..."
                    className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  No recent searches
                </div>
              </div>
            )}
            
            {activeMiniTab === 'lab' && (
              <div className="space-y-2">
                <div className="p-3 bg-accent/10 rounded-md">
                  <h4 className="font-medium text-sm mb-2">Active Batches</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Lions Mane #001</span>
                      <span className="text-green-600">96%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Oyster #012</span>
                      <span className="text-green-600">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeMiniTab === 'activity' && (
              <div className="space-y-2">
                <div className="p-3 bg-accent/10 rounded-md">
                  <h4 className="font-medium text-sm mb-2">System Status</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Temperature: 22.3°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Humidity: 85%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </IDEPanel>

        {/* Enhanced Center Panel - Chat & Terminal */}
        <div className="flex-1 flex flex-col">
          {/* Chat Interface with enhanced styling */}
          <div className="flex-1">
            <CroweLogicGPTInterface />
          </div>

          {/* Enhanced Terminal */}
          <IDETerminal
            output={terminalOutput}
            input={terminalInput}
            onInputChange={setTerminalInput}
            onSubmit={handleTerminalSubmit}
            placeholder="Enter lab command... (try 'help')"
          />
        </div>

        {/* Enhanced Right Panel - Lab Tools */}
        <IDEPanel position="right" width="w-96">
          <IDETabs
            tabs={[
              { id: 'sop', label: 'SOPs', isActive: activeRightTab === 'sop' },
              { id: 'batch', label: 'Batches', isActive: activeRightTab === 'batch' },
              { id: 'qr', label: 'QR', isActive: activeRightTab === 'qr' },
              { id: 'export', label: 'Export', isActive: activeRightTab === 'export' },
              { id: 'coder', label: 'Coder', isActive: activeRightTab === 'coder' }
            ]}
            onTabClick={(id) => setActiveRightTab(id as any)}
          />

          <div className="flex-1 p-4 overflow-y-auto ide-scrollbar">
            {activeRightTab === 'sop' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">SOP Generation</h3>
                  <StatusIndicator type="success">AI Ready</StatusIndicator>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-xs hover-lift">
                    <FileText className="h-3 w-3 mr-2" />
                    Sterilization Protocol
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs hover-lift">
                    <FileText className="h-3 w-3 mr-2" />
                    Substrate Preparation
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs hover-lift">
                    <FileText className="h-3 w-3 mr-2" />
                    Contamination Check
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs hover-lift">
                    <FileText className="h-3 w-3 mr-2" />
                    Environmental Controls
                  </Button>
                </div>
              </div>
            )}

            {activeRightTab === 'batch' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Active Batches</h3>
                  <StatusIndicator type="info">3 Running</StatusIndicator>
                </div>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg hover-glow cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-xs">🦁 Lions Mane #001</span>
                      <StatusIndicator type="success">Day 12/16</StatusIndicator>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Substrate: HWFP/Soy (optimal)</div>
                      <div>Success Rate: 96% • Yield Projection: 2.1kg</div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg hover-glow cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-xs">🦪 Oyster #012</span>
                      <StatusIndicator type="success">Day 8/14</StatusIndicator>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Substrate: Straw/Hardwood</div>
                      <div>Success Rate: 100% • No contamination</div>
                    </div>
                  </div>
                </div>
                <Button className="w-full text-xs hover-lift">
                  <Plus className="h-3 w-3 mr-2" />
                  Start New Batch
                </Button>
              </div>
            )}

            {activeRightTab === 'qr' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">QR Generation</h3>
                  <StatusIndicator type="info">Ready</StatusIndicator>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-xs hover-lift">
                    <QrCode className="h-3 w-3 mr-2" />
                    Batch Tracking QR
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs hover-lift">
                    <QrCode className="h-3 w-3 mr-2" />
                    Equipment Labels
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs hover-lift">
                    <QrCode className="h-3 w-3 mr-2" />
                    SOP Quick Access
                  </Button>
                </div>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-32 flex items-center justify-center spore-pattern">
                  <div className="text-center text-xs text-muted-foreground">
                    <QrCode className="h-8 w-8 mx-auto mb-2" />
                    Generate QR Code
                  </div>
                </div>
              </div>
            )}

            {activeRightTab === 'export' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Data Exports</h3>
                  <StatusIndicator type="success">Available</StatusIndicator>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-xs hover-lift">
                    <Download className="h-3 w-3 mr-2" />
                    Batch Reports (CSV)
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs hover-lift">
                    <Download className="h-3 w-3 mr-2" />
                    Yield Analysis (Excel)
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs hover-lift">
                    <Download className="h-3 w-3 mr-2" />
                    Lab Logs (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs hover-lift">
                    <Download className="h-3 w-3 mr-2" />
                    Full Database Backup
                  </Button>
                </div>
                <div className="border rounded-lg p-3 bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-2">Last Export</div>
                  <div className="text-xs font-medium">batch-analysis-2025-07-13.xlsx</div>
                  <div className="text-xs text-muted-foreground">2 hours ago • 2.3MB</div>
                </div>
              </div>
            )}

            {activeRightTab === 'coder' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <h3 className="font-semibold text-sm">Crowe Logic Coder</h3>
                  </div>
                  <StatusIndicator type={isCoderLoading ? "info" : "success"}>
                    {isCoderLoading ? "Coding..." : "Ready"}
                  </StatusIndicator>
                </div>

                {/* Project Templates */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Quick Templates</div>
                  <div className="grid grid-cols-2 gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs justify-start h-8"
                      onClick={() => setCoderInput("Create a Python script to analyze mushroom cultivation yield data from CSV files")}
                    >
                      <Database className="h-3 w-3 mr-1" />
                      Data Analysis
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs justify-start h-8"
                      onClick={() => setCoderInput("Build a web dashboard for real-time monitoring of lab temperature and humidity sensors")}
                    >
                      <Activity className="h-3 w-3 mr-1" />
                      Lab Monitor
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs justify-start h-8"
                      onClick={() => setCoderInput("Create a computer vision script to detect contamination in mushroom cultivation images")}
                    >
                      <Target className="h-3 w-3 mr-1" />
                      CV Detection
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs justify-start h-8"
                      onClick={() => setCoderInput("Design a SQLite database schema for tracking mushroom batches, yields, and growth stages")}
                    >
                      <Database className="h-3 w-3 mr-1" />
                      Database
                    </Button>
                  </div>
                </div>

                {/* Input Area */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Code Request</div>
                  <textarea
                    value={coderInput}
                    onChange={(e) => setCoderInput(e.target.value)}
                    className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none h-24 font-mono"
                    placeholder="Describe what you want to build:
• Python data analysis scripts
• Lab automation tools  
• Web dashboards
• Database schemas
• Computer vision models
• API integrations
• Research tools"
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCoderSubmit}
                      className="flex-1 text-xs"
                      disabled={isCoderLoading || !coderInput.trim()}
                    >
                      <Code className="h-3 w-3 mr-1" />
                      {isCoderLoading ? "Generating..." : "Generate Code"}
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      disabled={!coderResponse}
                      onClick={() => navigator.clipboard.writeText(coderResponse)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Response Area */}
                {coderResponse && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium text-muted-foreground">Generated Code</div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          <Play className="h-3 w-3 mr-1" />
                          Run
                        </Button>
                      </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-muted/50 px-3 py-1 text-xs font-mono border-b flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-400"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        </div>
                        <span>crowe-logic-generated.py</span>
                      </div>
                      <div className="p-3 text-sm bg-black text-green-400 max-h-64 overflow-y-auto custom-scrollbar">
                        <pre className="whitespace-pre-wrap font-mono">{coderResponse}</pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* Active Projects */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="text-xs font-medium text-muted-foreground">Recent Projects</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/30 text-xs">
                      <GitBranch className="h-3 w-3" />
                      <span>yield-optimizer.py</span>
                      <span className="ml-auto text-muted-foreground">2h ago</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/30 text-xs">
                      <Cpu className="h-3 w-3" />
                      <span>sensor-dashboard.html</span>
                      <span className="ml-auto text-muted-foreground">1d ago</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/30 text-xs">
                      <Database className="h-3 w-3" />
                      <span>batch-tracker.sql</span>
                      <span className="ml-auto text-muted-foreground">3d ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </IDEPanel>
      </div>

      {/* Enhanced Status Bar */}
      <div className="ide-status-bar flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <span>🍄 Mycology Lab Management Platform</span>
          <span>•</span>
          <span>Connected</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Temp: 22.3°C</span>
          <span>Humidity: 85%</span>
          <span>UTC {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}
