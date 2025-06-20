"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Layers,
  ClipboardList,
  Archive,
  FlaskConical,
  Sparkles,
  BrainCircuit,
  Database,
  LayoutDashboard,
  FileText,
  Plus,
  MessageSquare,
  ExternalLink,
} from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Crown } from "lucide-react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview and analytics",
  },
  {
    id: "chat",
    label: "AI Assistant",
    icon: MessageSquare,
    description: "Chat with Crowe Logic AI",
  },
  {
    id: "protocols",
    label: "Protocols",
    icon: ClipboardList,
    description: "Standard operating procedures",
  },
  {
    id: "batches",
    label: "Batch Logs",
    icon: Archive,
    description: "Track cultivation batches",
  },
  {
    id: "experiments",
    label: "R&D / Experiments",
    icon: FlaskConical,
    description: "Research and development",
  },
  {
    id: "simulations",
    label: "Simulations & Trees",
    icon: BrainCircuit,
    description: "Predictive modeling",
  },
  {
    id: "reports",
    label: "Generated Reports",
    icon: FileText,
    description: "AI-generated documentation",
  },
]

const aiTools = [
  {
    id: "ai-coach",
    label: "AI Coach",
    icon: Sparkles,
    description: "Personalized guidance",
  },
  {
    id: "chatgpt-model",
    label: "ChatGPT Model",
    icon: MessageSquare,
    description: "Access our custom GPT",
    external: true,
    url: "https://chatgpt.com/g/g-67aaf9d1c3e48191a517829b3719f7cb-crowe-logic-ai",
  },
  {
    id: "knowledge-base",
    label: "Knowledge Base",
    icon: Database,
    description: "Mycology database",
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: Layers,
    description: "Connect external tools",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    description: "Account and preferences",
  },
]

export default function FunctionalSidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { profile } = useAuth()
  const [recentSessions] = useState([
    { id: "1", title: "Lion's Mane Optimization", date: "Today" },
    { id: "2", title: "Shiitake Substrate Analysis", date: "Yesterday" },
    { id: "3", title: "Contamination Prevention", date: "2 days ago" },
  ])

  return (
    <div className="w-72 border-r bg-muted/20 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b h-16 flex items-center">
        <div className="flex items-center gap-3">
          <Image src="/crowe-avatar.png" alt="Crowe Logic AI Logo" width={36} height={36} className="rounded-full" />
          <div>
            <span className="font-semibold text-lg">Crowe Logic AI</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {/* Main Navigation */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn("w-full justify-start text-sm h-9 relative", isActive && "bg-primary/10 text-primary")}
                  onClick={() => onSectionChange(item.id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </nav>

          {/* AI Tools Section */}
          <div className="pt-3 mt-3 border-t">
            <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2">AI TOOLS</h3>
            {aiTools.map((tool) => {
              const Icon = tool.icon
              const isActive = activeSection === tool.id

              if (tool.external) {
                return (
                  <a key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="ghost" className="w-full justify-start text-sm h-9 hover:bg-primary/10">
                      <Icon className="mr-2 h-4 w-4" />
                      {tool.label}
                      <ExternalLink className="ml-auto h-3 w-3" />
                    </Button>
                  </a>
                )
              }

              return (
                <Button
                  key={tool.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn("w-full justify-start text-sm h-9", isActive && "bg-primary/10 text-primary")}
                  onClick={() => onSectionChange(tool.id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tool.label}
                </Button>
              )
            })}
          </div>

          {/* Recent Sessions */}
          {activeSection === "chat" && (
            <div className="pt-3 mt-3 border-t">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-muted-foreground px-2">RECENT SESSIONS</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-1">
                {recentSessions.map((session) => (
                  <Button
                    key={session.id}
                    variant="ghost"
                    className="w-full justify-start text-sm h-auto p-2 text-left"
                  >
                    <div className="truncate">
                      <div className="font-medium truncate">{session.title}</div>
                      <div className="text-xs text-muted-foreground">{session.date}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t mt-auto">
        <div className="bg-primary/10 p-3 rounded-lg">
          <h4 className="font-medium text-sm mb-1">Ready to Get Started?</h4>
          <p className="text-xs text-muted-foreground mb-2">
            Unlock the full power of Crowe Logic AI for your mycology lab.
          </p>
          <Link href="/pricing">
            <Button size="sm" className="w-full">
              <Crown className="h-3 w-3 mr-1" />
              Subscribe Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
