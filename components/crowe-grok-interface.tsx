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
  Brain,
  Microscope,
  FlaskConical,
  AlertTriangle,
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

interface CroweGrokInterfaceProps {
  model?: string
}

export default function CroweGrokInterface({ model = "grok-2-latest" }: CroweGrokInterfaceProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [apiEndpoint, setApiEndpoint] = useState("/api/chat-grok-direct") // Track which endpoint we're using
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
          title: "Crowe Logic AI Advanced Session",
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

    console.log("🔬 Crowe Logic: Sending request to", apiEndpoint)
    console.log("📝 User message:", userMessage.content)

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
          userId: user.id,
          sessionId: currentSession?.id,
          model,
          advanced_mode: true, // Flag to ensure advanced processing
        }),
      })

      console.log("📡 Response status:", response.status)
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ API Error:", errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
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

      let responsePreview = ""
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
                responsePreview += parsed.content
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

      console.log("✅ Response preview:", responsePreview.substring(0, 200) + "...")

      // Check if we got a generic response and warn the user
      const genericPhrases = [
        "excellent choice for lion's mane cultivation",
        "50/50 hardwood pellets and soy hulls",
        "hydration target: 60-65%",
        "would you like me to generate",
      ]

      const isGeneric = genericPhrases.some((phrase) => responsePreview.toLowerCase().includes(phrase))

      if (isGeneric) {
        console.warn("⚠️ Generic response detected!")
        toast.error("Generic response detected - system may not be using advanced mode")
      } else {
        console.log("✅ Advanced response confirmed")
      }
    } catch (error) {
      console.error("❌ Chat error:", error)
      toast.error(`Failed to send message: ${error.message}`)
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
    a.download = `crowe-logic-advanced-${messageId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Advanced response downloaded")
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

  const switchEndpoint = () => {
    const newEndpoint = apiEndpoint === "/api/chat-grok-direct" ? "/api/chat" : "/api/chat-grok-direct"
    setApiEndpoint(newEndpoint)
    toast.success(`Switched to ${newEndpoint}`)
  }

  const advancedPrompts = [
    "Analyze the biochemical mechanisms of sterilization and design an optimal protocol for Lion's Mane substrate with contamination risk assessment",
    "Compare autoclave vs pressure cooker sterilization effectiveness using statistical analysis and provide quantitative recommendations",
    "Design a sterilization validation protocol with biological indicators and contamination probability calculations",
    "Explain the molecular basis of heat sterilization and optimize temperature/time parameters for maximum substrate preservation",
    "Create a comprehensive sterilization SOP with quality control metrics and systematic troubleshooting protocols",
    "Analyze sterilization economics and develop cost-optimization strategies for commercial production scaling",
  ]

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
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg">
              <FlaskConical className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Crowe Logic AI - Advanced Mode</h2>
              <p className="text-sm text-muted-foreground">PhD-Level Mycology & Biochemistry Expertise</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800">
              <Brain className="h-3 w-3 mr-1" />
              {model}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <FlaskConical className="h-2 w-2 mr-1" />
              {apiEndpoint}
            </Badge>
            <Button variant="outline" size="sm" onClick={switchEndpoint}>
              Switch API
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <FlaskConical className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Crowe Logic AI - Advanced Mode</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                PhD-level mycology expertise with comprehensive biochemical analysis, statistical modeling, and
                systematic problem-solving. Absolutely no generic responses allowed.
              </p>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 p-4 rounded-lg border border-red-200 dark:border-red-800 max-w-2xl mx-auto mb-6">
                <h4 className="font-medium mb-2 flex items-center gap-2 text-red-800 dark:text-red-200">
                  <AlertTriangle className="h-4 w-4" />
                  Advanced Mode Active
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  This system is configured to provide only PhD-level responses with comprehensive scientific analysis.
                  Generic responses are strictly forbidden and will trigger system alerts.
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Advanced Scientific Prompts:</h4>
                <div className="grid grid-cols-1 gap-2 max-w-4xl mx-auto">
                  {advancedPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto p-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50"
                      onClick={() => {
                        setInput(prompt)
                      }}
                      disabled={isLoading}
                    >
                      <FlaskConical className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="text-xs">{prompt}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 max-w-2xl mx-auto">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Microscope className="h-4 w-4" />
                  Current API Endpoint: {apiEndpoint}
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Comprehensive biochemical analysis required</li>
                  <li>• Statistical risk assessment protocols</li>
                  <li>• Quantitative optimization strategies</li>
                  <li>• Systematic troubleshooting frameworks</li>
                  <li>• Economic modeling and cost analysis</li>
                  <li>• Quality control with measurable KPIs</li>
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
                  alt={message.role === "assistant" ? "Crowe Logic AI" : "User"}
                />
                <AvatarFallback>
                  {message.role === "assistant" ? <FlaskConical className="h-4 w-4" /> : "U"}
                </AvatarFallback>
              </Avatar>
              <div className={cn("space-y-1", message.role === "user" ? "items-end" : "items-start")}>
                <div className={cn("flex items-center gap-2", message.role === "user" ? "flex-row-reverse" : "")}>
                  <span className="text-xs font-medium">
                    {message.role === "assistant" ? "Crowe Logic AI" : user.name || "You"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {message.role === "assistant" && (
                    <Badge variant="outline" className="text-xs">
                      <FlaskConical className="h-2 w-2 mr-1" />
                      Advanced
                    </Badge>
                  )}
                </div>
                <div
                  className={cn(
                    "p-4 rounded-xl shadow-sm text-sm",
                    message.role === "assistant"
                      ? "bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 rounded-bl-none border border-emerald-200 dark:border-emerald-800"
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
                  <FlaskConical className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Crowe Logic AI</span>
                  <span className="text-xs text-muted-foreground">advanced analysis in progress...</span>
                  <Badge variant="outline" className="text-xs">
                    <FlaskConical className="h-2 w-2 mr-1" />
                    Advanced
                  </Badge>
                </div>
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 p-4 rounded-xl rounded-bl-none border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Applying PhD-level scientific methodology...</span>
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
            placeholder="Request comprehensive biochemical analysis, statistical risk assessment, quantitative optimization protocols, or systematic scientific frameworks..."
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
          Advanced Mode: PhD-level responses only. Using {apiEndpoint}. Press Enter to send, Escape to clear.
        </p>
      </div>
    </div>
  )
}
