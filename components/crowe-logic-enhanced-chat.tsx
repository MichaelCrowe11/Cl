"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { ApiRole } from '@/lib/chat-types'
import { streamCompletion } from "@/lib/ai"
import { 
  Send, 
  Brain, 
  Loader2, 
  Upload, 
  Microscope,
  FlaskConical,
  Dna,
  Leaf,
  Code,
  FileText,
  ExternalLink
} from "lucide-react"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    tags?: string[]
    provider?: string
    confidence?: number
  }
}

interface CroweLogicSession {
  id: string
  userId: string
  messages: Message[]
  context: {
    species?: string
    tags?: string[]
    decisionTree?: any
  }
}

export default function CroweLogicGPTInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to Crowe Logic AI, your advanced mycology research assistant. I specialize in mushroom identification, cultivation protocols, contamination analysis, and bioactivity research. How can I assist your mycology work today?',
      timestamp: new Date(),
      metadata: {
        tags: ['[SYSTEM] Welcome', '[AUTOMATION] Crowe Logic'],
        provider: 'crowe-logic'
      }
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(`session_${Date.now()}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      let assistantContent = ''
      const assistantMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        metadata: {
          provider: 'crowe-logic',
          tags: ['[AUTOMATION] Crowe Logic Reply']
        }
      }

      setMessages(prev => [...prev, assistantMessage])

      // Enhanced system prompt for Crowe Logic AI
      const systemPrompt = `You are Crowe Logic AI, an expert mycology research assistant powered by the Crowe Logic Knowledge Base with deep knowledge in:

• Mushroom identification and taxonomy
• Cultivation protocols and techniques  
• Contamination detection and prevention
• Bioactivity and medicinal properties
• Laboratory procedures and SOPs
• Environmental controls and optimization
• Substrate preparation and sterilization
• Harvest timing and quality assessment

Use the Crowe Logic™ tagging system to categorize your responses:
- [SPECIES] for species identification
- [PROTOCOL] for cultivation procedures
- [CONTAMINATION] for contamination issues
- [BIOACTIVITY] for medicinal/chemical properties
- [ENVIRONMENT] for growing conditions
- [TROUBLESHOOTING] for problem solving

Provide scientific, accurate, and actionable advice. Include relevant tags in your response when appropriate.`

      await streamCompletion(
        {
          messages: [
            { role: 'system' as ApiRole, content: systemPrompt },
            ...messages.slice(-5).map(m => ({ 
              role: (m.role === 'user' ? 'user' : 'assistant') as ApiRole, 
              content: m.content
            })),
            { role: 'user' as ApiRole, content: userMessage.content }
          ],
          model: 'grok-beta',
          temperature: 0.7,
          maxTokens: 2000
        },
        (chunk) => {
          assistantContent += chunk
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: assistantContent }
                : msg
            )
          )
        }
      )

      // Auto-tag the response
      const detectedTags = autoTagResponse(assistantContent)
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { 
                ...msg, 
                content: assistantContent,
                metadata: {
                  ...msg.metadata,
                  tags: [...(msg.metadata?.tags || []), ...detectedTags]
                }
              }
            : msg
        )
      )

    } catch (error) {
      console.error('Chat error:', error)
      toast({
        title: "Error",
        description: "Failed to get response from Crowe Logic AI",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const autoTagResponse = (content: string): string[] => {
    const tags: string[] = []
    
    if (/contamin|bacteria|mold|infection/i.test(content)) tags.push('[CONTAMINATION]')
    if (/species|identify|classification/i.test(content)) tags.push('[SPECIES]')
    if (/protocol|procedure|step|sop/i.test(content)) tags.push('[PROTOCOL]')
    if (/bioactive|medicinal|compound|extract/i.test(content)) tags.push('[BIOACTIVITY]')
    if (/temperature|humidity|environment|conditions/i.test(content)) tags.push('[ENVIRONMENT]')
    if (/substrate|medium|agar|steriliz/i.test(content)) tags.push('[SUBSTRATE]')
    if (/harvest|yield|flush|mature/i.test(content)) tags.push('[HARVEST]')
    
    return tags
  }

  const getProviderIcon = (provider?: string) => {
    switch (provider) {
      case 'crowe-logic':
        return <Brain className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getProviderColor = (provider?: string) => {
    switch (provider) {
      case 'crowe-logic':
        return 'from-purple-500 to-blue-600'
      default:
        return 'from-purple-500 to-blue-600'
    }
  }

  const getSuggestedActions = (content: string) => {
    const suggestions = []
    
    if (/code|script|program|develop|build|create.*app/i.test(content)) {
      suggestions.push({
        label: "Open Crowe Logic Coder",
        action: "coder",
        icon: <Code className="h-3 w-3" />,
        description: "Get AI coding assistance"
      })
    }
    
    if (/contamin|protocol|sop|procedure/i.test(content)) {
      suggestions.push({
        label: "Generate SOP",
        action: "sop", 
        icon: <FileText className="h-3 w-3" />,
        description: "Create lab protocol"
      })
    }
    
    if (/batch|track|monitor|data/i.test(content)) {
      suggestions.push({
        label: "Lab Tools",
        action: "lab",
        icon: <FlaskConical className="h-3 w-3" />,
        description: "Access lab management"
      })
    }
    
    return suggestions
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Chat Area */}
      <ScrollArea className="flex-1 px-6">
        <div className="space-y-6 py-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <img 
                    src="/crowe-avatar.png" 
                    alt="Crowe Logic AI" 
                    className="h-full w-full rounded-full object-cover"
                  />
                </Avatar>
              )}
              
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm bg-gradient-to-r bg-clip-text text-transparent from-purple-600 to-blue-600">
                      Crowe Logic AI
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      CroweOS Systems
                    </Badge>
                  </div>
                )}
                
                <Card className={`p-4 ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground ml-12' 
                    : 'bg-muted/50'
                }`}>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap m-0">{message.content}</p>
                  </div>
                </Card>
                
                {/* Tags */}
                {message.metadata?.tags && message.metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {message.metadata.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Suggested Actions */}
                {message.role === 'user' && message.content && (
                  <div className="mt-2">
                    {getSuggestedActions(message.content).map((action) => (
                      <Button 
                        key={action.label} 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => {
                          // Handle action click
                          console.log(`Action triggered: ${action.label}`)
                        }}
                      >
                        {action.icon}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
                
                {/* Smart Action Suggestions */}
                {message.role === 'assistant' && (() => {
                  const suggestions = getSuggestedActions(message.content)
                  return suggestions.length > 0 ? (
                    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                      <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">
                        💡 Suggested Actions
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-xs"
                            onClick={() => {
                              // This would trigger navigation to IDE with specific tab
                              if (typeof window !== 'undefined') {
                                const event = new CustomEvent('openLabIDE', { 
                                  detail: { tab: suggestion.action } 
                                })
                                window.dispatchEvent(event)
                              }
                            }}
                          >
                            {suggestion.icon}
                            <span className="font-medium">{suggestion.label}</span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null
                })()}
                
                <div className="text-xs text-muted-foreground mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
              
              {message.role === 'user' && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Leaf className="h-4 w-4 text-white" />
                  </div>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <img 
                  src="/crowe-avatar.png" 
                  alt="Crowe Logic AI" 
                  className="h-full w-full rounded-full object-cover opacity-60"
                />
              </Avatar>
              <Card className="bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Crowe Logic AI is analyzing...
                </div>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about species identification, cultivation protocols, contamination issues, or any mycology question..."
                className="min-h-[60px] max-h-32 resize-none pr-12 focus:ring-2 focus:ring-primary/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e as any)
                  }
                }}
              />
              <Button
                type="submit"
                size="sm"
                className="absolute bottom-2 right-2 h-8 w-8 p-0 rounded-full"
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Press Enter to send, Shift+Enter for new line</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{input.length}/2000</span>
              <div className="flex items-center gap-1">
                <div className="relative inline-flex">
                  <div className="rounded-full bg-green-400 w-2 h-2"></div>
                  <div className="absolute inset-0 rounded-full animate-ping bg-green-400 w-2 h-2"></div>
                </div>
                <span>Crowe Logic Ready</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}