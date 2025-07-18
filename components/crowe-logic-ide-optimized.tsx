"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { CroweLogo } from "@/components/crowe-logo"
import { MLConsole } from "@/components/ml-console"
import { 
  Code2, 
  Play, 
  Save, 
  FolderOpen, 
  FileText, 
  Settings, 
  Terminal, 
  Search,
  Moon, 
  Sun, 
  Database,
  Brain,
  Send,
  Loader2,
  Plus,
  X,
  Download,
  Upload,
  Cpu,
  HardDrive,
  Activity,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  File,
  Folder,
  GitBranch,
  Bug,
  Package,
  Zap
} from "lucide-react"

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileItem[]
  language?: string
  lastModified: Date
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  type?: 'code' | 'text' | 'suggestion'
}

interface AICodeSuggestion {
  id: string
  code: string
  description: string
  language: string
  confidence: number
}

export default function CroweLogicIDEOptimized() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  
  // IDE State
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'mycology-analysis.py',
      type: 'file',
      language: 'python',
      content: `# Mycology Analysis Script
import pandas as pd
import numpy as np
from datetime import datetime

class MushroomAnalyzer:
    def __init__(self):
        self.species_data = {}
        
    def analyze_specimen(self, specimen_data):
        """Analyze mushroom specimen data"""
        # Analysis logic here
        return {"confidence": 0.95, "species": "Agaricus bisporus"}
        
    def generate_report(self):
        """Generate analysis report"""
        return f"Analysis completed at {datetime.now()}"

# Initialize analyzer
analyzer = MushroomAnalyzer()
print("Mycology analyzer ready!")
`,
      lastModified: new Date()
    },
    {
      id: '2', 
      name: 'protocols',
      type: 'folder',
      children: [
        {
          id: '3',
          name: 'sterilization.md',
          type: 'file',
          language: 'markdown',
          content: `# Sterilization Protocols

## Autoclave Procedures
1. Load materials properly
2. Set temperature to 121°C
3. Run for 15-20 minutes
4. Allow pressure to drop naturally

## Chemical Sterilization
- 70% isopropyl alcohol
- Hydrogen peroxide solutions
- UV sterilization chambers
`,
          lastModified: new Date()
        }
      ],
      lastModified: new Date()
    }
  ])
  
  const [activeFileId, setActiveFileId] = useState('1')
  const [code, setCode] = useState('')
  const [terminalOutput, setTerminalOutput] = useState([
    '🍄 CroweOS Systems IDE Terminal v3.0.0',
    'Crowe Logic AI Coder initialized...',
    'Database connection established ✓',
    'Ready for mycology research and development.',
    ''
  ])
  const [terminalInput, setTerminalInput] = useState('')
  
  // AI Coder State
  const [aiMessages, setAIMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Crowe Logic AI Coder, your intelligent coding assistant. I can help you write, debug, and optimize mycology research code. I specialize in Python, data analysis, and bioinformatics. How can I assist your coding today?',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [aiInput, setAIInput] = useState('')
  const [isAILoading, setIsAILoading] = useState(false)
  const [codeSuggestions, setCodeSuggestions] = useState<AICodeSuggestion[]>([])
  
  // UI State
  const [leftPanelWidth, setLeftPanelWidth] = useState(300)
  const [rightPanelWidth, setRightPanelWidth] = useState(400)
  const [bottomPanelHeight, setBottomPanelHeight] = useState(200)
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false)
  const [isRightCollapsed, setIsRightCollapsed] = useState(false)
  const [isBottomCollapsed, setIsBottomCollapsed] = useState(false)
  const [selectedTab, setSelectedTab] = useState('explorer')
  const [bottomTab, setBottomTab] = useState('terminal')
  const [isMLConsoleOpen, setIsMLConsoleOpen] = useState(false)
  
  // File operations
  const saveFile = async (fileId: string, content: string) => {
    try {
      // Save to local storage (database simulation)
      const fileData = {
        id: fileId,
        content: content,
        lastModified: new Date().toISOString(),
        timestamp: Date.now()
      }
      
      localStorage.setItem(`crowe-file-${fileId}`, JSON.stringify(fileData))
      
      // Update files state
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, content, lastModified: new Date() }
          : file
      ))
      
      toast({
        title: "File Saved",
        description: `Successfully saved to database`,
      })
    } catch (error) {
      toast({
        title: "Save Error", 
        description: "Failed to save file to database",
        variant: "destructive"
      })
    }
  }

  const loadFile = async (fileId: string) => {
    try {
      const saved = localStorage.getItem(`crowe-file-${fileId}`)
      if (saved) {
        const fileData = JSON.parse(saved)
        return fileData.content
      }
    } catch (error) {
      console.error('Error loading file:', error)
    }
    return null
  }

  // AI Coder functions
  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiInput.trim() || isAILoading) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: aiInput.trim(),
      timestamp: new Date(),
      type: 'text'
    }

    setAIMessages(prev => [...prev, userMessage])
    setAIInput('')
    setIsAILoading(true)

    try {
      // Simulate AI response with code suggestions
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const aiResponse: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant', 
        content: generateAIResponse(userMessage.content),
        timestamp: new Date(),
        type: userMessage.content.toLowerCase().includes('code') ? 'code' : 'text'
      }

      setAIMessages(prev => [...prev, aiResponse])
      
      // Generate code suggestions
      if (userMessage.content.toLowerCase().includes('help') || userMessage.content.toLowerCase().includes('code')) {
        generateCodeSuggestions(userMessage.content)
      }
      
    } catch (error) {
      toast({
        title: "AI Error",
        description: "Failed to get response from Crowe Logic AI Coder",
        variant: "destructive"
      })
    } finally {
      setIsAILoading(false)
    }
  }

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('analyze') || lowerInput.includes('data')) {
      return `I can help you analyze mycology data! Here's a Python snippet for data analysis:

\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt

# Load and analyze mushroom data
def analyze_growth_data(data_file):
    df = pd.read_csv(data_file)
    growth_rate = df['size'].diff().mean()
    return {
        'avg_growth': growth_rate,
        'total_samples': len(df),
        'success_rate': len(df[df['healthy'] == True]) / len(df)
    }
\`\`\`

Would you like me to help you customize this for your specific dataset?`
    }
    
    if (lowerInput.includes('protocol') || lowerInput.includes('procedure')) {
      return `I'll help you create standardized protocols! Here's a template for lab procedures:

\`\`\`python
class SterilizationProtocol:
    def __init__(self, method='autoclave'):
        self.method = method
        self.temperature = 121 if method == 'autoclave' else 70
        self.duration = 15  # minutes
        
    def execute(self):
        print(f"Starting {self.method} sterilization...")
        print(f"Temperature: {self.temperature}°C")
        print(f"Duration: {self.duration} minutes")
        return True
\`\`\`

What specific protocol would you like me to help you implement?`
    }
    
    return `I'm here to help with your mycology coding needs! I can assist with:

• **Data Analysis**: Python scripts for analyzing growth data, contamination rates, yield optimization
• **Lab Automation**: Code for controlling equipment, monitoring conditions
• **Protocol Management**: Standardized procedures and workflows  
• **Visualization**: Charts and graphs for research results
• **Database Integration**: Storing and retrieving research data

What would you like to work on?`
  }

  const generateCodeSuggestions = (input: string) => {
    const suggestions: AICodeSuggestion[] = [
      {
        id: '1',
        code: `def monitor_growth_conditions():
    temperature = get_sensor_reading('temp')
    humidity = get_sensor_reading('humidity')
    
    if temperature < 20 or temperature > 25:
        alert("Temperature out of range!")
    
    return {"temp": temperature, "humidity": humidity}`,
        description: "Environmental monitoring function",
        language: 'python',
        confidence: 0.95
      },
      {
        id: '2', 
        code: `class ContaminationDetector:
    def __init__(self):
        self.threshold = 0.8
        
    def analyze_sample(self, image_path):
        # AI vision analysis
        contamination_score = self.detect_contamination(image_path)
        return contamination_score > self.threshold`,
        description: "AI-powered contamination detection",
        language: 'python',
        confidence: 0.92
      }
    ]
    
    setCodeSuggestions(suggestions)
  }

  const insertSuggestion = (suggestion: AICodeSuggestion) => {
    const activeFile = files.find(f => f.id === activeFileId)
    if (activeFile && activeFile.type === 'file') {
      const newContent = (activeFile.content || '') + '\n\n' + suggestion.code
      setCode(newContent)
      saveFile(activeFileId, newContent)
      
      toast({
        title: "Code Inserted",
        description: suggestion.description,
      })
    }
  }

  // Terminal functions
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!terminalInput.trim()) return

    const newOutput = [...terminalOutput, `$ ${terminalInput}`]
    
    // Simulate command execution
    if (terminalInput.includes('python')) {
      newOutput.push('Running Python script...')
      newOutput.push('✓ Analysis completed successfully')
    } else if (terminalInput.includes('save')) {
      newOutput.push('💾 Saving to database...')
      newOutput.push('✓ Files saved to CroweOS database')
    } else if (terminalInput.includes('test')) {
      newOutput.push('🧪 Running mycology tests...')
      newOutput.push('✓ All tests passed')
    } else {
      newOutput.push(`Command executed: ${terminalInput}`)
    }
    
    setTerminalOutput(newOutput)
    setTerminalInput('')
  }

  // Load file content when active file changes
  useEffect(() => {
    const activeFile = files.find(f => f.id === activeFileId)
    if (activeFile && activeFile.type === 'file') {
      setCode(activeFile.content || '')
    }
  }, [activeFileId, files])

  const renderFileTree = (items: FileItem[], level = 0) => {
    return items.map(item => (
      <div key={item.id} style={{ marginLeft: level * 16 }}>
        <div 
          className={`flex items-center gap-2 p-1 hover:bg-accent rounded cursor-pointer ${
            activeFileId === item.id ? 'bg-accent' : ''
          }`}
          onClick={() => item.type === 'file' && setActiveFileId(item.id)}
        >
          {item.type === 'folder' ? (
            <Folder className="h-4 w-4 text-blue-500" />
          ) : (
            <File className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm">{item.name}</span>
        </div>
        {item.children && renderFileTree(item.children, level + 1)}
      </div>
    ))
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="h-12 border-b bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <CroweLogo variant="official-circle" size={28} />
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">CroweOS</span>
            <Badge variant="secondary">IDE Pro</Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMLConsoleOpen(true)}
          >
            <Brain className="h-4 w-4 mr-2" />
            ML Console
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex">
{/* Left Panel - File Explorer & AI Tools */}
<div 
  className={`border-r bg-card transition-all duration-300 ${
    isLeftCollapsed ? 'w-12' : 'w-80'
  }`}
>
  {!isLeftCollapsed && (
    <div className="h-full flex flex-col">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1">
        <TabsList className="flex border-b">
          <TabsTrigger 
            value="explorer" 
            className="flex-1 rounded-none"
          >
            <FolderOpen className="h-4 w-4 mr-1" />
            Files
          </TabsTrigger>
          <TabsTrigger 
            value="ai" 
            className="flex-1 rounded-none"
          >
            <Brain className="h-4 w-4 mr-1" />
            AI Coder
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="explorer" className="flex-1 p-2">
          <ScrollArea className="h-full custom-scrollbar">
            <div className="space-y-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Project Files</span>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {renderFileTree(files)}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="ai" className="flex-1 p-2">
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/crowe-avatar.svg" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm">Crowe Logic AI Coder</span>
            </div>
            
            <ScrollArea className="flex-1 custom-scrollbar">
              <div className="space-y-3">
                {aiMessages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.role === 'assistant' && (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/crowe-avatar.svg" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`max-w-[200px] p-2 rounded text-xs ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground ml-6' 
                          : 'bg-muted'
                      }`}>
                        <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                      </div>
                    </div>
                  </div>
                ))}
                {isAILoading && (
                  <div className="flex gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/crowe-avatar.svg" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-2 rounded">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <form onSubmit={handleAISubmit} className="mt-2">
              <div className="flex gap-1">
                <Input
                  value={aiInput}
                  onChange={(e) => setAIInput(e.target.value)}
                  placeholder="Ask AI for help..."
                  className="text-xs"
                  disabled={isAILoading}
                />
                <Button type="submit" size="sm" disabled={isAILoading}>
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )}
  
  <Button
    variant="ghost"
    size="sm"
    className="absolute top-1/2 left-2"
    onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
  >
    {isLeftCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
  </Button>
        </div>

        {/* Center Panel - Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Editor Tabs */}
          <div className="h-10 border-b bg-card flex items-center px-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {files.find(f => f.id === activeFileId)?.name || 'Untitled'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => saveFile(activeFileId, code)}
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Code Editor */}
          <div className="flex-1 relative">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full resize-none border-0 rounded-none font-mono text-sm ide-scrollbar"
              placeholder="Start coding with Crowe Logic AI assistance..."
            />
          </div>
        </div>

        {/* Right Panel - AI Suggestions & Database */}
        <div 
          className={`border-l bg-card transition-all duration-300 ${
            isRightCollapsed ? 'w-12' : 'w-80'
          }`}
        >
          {!isRightCollapsed && (
            <div className="h-full p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Database Status
                  </h3>
                  <Card className="p-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Connection:</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Files Saved:</span>
                        <span>{files.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Sync:</span>
                        <span>Just now</span>
                      </div>
                    </div>
                  </Card>
                </div>
                
                {codeSuggestions.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      AI Suggestions
                    </h3>
                    <ScrollArea className="h-64 custom-scrollbar">
                      <div className="space-y-2">
                        {codeSuggestions.map((suggestion) => (
                          <Card key={suggestion.id} className="p-3 cursor-pointer hover:bg-accent" onClick={() => insertSuggestion(suggestion)}>
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <span className="text-sm font-medium">{suggestion.description}</span>
                                <Badge variant="secondary">{Math.round(suggestion.confidence * 100)}%</Badge>
                              </div>
                              <pre className="text-xs bg-muted p-2 rounded overflow-hidden">
                                {suggestion.code.substring(0, 100)}...
                              </pre>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1/2 right-2"
            onClick={() => setIsRightCollapsed(!isRightCollapsed)}
          >
            {isRightCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Bottom Panel - Terminal */}
      <div 
        className={`border-t bg-card transition-all duration-300 ${
          isBottomCollapsed ? 'h-8' : 'h-48'
        }`}
      >
        {!isBottomCollapsed && (
          <div className="h-full flex flex-col">
            <div className="h-8 border-b flex items-center justify-between px-4">
              <div className="flex">
                <Button
                  variant={bottomTab === 'terminal' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setBottomTab('terminal')}
                  className="text-xs rounded-none"
                >
                  <Terminal className="h-3 w-3 mr-1" />
                  Terminal
                </Button>
                <Button
                  variant={bottomTab === 'output' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setBottomTab('output')}
                  className="text-xs rounded-none"
                >
                  <Activity className="h-3 w-3 mr-1" />
                  Output
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-2">
              {bottomTab === 'terminal' && (
                <div className="h-full flex flex-col">
                  <ScrollArea className="flex-1 custom-scrollbar">
                    <div className="font-mono text-xs space-y-1">
                      {terminalOutput.map((line, index) => (
                        <div key={index} className="text-muted-foreground">
                          {line}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <form onSubmit={handleTerminalSubmit} className="mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">$</span>
                      <Input
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        placeholder="Enter command..."
                        className="text-xs font-mono"
                      />
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-2 right-2"
          onClick={() => setIsBottomCollapsed(!isBottomCollapsed)}
        >
          {isBottomCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* ML Console */}
      <MLConsole 
        isOpen={isMLConsoleOpen} 
        onClose={() => setIsMLConsoleOpen(false)} 
      />
    </div>
  )
}
