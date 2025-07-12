"use client"

import { useState } from 'react'
import { EnhancedChatInterface } from '@/components/enhanced-chat-interface'
import { SecurityDashboard } from '@/components/security-dashboard'
import { ResearchTools } from '@/components/research-tools'
import { EnhancedLayout } from '@/components/enhanced-layout'

export default function Home() {
  const [currentSection, setCurrentSection] = useState('chat')

  const renderSection = () => {
    switch (currentSection) {
      case 'chat':
        return <EnhancedChatInterface />
      case 'security':
        return <SecurityDashboard />
      case 'research':
        return <ResearchTools />
      case 'protocols':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Protocol Library</h2>
            <p className="text-gray-600">Standardized protocols for mycological research and cultivation</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">Substrate Preparation</h3>
                <p className="text-gray-600 text-sm mb-4">Standard protocols for substrate sterilization and preparation</p>
                <div className="text-xs text-gray-500">
                  • Moisture content optimization<br/>
                  • Sterilization parameters<br/>
                  • Cooling procedures
                </div>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">Inoculation Procedures</h3>
                <p className="text-gray-600 text-sm mb-4">Sterile inoculation techniques and contamination prevention</p>
                <div className="text-xs text-gray-500">
                  • Sterile technique<br/>
                  • Inoculation rates<br/>
                  • Quality control
                </div>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">Environmental Controls</h3>
                <p className="text-gray-600 text-sm mb-4">Temperature, humidity, and air flow management protocols</p>
                <div className="text-xs text-gray-500">
                  • Climate monitoring<br/>
                  • Air filtration<br/>
                  • Growth optimization
                </div>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">Harvesting Guidelines</h3>
                <p className="text-gray-600 text-sm mb-4">Optimal timing and techniques for mushroom harvesting</p>
                <div className="text-xs text-gray-500">
                  • Maturity indicators<br/>
                  • Harvesting techniques<br/>
                  • Post-harvest handling
                </div>
              </div>
            </div>
          </div>
        )
      case 'data':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Data Analysis</h2>
            <p className="text-gray-600">Advanced analytics and visualization tools</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-200 rounded-lg bg-white">
                <h3 className="font-semibold text-gray-900 mb-4">Yield Tracking</h3>
                <div className="h-32 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center border border-green-200">
                  <span className="text-green-600 font-medium">📊 Yield Analytics Coming Soon</span>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Real-time yield monitoring and trend analysis
                </div>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg bg-white">
                <h3 className="font-semibold text-gray-900 mb-4">Environmental Conditions</h3>
                <div className="h-32 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center border border-blue-200">
                  <span className="text-blue-600 font-medium">🌡️ Climate Data Visualization</span>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Temperature, humidity, and air quality metrics
                </div>
              </div>
            </div>
          </div>
        )
      case 'monitoring':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">System Monitoring</h2>
            <p className="text-gray-600">Real-time system health and performance metrics</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border border-gray-200 rounded-lg bg-white">
                <h3 className="font-semibold text-gray-900 mb-2">API Health</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">Operational</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">Last check: Just now</div>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg bg-white">
                <h3 className="font-semibold text-gray-900 mb-2">Database</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">Response time: 45ms</div>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg bg-white">
                <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">Secure</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">All systems protected</div>
              </div>
            </div>
          </div>
        )
      default:
        return <EnhancedChatInterface />
    }
  }

  return (
    <EnhancedLayout 
      currentSection={currentSection}
      onNavigate={setCurrentSection}
    >
      {renderSection()}
    </EnhancedLayout>
  )
} 