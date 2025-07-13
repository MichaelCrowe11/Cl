"use client"

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Send, 
  Copy, 
  Download, 
  Loader2, 
  RefreshCw,
  User,
  Check,
  Bot
} from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { useTheme } from 'next-themes'
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
  const [sessionId, setSessionId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const { theme } = useTheme()

  const [aiConfig, setAiConfig] = useState<AIModelConfig>({
    modelName: 'Crowe Logic GPT',
    temperature: 0.3,
    maxTokens: 4096,
  })

  // Create or load chat session
  useEffect(() => {
    if (user) {
      loadOrCreateSession()
    }
  }, [user])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const loadOrCreateSession = async () => {
    if (!user) return

    try {
      // Try to get the most recent session
      const { data: sessions, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)

      if (error) throw error

      if (sessions && sessions.length > 0) {
        // Load existing session
        const session = sessions[0]
        setSessionId(session.id)
        
        // Load messages for this session
        const { data: sessionMessages, error: msgError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', session.id)
          .order('created_at', { ascending: true })

        if (msgError) throw msgError

        if (sessionMessages && sessionMessages.length > 0) {
          setMessages(sessionMessages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.created_at),
          })))
        }
      } else {
        // Create new session
        const { data: newSession, error: createError } = await supabase
          .from('chat_sessions')
          .insert({
            user_id: user.id,
            title: 'New Chat',
            model: aiConfig.modelName,
          })
          .select()
          .single()

        if (createError) throw createError
        setSessionId(newSession.id)
      }
    } catch (error) {
      console.error('Error managing chat session:', error)
    }
  }

  const saveMessage = async (message: Message) => {
    if (!user || !sessionId) return

    try {
      await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          role: message.role,
          content: message.content,
        })
    } catch (error) {
      console.error('Error saving message:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Save user message
    await saveMessage(userMessage)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          config: aiConfig,
          sessionId: sessionId,
          userId: user?.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Save assistant message
      await saveMessage(assistantMessage)
      
      // Update session title if it's still "New Chat"
      if (sessionId && messages.length === 1) {
        const title = userMessage.content.slice(0, 50) + (userMessage.content.length > 50 ? '...' : '')
        await supabase
          .from('chat_sessions')
          .update({ title, updated_at: new Date().toISOString() })
          .eq('id', sessionId)
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyMessage = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDownloadConversation = () => {
    const conversationText = messages
      .map(msg => `${msg.role.toUpperCase()} (${msg.timestamp.toLocaleString()}):\n${msg.content}\n`)
      .join('\n---\n\n')
    
    const blob = new Blob([conversationText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `crowe-logic-conversation-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date)
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
                            onClick={() => handleCopyMessage(message.content, message.id)}
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
                            onClick={() => handleDownloadConversation()}
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
              onClick={handleSendMessage}
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
