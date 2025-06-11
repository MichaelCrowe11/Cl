"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Copy, Download, ThumbsUp, ThumbsDown, Mic, Send, Paperclip, Smile } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "agent",
      userName: "Crowe Logic AI",
      avatar: "/crowe-avatar.png", // Updated avatar
      content:
        "Welcome to Crowe Logic AI, your dedicated mycology lab partner. How can I assist your cultivation efforts today? You can speak or type your observations, questions, or commands.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    {
      id: "2",
      role: "user",
      userName: "Cultivator",
      avatar: "/placeholder.svg?width=40&height=40", // Kept placeholder for user
      content:
        "Hey Logic, I'm starting a new batch of Lion's Mane. Substrate is hardwood fuel pellets and soy hulls, 50/50 mix. Planning for 10 bags.",
      timestamp: new Date(Date.now() + 1 * 60 * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    {
      id: "3",
      role: "agent",
      userName: "Crowe Logic AI",
      avatar: "/crowe-avatar.png", // Updated avatar
      content:
        "Understood. Logging new Lion's Mane batch (10 bags, HWFP/Soy hulls 50/50).\n\nWould you like me to:\n1. Generate a batch label and SOP for this?\n2. Confirm hydration levels for this substrate mix?\n3. Set reminders for sterilization and inoculation?",
      timestamp: new Date(Date.now() + 2 * 60 * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[style*="overflow: scroll hidden;"]')
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight
      }
    }
  }, [messages])

  const handleSend = () => {
    if (input.trim() === "") return
    const newMessage: Message = {
      id: String(messages.length + 1),
      role: "user",
      userName: "Cultivator",
      avatar: "/placeholder.svg?width=40&height=40", // User avatar
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prevMessages) => [...prevMessages, newMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: String(messages.length + messages.length + 1), // Ensure unique ID
        role: "agent",
        userName: "Crowe Logic AI",
        avatar: "/crowe-avatar.png", // Updated avatar
        content: `Acknowledged: "${input.substring(0, 50)}${input.length > 50 ? "..." : ""}". I'm processing this. What would you like to do next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prevMessages) => [...prevMessages, aiResponse])
    }, 1000)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3 max-w-[85%]", message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}
            >
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.userName} />
                <AvatarFallback>{message.userName.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <div className={cn("space-y-1", message.role === "user" ? "items-end" : "items-start")}>
                <div className={cn("flex items-center gap-2", message.role === "user" ? "flex-row-reverse" : "")}>
                  <span className="text-xs font-medium">{message.userName}</span>
                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>
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
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
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
            <Button onClick={handleSend} className="h-9 w-9 p-0" size="icon" disabled={!input.trim()}>
              <Send className="h-4.5 w-4.5" />
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
