"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Send, 
  Loader2, 
  Copy, 
  Download, 
  Check, 
  Microscope, 
  Beaker, 
  Database, 
  FileText, 
  Settings, 
  Sparkles,
  Leaf,
  FlaskConical,
  BarChart3,
  BookOpen,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'text' | 'analysis' | 'protocol' | 'data' | 'research'
  metadata?: {
    species?: string
    protocol?: string
    confidence?: number
    sources?: string[]
  }
}

interface AIModelConfig {
  modelName: string
  endpoint?: string
  apiKey?: string
  temperature?: number
  maxTokens?: number
  specialty?: 'general' | 'mycology' | 'research' | 'business'
}

// Mycology-specific quick prompts
const MYCOLOGY_PROMPTS = [
  {
    icon: Microscope,
    title: "Species Identification",
    prompt: "Help me identify a mushroom species based on morphological characteristics"
  },
  {
    icon: Beaker,
    title: "Substrate Analysis",
    prompt: "Analyze substrate composition for optimal mycelium growth"
  },
  {
    icon: FlaskConical,
    title: "Protocol Design",
    prompt: "Design a sterile cultivation protocol for laboratory conditions"
  },
  {
    icon: BarChart3,
    title: "Yield Optimization",
    prompt: "Optimize growing conditions for maximum yield and quality"
  },
  {
    icon: Database,
    title: "Research Query",
    prompt: "Search mycological literature and provide recent research findings"
  },
  {
    icon: Leaf,
    title: "Environmental Impact",
    prompt: "Assess environmental benefits of mycoremediation applications"
  }
]

export function CroweLogicGPT() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `# Welcome to Crowe Logic GPT 🍄

I'm your advanced AI assistant specialized in **mycology, environmental intelligence, and biotechnology research**. Think of me as your personal research scientist with access to cutting-edge fungal biotechnology knowledge.

## What I Can Help You With:

### 🔬 **Mycological Research**
- Species identification and classification
- Molecular analysis and phylogenetics
- Cultivation protocols and optimization
- Contamination prevention strategies

### 🌿 **Environmental Applications**
- Mycoremediation project design
- Ecosystem restoration planning
- Carbon sequestration analysis
- Biodiversity impact assessments

### 💡 **Biotechnology Innovation**
- Bioactive compound extraction
- Fermentation optimization
- Product development strategies
- Scale-up methodologies

### 📊 **Data Analysis & Research**
- Literature review and synthesis
- Statistical analysis interpretation
- Experimental design consultation
- Publication support

**Ready to explore the fascinating world of fungi?** Ask me anything from basic mycology to advanced biotechnology applications!`,
      timestamp: new Date(),
      type: 'text'
    },
  ])
  
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showPrompts, setShowPrompts] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [aiConfig, setAiConfig] = useState<AIModelConfig>({
    modelName: 'crowe-logic-gpt',
    temperature: 0.3,
    maxTokens: 4096,
    specialty: 'mycology'
  })

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (messageText?: string) => {
    const messageToSend = messageText || input.trim()
    if (!messageToSend || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setShowPrompts(false)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      type: 'text'
    }

    try {
      // Enhanced prompt for mycology context
      const enhancedPrompt = `As Crowe Logic GPT, a specialized AI for mycology and biotechnology research, please respond to: ${messageToSend}

Context: You are an expert in fungal biology, environmental applications, biotechnology, and research methodologies. Provide scientifically accurate, detailed responses with practical applications when relevant.`

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: enhancedPrompt,
          config: aiConfig 
        }),
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Backend error')
      
      assistantMessage.content = data.response
      
      // Detect message type based on content
      if (data.response.includes('protocol') || data.response.includes('procedure')) {
        assistantMessage.type = 'protocol'
      } else if (data.response.includes('analysis') || data.response.includes('data')) {
        assistantMessage.type = 'analysis'
      } else if (data.response.includes('research') || data.response.includes('study')) {
        assistantMessage.type = 'research'
      }
      
    } catch (error) {
      console.error('Crowe Logic GPT Error:', error)
      assistantMessage.content = `I apologize, but I'm having trouble connecting to the Crowe Logic research network. This might be due to:

- Temporary server maintenance
- Network connectivity issues
- High research query volume

Please try again in a moment. In the meantime, you can:
- Check your internet connection
- Try a simpler query
- Contact support if the issue persists

I'm here to help with your mycology and research needs as soon as the connection is restored! 🍄`
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const getMessageTypeIcon = (type?: string) => {
    switch (type) {
      case 'analysis': return <BarChart3 className="h-4 w-4" />
      case 'protocol': return <FileText className="h-4 w-4" />
      case 'research': return <BookOpen className="h-4 w-4" />
      default: return <Sparkles className="h-4 w-4" />
    }
  }

  const getMessageTypeColor = (type?: string) => {
    switch (type) {
      case 'analysis': return 'border-l-blue-500'
      case 'protocol': return 'border-l-green-500'
      case 'research': return 'border-l-purple-500'
      default: return 'border-l-orange-500'
    }
  }

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
                <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic GPT" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                  CL
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                <Zap className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Crowe Logic GPT
              </h1>
              <p className="text-sm text-muted-foreground">
                Specialized AI for Mycology & Biotechnology Research
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-6 py-4">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 ring-2 ring-blue-500/20">
                  <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic GPT" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                    CL
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={cn(
                  "group relative max-w-[85%] rounded-2xl px-4 py-3 shadow-sm border-l-4",
                  message.role === 'user'
                    ? 'bg-blue-500 text-white border-l-blue-600'
                    : `bg-card text-card-foreground ${getMessageTypeColor(message.type)}`
                )}
              >
                {message.role === 'assistant' && message.type && (
                  <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                    {getMessageTypeIcon(message.type)}
                    <span className="capitalize">{message.type} Response</span>
                  </div>
                )}
                
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {message.content.split('\n').map((line, index) => (
                    <p key={index} className="mb-2 last:mb-0 whitespace-pre-wrap">
                      {line}
                    </p>
                  ))}
                </div>
                
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="h-6 px-2 text-xs"
                    >
                      {copiedId === message.id ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    You
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 justify-start">
              <Avatar className="h-8 w-8 ring-2 ring-blue-500/20">
                <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic GPT" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                  CL
                </AvatarFallback>
              </Avatar>
              <div className="bg-card text-card-foreground rounded-2xl px-4 py-3 border-l-4 border-l-orange-500">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Analyzing your query...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      {showPrompts && messages.length <= 1 && (
        <div className="px-6 py-4 border-t bg-muted/10">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-sm font-medium mb-3 text-muted-foreground">
              🚀 Quick Start - Mycology Research
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {MYCOLOGY_PROMPTS.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSend(prompt.prompt)}
                  className="h-auto p-3 text-left justify-start hover:bg-muted/50"
                  disabled={isLoading}
                >
                  <prompt.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-xs">{prompt.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {prompt.prompt}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-background/80 backdrop-blur-sm px-6 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about mycology, research protocols, or biotechnology applications..."
              className="pr-12 h-12 text-base border-2 focus:border-blue-500 transition-colors"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {input.length}/4000
            </div>
          </div>
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto mt-2 text-xs text-muted-foreground text-center">
          Crowe Logic GPT can make mistakes. Verify important research information.
        </div>
      </div>
    </div>
  )
}
