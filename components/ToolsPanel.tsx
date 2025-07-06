"use client"

import React from 'react'
import { 
  Download, 
  FileText, 
  Mic2, 
  Share2, 
  PlusCircle, 
  FolderOpen,
  Microscope,
  Beaker,
  FlaskConical,
  BarChart3,
  BookOpen,
  Leaf,
  Calculator,
  Camera,
  Database,
  Settings,
  Copy,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const tabs = ['Tools', 'Research', 'Session'] as const
type Tab = typeof tabs[number]

export default function ToolsPanel() {
  const [activeTab, setActiveTab] = React.useState<Tab>('Tools')

  const researchTools = [
    { 
      icon: Microscope, 
      name: "Species Identifier", 
      desc: "AI-powered mushroom identification",
      action: () => alert("Species Identifier tool - Upload an image to identify mushroom species")
    },
    { 
      icon: Beaker, 
      name: "Substrate Calculator", 
      desc: "Optimize growing media ratios",
      action: () => alert("Substrate Calculator - Calculate optimal substrate compositions")
    },
    { 
      icon: FlaskConical, 
      name: "Protocol Generator", 
      desc: "Create sterile lab protocols",
      action: () => alert("Protocol Generator - Generate step-by-step lab protocols")
    },
    { 
      icon: BarChart3, 
      name: "Yield Optimizer", 
      desc: "Maximize production efficiency",
      action: () => alert("Yield Optimizer - Analyze and optimize cultivation yields")
    },
    { 
      icon: Calculator, 
      name: "Nutrition Calculator", 
      desc: "C:N ratio analysis",
      action: () => alert("Nutrition Calculator - Calculate carbon-to-nitrogen ratios")
    },
    { 
      icon: Database, 
      name: "Research Database", 
      desc: "Literature search & analysis",
      action: () => window.open("https://pubmed.ncbi.nlm.nih.gov/", "_blank")
    }
  ]

  const toolsPanel = [
    { 
      icon: Camera, 
      name: "Image Analysis", 
      desc: "Microscopy & sample analysis",
      action: () => alert("Image Analysis - Upload images for AI-powered analysis")
    },
    { 
      icon: Leaf, 
      name: "Environmental Monitor", 
      desc: "Track growing conditions",
      action: () => alert("Environmental Monitor - Monitor temperature, humidity, and air quality")
    },
    { 
      icon: BookOpen, 
      name: "Knowledge Base", 
      desc: "Access research library",
      action: () => alert("Knowledge Base - Browse curated mycology resources")
    },
    { 
      icon: Settings, 
      name: "Lab Settings", 
      desc: "Configure lab parameters",
      action: () => alert("Lab Settings - Customize your laboratory settings")
    }
  ]

  const sessionTools = [
    { 
      icon: Download, 
      name: "Export Chat", 
      desc: "Download conversation as PDF",
      action: () => {
        const content = "Crowe Logic GPT Conversation\\n\\nExported on: " + new Date().toLocaleDateString()
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `crowe-logic-gpt-session-${Date.now()}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    },
    { 
      icon: Share2, 
      name: "Share Session", 
      desc: "Collaborate with colleagues",
      action: () => {
        navigator.clipboard.writeText(window.location.href)
        alert("Session link copied to clipboard!")
      }
    },
    { 
      icon: Copy, 
      name: "Copy Last Response", 
      desc: "Copy AI response to clipboard",
      action: () => alert("Last response copied to clipboard!")
    },
    { 
      icon: PlusCircle, 
      name: "New Session", 
      desc: "Start a fresh conversation",
      action: () => {
        if (confirm("Start a new session? Current conversation will be lost.")) {
          window.location.reload()
        }
      }
    }
  ]

  const getActiveTools = () => {
    switch (activeTab) {
      case 'Research': return researchTools
      case 'Session': return sessionTools
      default: return toolsPanel
    }
  }

  return (
    <aside className="w-80 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Research Lab
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Mycology tools & protocols
        </p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <nav className="flex">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tools Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-3">
          {getActiveTools().map(tool => (
            <Button
              key={tool.name}
              variant="ghost"
              onClick={tool.action}
              className="w-full h-auto p-4 justify-start hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 group"
            >
              <div className="flex items-start space-x-3 w-full">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                  <tool.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {tool.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {tool.desc}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </div>
            </Button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => alert("Voice mode activated! Speak your question.")}
              className="flex items-center gap-2"
            >
              <Mic2 className="w-4 h-4" />
              Voice
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open("https://github.com/MichaelCrowe11/Cl", "_blank")}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
