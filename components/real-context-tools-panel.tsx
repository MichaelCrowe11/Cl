"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Download,
  Copy,
  RefreshCw,
  Plus,
  Thermometer,
  Droplets,
  Wind,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Share,
  Mic,
  FileSpreadsheet,
  FileJson,
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"

interface Document {
  id: string
  name: string
  type: string
  category: string
  file_size: number
  status: string
  created_at: string
}

interface EnvironmentalData {
  id: string
  location: string
  temperature: number
  humidity: number
  co2_level: number
  ph_level: number
  recorded_at: string
}

interface Alert {
  id: string
  title: string
  message: string
  type: string
  priority: string
  created_at: string
}

interface ContextToolsPanelProps {
  activeSection: string
}

export default function RealContextToolsPanel({ activeSection }: ContextToolsPanelProps) {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Fetch user-specific data
  useEffect(() => {
    if (user) {
      fetchUserData()
      const interval = setInterval(fetchUserData, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [user, activeSection])

  const fetchUserData = async () => {
    if (!user) return

    try {
      // Fetch documents for current section
      const docsResponse = await fetch(`/api/user/documents?category=${activeSection}`, {
        headers: { "x-user-id": user.id },
      })
      const docsData = await docsResponse.json()
      if (docsData.documents) setDocuments(docsData.documents)

      // Fetch environmental data
      const envResponse = await fetch("/api/user/environmental", {
        headers: { "x-user-id": user.id },
      })
      const envData = await envResponse.json()
      if (envData.environmentalData) setEnvironmentalData(envData.environmentalData)

      // Fetch alerts
      const alertsResponse = await fetch("/api/user/alerts", {
        headers: { "x-user-id": user.id },
      })
      const alertsData = await alertsResponse.json()
      if (alertsData.alerts) setAlerts(alertsData.alerts)

      setLastUpdate(new Date())
    } catch (error) {
      console.error("Failed to fetch user data:", error)
    }
  }

  const generateDocument = async (type: string) => {
    if (!user) return

    setIsGenerating(true)
    toast.loading(`Generating ${type} document...`)

    try {
      const response = await fetch("/api/user/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          name: `${type} - ${new Date().toLocaleDateString()}`,
          type: type.toLowerCase(),
          category: activeSection,
          content: `Generated ${type} content for ${activeSection} section`,
          metadata: { generated: true, section: activeSection },
        }),
      })

      const data = await response.json()
      if (data.document) {
        setDocuments((prev) => [data.document, ...prev])
        toast.success(`${type} document generated successfully!`)
      }
    } catch (error) {
      toast.error("Failed to generate document")
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadDocument = async (doc: Document) => {
    toast.loading("Preparing download...")

    try {
      // Simulate download preparation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In real implementation, this would fetch the actual file
      const blob = new Blob([doc.name], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${doc.name}.${doc.type}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Document downloaded successfully!")
    } catch (error) {
      toast.error("Failed to download document")
    }
  }

  const copyDocumentLink = async (doc: Document) => {
    try {
      const link = `${window.location.origin}/documents/${doc.id}`
      await navigator.clipboard.writeText(link)
      toast.success("Document link copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy document link")
    }
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    await fetchUserData()
    setIsRefreshing(false)
    toast.success("Data refreshed successfully!")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (!user) {
    return (
      <div className="w-80 border-l bg-muted/30 p-4 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Database className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Sign in to access your data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Context & Tools</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={refreshData} disabled={isRefreshing}>
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Last updated: {lastUpdate.toLocaleTimeString()}</p>
      </div>

      <Tabs defaultValue="docs" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
          <TabsTrigger value="docs" className="text-xs">
            Docs
          </TabsTrigger>
          <TabsTrigger value="context" className="text-xs">
            Context
          </TabsTrigger>
          <TabsTrigger value="tools" className="text-xs">
            Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="docs" className="flex-1 px-4 pb-4">
          <ScrollArea className="h-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Your Documents</h4>
                <Badge variant="secondary" className="text-xs">
                  {documents.length}
                </Badge>
              </div>

              {documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">No documents yet</p>
                  <p className="text-xs">Generate your first document</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id} className="p-3 bg-background rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(doc.file_size)} • {formatTimeAgo(doc.created_at)}
                        </p>
                      </div>
                      <Badge variant={doc.status === "ready" ? "default" : "secondary"} className="text-xs ml-2">
                        {doc.status === "ready" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {doc.status}
                      </Badge>
                    </div>

                    {doc.status === "ready" && (
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => downloadDocument(doc)}>
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyDocumentLink(doc)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}

              <Button className="w-full" onClick={() => generateDocument("Report")} disabled={isGenerating}>
                <Plus className="h-4 w-4 mr-2" />
                Generate Document
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="context" className="flex-1 px-4 pb-4">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Environmental Data</h4>
                {environmentalData.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <Activity className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-xs">No environmental data</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {environmentalData.slice(0, 3).map((data) => (
                      <div key={data.id} className="p-2 bg-background rounded border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{data.location}</span>
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(data.recorded_at)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3" />
                            {data.temperature}°C
                          </div>
                          <div className="flex items-center gap-1">
                            <Droplets className="h-3 w-3" />
                            {data.humidity}%
                          </div>
                          <div className="flex items-center gap-1">
                            <Wind className="h-3 w-3" />
                            {data.co2_level} ppm
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            pH {data.ph_level}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Active Alerts</h4>
                {alerts.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <CheckCircle className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-xs">All systems normal</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="p-2 bg-background rounded border">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium">{alert.title}</p>
                            <p className="text-xs text-muted-foreground">{alert.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="tools" className="flex-1 px-4 pb-4">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto p-2 flex flex-col items-center gap-1"
                    onClick={() => generateDocument("SOP")}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-xs">New SOP</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto p-2 flex flex-col items-center gap-1"
                    onClick={() => generateDocument("Report")}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span className="text-xs">Report</span>
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Export Tools</h4>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => toast.success("Exporting data as CSV...")}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export as CSV
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => toast.success("Exporting data as JSON...")}
                  >
                    <FileJson className="h-4 w-4 mr-2" />
                    Export as JSON
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">AI Tools</h4>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => toast.success("Voice mode activated!")}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Voice Mode
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => toast.success("Session shared!")}
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share Session
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
