"use client"

import React from 'react'
import Image from 'next/image'
import { Bot, Cpu, BookOpen, Plug, Settings, PlusCircle, Clock, Microscope, FlaskConical, MessageSquare } from 'lucide-react'

const navItems = [
  { label: 'Crowe Logic GPT', icon: MessageSquare },
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
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-full">
      {/* Header with Crowe Logic Avatar */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden">
            <Image
              src="/crowe-avatar.png"
              alt="Crowe Logic"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-white text-sm">Crowe Logic GPT</div>
            <div className="text-xs text-gray-400">Mycology Research</div>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-600">
          <PlusCircle className="w-4 h-4" />
          <span className="text-sm font-medium">New chat</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-auto">
        <div className="space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
            >
              <item.icon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">{item.label}</span>
            </button>
          ))}
        </div>
        
        {/* Recent Sessions */}
        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Recent
          </h3>
          <div className="space-y-1">
            {recentSessions.map(session => (
              <button
                key={session}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-left group"
              >
                <MessageSquare className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 truncate">{session}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  )
}
