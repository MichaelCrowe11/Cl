"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  FileText,
  Download,
  Copy,
  Plus,
  Settings,
  Database,
  Beaker,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Thermometer,
  Droplets,
  Wind,
  Activity,
  BarChart3,
  FileSpreadsheet,
  Calendar,
  Bell,
  Mic,
  Share,
  RefreshCw,
} from "lucide-react"

interface ContextToolsPanelProps {
  activeSection: string
}

export default function ContextToolsPanel({ activeSection }: ContextToolsPanelProps) {
  const [activeTab, setActiveTab] = useState("docs")
  const [isGenerating, setIsGenerating] = useState(false)
  const [realtimeData, setRealtimeData] = useState({
    temperature: 72.3,
    humidity: 85.2,
    co2: 1200,
    ph: 6.8,
    activeBatches: 12,
    alerts: 2,
    lastUpdate: new Date(),
  })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData((prev) => ({
        ...prev,
        temperature: 70 + Math.random() * 6,
        humidity: 80 + Math.random() * 10,
        co2: 1000 + Math.random() * 400,
        ph: 6.5 + Math.random() * 0.6,
        lastUpdate: new Date(),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const generateDocument = async (type: string) => {
    setIsGenerating(true)
    toast.loading(`Generating ${type} document...`)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsGenerating(false)
    toast.success(`${type} document generated successfully!`)
    console.log(`Generated ${type} document for ${activeSection} section`)
  }

  const copyToClipboard = async (text: string, label = "content") => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard!`)
    } catch (error) {
      toast.error("Failed to copy to clipboard")
      console.error("Clipboard error:", error)
    }
  }

  const exportData = async (format: string) => {
    toast.loading(`Exporting data as ${format}...`)

    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success(`Data exported as ${format}!`)
    console.log(`Exported ${activeSection} data as ${format}`)
  }

  const refreshData = () => {
    toast.success("Data refreshed!")
    setRealtimeData((prev) => ({
      ...prev,
      lastUpdate: new Date(),
    }))
  }

  const renderGeneratedDocs = () => {
    const docs = {
      chat: [
        { name: "Lion's Mane SOP", type: "Protocol", date: "Today", status: "ready", size: "2.3 MB" },
        { name: "Substrate Analysis", type: "Report", date: "Yesterday", status: "ready", size: "1.8 MB" },
        { name: "Batch Log Template", type: "Template", date: "2 days ago", status: "ready", size: "0.5 MB" },
        { name: "Contamination Guide", type: "Manual", date: "1 week ago", status: "ready", size: "4.2 MB" },
      ],
      dashboard: [
        {
          name: "Monthly Report",
          type: "Analytics",
          date: "Today",
          status: isGenerating ? "generating" : "ready",
          size: "3.1 MB",
        },
        { name: "Yield Analysis", type: "Report", date: "Yesterday", status: "ready", size: "2.7 MB" },
        { name: "Performance Metrics", type: "Dashboard", date: "Today", status: "ready", size: "1.2 MB" },
        { name: "Batch Comparison", type: "Analysis", date: "3 days ago", status: "ready", size: "2.9 MB" },
      ],
      protocols: [
        { name: "Sterilization SOP", type: "Protocol", date: "Today", status: "ready", size: "1.5 MB" },
        { name: "Contamination Guide", type: "Manual", date: "Yesterday", status: "ready", size: "3.8 MB" },
        { name: "Safety Checklist", type: "Checklist", date: "Today", status: "ready", size: "0.8 MB" },
        { name: "Quality Control", type: "Protocol", date: "2 days ago", status: "ready", size: "2.1 MB" },
      ],
    }

    const currentDocs = docs[activeSection as keyof typeof docs] || docs.chat

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-sm">Recent Documents</h4>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={refreshData} className="h-7 px-2">
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => generateDocument("custom")}
              disabled={isGenerating}
              className="h-7 px-2"
            >
              <Plus className="h-3 w-3 mr-1" />
              Generate
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {currentDocs.map((doc, index) => (
            <Card key={index} className="p-3 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.type} • {doc.date} • {doc.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Badge variant={doc.status === "ready" ? "default" : "secondary"} className="text-xs">
                    {doc.status === "ready" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {doc.status}
                  </Badge>
                  {doc.status === "ready" && (
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => exportData("PDF")}>
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(`${doc.name} - ${doc.type}`, "Document link")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const renderContext = () => {
    const contextData = {
      chat: {
        session: "Mycology Consultation",
        messages: 15,
        duration: "23 min",
        topics: ["Lion's Mane", "Substrate", "Contamination"],
        aiModel: "GPT-4o",
        tokens: 2847,
      },
      dashboard: {
        period: "Last 30 days",
        batches: 47,
        success: "94.2%",
        yield: "847 lbs",
        alerts: 3,
        efficiency: "98.1%",
      },
      protocols: {
        total: 24,
        updated: 8,
        pending: 3,
        categories: ["Sterilization", "Inoculation", "Harvesting"],
        compliance: "100%",
      },
    }

    const current = contextData[activeSection as keyof typeof contextData] || contextData.chat

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">Current Context</h4>
          <Button size="sm" variant="ghost" onClick={refreshData} className="h-6 w-6 p-0">
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>

        {/* Real-time Environmental Data */}
        <Card className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-xs flex items-center">
              <Activity className="h-3 w-3 mr-1" />
              Live Environment
            </h5>
            <span className="text-xs text-muted-foreground">{realtimeData.lastUpdate.toLocaleTimeString()}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <Thermometer className="h-3 w-3 mr-1" />
                Temp
              </span>
              <span className="font-mono">{realtimeData.temperature.toFixed(1)}°F</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <Droplets className="h-3 w-3 mr-1" />
                Humidity
              </span>
              <span className="font-mono">{realtimeData.humidity.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <Wind className="h-3 w-3 mr-1" />
                CO₂
              </span>
              <span className="font-mono">{realtimeData.co2.toFixed(0)} ppm</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <Beaker className="h-3 w-3 mr-1" />
                pH
              </span>
              <span className="font-mono">{realtimeData.ph.toFixed(1)}</span>
            </div>
          </div>
        </Card>

        {/* Section-specific Context */}
        <Card className="p-3">
          <h5 className="font-medium text-xs mb-2">Section Data</h5>
          <div className="space-y-2 text-xs">
            {Object.entries(current).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, " $1")}</span>
                <span className="font-medium">{Array.isArray(value) ? value.join(", ") : value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Alerts */}
        {realtimeData.alerts > 0 && (
          <Card className="p-3 border-orange-200 bg-orange-50 dark:bg-orange-950">
            <h5 className="font-medium text-xs mb-2 flex items-center text-orange-800 dark:text-orange-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Active Alerts ({realtimeData.alerts})
            </h5>
            <div className="space-y-1 text-xs">
              <div className="text-orange-700 dark:text-orange-300">• Batch LM-001 ready for harvest</div>
              <div className="text-orange-700 dark:text-orange-300">• CO₂ levels elevated in Room B</div>
            </div>
          </Card>
        )}
      </div>
    )
  }

  const renderTools = () => {
    const tools = {
      chat: [
        {
          name: "Export Chat",
          icon: Download,
          action: () => exportData("JSON"),
          description: "Download conversation history",
        },
        {
          name: "Generate SOP",
          icon: FileText,
          action: () => generateDocument("SOP"),
          description: "Create standard operating procedure",
        },
        {
          name: "Voice Mode",
          icon: Mic,
          action: () => toast.success("Voice mode activated!"),
          description: "Enable voice interaction",
        },
        {
          name: "Share Session",
          icon: Share,
          action: () => copyToClipboard("https://app.crowelogic.ai/session/abc123", "Session link"),
          description: "Copy shareable session link",
        },
      ],
      dashboard: [
        {
          name: "Export Data",
          icon: FileSpreadsheet,
          action: () => exportData("Excel"),
          description: "Download analytics data",
        },
        {
          name: "Schedule Report",
          icon: Calendar,
          action: () => toast.success("Report scheduled for weekly delivery!"),
          description: "Set up automated reporting",
        },
        {
          name: "Set Alert",
          icon: Bell,
          action: () => toast.success("Alert threshold configured!"),
          description: "Configure monitoring alerts",
        },
        {
          name: "Analyze Trends",
          icon: TrendingUp,
          action: () => toast.success("Trend analysis started!"),
          description: "Run predictive analytics",
        },
      ],
      protocols: [
        {
          name: "Create Protocol",
          icon: Plus,
          action: () => generateDocument("Protocol"),
          description: "Generate new SOP document",
        },
        {
          name: "Batch Generate",
          icon: FileText,
          action: () => generateDocument("Batch SOPs"),
          description: "Create multiple protocols",
        },
        {
          name: "Compliance Check",
          icon: CheckCircle,
          action: () => toast.success("Compliance audit completed - 100% compliant!"),
          description: "Verify regulatory compliance",
        },
        {
          name: "Version Control",
          icon: Settings,
          action: () => toast.success("Version history accessed!"),
          description: "Manage protocol versions",
        },
      ],
    }

    const currentTools = tools[activeSection as keyof typeof tools] || tools.chat

    return (
      <div className="space-y-3">
        <h4 className="font-medium text-sm mb-3">Available Tools</h4>
        <div className="space-y-2">
          {currentTools.map((tool, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="justify-start h-auto p-3 w-full"
              onClick={tool.action}
              disabled={isGenerating && tool.name.includes("Generate")}
            >
              <tool.icon className="h-4 w-4 mr-2 flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-medium text-sm">{tool.name}</div>
                <div className="text-xs text-muted-foreground truncate">{tool.description}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Quick Actions for Current Section */}
        <div className="mt-6 pt-4 border-t">
          <h5 className="font-medium text-xs mb-3">Quick Actions</h5>
          <div className="space-y-2">
            {activeSection === "dashboard" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs justify-start"
                  onClick={() => toast.success("New batch created!")}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  New Batch
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs justify-start"
                  onClick={() => generateDocument("Report")}
                >
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Generate Report
                </Button>
              </>
            )}
            {activeSection === "chat" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs justify-start"
                  onClick={() => toast.success("New chat session started!")}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  New Session
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs justify-start"
                  onClick={() => toast.success("Context loaded from database!")}
                >
                  <Database className="h-3 w-3 mr-1" />
                  Load Context
                </Button>
              </>
            )}
            {activeSection === "protocols" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs justify-start"
                  onClick={() => generateDocument("SOP")}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Create SOP
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs justify-start"
                  onClick={() => toast.success("Audit completed - All protocols compliant!")}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Run Audit
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 border-l bg-muted/20 flex flex-col">
      <div className="h-16 border-b px-4 flex items-center">
        <h2 className="font-semibold text-md">Context & Tools</h2>
      </div>

      <div className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="docs" className="text-xs">
              Generated Docs
            </TabsTrigger>
            <TabsTrigger value="context" className="text-xs">
              Context
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-xs">
              Tools
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <TabsContent value="docs" className="mt-0">
              {renderGeneratedDocs()}
            </TabsContent>

            <TabsContent value="context" className="mt-0">
              {renderContext()}
            </TabsContent>

            <TabsContent value="tools" className="mt-0">
              {renderTools()}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  )
}
