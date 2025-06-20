"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Copy, Download, ThumbsUp, ThumbsDown, Mic, Send, Paperclip, Smile, Loader2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Message {
  id: string
  role: "assistant" | "user"
  content: string
  timestamp: string
}

const DEMO_RESPONSES = [
  "Excellent choice for Lion's Mane cultivation! For your 50/50 hardwood pellets and soy hulls substrate:\n\n**Hydration Target:** 60-65% moisture content\n**Sterilization:** 15 PSI for 2.5 hours\n**Expected Yield:** 2.5-3.5 lbs per 10lb block\n\nWould you like me to generate a detailed SOP for this batch?",

  "Based on your substrate composition, I recommend:\n\n1. **Pre-hydration:** Soak pellets for 30 minutes before mixing\n2. **pH Adjustment:** Target 6.0-6.5 using lime if needed\n3. **Inoculation Rate:** 10% spawn rate for optimal colonization\n4. **Incubation:** 75-80°F for 14-21 days\n\nShall I create batch tracking labels for your 10 bags?",

  "For contamination prevention with this substrate mix:\n\n**Critical Control Points:**\n- Ensure complete sterilization (internal temp 250°F+)\n- Cool to <80°F before inoculation\n- Maintain sterile technique during spawning\n- Monitor for green/black mold during incubation\n\nI can set up automated monitoring reminders if you'd like.",

  "Your Lion's Mane cultivation parameters look optimal! Here's what I'm tracking:\n\n✅ Substrate: HWFP/Soy hulls 50/50\n✅ Batch size: 10 bags\n✅ Target yield: 25-35 lbs total\n✅ Timeline: 3-4 weeks to harvest\n\nNext steps: Would you like me to generate the sterilization schedule or create QR codes for batch tracking?",

  "I've analyzed your growing conditions and here are my recommendations:\n\n**Environmental Optimization:**\n- Temperature: Maintain 65-75°F for fruiting\n- Humidity: 85-95% RH during pinning\n- Air Exchange: 4-6 times per hour\n- Light: 12-hour photoperiod with LED\n\n**Yield Enhancement Tips:**\n- Cold shock at 50°F for 12 hours before fruiting\n- Mist walls, not mushrooms directly\n- Harvest before spore drop for premium quality\n\nWould you like me to create a detailed environmental control schedule?",

  "Based on the Crowe Logic strain database, here's what I know about your cultivation:\n\n**Lion's Mane (Hericium erinaceus) Profile:**\n- Substrate preference: Hardwood sawdust + supplements\n- Colonization time: 14-21 days at 75°F\n- Fruiting temperature: 65-75°F\n- Biological efficiency: 60-80%\n- Harvest window: 5-7 days after pinning\n\n**Pro Tips from our database:**\n- This strain responds well to CO2 shocking\n- Prefers slightly acidic substrates (pH 5.5-6.5)\n- Benefits from casing layer for consistent pinning\n\nNeed help with any specific cultivation challenges?",
]

const QUICK_PROMPTS = [
  "Help me optimize my Lion's Mane substrate",
  "What's the best sterilization method?",
  "How do I prevent contamination?",
  "Calculate yield predictions for my batch",
  "Generate a cultivation SOP",
  "Troubleshoot slow colonization",
]

export default function DemoChatInterface() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to Crowe Logic AI! I'm your expert mycology assistant powered by advanced fungal biotechnology data.\n\nI can help you with:\n🍄 Substrate optimization and scoring\n📊 Yield predictions and analytics\n🔬 Contamination risk assessment\n📋 Protocol generation\n📈 Batch tracking and analysis\n\nWhat cultivation project are you working on today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [responseIndex, setResponseIndex] = useState(0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight
      }
    }
  }, [messages])

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim()
    if (textToSend === "" || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI processing time
    setTimeout(
      () => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: DEMO_RESPONSES[responseIndex % DEMO_RESPONSES.length],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }

        setMessages((prev) => [...prev, aiResponse])
        setResponseIndex((prev) => prev + 1)
        setIsLoading(false)
      },
      1500 + Math.random() * 1000,
    ) // 1.5-2.5 second delay
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

  return (
    <div className="flex-1 flex flex-col bg-background">
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.length === 1 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">Try these quick prompts:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto p-3"
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                  >
                    <Zap className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="text-xs">{prompt}</span>
                  </Button>
                ))}
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
                  alt={message.role === "assistant" ? "Crowe Logic AI" : "User"}
                />
                <AvatarFallback>{message.role === "assistant" ? "AI" : "U"}</AvatarFallback>
              </Avatar>
              <div className={cn("space-y-1", message.role === "user" ? "items-end" : "items-start")}>
                <div className={cn("flex items-center gap-2", message.role === "user" ? "flex-row-reverse" : "")}>
                  <span className="text-xs font-medium">{message.role === "assistant" ? "Crowe Logic AI" : "You"}</span>
                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>
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
                  <span className="text-xs text-muted-foreground">analyzing...</span>
                </div>
                <div className="bg-muted/60 p-3 rounded-xl rounded-bl-none">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Processing your mycology query...</span>
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
            placeholder="Ask about substrate optimization, contamination prevention, yield predictions..."
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
            <Button
              onClick={() => handleSend()}
              className="h-9 w-9 p-0"
              size="icon"
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Send className="h-4.5 w-4.5" />}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Crowe Logic AI provides expert mycology guidance. Press Enter to send, Escape to clear.
        </p>
      </div>
    </div>
  )
}
