'use client'

import { useState } from 'react'
import { MinimalChatInterface } from './minimal-chat-interface'

type WorkArea = 'chat' | 'research' | 'analysis' | 'protocols'

interface WorkAreaOption {
  id: WorkArea
  title: string
  description: string
  icon: React.ReactNode
}

const WORK_AREAS: WorkAreaOption[] = [
  {
    id: 'chat',
    title: 'AI Assistant',
    description: 'Interactive mycology consultation',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <circle cx="8.5" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="15.5" cy="12" r="1.5" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'research',
    title: 'Research Hub',
    description: 'Scientific literature & studies',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M3 3h18v18H3V3z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      </svg>
    )
  },
  {
    id: 'analysis',
    title: 'Data Analysis',
    description: 'Yield tracking & optimization',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M3 20h18M5 20V10M9 20V4M13 20V12M17 20V8" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="5" cy="8" r="1" fill="currentColor"/>
        <circle cx="9" cy="2" r="1" fill="currentColor"/>
        <circle cx="13" cy="10" r="1" fill="currentColor"/>
        <circle cx="17" cy="6" r="1" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'protocols',
    title: 'Protocols',
    description: 'Cultivation procedures',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M8 6h8M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="6" cy="18" r="1" fill="currentColor"/>
        <circle cx="10" cy="18" r="1" fill="currentColor"/>
        <circle cx="14" cy="18" r="1" fill="currentColor"/>
      </svg>
    )
  }
]

export function MinimalLayout() {
  const [activeArea, setActiveArea] = useState<WorkArea>('chat')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderContent = () => {
    switch (activeArea) {
      case 'chat':
        return <MinimalChatInterface />
      case 'research':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                {WORK_AREAS.find(area => area.id === 'research')?.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Research Hub</h3>
              <p className="text-gray-600">Scientific literature and studies coming soon</p>
            </div>
          </div>
        )
      case 'analysis':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                {WORK_AREAS.find(area => area.id === 'analysis')?.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Data Analysis</h3>
              <p className="text-gray-600">Analytics dashboard coming soon</p>
            </div>
          </div>
        )
      case 'protocols':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                {WORK_AREAS.find(area => area.id === 'protocols')?.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Protocols</h3>
              <p className="text-gray-600">Cultivation procedures coming soon</p>
            </div>
          </div>
        )
      default:
        return <MinimalChatInterface />
    }
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-16'} transition-all duration-300 bg-black text-white flex flex-col border-r border-gray-800`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-black">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor"/>
                <path d="M12 6v6l4 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-semibold">CroweLogic</h1>
                <p className="text-sm text-gray-400">Mycology AI</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <div className="space-y-2">
            {WORK_AREAS.map((area) => (
              <button
                key={area.id}
                onClick={() => setActiveArea(area.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                  activeArea === area.id
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <div className="w-6 h-6 flex-shrink-0">
                  {area.icon}
                </div>
                {sidebarOpen && (
                  <div className="text-left">
                    <div className="font-medium text-sm">{area.title}</div>
                    <div className="text-xs opacity-60">{area.description}</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {WORK_AREAS.find(area => area.id === activeArea)?.title}
            </h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
