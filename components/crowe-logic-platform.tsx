"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  FlaskConical, 
  MessageSquare, 
  Code
} from "lucide-react"
import CroweLogicGPTInterface from "@/components/crowe-logic-enhanced-chat"
import EnhancedLabInterface from "@/components/enhanced-lab-interface"

export default function CroweLogicPlatform() {
  const [activeInterface, setActiveInterface] = useState<'chat' | 'lab'>('chat')

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Interface Selector - Simplified header without logo since we have global header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
            <Button
              variant={activeInterface === 'chat' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveInterface('chat')}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              AI Chat
            </Button>
            <Button
              variant={activeInterface === 'lab' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveInterface('lab')}
              className="flex items-center gap-2"
            >
              <FlaskConical className="h-4 w-4" />
              Lab IDE
            </Button>
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
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {activeInterface === 'chat' && <CroweLogicGPTInterface />}
        {activeInterface === 'lab' && <EnhancedLabInterface />}
      </div>
    </div>
  )
}
