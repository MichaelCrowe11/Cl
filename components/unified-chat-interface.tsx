'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Copy, 
  Download, 
  Loader2, 
  Bot,
  User,
  Settings,
  Brain,
  Beaker,
  BarChart,
  Image as ImageIcon,
  AlertTriangle,
  Sparkles
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  model?: string
  mlService?: string
  attachments?: any[]
}

interface AIModelConfig {
  model: string
  temperature: number
  maxTokens: number
  capabilities: string[]
}

const AI_MODELS = {
  'o3': { name: 'OpenAI o3', capabilities: ['reasoning', 'function-calling', 'mycology'], icon: Brain },
  'o4-mini': { name: 'OpenAI o4-mini', capabilities: ['function-calling', 'efficient'], icon: Sparkles },
  'gpt-4': { name: 'GPT-4', capabilities: ['general', 'coding'], icon: Bot },
  'claude-3-opus': { name: 'Claude 3 Opus', capabilities: ['analysis', 'writing'], icon: Brain },
  'claude-3-sonnet': { name: 'Claude 3.5 Sonnet', capabilities: ['balanced', 'fast'], icon: Bot }
}

const ML_SERVICES = {
  'yield-prediction': { name: 'Yield Predictor', icon: BarChart },
  'substrate-calculation': { name: 'Substrate Calculator', icon: Beaker },
  'contamination-analysis': { name: 'Contamination Analyzer', icon: AlertTriangle },
  'vision-analysis': { name: 'Vision Analysis', icon: ImageIcon }
}

