"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  Send, 
  Plus, 
  MoreHorizontal, 
  Bot,
  User,
  BarChart3,
  FileText,
  MessageSquare,
  FlaskConical,
  Activity,
  Database
} from "lucide-react"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Crowe Logic AI, your mycology lab assistant powered by the Crowe Logic Knowledge Base. I can help you with substrate optimization, environmental monitoring, contamination prevention, and protocol development. What can I help you with today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeView, setActiveView] = useState<'chat' | 'dashboard'>('chat')
  const { toast } = useToast()

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(m => ({
            role: m.role,
            content: m.content
          })),
          model: 'grok-beta',
          temperature: 0.3,
          maxTokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Sorry, I could not generate a response.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const DashboardView = () => (
    <section role="region" aria-label="Lab Dashboard overview" className="p-6 space-y-6">
      <div>
        <h1 id="dashboard-heading" className="text-3xl font-bold mb-2">Mycology Lab Dashboard</h1>
        <p className="text-muted-foreground">Monitor your cultivation operations and access AI-powered insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setActiveView('chat')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveView('chat') }}
        >
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">AI Assistant</CardTitle>
            </div>
            <CardDescription>Get expert mycology guidance and protocol recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="secondary">Active</Badge>
              <p className="text-sm text-muted-foreground">
                Chat with Crowe Logic AI for cultivation advice, contamination diagnosis, and optimization strategies.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FlaskConical className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg">Batch Tracking</CardTitle>
            </div>
            <CardDescription>Monitor current cultivation batches and yields</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="outline">Coming Soon</Badge>
              <p className="text-sm text-muted-foreground">
                Track substrate preparation, inoculation, and harvest data for optimal yield analysis.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg">Analytics</CardTitle>
            </div>
            <CardDescription>Yield predictions and environmental data analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="outline">Coming Soon</Badge>
              <p className="text-sm text-muted-foreground">
                Advanced analytics for contamination rates, yield optimization, and ROI calculations.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-lg">Protocols</CardTitle>
            </div>
            <CardDescription>Standard Operating Procedures and workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="outline">Coming Soon</Badge>
              <p className="text-sm text-muted-foreground">
                Generate and manage SOPs for sterile technique, substrate prep, and quality control.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg">Environmental Monitor</CardTitle>
            </div>
            <CardDescription>Temperature, humidity, and air quality tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="outline">Coming Soon</Badge>
              <p className="text-sm text-muted-foreground">
                Real-time monitoring of growing conditions with automated alerts and adjustments.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-indigo-500" />
              <CardTitle className="text-lg">Knowledge Base</CardTitle>
            </div>
            <CardDescription>Species database and cultivation guides</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="outline">Coming Soon</Badge>
              <p className="text-sm text-muted-foreground">
                Comprehensive database of mushroom species, growing parameters, and troubleshooting guides.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )

  const ChatView = () => (
    <div aria-label="Chat conversation" role="region" className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
            <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">Crowe Logic AI</h2>
            <p className="text-sm text-muted-foreground">Mycology Lab Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveView('dashboard')}
          >
            Dashboard
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" role="log" aria-live="polite">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                {message.role === 'user' ? (
                  <>
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
                    <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                  </>
                )}
              </Avatar>
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                <div className="text-xs opacity-50 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
                <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); sendMessage(); }} aria-label="Chat input form">
          <Button variant="outline" size="icon" aria-label="Add attachment">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cultivation techniques, contamination issues, or protocol development..."
              className="pr-12"
              disabled={isLoading}
              aria-label="Type your message here"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <nav role="navigation" aria-label="Main navigation" className="flex gap-2 p-4 border-b bg-background">
        <Button
          variant={activeView === 'chat' ? 'secondary' : 'ghost'}
          onClick={() => setActiveView('chat')}
        >
          Chat
        </Button>
        <Button
          variant={activeView === 'dashboard' ? 'secondary' : 'ghost'}
          onClick={() => setActiveView('dashboard')}
        >
          Dashboard
        </Button>
      </nav>
      {/* Main Content */}
      <main id="main-content" className="flex-1 overflow-auto" tabIndex={-1}>
        {activeView === 'dashboard' ? <DashboardView /> : <ChatView />}
      </main>
    </div>
  )
}
