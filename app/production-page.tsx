"use client"

import { useState } from "react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import FunctionalSidebar from "@/components/functional-sidebar"
import DemoChatInterface from "@/components/demo-chat-interface"
import { User, Crown, Sparkles, TrendingUp, Activity, Target } from "lucide-react"
import Link from "next/link"
import ContextToolsPanel from "@/components/context-tools-panel"

export default function ProductionDashboard() {
  const [activeSection, setActiveSection] = useState("chat")

  const renderContent = () => {
    switch (activeSection) {
      case "chat":
        return <DemoChatInterface />
      case "dashboard":
        return (
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Mycology Lab Dashboard</h1>
                <Badge variant="secondary" className="text-sm">
                  <Activity className="h-3 w-3 mr-1" />
                  Live System
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Active Batches</h3>
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-primary mb-1">12</p>
                  <p className="text-sm text-muted-foreground">3 ready for harvest</p>
                  <div className="mt-3 bg-blue-50 dark:bg-blue-950 p-2 rounded text-xs">
                    Lion's Mane, Shiitake, Oyster
                  </div>
                </div>
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Success Rate</h3>
                    <Target className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-green-600 mb-1">94.2%</p>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "94.2%" }}></div>
                  </div>
                </div>
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Total Yield</h3>
                    <Sparkles className="h-5 w-5 text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold text-purple-600 mb-1">847 lbs</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                  <div className="mt-3 text-xs text-purple-600">+23% vs last month</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h3 className="font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="font-medium">Lion's Mane Batch #LM-2024-001</p>
                        <p className="text-xs text-muted-foreground">Started 14 days ago</p>
                      </div>
                      <Badge variant="secondary">Incubating</Badge>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="font-medium">Shiitake Batch #SH-2024-015</p>
                        <p className="text-xs text-muted-foreground">Started 28 days ago</p>
                      </div>
                      <Badge variant="default">Ready to Harvest</Badge>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium">Oyster Mushroom Batch #OM-2024-032</p>
                        <p className="text-xs text-muted-foreground">Started 2 hours ago</p>
                      </div>
                      <Badge variant="outline">Sterilizing</Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h3 className="font-semibold mb-4">AI Insights</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded border-l-4 border-green-500">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">Optimal Conditions</p>
                      <p className="text-xs text-green-600 dark:text-green-300">
                        Current humidity levels are perfect for Lion's Mane fruiting
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded border-l-4 border-blue-500">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Yield Prediction</p>
                      <p className="text-xs text-blue-600 dark:text-blue-300">
                        Shiitake batch expected to yield 2.8 lbs (above average)
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded border-l-4 border-orange-500">
                      <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Recommendation</p>
                      <p className="text-xs text-orange-600 dark:text-orange-300">
                        Consider increasing CO2 levels for faster colonization
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case "protocols":
        return (
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Standard Operating Procedures</h1>
                <Button>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate New SOP
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-600 dark:text-blue-300 font-semibold">SP</span>
                    </div>
                    <h3 className="font-semibold">Substrate Preparation</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">Complete guide for substrate mixing and sterilization</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Updated 2 days ago
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Protocol
                    </Button>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-green-600 dark:text-green-300 font-semibold">IN</span>
                    </div>
                    <h3 className="font-semibold">Inoculation Procedures</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">Sterile technique and spawn introduction methods</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Updated 1 week ago
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Protocol
                    </Button>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-red-600 dark:text-red-300 font-semibold">CC</span>
                    </div>
                    <h3 className="font-semibold">Contamination Control</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">Prevention and identification of common contaminants</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Updated 3 days ago
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Protocol
                    </Button>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-purple-600 dark:text-purple-300 font-semibold">HS</span>
                    </div>
                    <h3 className="font-semibold">Harvest & Storage</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">Optimal timing and post-harvest handling</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Updated 5 days ago
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Protocol
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 rounded-lg border">
                <h3 className="font-semibold mb-2">AI-Generated Protocols</h3>
                <p className="text-muted-foreground mb-4">
                  Let Crowe Logic AI create custom SOPs based on your specific strains and equipment.
                </p>
                <Button>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Custom Protocol
                </Button>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex-1 p-6">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4 capitalize">{activeSection.replace("-", " ")}</h1>
              <p className="text-muted-foreground mb-6">
                This feature is available in the full version of Crowe Logic AI.
              </p>
              <div className="bg-card p-8 rounded-lg border shadow-sm">
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2 text-xl">Upgrade to Pro</h3>
                <p className="text-muted-foreground mb-6">
                  Get access to all features including advanced analytics, batch tracking, and custom protocols.
                </p>
                <div className="space-y-3">
                  <Link href="/pricing">
                    <Button className="w-full" size="lg">
                      <Crown className="h-4 w-4 mr-2" />
                      View Pricing Plans
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full" onClick={() => setActiveSection("chat")}>
                      Try AI Assistant
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <FunctionalSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b px-6 flex items-center justify-between bg-background">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-medium">
                {activeSection === "chat"
                  ? "AI Assistant"
                  : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/pricing">
                <Button variant="outline" size="sm">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            </div>
          </header>
          {renderContent()}
        </div>

        {/* Right Panel - Context & Tools */}
        <ContextToolsPanel activeSection={activeSection} />
      </div>
    </div>
  )
}
