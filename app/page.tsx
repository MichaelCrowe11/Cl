"use client"

import { useState } from 'react'
import { CroweLogicGPT } from '@/components/crowe-logic-gpt'
import { NavigationHeader } from '@/components/navigation-header'
import { SecurityDashboard } from '@/components/security-dashboard'
import { ResearchTools } from '@/components/research-tools'

export default function Home() {
  const [currentSection, setCurrentSection] = useState('chat')

  const renderSection = () => {
    switch (currentSection) {
      case 'chat':
        return <CroweLogicGPT />
      case 'security':
        return <SecurityDashboard />
      case 'research':
        return <ResearchTools />
      case 'protocols':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Protocol Library</h2>
            <p className="text-gray-600">Standardized protocols for mycological research and cultivation</p>
            <div className="text-center text-gray-500 py-8">
              Protocol library coming soon...
            </div>
          </div>
        )
      case 'data':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Data Analysis</h2>
            <p className="text-gray-600">Advanced analytics and visualization tools</p>
            <div className="text-center text-gray-500 py-8">
              Data analysis tools coming soon...
            </div>
          </div>
        )
      case 'monitoring':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">System Monitoring</h2>
            <p className="text-gray-600">Real-time system health and performance metrics</p>
            <div className="text-center text-gray-500 py-8">
              System monitoring dashboard coming soon...
            </div>
          </div>
        )
      default:
        return <CroweLogicGPT />
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <NavigationHeader 
        onNavigate={setCurrentSection}
        currentSection={currentSection}
      />
      <div className="flex-1 container mx-auto px-4 py-6">
        {renderSection()}
      </div>
    </main>
  )
} 