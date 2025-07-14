"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  FlaskConical, 
  MessageSquare, 
  Code,
  Settings
} from "lucide-react"

interface NavigationBarProps {
  activeInterface: 'chat' | 'lab'
  onInterfaceChange: (interfaceType: 'chat' | 'lab') => void
}

export default function NavigationBar({ activeInterface, onInterfaceChange }: NavigationBarProps) {
  return (
    <div className="border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center border-2 border-amber-300/50 shadow-lg">
                <span className="text-white font-bold text-lg">OS</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-xl bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                CroweOS
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                Systems Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
            <Button
              variant={activeInterface === 'chat' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onInterfaceChange('chat')}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              AI Chat
            </Button>
            <Button
              variant={activeInterface === 'lab' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onInterfaceChange('lab')}
              className="flex items-center gap-2"
            >
              <FlaskConical className="h-4 w-4" />
              Lab IDE
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            {activeInterface === 'chat' ? (
              <>
                <Brain className="h-3 w-3" />
                Crowe Logic AI
              </>
            ) : (
              <>
                <Code className="h-3 w-3" />
                Lab Environment
              </>
            )}
          </Badge>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="relative inline-flex">
              <div className="rounded-full bg-green-400 w-2 h-2"></div>
              <div className="absolute inset-0 rounded-full animate-ping bg-green-400 w-2 h-2"></div>
            </div>
            <span>Connected</span>
          </div>

          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
