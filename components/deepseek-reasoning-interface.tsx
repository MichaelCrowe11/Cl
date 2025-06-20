"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Copy,
  Download,
  ThumbsUp,
  ThumbsDown,
  Mic,
  Send,
  Paperclip,
  Smile,
  Loader2,
  Zap,
  GitBranch,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface DeepSeekReasoningInterfaceProps {
  model?: string
}

export default function DeepSeekReasoningInterface({
  model = "deepseek-r1-distill-llama-70b",
}: DeepSeekReasoningInterfaceProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentSession, setCurrentSession] = useState<any>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

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
          title: "DeepSeek R1 Reasoning Session",
        }),
      })

      const { session } = await response.json()
      setCurrentSession(session)
    } catch (error) {
      toast.error("Failed to create new session")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !user) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat-groq-deepseek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
          userId: user.id,
          sessionId: currentSession?.id,
          model,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response body")

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") break

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id ? { ...msg, content: msg.content + parsed.content } : msg,
                  ),
                )
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
    } catch (error) {
      toast.error("Failed to send message")
      console.error("Chat error:", error)
    } finally {
      setIsLoading(false)
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
    a.download = `deepseek-reasoning-${messageId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Reasoning analysis downloaded")
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(event as any)
    }
    if (event.key === "Escape") {
      setInput("")
    }
  }

  const reasoningPrompts = [
    "Analyze the multi-step reasoning process for optimizing Lion's Mane substrate composition using systematic problem decomposition",
    "Design a comprehensive sterilization protocol using chain-of-thought analysis and statistical risk assessment",
    "Create a systematic troubleshooting framework for contamination issues using logical reasoning trees and root cause analysis",
    "Develop a yield optimization strategy using multi-variable analysis and predictive modeling with quantitative outcomes",
    "Analyze the biochemical pathways of bioactive compound production using step-by-step molecular reasoning",
    "Design an economic optimization model for commercial production using systematic cost-benefit analysis and decision trees",
  ]

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please sign in to continue</h2>
          <p className="text-muted-foreground mb-4">You need to be authenticated to use DeepSeek R1 Reasoning</p>
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
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
              <GitBranch className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Crowe Logic AI - DeepSeek R1 Reasoning</h2>
              <p className="text-sm text-muted-foreground">Advanced Chain-of-Thought Analysis & Problem Solving</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800">
              <Zap className="h-3 w-3 mr-1" />
              {model}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <GitBranch className="h-2 w-2 mr-1" />
              Reasoning Engine
            </Badge>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <GitBranch className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">DeepSeek R1 Reasoning Engine</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Advanced chain-of-thought analysis powered by DeepSeek R1's reasoning capabilities. Systematic
                problem-solving with multi-step logical analysis and comprehensive scientific methodology.
              </p>

              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Advanced Reasoning Prompts:</h4>
                <div className="grid grid-cols-1 gap-2 max-w-4xl mx-auto">
                  {reasoningPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
                      onClick={() => {
                        setInput(prompt)
                      }}
                      disabled={isLoading}
                    >
                      <GitBranch className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="text-xs">{prompt}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800 max-w-2xl mx-auto">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  DeepSeek R1 Capabilities
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Multi-step logical reasoning chains</li>
                  <li>• Systematic problem decomposition</li>
                  <li>• Chain-of-thought analysis</li>
                  <li>• Statistical risk assessment</li>
                  <li>• Predictive modeling and optimization</li>
                  <li>• Root cause analysis frameworks</li>
                </ul>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3 max-w-[90%]", message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}
            >
              <Avatar className="h-8 w-8 border">
                <AvatarImage
                  src={message.role === "assistant" ? "/crowe-avatar.png" : "/placeholder-user.jpg"}
                  alt={message.role === "assistant" ? "DeepSeek R1" : "User"}
                />
                <AvatarFallback>
                  {message.role === "assistant" ? <GitBranch className="h-4 w-4" /> : "U"}
                </AvatarFallback>
              </Avatar>
              <div className={cn("space-y-1", message.role === "user" ? "items-end" : "items-start")}>
                <div className={cn("flex items-center gap-2", message.role === "user" ? "flex-row-reverse" : "")}>
                  <span className="text-xs font-medium">
                    {message.role === "assistant" ? "DeepSeek R1" : user.name || "You"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {message.role === "assistant" && (
                    <Badge variant="outline" className="text-xs">
                      <GitBranch className="h-2 w-2 mr-1" />
                      Reasoning
                    </Badge>
                  )}
                </div>
                <div
                  className={cn(
                    "p-4 rounded-xl shadow-sm text-sm",
                    message.role === "assistant"
                      ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-bl-none border border-purple-200 dark:border-purple-800"
                      : "bg-primary text-primary-foreground rounded-br-none",
                  )}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
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
            <div className="flex gap-3 max-w-[90%] mr-auto">
              <Avatar className="h-8 w-8 border">
                <AvatarFallback>
                  <GitBranch className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">DeepSeek R1</span>
                  <span className="text-xs text-muted-foreground">reasoning through problem...</span>
                  <Badge variant="outline" className="text-xs">
                    <GitBranch className="h-2 w-2 mr-1" />
                    Reasoning
                  </Badge>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-xl rounded-bl-none border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Applying chain-of-thought analysis...</span>
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
            placeholder="Request systematic analysis, multi-step reasoning, chain-of-thought problem solving, or comprehensive logical frameworks..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
          DeepSeek R1 Reasoning: Advanced chain-of-thought analysis with systematic problem-solving. Press Enter to
          send, Escape to clear.
        </p>
      </div>
    </div>
  )
}
