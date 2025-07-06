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
  Settings
} from 'lucide-react'

const tabs = ['Research Tools', 'Lab Protocols', 'Session'] as const

type Tab = typeof tabs[number]

export default function ToolsPanel() {
  const [activeTab, setActiveTab] = React.useState<Tab>('Research Tools')

  const researchTools = [
    { icon: Microscope, name: "Species Identifier", desc: "AI-powered ID tool" },
    { icon: Beaker, name: "Substrate Calculator", desc: "Optimize growing media" },
    { icon: FlaskConical, name: "Protocol Generator", desc: "Create sterile protocols" },
    { icon: BarChart3, name: "Yield Optimizer", desc: "Maximize production" },
    { icon: Calculator, name: "Nutrition Calculator", desc: "C:N ratio analysis" },
    { icon: Camera, name: "Image Analysis", desc: "Microscopy analysis" },
    { icon: Database, name: "Research Database", desc: "Literature search" },
    { icon: Leaf, name: "Environmental Impact", desc: "Sustainability metrics" }
  ]

  const protocolTools = [
    { icon: FileText, name: "Sterilization SOP", desc: "Standard protocols" },
    { icon: Beaker, name: "Inoculation Guide", desc: "Step-by-step procedures" },
    { icon: FlaskConical, name: "Harvest Protocol", desc: "Optimal timing guides" },
    { icon: BookOpen, name: "Quality Control", desc: "Testing procedures" }
  ]

  const sessionTools = [
    { icon: Download, name: "Export Chat", desc: "Download as PDF" },
    { icon: Share2, name: "Share Session", desc: "Collaborate" },
    { icon: Mic2, name: "Voice Mode", desc: "Voice interaction" },
    { icon: PlusCircle, name: "New Session", desc: "Start fresh" }
  ]

  return (
    <aside className="w-80 bg-white dark:bg-zinc-900 border-l flex flex-col h-full">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-950/20 dark:to-orange-950/20">
        <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
          Research Lab
        </h2>
        <p className="text-sm text-muted-foreground font-medium">
          Advanced mycology tools & protocols
        </p>
      </div>
      
      {/* Tabs */}
      <div className="border-b">
        <nav className="flex">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center p-3 text-xs font-medium hover:bg-muted transition-colors ${
                activeTab === tab 
                  ? 'border-b-2 border-primary text-primary bg-primary/5' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'Research Tools' && (
          <div className="space-y-3">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-2">
                <Microscope className="w-4 h-4" />
                Laboratory Instruments
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                AI-powered mycology research tools
              </p>
            </div>
            
            {researchTools.map((tool, index) => (
              <button
                key={index}
                className="w-full flex items-start space-x-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors group text-left"
              >
                <tool.icon className="w-5 h-5 text-blue-500 mt-0.5 group-hover:text-blue-600 transition-colors" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{tool.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tool.desc}</div>
                </div>
              </button>
            ))}
            
            {/* Quick Stats */}
            <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">Research Stats</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Species Identified</span>
                  <span className="font-medium text-blue-600">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Protocols Generated</span>
                  <span className="font-medium text-green-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Citations Found</span>
                  <span className="font-medium text-purple-600">156</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'Lab Protocols' && (
          <div className="space-y-3">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Standard Protocols
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Laboratory procedures & SOPs
              </p>
            </div>
            
            {protocolTools.map((tool, index) => (
              <button
                key={index}
                className="w-full flex items-start space-x-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors group text-left"
              >
                <tool.icon className="w-5 h-5 text-green-500 mt-0.5 group-hover:text-green-600 transition-colors" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{tool.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tool.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {activeTab === 'Session' && (
          <div className="space-y-3">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Session Management
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Save, share, and manage conversations
              </p>
            </div>
            
            {sessionTools.map((tool, index) => (
              <button
                key={index}
                className="w-full flex items-start space-x-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors group text-left"
              >
                <tool.icon className="w-5 h-5 text-orange-500 mt-0.5 group-hover:text-orange-600 transition-colors" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{tool.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tool.desc}</div>
                </div>
              </button>
            ))}
            
            {/* Recent Sessions */}
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">Recent Sessions</h4>
              <div className="space-y-2">
                <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded text-xs">
                  <div className="font-medium text-gray-800 dark:text-gray-100">Shiitake Cultivation</div>
                  <div className="text-gray-500 dark:text-gray-400">2 hours ago</div>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded text-xs">
                  <div className="font-medium text-gray-800 dark:text-gray-100">Substrate Analysis</div>
                  <div className="text-gray-500 dark:text-gray-400">1 day ago</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
