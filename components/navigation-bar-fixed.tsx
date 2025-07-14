"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { CroweLogo } from "@/components/crowe-logo"
import { 
  MessageSquare, 
  Code2, 
  Brain, 
  FlaskConical, 
  ExternalLink,
  Sparkles,
  Zap,
  Home
} from "lucide-react"

interface NavigationBarProps {
  activeInterface: 'chat' | 'ide'
  onInterfaceChange: (interfaceType: 'chat' | 'ide') => void
}

export default function NavigationBar({ activeInterface, onInterfaceChange }: NavigationBarProps) {
  return (
    <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left - Branding & Navigation */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {/* CroweOS Systems Logo - Clickable Home Button */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <CroweLogo 
                variant="official-circle"
                size={32}
                systemBranding={true}
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-base bg-gradient-to-r bg-clip-text text-transparent from-purple-600 to-blue-600">
                    CroweOS
                  </span>
                  <span className="text-xs font-medium text-muted-foreground/80 tracking-wider">
                    SYSTEMS
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Interface Toggle */}
          <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg">
            <Button
              variant={activeInterface === 'chat' ? 'default' : 'ghost'}
              size="sm"
              className={`text-xs gap-2 transition-all ${
                activeInterface === 'chat' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md' 
                  : 'hover:bg-muted'
              }`}
              onClick={() => onInterfaceChange('chat')}
            >
              <MessageSquare className="h-3 w-3" />
              AI Chat
              {activeInterface === 'chat' && (
                <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                  Active
                </Badge>
              )}
            </Button>
            
            <Button
              variant={activeInterface === 'ide' ? 'default' : 'ghost'}
              size="sm"
              className={`text-xs gap-2 transition-all ${
                activeInterface === 'ide' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md' 
                  : 'hover:bg-muted'
              }`}
              onClick={() => onInterfaceChange('ide')}
            >
              <Code2 className="h-3 w-3" />
              Lab IDE
              {activeInterface === 'ide' && (
                <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                  Active
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Center - Session Info */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">Session Active</span>
          </div>
        </div>

        {/* Right - Actions & Settings */}
        <div className="flex items-center gap-3">
          {/* Status Indicators */}
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Brain className="h-3 w-3 mr-1" />
              Crowe Logic Ready
            </Badge>
          </div>

          {/* Interface Status */}
          <div className="hidden sm:flex items-center gap-2">
            {activeInterface === 'chat' && (
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Assistant Active
              </Badge>
            )}
            {activeInterface === 'ide' && (
              <Badge variant="secondary" className="text-xs">
                <FlaskConical className="h-3 w-3 mr-1" />
                Lab IDE Active
              </Badge>
            )}
          </div>

          {/* Quick Interface Switch */}
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-2"
            onClick={() => onInterfaceChange(activeInterface === 'chat' ? 'ide' : 'chat')}
          >
            {activeInterface === 'chat' ? (
              <>
                <Code2 className="h-3 w-3" />
                Switch to IDE
              </>
            ) : (
              <>
                <MessageSquare className="h-3 w-3" />
                Switch to Chat
              </>
            )}
            <ExternalLink className="h-3 w-3" />
          </Button>

          {/* Home Button */}
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-2"
            asChild
          >
            <Link href="/">
              <Home className="h-3 w-3" />
              Home
            </Link>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
