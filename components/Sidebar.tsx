"use client"

import React from 'react'
import { CroweLogoSVG } from './crowe-logo'
import { Bot, Cpu, BookOpen, Plug, Settings, PlusCircle, Clock, Microscope, FlaskConical } from 'lucide-react'

const navItems = [
  { label: 'Crowe Logic GPT', icon: Bot },
  { label: 'Research Models', icon: Cpu },
  { label: 'Mycology Database', icon: Microscope },
  { label: 'Lab Protocols', icon: FlaskConical },
  { label: 'Knowledge Base', icon: BookOpen },
  { label: 'Integrations', icon: Plug },
  { label: 'Settings', icon: Settings },
]

const recentSessions = [
  "Lion's Mane Cultivation Research",
  'Shiitake Substrate Optimization',
  'Contamination Prevention Protocols',
  'Yield Prediction Analysis',
  'Environmental Impact Study',
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r flex flex-col">
      <div className="p-4 border-b flex items-center bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-950/20 dark:to-orange-950/20">
        <CroweLogoSVG size={32} className="mr-3" />
        <div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
            Crowe Logic
          </span>
          <div className="text-xs text-muted-foreground font-medium">GPT Research Platform</div>
        </div>
      </div>
      <nav className="flex-1 p-4 overflow-auto">
        {/* New Chat Button */}
        <button className="w-full mb-4 p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm">
          <PlusCircle className="w-4 h-4" />
          New Research Chat
        </button>
        
        <ul className="space-y-1">
          {navItems.map(item => (
            <li key={item.label}>
              <a href="#" className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
                <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
        
        <div className="mt-8">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Sessions</h3>
          <ul className="space-y-1">
            {recentSessions.map(session => (
              <li key={session}>
                <a href="#" className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors">
                  <Clock className="w-4 h-4 text-muted-foreground group-hover:text-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground truncate">{session}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="p-4 border-t">
        <button className="w-full flex items-center justify-center space-x-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <PlusCircle className="w-5 h-5" />
          <span>New Session</span>
        </button>
      </div>
    </aside>
  )
}
