"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Loader2, Copy, Download, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// AI Model Integration Interface
interface AIModelConfig {
  modelName: string
  endpoint?: string
  apiKey?: string
  temperature?: number
  maxTokens?: number
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Welcome to Crowe Logic AI! I'm your expert in mycology, environmental intelligence, and business strategy.

🍄 **Mycology Expertise**: Substrate optimization, contamination prevention, yield predictions
🌍 **Environmental Intelligence**: Climate analysis, ecosystem monitoring, biodiversity tracking  
💼 **Business Strategy**: Market analysis, operational efficiency, sustainable growth planning
🔬 **Advanced Capabilities**: MEI platform integration, quantum modeling, biome intelligence

How can I assist you today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // AI Model Configuration State
  const [aiConfig, setAiConfig] = useState<AIModelConfig>({
    modelName: 'default',
    temperature: 0.7,
    maxTokens: 2048,
  })

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // TODO: Integrate with your custom AI model here
    // This is where you'll call your AI model API
    try {
      const response = await callAIModel(userMessage.content, aiConfig)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI Model Error:', error)
      // Fallback response for now
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I understand your question. Let me help you with that. [AI Model Integration Pending]',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Placeholder for AI model integration
  async function callAIModel(prompt: string, config: AIModelConfig): Promise<string> {
    // TODO: Replace with actual AI model API call
    // Example structure:
    // const response = await fetch(config.endpoint || '/api/ai', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${config.apiKey}`,
    //   },
    //   body: JSON.stringify({
    //     prompt,
    //     model: config.modelName,
    //     temperature: config.temperature,
    //     max_tokens: config.maxTokens,
    //   }),
    // })
    // const data = await response.json()
    // return data.response

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Return a placeholder response
    return `I understand you're asking about "${prompt}". This is where your custom AI model response will appear. The system is ready for AI model integration.`
  }

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDownload = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `crowe-logic-ai-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-yellow-600/50">
            <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" className="object-cover" />
            <AvatarFallback className="bg-purple-600 text-white font-bold">CL</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold">Crowe Logic AI</h1>
            <p className="text-sm text-muted-foreground">Mycology • Environmental Intelligence • Business Strategy</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Model: {aiConfig.modelName}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' && "flex-row-reverse"
              )}
            >
              <Avatar className={cn(
                "h-8 w-8 shrink-0",
                message.role === 'assistant' && "ring-2 ring-yellow-600/30"
              )}>
                {message.role === 'assistant' ? (
                  <>
                    <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" className="object-cover" />
                    <AvatarFallback className="bg-purple-600 text-white font-bold text-sm">CL</AvatarFallback>
                  </>
                ) : (
                  <AvatarFallback className="bg-secondary text-secondary-foreground">You</AvatarFallback>
                )}
              </Avatar>
              <div
                className={cn(
                  "flex flex-col gap-1 max-w-[80%]",
                  message.role === 'user' && "items-end"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-3 py-2",
                    message.role === 'assistant'
                      ? "bg-muted"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {message.role === 'assistant' && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopy(message.content, message.id)}
                      >
                        {copiedId === message.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleDownload(message.content)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 ring-2 ring-yellow-600/30">
                <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" className="object-cover" />
                <AvatarFallback className="bg-purple-600 text-white font-bold text-sm">CL</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-3 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about substrate optimization, contamination prevention, yield predictions..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Crowe Logic AI provides expert mycology guidance. Press Enter to send, Escape to clear.
        </p>
      </div>
    </div>
  )
} 