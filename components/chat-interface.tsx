"use client"

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Copy, Download, Check } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

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
      content: `Welcome to **Crowe Logic GPT** - Your Advanced Mycology Research Platform! 

🍄 **Mycology Research**: Substrate optimization, strain analysis, contamination prevention, yield modeling
🔬 **Laboratory Management**: Protocol development, quality control, data analysis, research planning
🌍 **Environmental Intelligence**: Climate analysis, ecosystem monitoring, biodiversity assessments
📊 **Data Analytics**: Statistical modeling, predictive analytics, research insights, trend analysis
💡 **Innovation Support**: R&D guidance, experimental design, literature research, peer collaboration

**Powered by advanced AI** to accelerate your mycological research and discoveries.

What would you like to explore today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [aiConfig, setAiConfig] = useState<AIModelConfig>({
    modelName: 'Crowe Logic GPT',
    temperature: 0.3,
    maxTokens: 4096,
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

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Backend error')
      assistantMessage.content = data.response
    } catch (error) {
      console.error('AI Model Error:', error)
      assistantMessage.content = 'Sorry, an error occurred connecting to the AI service.'
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
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
    a.download = `crowe-logic-gpt-${Date.now()}.txt`
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
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header - OpenAI Style */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="/crowe-avatar.png"
                alt="Crowe Logic GPT"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Crowe Logic GPT
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Mycology Research Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              {aiConfig.modelName}
            </div>
          </div>
        </div>
      </div>

      {/* Messages - OpenAI Style */}
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <div className="relative w-24 h-24 mb-6 opacity-10">
                <Image
                  src="/crowe-logo-secondary.png"
                  alt="Crowe Logic"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                How can I help you today?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                Ask me anything about mycology, research protocols, or laboratory management.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "group border-b border-gray-100 dark:border-gray-800 py-8 px-4",
                    message.role === 'assistant' && "bg-gray-50 dark:bg-gray-800/50"
                  )}
                >
                  <div className="max-w-3xl mx-auto flex gap-6">
                    <div className="flex-shrink-0">
                      {message.role === 'assistant' ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src="/crowe-avatar.png"
                            alt="Crowe Logic GPT"
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">You</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="prose prose-gray dark:prose-invert max-w-none">
                        <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(message.content, message.id)}
                            className="h-8 px-2"
                          >
                            {copiedId === message.id ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(message.content)}
                            className="h-8 px-2"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Loading State */}
          {isLoading && (
            <div className="group border-b border-gray-100 dark:border-gray-800 py-8 px-4 bg-gray-50 dark:bg-gray-800/50">
              <div className="max-w-3xl mx-auto flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src="/crowe-avatar.png"
                      alt="Crowe Logic GPT"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area - OpenAI Style */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message Crowe Logic GPT..."
              className="pr-12 py-4 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-2 h-8 w-8 p-0 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Crowe Logic GPT can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  )
}