export function UnifiedChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'system',
      content: `# 🍄 Welcome to Crowe Logic AI Research Platform

I'm your integrated AI assistant with access to:
- **Multiple AI Models**: o3, GPT-4, Claude for different tasks
- **ML Services**: Yield prediction, substrate calculation, contamination analysis
- **Computer Vision**: Mushroom identification and growth analysis
- **Function Calling**: Automated tools for mycology research

How can I assist with your mycology research today?`,
      timestamp: new Date()
    }
  ])
  
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>('o3')
  const [showSettings, setShowSettings] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const { theme } = useTheme()
  
  const [aiConfig, setAiConfig] = useState<AIModelConfig>({
    model: 'o3',
    temperature: 0.3,
    maxTokens: 4096,
    capabilities: ['reasoning', 'function-calling', 'mycology']
  })

  // Load or create session
  useEffect(() => {
    if (user) {
      createSession()
    }
  }, [user])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const createSession = async () => {
    if (!user) return
    
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        title: 'New Research Session',
        metadata: { model: selectedModel }
      })
      .select()
      .single()
    
    if (data) {
      setSessionId(data.id)
    }
  }

  const detectIntent = (message: string): { needsML: boolean, mlService?: string } => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('yield') || lowerMessage.includes('predict') || lowerMessage.includes('harvest')) {
      return { needsML: true, mlService: 'yield-prediction' }
    }
    if (lowerMessage.includes('substrate') || lowerMessage.includes('ratio') || lowerMessage.includes('mix')) {
      return { needsML: true, mlService: 'substrate-calculation' }
    }
    if (lowerMessage.includes('contamination') || lowerMessage.includes('risk') || lowerMessage.includes('sterile')) {
      return { needsML: true, mlService: 'contamination-analysis' }
    }
    if (lowerMessage.includes('identify') || lowerMessage.includes('species') || lowerMessage.includes('image')) {
      return { needsML: true, mlService: 'vision-analysis' }
    }
    
    return { needsML: false }
  }

  const callMLService = async (service: string, params: any) => {
    const response = await fetch('/api/ml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service, parameters: params })
    })
    
    if (!response.ok) {
      throw new Error('ML service failed')
    }
    
    return await response.json()
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Detect if ML service is needed
      const { needsML, mlService } = detectIntent(userMessage.content)
      
      let assistantContent = ''
      let mlResults = null
      
      // If ML service is needed, call it first
      if (needsML && mlService) {
        // Extract parameters from the message (simplified example)
        let params = {}
        
        switch (mlService) {
          case 'yield-prediction':
            // Simple parameter extraction (in production, use NLP)
            params = {
              species: 'oyster',
              substrate_weight: 10,
              temperature: 22,
              humidity: 85,
              co2_level: 800
            }
            break
          // Add other services...
        }
        
        try {
          mlResults = await callMLService(mlService, params)
          assistantContent += `\n### 📊 ${ML_SERVICES[mlService as keyof typeof ML_SERVICES].name} Results\n\n`
          assistantContent += '```json\n' + JSON.stringify(mlResults.result, null, 2) + '\n```\n\n'
        } catch (error) {
          console.error('ML service error:', error)
        }
      }
      
      // Call AI model for response
      const endpoint = selectedModel.startsWith('o') ? '/api/ai/o3-route' : '/api/ai'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          model: selectedModel,
          context: {
            messages: messages.slice(-10),
            mlResults: mlResults
          },
          temperature: aiConfig.temperature,
          max_tokens: aiConfig.maxTokens
        })
      })

      if (!response.ok) {
        throw new Error('AI response failed')
      }

      const data = await response.json()
      assistantContent += data.response || data.outputText || 'No response generated'

      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        model: selectedModel,
        mlService: mlService
      }

      setMessages(prev => [...prev, assistantMessage])

      // Save to database if user is logged in
      if (user && sessionId) {
        await supabase
          .from('chat_messages')
          .insert([
            { session_id: sessionId, ...userMessage },
            { session_id: sessionId, ...assistantMessage }
          ])
      }

    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'system',
        content: '❌ An error occurred. Please try again or check your API configuration.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const copyMessage = async (content: string) => {
    await navigator.clipboard.writeText(content)
  }

  const exportConversation = () => {
    const markdown = messages.map(msg => 
      `### ${msg.role === 'user' ? '👤 User' : '🤖 Assistant'}\n${msg.content}\n`
    ).join('\n---\n\n')
    
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `crowe-logic-chat-${new Date().toISOString()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Unified AI Research Assistant</h2>
          <Badge variant="outline" className="gap-1">
            {React.createElement(AI_MODELS[selectedModel as keyof typeof AI_MODELS].icon, { className: "h-3 w-3" })}
            {AI_MODELS[selectedModel as keyof typeof AI_MODELS].name}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={exportConversation}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="m-4 p-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">AI Model</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(AI_MODELS).map(([key, model]) => (
                <Button
                  key={key}
                  size="sm"
                  variant={selectedModel === key ? "default" : "outline"}
                  onClick={() => {
                    setSelectedModel(key)
                    setAiConfig(prev => ({ ...prev, model: key }))
                  }}
                  className="justify-start gap-2"
                >
                  {React.createElement(model.icon, { className: "h-4 w-4" })}
                  <span className="truncate">{model.name}</span>
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm">Temperature: {aiConfig.temperature}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={aiConfig.temperature}
                onChange={(e) => setAiConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm">Max Tokens: {aiConfig.maxTokens}</label>
              <input
                type="range"
                min="1000"
                max="8000"
                step="500"
                value={aiConfig.maxTokens}
                onChange={(e) => setAiConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' && "flex-row-reverse"
              )}
            >
              <Avatar className="h-8 w-8">
                {message.role === 'user' ? (
                  <>
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </>
                ) : (
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className={cn(
                "flex-1 space-y-2",
                message.role === 'user' && "flex flex-col items-end"
              )}>
                <Card className={cn(
                  "p-4 max-w-[80%]",
                  message.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  {message.mlService && (
                    <Badge variant="secondary" className="mb-2 gap-1">
                      {React.createElement(ML_SERVICES[message.mlService as keyof typeof ML_SERVICES].icon, { className: "h-3 w-3" })}
                      {ML_SERVICES[message.mlService as keyof typeof ML_SERVICES].name}
                    </Badge>
                  )}
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {message.content.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < message.content.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.model && (
                      <Badge variant="outline" className="text-xs">
                        {message.model}
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyMessage(message.content)}
                      className="h-6 w-6 p-0 ml-auto"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-muted">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    {selectedModel.startsWith('o') ? 'Reasoning...' : 'Thinking...'}
                  </span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage() }} className="flex gap-2 max-w-4xl mx-auto">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about yield prediction, substrate calculation, contamination risks..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        {/* Quick Actions */}
        <div className="flex gap-2 mt-2 max-w-4xl mx-auto flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInput("Predict yield for 10kg oyster mushroom substrate at 22°C, 85% humidity")}
            className="text-xs"
          >
            🍄 Yield Prediction
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInput("Calculate substrate mix for 20kg shiitake cultivation")}
            className="text-xs"
          >
            🧪 Substrate Calculator
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInput("Analyze contamination risk with current lab conditions")}
            className="text-xs"
          >
            ⚠️ Risk Analysis
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInput("What's the optimal temperature for lion's mane cultivation?")}
            className="text-xs"
          >
            🌡️ Environment Tips
          </Button>
        </div>
      </div>
    </div>
  )
} 