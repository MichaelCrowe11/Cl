"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  BarChart3, 
  BookOpen, 
  FileText, 
  FlaskConical, 
  TreePine, 
  Download, 
  MessageSquare, 
  Database, 
  Zap, 
  Settings,
  Menu,
  X,
  Home
} from "lucide-react"

interface NavigationProps {
  activeModule: string
  onModuleChange: (module: string) => void
}

export default function Navigation({ activeModule, onModuleChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const modules = [
    { id: "dashboard", name: "Dashboard", icon: Home, color: "text-blue-600" },
    { id: "overview", name: "Overview", icon: BarChart3, color: "text-blue-600" },
    { id: "protocols", name: "Protocols", icon: BookOpen, color: "text-green-600" },
    { id: "batch-logs", name: "Batch Logs", icon: FileText, color: "text-orange-600" },
    { id: "rd-experiments", name: "R&D / Experiments", icon: FlaskConical, color: "text-purple-600" },
    { id: "simulations", name: "Simulations & Trees", icon: TreePine, color: "text-emerald-600" },
    { id: "reports", name: "Generated Reports", icon: Download, color: "text-indigo-600" },
    { id: "ai-coach", name: "AI Coach", icon: MessageSquare, color: "text-pink-600" },
    { id: "knowledge-base", name: "Knowledge Base", icon: Database, color: "text-teal-600" },
    { id: "integrations", name: "Integrations", icon: Zap, color: "text-yellow-600" },
    { id: "settings", name: "Settings", icon: Settings, color: "text-gray-600" }
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow-lg"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Crowe Logic AI
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              v3.1 Professional
            </p>
          </div>

          <nav className="space-y-2">
            {modules.map((module) => {
              const Icon = module.icon
              const isActive = activeModule === module.id
              
              return (
                <Button
                  key={module.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left h-auto py-3 px-3",
                    isActive ? "bg-blue-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                  onClick={() => {
                    onModuleChange(module.id)
                    setIsOpen(false)
                  }}
                >
                  <Icon className={cn("h-4 w-4 mr-3", isActive ? "text-white" : module.color)} />
                  <span className="text-sm">{module.name}</span>
                </Button>
              )
            })}
          </nav>

          <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <h3 className="text-sm font-medium mb-2">System Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600 dark:text-slate-400">Active Batches</span>
                <Badge variant="secondary" className="text-xs">24</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600 dark:text-slate-400">Contamination</span>
                <Badge variant="secondary" className="text-xs text-green-600">2.1%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600 dark:text-slate-400">AI Health</span>
                <Badge variant="secondary" className="text-xs text-green-600">Online</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
