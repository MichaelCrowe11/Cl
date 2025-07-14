"use client"

import React, { useEffect, useRef, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Terminal, 
  Code, 
  Play, 
  Square, 
  Maximize2, 
  Minimize2,
  X,
  ChevronDown,
  ChevronRight,
  Database,
  Brain,
  Cpu,
  Zap,
  BarChart3,
  FileCode,
  Settings,
  GitBranch,
  Save,
  Download,
  Upload
} from 'lucide-react'

// Utility to join class names conditionally
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

// Dynamically import Monaco and XTerm for lazy loading
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-32 bg-muted">
      <div className="text-sm text-muted-foreground">Loading editor...</div>
    </div>
  )
})

interface MLConsoleProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

interface TabItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  type: 'data' | 'python' | 'analysis' | 'config'
  language: string
  content: string
  readonly?: boolean
}

export function MLConsole({ isOpen, onClose, className }: MLConsoleProps) {
  const [activeTab, setActiveTab] = useState('data')
  const [isMaximized, setIsMaximized] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [terminalHeight, setTerminalHeight] = useState(200)
  const [executionCount, setExecutionCount] = useState(1)
  
  const tabs: TabItem[] = [
    {
      id: 'data',
      label: 'Batch Data',
      icon: Database,
      type: 'data',
      language: 'json',
      readonly: true,
      content: `{
  "lab_session": {
    "id": "COS-2025-001",
    "operator": "Dr. Sarah Chen",
    "timestamp": "2025-07-13T09:30:00Z",
    "environment": {
      "temperature_c": 22.3,
      "humidity_percent": 85,
      "atmospheric_pressure": 1013.2,
      "air_quality_index": 45
    }
  },
  "active_batches": [
    {
      "batch_id": "LM-001-2025",
      "species": "Hericium erinaceus",
      "strain": "CL-HE-Premium",
      "substrate_composition": {
        "hardwood_pellets": 0.65,
        "soybean_meal": 0.20,
        "wheat_bran": 0.10,
        "calcium_carbonate": 0.03,
        "gypsum": 0.02
      },
      "inoculation_date": "2025-07-01T14:00:00Z",
      "current_phase": "primordial_formation",
      "days_elapsed": 12,
      "projected_harvest": "2025-07-16",
      "vitals": {
        "mycelium_coverage": 0.96,
        "contamination_rate": 0.02,
        "growth_velocity": 2.3,
        "predicted_yield_kg": 2.8,
        "quality_score": 0.94
      }
    }
  ]
}`
    },
    {
      id: 'python',
      label: 'ML Analysis',
      icon: Brain,
      type: 'python',
      language: 'python',
      content: `#!/usr/bin/env python3
"""
CroweOS Systems - Advanced Mycology Analytics Engine
Batch Performance Analysis & Yield Optimization
Version: 2.1.0
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
from typing import Dict, List, Tuple

class MyceliumAnalytics:
    def __init__(self, lab_data: Dict):
        self.data = lab_data
        self.batches = pd.DataFrame(lab_data['active_batches'])
        
    def calculate_yield_efficiency(self) -> float:
        """Calculate overall yield efficiency across all batches"""
        total_predicted = self.batches['vitals'].apply(
            lambda x: x['predicted_yield_kg']
        ).sum()
        
        efficiency = total_predicted / 10.0  # Base calculation
        return round(efficiency, 3)
    
    def contamination_risk_analysis(self) -> Dict[str, float]:
        """Analyze contamination patterns and predict risk factors"""
        contamination_rates = self.batches['vitals'].apply(
            lambda x: x['contamination_rate']
        )
        
        risk_factors = {
            'current_avg_contamination': contamination_rates.mean(),
            'max_contamination': contamination_rates.max(),
            'batches_at_risk': len(contamination_rates[contamination_rates > 0.05]),
        }
        
        return {k: round(v, 4) for k, v in risk_factors.items()}

# Initialize analytics
print("🔬 CroweOS Mycology Analytics Engine v2.1.0")
print("=" * 50)

# Run analysis
analytics_engine = MyceliumAnalytics({
    "active_batches": [
        {
            "vitals": {
                "predicted_yield_kg": 2.8,
                "contamination_rate": 0.02
            }
        }
    ]
})

yield_eff = analytics_engine.calculate_yield_efficiency()
print(f"Overall Yield Efficiency: {yield_eff:.1%}")

contamination_analysis = analytics_engine.contamination_risk_analysis()
print(f"Average Contamination Rate: {contamination_analysis['current_avg_contamination']:.1%}")

print("\\n✅ Analysis Complete - Ready for optimization implementation")
`
    }
  ]

  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<{ dispose: () => void; writeln: (data: string) => void; write: (data: string) => void; clear: () => void } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Find active tab content
  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0]

  // Initialize XTerm terminal
  useEffect(() => {
    if (!isOpen || !terminalRef.current) return

    const loadXTerm = async () => {
      try {
        const { Terminal } = await import('@xterm/xterm')
        const { FitAddon } = await import('@xterm/addon-fit')
        
        if (xtermRef.current) {
          xtermRef.current.dispose()
        }

        const terminal = new Terminal({
          theme: {
            background: '#0a0a0a',
            foreground: '#e5e5e5',
            cursor: '#00ff88'
          },
          fontSize: 13,
          fontFamily: '"Fira Code", monospace',
          cursorBlink: true
        })

        const fitAddon = new FitAddon()
        terminal.loadAddon(fitAddon)
        terminal.open(terminalRef.current!)
        
        setTimeout(() => fitAddon.fit(), 100)

        terminal.writeln('🔬 CroweOS Systems Advanced ML Console v2.1.0')
        terminal.writeln('│  Mycology Lab Intelligence & Analytics Platform')
        terminal.writeln('')
        terminal.writeln('✅ System ready - AI-powered mycology analytics online')
        terminal.writeln('')
        terminal.write('(crowe-ml) $ ')

        xtermRef.current = terminal

        // Terminal input handling
        let currentLine = ''
        terminal.onData((data) => {
          if (data === '\r' || data === '\n') {
            terminal.writeln('')
            if (currentLine.trim()) {
              handleTerminalCommand(currentLine.trim())
            }
            currentLine = ''
            terminal.write('(crowe-ml) $ ')
          } else if (data === '\u007f') { // Backspace
            if (currentLine.length > 0) {
              currentLine = currentLine.slice(0, -1)
              terminal.write('\b \b')
            }
          } else if (data.charCodeAt(0) >= 32) { // Printable characters
            currentLine += data
            terminal.write(data)
          }
        })
      } catch (error) {
        console.error('Failed to load XTerm:', error)
      }
    }

    loadXTerm()

    return () => {
      if (xtermRef.current) {
        xtermRef.current.dispose()
        xtermRef.current = null
      }
    }
  }, [isOpen])

  // Handle terminal commands
  const handleTerminalCommand = (command: string) => {
    if (!xtermRef.current) return

    const cmd = command.toLowerCase().trim()
    
    switch (cmd) {
      case 'help':
        xtermRef.current.writeln('Available Commands:')
        xtermRef.current.writeln('  analyze    - Run batch analysis')
        xtermRef.current.writeln('  status     - Show system status')
        xtermRef.current.writeln('  clear      - Clear terminal')
        xtermRef.current.writeln('  help       - Show this help')
        break
      
      case 'analyze':
      case 'run':
        runPythonCode()
        return
        
      case 'status':
        xtermRef.current.writeln('🟢 System Status: Operational')
        xtermRef.current.writeln('🔬 Active Batches: 2')
        xtermRef.current.writeln('🌡️ Environment: Optimal')
        xtermRef.current.writeln('🧠 ML Models: Online')
        break
        
      case 'clear':
        xtermRef.current.clear()
        xtermRef.current.write('(crowe-ml) $ ')
        return
        
      default:
        if (cmd) {
          xtermRef.current.writeln(`Command not found: ${cmd}`)
          xtermRef.current.writeln('Type "help" for available commands')
        }
    }
  }

  const runPythonCode = async () => {
    if (!xtermRef.current) return

    setIsRunning(true)
    xtermRef.current.writeln('🚀 Executing ML analysis pipeline...')
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (xtermRef.current) {
      xtermRef.current.writeln('🔬 CroweOS Mycology Analytics Engine v2.1.0')
      xtermRef.current.writeln('==================================================')
      xtermRef.current.writeln('📊 BATCH PERFORMANCE ANALYSIS')
      xtermRef.current.writeln('Overall Yield Efficiency: 92.0%')
      xtermRef.current.writeln('Average Contamination Rate: 2.0%')
      xtermRef.current.writeln('✅ Analysis Complete - Ready for optimization')
      xtermRef.current.write('\n(crowe-ml) $ ')
    }
    
    setExecutionCount(prev => prev + 1)
    setIsRunning(false)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "fixed inset-0 z-50 bg-background/95 backdrop-blur-sm border border-border shadow-2xl",
        isMaximized ? "m-0" : "m-4 rounded-xl",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Brain className="h-5 w-5 text-purple-400" />
          <div>
            <h2 className="font-semibold text-lg">CroweOS ML Console</h2>
            <p className="text-xs text-muted-foreground">Advanced Mycology Analytics Platform v2.1.0</p>
          </div>
          <Badge variant={isRunning ? "default" : "secondary"} className="text-xs">
            {isRunning ? "Running" : "Ready"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={runPythonCode}>
            <Play className="h-3 w-3 mr-2" />
            Run
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r bg-muted/30 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="w-full justify-start mb-1"
              >
                <Icon className="h-4 w-4 mr-3" />
                {tab.label}
              </Button>
            )
          })}
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-3 border-b">
            <span className="font-medium text-sm">{activeTabData.label}</span>
            <Badge variant="outline" className="text-xs">{activeTabData.language}</Badge>
          </div>
          
          <div className="flex-1">
            <Suspense fallback={<div className="p-4">Loading editor...</div>}>
              <MonacoEditor
                height="100%"
                language={activeTabData.language}
                value={activeTabData.content}
                options={{
                  readOnly: activeTabData.readonly,
                  fontSize: 13,
                  theme: 'vs-dark',
                  minimap: { enabled: false }
                }}
              />
            </Suspense>
          </div>

          {/* Terminal */}
          <div className="h-48 border-t bg-black">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-green-400" />
                <span className="text-sm text-white">Terminal</span>
              </div>
            </div>
            <div ref={terminalRef} className="flex-1 p-3" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
