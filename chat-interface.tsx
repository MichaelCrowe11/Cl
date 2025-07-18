"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner, MessageLoading } from "@/components/ui/loading"
import { useToast } from "@/hooks/use-toast"
import { Copy, Download, ThumbsUp, ThumbsDown, Mic, Send, Paperclip, Smile, Loader2, StopCircle, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { CroweLogicAvatar } from "@/components/croweos-logo-system"

interface Message {
  id: string
  role: "agent" | "user"
  content: string
  timestamp: string
  avatar?: string
  userName: string
}

export default function ChatInterface() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState("grok-beta")
  const [isClient, setIsClient] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "agent",
      userName: "Crowe Logic AI",
      avatar: "/crowe-avatar.svg", // Official Crowe branding
      content:
        "Welcome to Crowe Logic AI, your dedicated mycology lab partner powered by the Crowe Logic Knowledge Base. How can I assist your cultivation efforts today? You can speak or type your observations, questions, or commands.",
      timestamp: "",
    },
    {
      id: "2",
      role: "user",
      userName: "Cultivator",
      avatar: "/placeholder-user.jpg", // Professional user avatar
      content:
        "Hey Logic, I'm starting a new batch of Lion's Mane. Substrate is hardwood fuel pellets and soy hulls, 50/50 mix. Planning for 10 bags.",
      timestamp: "",
    },
    {
      id: "3",
      role: "agent",
      userName: "Crowe Logic AI",
      avatar: "/crowe-avatar.png", // Official Crowe branding
      content:
        "Understood. Logging new Lion's Mane batch (10 bags, HWFP/Soy hulls 50/50).\n\nWould you like me to:\n1. Generate a batch label and SOP for this?\n2. Confirm hydration levels for this substrate mix?\n3. Set reminders for sterilization and inoculation?",
      timestamp: "",
    },
  ])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Fix hydration by setting timestamps only on client side
  useEffect(() => {
    setIsClient(true)
    setMessages(prev => prev.map((msg, index) => ({
      ...msg,
      timestamp: new Date(Date.now() + index * 60 * 1000).toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit" 
      })
    })))
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[style*="overflow: scroll hidden;"]')
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight
      }
    }
  }, [messages])

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return
    
    const newMessage: Message = {
      id: String(messages.length + 1),
      role: "user",
      userName: "Cultivator",
      avatar: "/placeholder-user.jpg", // Professional user avatar
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    
    const currentInput = input
    setMessages((prevMessages) => [...prevMessages, newMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Prepare messages for API
      const apiMessages = [...messages, newMessage].map(msg => ({
        role: msg.role === 'agent' ? 'assistant' : 'user',
        content: msg.content
      }))

      // Call the AI API
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          model: selectedModel,
          temperature: 0.3,
          maxTokens: 2000
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.details || data.error)
      }

      const aiResponse: Message = {
        id: String(Date.now()), // Use timestamp for unique ID
        role: "agent",
        userName: "Crowe Logic AI",
        avatar: "/crowe-avatar.png",
        content: data.response || 'No response received',
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      
      setMessages((prevMessages) => [...prevMessages, aiResponse])
    } catch (error) {
      console.error('Failed to get AI response:', error)
      
      // Show toast notification for error
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : 'Failed to connect to AI service',
        variant: "destructive",
        duration: 5000
      })
      
      // Show error message to user
      const errorMessage: Message = {
        id: String(Date.now()),
        role: "agent", 
        userName: "Crowe Logic AI",
        avatar: "/crowe-avatar.png",
        content: `⚠️ I encountered an error processing your request: ${error instanceof Error ? error.message : 'Unknown error'}

To resolve this:
1. Check that your API keys are configured in .env.local
2. Ensure your internet connection is stable
3. Try again in a moment

You can still use me for general mycology guidance while we resolve the connection issue.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
    if (event.key === "Escape") {
      setInput("")
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
        variant: "success",
        duration: 2000
      })
    } catch (err) {
      console.error('Failed to copy text: ', err)
      toast({
        title: "Copy failed",
        description: "Could not copy message to clipboard",
        variant: "destructive",
        duration: 3000
      })
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Model Selector Header */}
      <div className="p-4 border-b bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">AI Model:</span>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grok-beta">Grok Beta</SelectItem>
                <SelectItem value="grok-vision-beta">Grok Vision Beta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-muted-foreground">
            {messages.length} messages
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3 max-w-[85%]", message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}
            >
              {/* Use CroweLogicAvatar for AI responses, regular Avatar for users */}
              {message.role === "agent" ? (
                <CroweLogicAvatar size={32} className="border" />
              ) : (
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={message.avatar || "/placeholder-user.jpg"} alt={message.userName} />
                  <AvatarFallback>{message.userName.substring(0, 1)}</AvatarFallback>
                </Avatar>
              )}
              <div className={cn("space-y-1", message.role === "user" ? "items-end" : "items-start")}>
                <div className={cn("flex items-center gap-2", message.role === "user" ? "flex-row-reverse" : "")}>
                  <span className="text-xs font-medium">{message.userName}</span>
                  {isClient && message.timestamp && (
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                  )}
                </div>
                <div
                  className={cn(
                    "p-3 rounded-xl shadow-sm text-sm",
                    message.role === "agent"
                      ? "bg-muted/60 rounded-bl-none"
                      : "bg-primary text-primary-foreground rounded-br-none",
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "agent" && (
                  <div className="flex items-center gap-1 pt-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(message.content)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Loading state with Crowe Logic avatar */}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <CroweLogicAvatar size={32} className="border" />
              <div className="space-y-1 items-start">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Crowe Logic AI</span>
                </div>
                <div className="bg-muted/60 rounded-xl rounded-bl-none p-3 shadow-sm text-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-muted/30">
        <div className="relative">
          <Textarea
            placeholder="Speak or type your lab notes, questions, or commands..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[52px] max-h-40 pr-28 pl-10 py-3.5 resize-none"
          />
          <div className="absolute top-1/2 left-3 transform -translate-y-1/2 flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Paperclip className="h-4.5 w-4.5" />
            </Button>
          </div>
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Smile className="h-4.5 w-4.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
              <Mic className="h-5 w-5" />
            </Button>
            <Button onClick={handleSend} className="h-9 w-9 p-0" size="icon" disabled={!input.trim() || isLoading}>
              {isLoading ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <Send className="h-4.5 w-4.5" />
              )}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Crowe Logic AI can respond to voice commands. Click the microphone or start typing.
        </p>
      </div>
    </div>
  )
}
