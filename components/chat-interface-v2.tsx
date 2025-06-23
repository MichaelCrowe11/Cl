"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Loader2, Copy, Download, Check, Sparkles } from 'lucide-react'
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

export function ChatInterfaceV2() {
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
    modelName: 'gpt-4',
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
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize for the inconvenience. There was an error processing your request. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  async function callAIModel(prompt: string, config: AIModelConfig): Promise<string> {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model: config.modelName,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }
    
    const data = await response.json()
    return data.response
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
      {/* Header - Clean OpenAI Style */}
      <div className="border-b bg-white/50 dark:bg-black/50 backdrop-blur-xl px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-800 shadow-sm">
                <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
                <AvatarFallback className="ai-gradient text-white font-bold">CL</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                Crowe Logic AI 
                <Sparkles className="h-4 w-4 text-primary" />
              </h1>
              <p className="text-sm text-muted-foreground">Mycology • Environmental Intelligence • Business Strategy</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Model: <span className="font-medium text-foreground">{aiConfig.modelName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages - Clean Design */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4 animate-in",
                  message.role === 'user' && "flex-row-reverse"
                )}
              >
                <Avatar className={cn(
                  "h-8 w-8 shrink-0 shadow-sm",
                  message.role === 'assistant' && "ring-2 ring-primary/10"
                )}>
                  {message.role === 'assistant' ? (
                    <>
                      <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
                      <AvatarFallback className="ai-gradient text-white font-semibold text-sm">CL</AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-secondary text-secondary-foreground">You</AvatarFallback>
                  )}
                </Avatar>
                <div
                  className={cn(
                    "flex flex-col gap-2 max-w-[85%]",
                    message.role === 'user' && "items-end"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 shadow-sm",
                      message.role === 'assistant'
                        ? "bg-white dark:bg-gray-900 border border-border"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground px-2">
                    <span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-secondary"
                          onClick={() => handleCopy(message.content, message.id)}
                        >
                          {copiedId === message.id ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-secondary"
                          onClick={() => handleDownload(message.content)}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 animate-in">
                <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                  <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
                  <AvatarFallback className="ai-gradient text-white font-semibold text-sm">CL</AvatarFallback>
                </Avatar>
                <div className="bg-white dark:bg-gray-900 border border-border rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Input - Clean OpenAI Style */}
      <div className="border-t bg-white/50 dark:bg-black/50 backdrop-blur-xl p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about substrate optimization, contamination prevention, yield predictions..."
              disabled={isLoading}
              className="flex-1 h-12 px-4 rounded-xl border-0 bg-secondary/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <Button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()}
              className="h-12 px-6 rounded-xl shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Crowe Logic AI provides expert guidance. Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
} 