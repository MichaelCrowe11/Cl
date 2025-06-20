"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, ThumbsUp, ThumbsDown, Mic, Send, Paperclip, Smile, Loader2, Zap, Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface GrokChatInterfaceProps {
  model?: string
}

export default function GrokChatInterface({ model = "grok-2-1212" }: GrokChatInterfaceProps) {
  const { user } = useAuth()
  const [currentSession, setCurrentSession] = useState<any>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat-grok",
    body: {
      userId: user?.id,
      sessionId: currentSession?.id,
      model,
    },
    onError: (error) => {
      toast.error("Failed to send message: " + error.message)
    },
    onFinish: async (message) => {
      // Save AI response to database
      if (currentSession) {
        try {
          await fetch("/api/chat/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": user?.id || "",
            },
            body: JSON.stringify({
              sessionId: currentSession.id,
              role: "assistant",
              content: message.content,
            }),
          })
        } catch (error) {
          console.error("Failed to save message:", error)
        }
      }
    },
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight
      }
    }
  }, [messages])

  // Create new session on component mount
  useEffect(() => {
    if (user && !currentSession) {
      createNewSession()
    }
  }, [user])

  const createNewSession = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          title: "Grok Mycology Session",
        }),
      })

      const { session } = await response.json()
      setCurrentSession(session)
    } catch (error) {
      toast.error("Failed to create new session")
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard")
    } catch (err) {
      toast.error("Failed to copy text")
    }
  }

  const downloadResponse = (content: string, messageId: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `grok-response-${messageId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Response downloaded")
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(event as any)
    }
    if (event.key === "Escape") {
      handleInputChange({ target: { value: "" } } as any)
    }
  }

  const grokPrompts = [
    "Analyze the optimal substrate composition for Lion's Mane cultivation",
    "Explain the biochemical processes during mushroom fruiting",
    "Compare contamination risks across different cultivation methods",
    "Design an innovative sterile technique protocol",
    "Predict yield outcomes based on environmental parameters",
    "Troubleshoot slow mycelium colonization with reasoning",
  ]

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please sign in to continue</h2>
          <p className="text-muted-foreground mb-4">You need to be authenticated to use Grok-powered AI</p>
          <Button onClick={() => (window.location.href = "/auth/login")}>Sign In</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Grok-Powered Mycology AI</h2>
              <p className="text-sm text-muted-foreground">Advanced reasoning for cultivation challenges</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
            <Zap className="h-3 w-3 mr-1" />
            {model}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Welcome to Grok-Powered Mycology AI</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Experience advanced reasoning and creative problem-solving for your mycology challenges. Grok brings
                enhanced analytical capabilities to cultivation science.
              </p>

              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Try these Grok-powered prompts:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mx-auto">
                  {grokPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto p-3"
                      onClick={() => {
                        handleInputChange({ target: { value: prompt } } as any)
                        setTimeout(() => {
                          const form = document.querySelector("form")
                          if (form) {
                            form.dispatchEvent(new Event("submit", { bubbles: true }))
                          }
                        }, 100)
                      }}
                      disabled={isLoading}
                    >
                      <Brain className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="text-xs">{prompt}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3 max-w-[85%]", message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}
            >
              <Avatar className="h-8 w-8 border">
                <AvatarImage
                  src={message.role === "assistant" ? "/crowe-avatar.png" : "/placeholder-user.jpg"}
                  alt={message.role === "assistant" ? "Grok AI" : "User"}
                />
                <AvatarFallback>{message.role === "assistant" ? <Brain className="h-4 w-4" /> : "U"}</AvatarFallback>
              </Avatar>
              <div className={cn("space-y-1", message.role === "user" ? "items-end" : "items-start")}>
                <div className={cn("flex items-center gap-2", message.role === "user" ? "flex-row-reverse" : "")}>
                  <span className="text-xs font-medium">
                    {message.role === "assistant" ? "Grok Mycology AI" : user.name || "You"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {message.role === "assistant" && (
                    <Badge variant="outline" className="text-xs">
                      <Brain className="h-2 w-2 mr-1" />
                      Grok
                    </Badge>
                  )}
                </div>
                <div
                  className={cn(
                    "p-3 rounded-xl shadow-sm text-sm",
                    message.role === "assistant"
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-bl-none border border-blue-200 dark:border-blue-800"
                      : "bg-primary text-primary-foreground rounded-br-none",
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "assistant" && (
                  <div className="flex items-center gap-1 pt-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(message.content)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => downloadResponse(message.content, message.id)}
                    >
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

          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <Avatar className="h-8 w-8 border">
                <AvatarFallback>
                  <Brain className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Grok Mycology AI</span>
                  <span className="text-xs text-muted-foreground">reasoning...</span>
                  <Badge variant="outline" className="text-xs">
                    <Brain className="h-2 w-2 mr-1" />
                    Grok
                  </Badge>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-3 rounded-xl rounded-bl-none border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Grok is analyzing your mycology query...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-muted/30">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            placeholder="Ask Grok about advanced mycology concepts, complex cultivation challenges, or innovative research ideas..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="min-h-[52px] max-h-40 pr-28 pl-10 py-3.5 resize-none"
            disabled={isLoading}
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
            <Button type="submit" className="h-9 w-9 p-0" size="icon" disabled={!input.trim() || isLoading}>
              {isLoading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Send className="h-4.5 w-4.5" />}
            </Button>
          </div>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Powered by Grok's advanced reasoning for complex mycology challenges. Press Enter to send, Escape to clear.
        </p>
      </div>
    </div>
  )
}
