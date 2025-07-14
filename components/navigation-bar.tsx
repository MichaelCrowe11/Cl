"use client"

import React from "react"
import { 
  Brain, 
  FlaskConical, 
  MessageSquare, 
  Code,
  Code2,
  Settings,
  Home,
  Sparkles,
  Zap,
  Monitor,
  Terminal
} from "lucide-react"

// Import our logo component
import { CroweLogo } from './crowe-logo'

// Simple Badge component as fallback
// Simple Badge component as fallback
const Badge = ({ children, variant = "default", className = "" }: { 
  children: React.ReactNode, 
  variant?: "default" | "outline", 
  className?: string 
}) => (
  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${
    variant === "outline" 
      ? "border border-border bg-background text-foreground" 
      : "bg-primary text-primary-foreground"
  } ${className}`}>
    {children}
  </span>
)

// Simple Button component as fallback
const Button = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "",
  onClick,
  title,
  ...props 
}: { 
  children: React.ReactNode,
  variant?: "default" | "outline" | "ghost",
  size?: "default" | "sm",
  className?: string,
  onClick?: () => void,
  title?: string,
  [key: string]: any
}) => (
  <button 
    className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${
      variant === "outline" 
        ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground" 
        : variant === "ghost"
        ? "hover:bg-accent hover:text-accent-foreground"
        : "bg-primary text-primary-foreground hover:bg-primary/90"
    } ${
      size === "sm" 
        ? "h-9 px-3 text-sm" 
        : "h-10 py-2 px-4"
    } ${className}`}
    onClick={onClick}
    title={title}
    {...props}
  >
    {children}
  </button>
)
import { ExternalLink } from "lucide-react"

// Simple ThemeToggle component as fallback
const ThemeToggle = () => (
  <Button
    variant="ghost"
    size="sm"
    className="text-xs gap-1"
    onClick={() => {
      // Toggle theme logic would go here
      const isDark = document.documentElement.classList.contains('dark')
      if (isDark) {
        document.documentElement.classList.remove('dark')
      } else {
        document.documentElement.classList.add('dark')
      }
    }}
    title="Toggle theme"
  >
    <Monitor className="h-3 w-3" />
  </Button>
)

interface NavigationBarProps {
  activeInterface: 'chat' | 'ide'
  onInterfaceChange: (interfaceName: 'chat' | 'ide') => void
}

export default function NavigationBar({ activeInterface, onInterfaceChange }: NavigationBarProps) {
  return (
    <div className="border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left - Branding & Navigation */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {/* CroweOS Systems Logo - Clickable Home Button */}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg"
              onClick={() => window.location.href = '/'}
            >
              {/* Use official CroweOS Systems logo */}
              <CroweLogo 
                variant="official-circle"
                size={32}
                showText={false}
                systemBranding={true}
                className="shrink-0"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-base bg-gradient-to-r bg-clip-text text-transparent from-purple-700 to-amber-500">
                    CroweOS
                  </span>
                  <span className="text-xs font-medium text-purple-600/80 tracking-wider">
                    SYSTEMS
                  </span>
                </div>
                <div className="text-xs text-purple-500/70 -mt-0.5">
                  Mycology Research Platform
                </div>
              </div>
            </Button>
            
            {/* Home Button */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-xs"
              onClick={() => window.location.href = '/'}
              title="Return to Dashboard"
            >
              <Home className="h-3 w-3" />
              Home
            </Button>
          </div>

          {/* Interface Switcher */}
          <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg">
            <Button
              variant={activeInterface === 'chat' ? 'default' : 'ghost'}
              size="sm"
              className={`text-xs gap-2 transition-all ${
                activeInterface === 'chat' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'hover:bg-background'
              }`}
              onClick={() => onInterfaceChange('chat')}
            >
              <MessageSquare className="h-3 w-3" />
              AI Assistant
              {activeInterface === 'chat' && <Sparkles className="h-3 w-3" />}
            </Button>
            <Button
              variant={activeInterface === 'ide' ? 'default' : 'ghost'}
              size="sm"
              className={`text-xs gap-2 transition-all ${
                activeInterface === 'ide' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'hover:bg-background'
              }`}
              onClick={() => onInterfaceChange('ide')}
            >
              <Code2 className="h-3 w-3" />
              Lab IDE
              {activeInterface === 'ide' && <Zap className="h-3 w-3" />}
            </Button>
          </div>
        </div>

        {/* Center - Quick Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <div className="relative inline-flex">
                <div className="rounded-full bg-green-400 w-2 h-2"></div>
                <div className="absolute inset-0 rounded-full animate-ping bg-green-400 w-2 h-2"></div>
              </div>
              <span className="text-muted-foreground">All Systems Online</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <FlaskConical className="h-3 w-3" />
              <span>3 Active Batches</span>
            </div>
          </div>
        </div>

        {/* Right - Status & Settings */}
        <div className="flex items-center gap-3">
          {/* Session Info */}
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Session: {new Date().toISOString().slice(11, 16)}
            </Badge>
          </div>

          {/* Interface Status */}
          <div className="hidden sm:flex items-center gap-2">
            {activeInterface === 'chat' && (
              <Badge variant="outline" className="text-xs gap-1">
                <Brain className="h-3 w-3" />
                AI Chat Active
              </Badge>
            )}
            {activeInterface === 'ide' && (
              <Badge variant="outline" className="text-xs gap-1">
                <Code2 className="h-3 w-3" />
                Lab IDE Active
              </Badge>
            )}
          </div>

          {/* Quick Link to Other Interface */}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => onInterfaceChange(activeInterface === 'chat' ? 'ide' : 'chat')}
          >
            {activeInterface === 'chat' ? (
              <>
                <Code2 className="h-3 w-3" />
                Open Lab IDE
              </>
            ) : (
              <>
                <MessageSquare className="h-3 w-3" />
                Open AI Chat
              </>
            )}
            <ExternalLink className="h-3 w-3" />
          </Button>

          <div className="h-4 w-px bg-border"></div>
          <ThemeToggle />
        </div>
      </div>

      {/* Quick Feature Highlights */}
      {activeInterface === 'ide' && (
        <div className="px-6 py-2 bg-muted/20 border-t border-border/50">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Code2 className="h-3 w-3" />
              Crowe Logic Coder Available
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FlaskConical className="h-3 w-3" />
              Lab Tools Active
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              AI Assistant Ready
            </span>
          </div>
        </div>
      )}

      {activeInterface === 'chat' && (
        <div className="px-6 py-2 bg-muted/20 border-t border-border/50">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Enhanced Mycology AI
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Code2 className="h-3 w-3" />
              Need coding help? Switch to Lab IDE
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
