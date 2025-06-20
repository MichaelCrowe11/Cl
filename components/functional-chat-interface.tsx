"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Copy, Download, ThumbsUp, ThumbsDown, Mic, Send, Paperclip, Smile, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface ChatSession {
  id: string
  title: string
  created_at: string
}

export default function FunctionalChatInterface() {
  const { user } = useAuth()
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    body: {
      userId: user?.id,
      sessionId: currentSession?.id,
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
          title: "New Mycology Session",
        }),
      })

      const { session } = await response.json()
      setCurrentSession(session)
      setSessions((prev) => [session, ...prev])
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
    a.download = `crowe-ai-response-${messageId}.txt`
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

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please sign in to continue</h2>
          <p className="text-muted-foreground mb-4">You need to be authenticated to use Crowe Logic AI</p>
          <Button onClick={() => (window.location.href = "/auth/login")}>Sign In</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Avatar className="h-16 w-16 mx-auto mb-4">
                <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold mb-2">Welcome to Crowe Logic AI</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your dedicated mycology lab partner. Ask me about substrate optimization, contamination prevention,
                yield predictions, or any cultivation questions you have.
              </p>
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
                  alt={message.role === "assistant" ? "Crowe Logic AI" : "User"}
                />
                <AvatarFallback>{message.role === "assistant" ? "AI" : "U"}</AvatarFallback>
              </Avatar>
              <div className={cn("space-y-1", message.role === "user" ? "items-end" : "items-start")}>
                <div className={cn("flex items-center gap-2", message.role === "user" ? "flex-row-reverse" : "")}>
                  <span className="text-xs font-medium">
                    {message.role === "assistant" ? "Crowe Logic AI" : user.name || "You"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div
                  className={cn(
                    "p-3 rounded-xl shadow-sm text-sm",
                    message.role === "assistant"
                      ? "bg-muted/60 rounded-bl-none"
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
                <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Crowe Logic AI</span>
                  <span className="text-xs text-muted-foreground">thinking...</span>
                </div>
                <div className="bg-muted/60 p-3 rounded-xl rounded-bl-none">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Analyzing your request...</span>
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
            placeholder="Ask about substrate optimization, contamination prevention, yield predictions..."
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
          Crowe Logic AI provides expert mycology guidance. Press Enter to send, Escape to clear.
        </p>
      </div>
    </div>
  )
}
