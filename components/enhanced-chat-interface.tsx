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
  GitBranch,
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

interface AIModel {
  id: string
  name: string
  endpoint: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  description: string
}

const AI_MODELS: AIModel[] = [
  {
    id: "crowe-advanced",
    name: "Crowe Logic AI",
    endpoint: "/api/crowe-advanced",
    icon: FlaskConical,
    gradient: "from-emerald-500 to-blue-600",
    description: "PhD-Level Mycology & Biochemistry Expertise",
  },
  {
    id: "deepseek-reasoning",
    name: "DeepSeek R1 Reasoning",
    endpoint: "/api/chat-groq-deepseek",
    icon: GitBranch,
    gradient: "from-purple-500 to-pink-600",
    description: "Chain-of-Thought Analysis & Problem Solving",
  },
  {
    id: "openai-gpt4",
    name: "OpenAI GPT-4",
    endpoint: "/api/chat",
    icon: Brain,
    gradient: "from-blue-500 to-indigo-600",
    description: "General AI Assistant",
  },
]

export default function EnhancedChatInterface() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]) // Default to Crowe Logic AI
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  console.log("🧬 Enhanced Chat Interface loaded with model:", selectedModel.name)
  console.log("🔗 Using endpoint:", selectedModel.endpoint)

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
          title: `${selectedModel.name} Session`,
        }),
      })

      const { session } = await response.json()
      setCurrentSession(session)
    } catch (error) {
      console.error("Failed to create session:", error)
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

    console.log("🚀 Sending request to:", selectedModel.endpoint)
    console.log("📝 User message:", userMessage.content)
    console.log("🤖 Using model:", selectedModel.name)

    try {
      const response = await fetch(selectedModel.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
          userId: user.id,
          sessionId: currentSession?.id,
          model: selectedModel.id === "crowe-advanced" ? "grok-2-latest" : "gpt-4",
          advanced_mode: true,
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

      console.log("✅ Response received, length:", responsePreview.length)
      console.log("🔬 Response preview:", responsePreview.substring(0, 200) + "...")

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
        toast.error("Generic response detected - API may not be working correctly")
      } else {
        console.log("✅ Advanced response confirmed")
        toast.success("Advanced response received")
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
    a.download = `${selectedModel.id}-response-${messageId}.txt`
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
      setInput("")
    }
  }

  const handleModelChange = (modelId: string) => {
    const model = AI_MODELS.find((m) => m.id === modelId)
    if (model) {
      setSelectedModel(model)
      console.log("🔄 Switched to model:", model.name)
      console.log("🔗 New endpoint:", model.endpoint)
      toast.success(`Switched to ${model.name}`)

      // Create new session for new model
      if (user) {
        createNewSession()
      }
    }
  }

  const advancedPrompts = [
    "Generate a comprehensive cultivation SOP with biochemical analysis",
    "Analyze contamination prevention using statistical risk assessment",
    "Design substrate optimization protocol with molecular composition analysis",
    "Create sterilization validation framework with biological indicators",
    "Develop yield optimization strategies with quantitative parameters",
    "Explain enzymatic pathways in mushroom cultivation with scientific detail",
  ]

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please sign in to continue</h2>
          <p className="text-muted-foreground mb-4">You need to be authenticated to use the enhanced chat interface</p>
          <Button onClick={() => (window.location.href = "/auth/login")}>Sign In</Button>
        </div>
      </div>
    )
  }

  const ModelIcon = selectedModel.icon

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-gradient-to-r ${selectedModel.gradient} rounded-lg`}>
              <ModelIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">{selectedModel.name}</h2>
              <p className="text-sm text-muted-foreground">{selectedModel.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedModel.id}
              onChange={(e) => handleModelChange(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              {AI_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <Badge variant="outline" className="text-xs">
              <Microscope className="h-2 w-2 mr-1" />
              {selectedModel.endpoint}
            </Badge>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div
                className={`p-4 bg-gradient-to-r ${selectedModel.gradient} rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center`}
              >
                <ModelIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{selectedModel.name}</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">{selectedModel.description}</p>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-4 rounded-lg border border-green-200 dark:border-green-800 max-w-2xl mx-auto mb-6">
                <h4 className="font-medium mb-2 flex items-center gap-2 text-green-800 dark:text-green-200">
                  <AlertTriangle className="h-4 w-4" />
                  Enhanced AI Mode Active
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Using endpoint: {selectedModel.endpoint} - Advanced responses with comprehensive scientific analysis.
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Advanced Prompts:</h4>
                <div className="grid grid-cols-1 gap-2 max-w-4xl mx-auto">
                  {advancedPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto p-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50"
                      onClick={() => {
                        setInput(prompt)
                      }}
                      disabled={isLoading}
                    >
                      <ModelIcon className="h-3 w-3 mr-2 flex-shrink-0" />
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
              className={cn("flex gap-3 max-w-[90%]", message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}
            >
              <Avatar className="h-8 w-8 border">
                <AvatarImage
                  src={message.role === "assistant" ? "/crowe-avatar.png" : "/placeholder-user.jpg"}
                  alt={message.role === "assistant" ? selectedModel.name : "User"}
                />
                <AvatarFallback>
                  {message.role === "assistant" ? <ModelIcon className="h-4 w-4" /> : "U"}
                </AvatarFallback>
              </Avatar>
              <div className={cn("space-y-1", message.role === "user" ? "items-end" : "items-start")}>
                <div className={cn("flex items-center gap-2", message.role === "user" ? "flex-row-reverse" : "")}>
                  <span className="text-xs font-medium">
                    {message.role === "assistant" ? selectedModel.name : user.name || "You"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {message.role === "assistant" && (
                    <Badge variant="outline" className="text-xs">
                      <ModelIcon className="h-2 w-2 mr-1" />
                      Advanced
                    </Badge>
                  )}
                </div>
                <div
                  className={cn(
                    "p-4 rounded-xl shadow-sm text-sm",
                    message.role === "assistant"
                      ? `bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-bl-none border border-green-200 dark:border-green-800`
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
                  <ModelIcon className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{selectedModel.name}</span>
                  <span className="text-xs text-muted-foreground">generating advanced response...</span>
                  <Badge variant="outline" className="text-xs">
                    <ModelIcon className="h-2 w-2 mr-1" />
                    Advanced
                  </Badge>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-4 rounded-xl rounded-bl-none border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Applying {selectedModel.name} methodology...</span>
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
            placeholder={`Request ${selectedModel.name} analysis...`}
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
          Using {selectedModel.name} via {selectedModel.endpoint}. Press Enter to send, Escape to clear.
        </p>
      </div>
    </div>
  )
}
