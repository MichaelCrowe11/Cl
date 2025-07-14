"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { 
  FileText, 
  Search, 
  GitBranch, 
  Settings, 
  Activity,
  Folder,
  Code,
  Database,
  Terminal,
  Beaker,
  FlaskConical
} from "lucide-react"

interface MiniSidebarProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  className?: string
}

export default function MiniSidebar({ 
  activeTab = 'explorer', 
  onTabChange, 
  className 
}: MiniSidebarProps) {
  const sidebarTabs = [
    { id: 'explorer', icon: Folder, label: 'Explorer', tooltip: 'File Explorer' },
    { id: 'search', icon: Search, label: 'Search', tooltip: 'Search Files' },
    { id: 'git', icon: GitBranch, label: 'Git', tooltip: 'Source Control' },
    { id: 'lab', icon: Beaker, label: 'Lab', tooltip: 'Lab Tools' },
    { id: 'protocols', icon: FlaskConical, label: 'Protocols', tooltip: 'Lab Protocols' },
    { id: 'terminal', icon: Terminal, label: 'Terminal', tooltip: 'Terminal' },
    { id: 'activity', icon: Activity, label: 'Activity', tooltip: 'Activity Monitor' },
    { id: 'settings', icon: Settings, label: 'Settings', tooltip: 'Settings' }
  ]

  return (
    <div className={cn(
      "w-12 bg-slate-900 border-r border-slate-700 flex flex-col items-center py-2 gap-1",
      className
    )}>
      {sidebarTabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            title={tab.tooltip}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200",
              "hover:bg-slate-800 hover:scale-105",
              isActive 
                ? "bg-slate-700 text-slate-100 border border-slate-600" 
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Icon className="h-5 w-5" />
          </button>
        )
      })}
      
      {/* Spacer */}
      <div className="flex-1" />
      
      {/* Bottom action buttons */}
      <button
        title="Database"
        className="w-10 h-10 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all duration-200"
      >
        <Database className="h-5 w-5" />
      </button>
    </div>
  )
}
