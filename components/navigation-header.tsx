"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Settings, 
  Shield, 
  BarChart3, 
  Database, 
  FileText, 
  Microscope, 
  Menu, 
  X,
  Home,
  Brain,
  Activity
} from 'lucide-react'

interface NavigationHeaderProps {
  onNavigate?: (section: string) => void
  currentSection?: string
}

export function NavigationHeader({ onNavigate, currentSection = 'chat' }: NavigationHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    { id: 'chat', label: 'AI Chat', icon: Brain },
    { id: 'research', label: 'Research Tools', icon: Microscope },
    { id: 'protocols', label: 'Protocols', icon: FileText },
    { id: 'data', label: 'Data Analysis', icon: BarChart3 },
    { id: 'security', label: 'Security Dashboard', icon: Shield },
    { id: 'monitoring', label: 'System Health', icon: Activity },
  ]

  const handleNavigation = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId)
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center px-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Microscope className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-900">Crowe Logic AI</h1>
            <p className="text-xs text-gray-500">Mycology Research Suite</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 ml-8">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentSection === item.id
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center space-x-2 ${
                  isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Button>
            )
          })}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Settings */}
        <div className="hidden md:flex ml-auto">
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentSection === item.id
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full justify-start space-x-2 ${
                    isActive ? 'bg-green-100 text-green-700' : ''
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
