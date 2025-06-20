"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  BarChart3,
  Bot,
  Brain,
  ChevronRight,
  Database,
  FileText,
  FlaskConical,
  Home,
  MessageSquare,
  Microscope,
  Settings,
  TestTube,
  Crown,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// Navigation configuration
export const navigationConfig = {
  main: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: false,
    },
    {
      title: "Chat Interface",
      url: "/chat",
      icon: MessageSquare,
      isActive: false,
    },
  ],
  aiTools: [
    {
      title: "Crowe Logic AI",
      url: "https://chatgpt.com/g/g-675a4c0e4a5c8191a7c4b8f0-crowe-logic-ai",
      icon: Brain,
      isActive: false,
      external: true,
    },
    {
      title: "Crowe Lab",
      url: "/crowe-lab",
      icon: Microscope,
      isActive: false,
    },
    {
      title: "Image Lab",
      url: "/image-lab",
      icon: Bot,
      isActive: false,
    },
  ],
  cultivation: [
    {
      title: "Protocols",
      url: "/protocols",
      icon: FileText,
      isActive: false,
    },
    {
      title: "Batch Management",
      url: "/batches",
      icon: Database,
      isActive: false,
    },
    {
      title: "Experiments",
      url: "/experiments",
      icon: FlaskConical,
      isActive: false,
    },
  ],
  analytics: [
    {
      title: "Simulations",
      url: "/simulations",
      icon: TestTube,
      isActive: false,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: BarChart3,
      isActive: false,
    },
  ],
  system: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      isActive: false,
    },
  ],
}

interface FunctionalSidebarProps {
  user?: {
    name?: string
    email?: string
    avatar?: string
  }
}

function FunctionalSidebar({ user }: FunctionalSidebarProps) {
  const pathname = usePathname()

  // Update active states based on current pathname
  const updateActiveStates = (items: any[]) => {
    return items.map((item) => ({
      ...item,
      isActive: pathname === item.url,
    }))
  }

  const mainItems = updateActiveStates(navigationConfig.main)
  const aiToolsItems = updateActiveStates(navigationConfig.aiTools)
  const cultivationItems = updateActiveStates(navigationConfig.cultivation)
  const analyticsItems = updateActiveStates(navigationConfig.analytics)
  const systemItems = updateActiveStates(navigationConfig.system)

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard">
                  {/* Official Crowe Logic AI Branding */}
                  <div className="flex items-center gap-3">
                    <Image
                      src="/crowe-avatar.png"
                      alt="Crowe Logic AI"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Crowe Logic AI</span>
                      <span className="truncate text-xs text-muted-foreground">Mycology Platform</span>
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* AI Tools */}
          <SidebarGroup>
            <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {aiToolsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      {item.external ? (
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto h-4 w-4" />
                        </a>
                      ) : (
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Cultivation */}
          <SidebarGroup>
            <SidebarGroupLabel>Cultivation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {cultivationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Analytics */}
          <SidebarGroup>
            <SidebarGroupLabel>Analytics</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {analyticsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* System */}
          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {systemItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/settings">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatar || "/crowe-avatar.png"} alt={user?.name || "User"} />
                    <AvatarFallback className="rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white">
                      {user?.name?.charAt(0) || "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name || "User"}</span>
                    <span className="truncate text-xs">{user?.email || "user@example.com"}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Subscription CTA */}
          <div className="p-2">
            <div className="bg-gradient-to-r from-emerald-500/10 to-blue-600/10 p-3 rounded-lg border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/crowe-avatar.png" alt="Crowe Logic AI" width={20} height={20} className="rounded-full" />
                <h4 className="font-medium text-sm">Ready to Get Started?</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Unlock the full power of Crowe Logic AI for your mycology lab.
              </p>
              <Link href="/pricing">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Subscribe Now
                </Button>
              </Link>
            </div>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  )
}

// Default export
export default FunctionalSidebar
