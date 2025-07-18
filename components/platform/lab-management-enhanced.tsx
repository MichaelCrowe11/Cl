import React from 'react'
import { CroweLogo } from '@/components/crowe-logo'
import { Button } from '@/components/ui/button'
import { 
  Microscope, 
  FlaskConical, 
  Database, 
  BarChart2, 
  Cloud, 
  Clock 
} from 'lucide-react'

export default function LabManagementEnhanced() {
  const capabilities = [
    {
      icon: <Microscope className="h-8 w-8" />,
      title: "Advanced Specimen Tracking",
      description: "Real-time monitoring, geolocation tracking, and comprehensive specimen lifecycle management",
      badge: "Tracking"
    },
    {
      icon: <FlaskConical className="h-8 w-8" />,
      title: "Protocol Automation",
      description: "Standardized workflows, automated documentation, and intelligent protocol optimization",
      badge: "Automation"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Research Data Management",
      description: "Secure cloud storage, AI-powered data insights, and seamless collaboration tools",
      badge: "Data Suite"
    }
  ]

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <CroweLogo 
                  variant="official-circle"
                  size={40}
                  systemBranding={true}
                  showText={false}
                  darkTheme={false}
                />
                <span className="ml-2 text-zinc-900 font-semibold">Systems</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-lg text-zinc-900">CroweOS</span>
                  <span className="text-sm font-medium text-zinc-600 tracking-wider">LAB PLATFORM</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100">
                <BarChart2 className="mr-2 h-4 w-4" /> Analytics
              </Button>
              <Button variant="ghost" className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100">
                <Clock className="mr-2 h-4 w-4" /> Schedule
              </Button>
              <Button className="bg-zinc-900 text-white hover:bg-zinc-800">
                Start Lab Session
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
            <div className="w-1/2 md:w-1/4 animate-float">
              <div className="w-full h-auto max-w-xs mx-auto">
                <CroweLogo 
                  variant="official-circle"
                  size={200}
                  systemBranding={true}
                  showText={false}
                  darkTheme={false}
                />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-zinc-900">
                Intelligent Lab 
                <br />
                Management Ecosystem
              </h1>
              <p className="text-xl text-zinc-700 mb-6 max-w-3xl leading-relaxed">
                A comprehensive platform that transforms scientific research management through 
                AI-driven insights, automated workflows, and seamless collaboration tools.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {capabilities.map((capability, index) => (
              <div key={index} className="bg-zinc-50 p-6 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-zinc-100">
                    {React.cloneElement(capability.icon, { className: 'h-8 w-8 text-zinc-700' })}
                  </div>
                  <span className="text-xs text-white bg-zinc-900 px-2 py-1 rounded">
                    {capability.badge}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">{capability.title}</h3>
                <p className="text-zinc-600">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
