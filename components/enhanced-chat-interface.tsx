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
  Check, 
  Microscope, 
  Beaker, 
  Database, 
  FileText, 
  BarChart3,
  Leaf,
  FlaskConical,
  BookOpen,
  Sparkles,
  Zap
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'text' | 'analysis' | 'protocol' | 'data' | 'research'
}

interface AIModelConfig {
  modelName: string
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

export function EnhancedChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `# Welcome to Crowe Logic GPT 🍄

I'm your advanced AI assistant specialized in **mycology, environmental intelligence, and biotechnology research**. I can help you with:

🔬 **Mycological Research** - Species identification, molecular analysis, cultivation protocols
🌿 **Environmental Applications** - Mycoremediation, ecosystem restoration, carbon sequestration  
💡 **Biotechnology Innovation** - Bioactive compounds, fermentation, product development
📊 **Data Analysis** - Literature review, statistical analysis, experimental design

**Ready to explore the fascinating world of fungi?** Choose a quick prompt below or ask me anything!`,
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
    modelName: 'gpt-4',
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
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageToSend,
          config: aiConfig 
        }),
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'AI service error')
      
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
      assistantMessage.content = `I apologize, but I'm experiencing technical difficulties. This could be due to:

• API connectivity issues
• High server load
• Configuration problems

Please try again in a moment. If the issue persists, the system may need maintenance. I'm here to help with your mycology research needs as soon as the connection is restored! 🍄`
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
    <div className="flex flex-col h-full">
      {/* Quick Prompts */}
      {showPrompts && messages.length === 1 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MYCOLOGY_PROMPTS.map((prompt, index) => {
              const Icon = prompt.icon
              return (
                <button
                  key={index}
                  onClick={() => handleSend(prompt.prompt)}
                  disabled={isLoading}
                  className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-green-100">
                      <Icon className="h-4 w-4 text-gray-600 group-hover:text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm">{prompt.title}</h4>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{prompt.prompt}</p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="flex space-x-4">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={message.role === 'user' ? '/user-avatar.png' : '/ai-avatar.png'} />
                  <AvatarFallback className={message.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}>
                    {message.role === 'user' ? 'You' : 'AI'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900 text-sm">
                      {message.role === 'user' ? 'You' : 'Crowe Logic GPT'}
                    </span>
                    {message.type && message.type !== 'text' && (
                      <div className="flex items-center space-x-1">
                        {getMessageTypeIcon(message.type)}
                        <span className="text-xs text-gray-500 capitalize">{message.type}</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={`prose prose-sm max-w-none ${getMessageTypeColor(message.type)} border-l-4 pl-4 bg-white rounded-r-lg py-3`}>
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
                      {message.content}
                    </div>
                  </div>
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="text-gray-400 hover:text-gray-600 h-8 px-2"
                      >
                        {copiedId === message.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex space-x-4">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-green-100 text-green-600">AI</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900 text-sm">Crowe Logic GPT</span>
                    <Loader2 className="h-3 w-3 animate-spin text-green-600" />
                  </div>
                  <div className="text-gray-500 text-sm bg-gray-50 rounded-lg p-3 border-l-4 border-l-orange-500">
                    Analyzing your request...
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="mt-6 border-t pt-4">
        <div className="flex space-x-3">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about mycology, cultivation, research protocols, or data analysis..."
            className="flex-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
            disabled={isLoading}
          />
          <Button 
            onClick={() => handleSend()} 
            disabled={!input.trim() || isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <div className="flex items-center space-x-2">
            <Zap className="h-3 w-3" />
            <span>Powered by {aiConfig.modelName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
