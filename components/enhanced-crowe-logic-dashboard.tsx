"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  BarChart3, 
  BookOpen, 
  FileText, 
  FlaskConical, 
  TreePine, 
  Download, 
  MessageSquare, 
  Database, 
  Zap, 
  Settings,
  Activity,
  AlertTriangle,
  Target,
  Brain,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Search,
  Home,
  Moon,
  Sun,
  Plus
} from "lucide-react"
import { CroweLogo } from "@/components/crowe-logo"
import { useTheme } from "next-themes"

interface ModuleCardProps {
  name: string
  icon: React.ReactNode
  description: string
  features: string[]
  sources: string[]
  onClick: () => void
}

function ModuleCard({ name, icon, description, features, sources, onClick }: ModuleCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="text-lg">{name}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Key Features</h4>
            <div className="flex flex-wrap gap-1">
              {features.map((feature, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Data Sources ({sources.length})</h4>
            <div className="text-xs text-muted-foreground">
              {sources.slice(0, 2).map((source, idx) => (
                <div key={idx}>• {source}</div>
              ))}
              {sources.length > 2 && <div>• +{sources.length - 2} more...</div>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function EnhancedCroweLogicDashboard() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const modules = [
    {
      name: "Dashboard",
      icon: <BarChart3 className="h-5 w-5 text-blue-600" />,
      description: "Real-time batch monitoring and performance analytics",
      features: ["Batch summaries", "Yield projections", "Contamination alerts", "30/60/90 OKRs"],
      sources: [
        "Mushroom Blue Print-90 Days.pdf",
        "The_Power_of_Mindset_in_Mycology.pdf",
        "crowe_rag_mycology_scaffold.json"
      ]
    },
    {
      name: "Protocols",
      icon: <BookOpen className="h-5 w-5 text-green-600" />,
      description: "Standard Operating Procedures and workflow management",
      features: ["SOP display", "Phase-tag flowcharts", "Substrate calculator"],
      sources: [
        "Making-95-blocks-of-our-hardwood-sawdust-substrate.pdf",
        "Crowe logic behavior core.txt",
        "A_Journey_Into_Mycology (1).pdf"
      ]
    },
    {
      name: "Batch Logs",
      icon: <FileText className="h-5 w-5 text-orange-600" />,
      description: "Comprehensive batch tracking and metadata management",
      features: ["Metadata tagging", "CLX extraction scoring", "Time-series batch recall"],
      sources: [
        "batch_report.docx",
        "CroweLogic_LionsMane_CustomerBatchReport_CLX-LM001.docx"
      ]
    },
    {
      name: "R&D / Experiments",
      icon: <FlaskConical className="h-5 w-5 text-purple-600" />,
      description: "Research and development experimentation platform",
      features: ["Compound study viewer", "Strain comparisons", "Experimental block logs"],
      sources: [
        "bears_head_research.pdf",
        "mushroom_bioactive_compounds.txt",
        "SouthwestMushrooms_Strain_Metadata.json",
        "Cmid.master .txt"
      ]
    },
    {
      name: "Simulations & Trees",
      icon: <TreePine className="h-5 w-5 text-emerald-600" />,
      description: "Predictive modeling and decision support systems",
      features: ["Yield predictor", "Contamination risk model", "Substrate decision tree"],
      sources: [
        "myco_ml.py.txt",
        "python3 mycelium_ei_focus_model.py.txt",
        "Copy_of_Mycelium_EI_Environmental_Intelligence_in_Action.pdf"
      ]
    },
    {
      name: "Generated Reports",
      icon: <Download className="h-5 w-5 text-indigo-600" />,
      description: "Automated reporting and export capabilities",
      features: ["Export batch summaries", "Generate extract reports", "Flag protocol deltas"],
      sources: ["All modules"]
    },
    {
      name: "AI Coach",
      icon: <MessageSquare className="h-5 w-5 text-pink-600" />,
      description: "Personalized coaching and operational guidance",
      features: ["Motivational coaching", "Operational prompts", "Weekly checkpoint assistant"],
      sources: [
        "The_Power_of_Mindset_in_Mycology.pdf",
        "Mushroom Blue Print-90 Days.pdf"
      ]
    },
    {
      name: "Knowledge Base",
      icon: <Database className="h-5 w-5 text-teal-600" />,
      description: "Centralized knowledge management and search",
      features: ["CroweLayer tag search", "Knowledge delta reporting", "Protocol comparison"],
      sources: ["All books + RAG files"]
    },
    {
      name: "Integrations",
      icon: <Zap className="h-5 w-5 text-yellow-600" />,
      description: "External system integrations and automation",
      features: ["Sensor-driven SOPs", "Telemetry logging", "Smart alerts"],
      sources: [
        "Mycelium_EI_Environmental_Intelligence_in_Action.pdf",
        "MycoSoft sensor logic"
      ]
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5 text-gray-600" />,
      description: "System configuration and customization",
      features: ["Environment configs", "Species presets", "Extraction tier tuning"],
      sources: []
    }
  ]

  const outputTags = [
    { name: "PHASE", color: "bg-blue-100 text-blue-800" },
    { name: "MUSHROOM", color: "bg-green-100 text-green-800" },
    { name: "SUBSTRATE", color: "bg-orange-100 text-orange-800" },
    { name: "EQUIPMENT", color: "bg-purple-100 text-purple-800" },
    { name: "EXTRACT_TIER", color: "bg-pink-100 text-pink-800" },
    { name: "AUTOMATION", color: "bg-indigo-100 text-indigo-800" },
    { name: "ROI_METRIC", color: "bg-emerald-100 text-emerald-800" }
  ]

  const sidebarItems = [
    { name: "Overview", icon: <Home className="w-4 h-4" />, id: "overview" },
    { name: "Analytics", icon: <BarChart3 className="w-4 h-4" />, id: "analytics" },
    { name: "Batches", icon: <FlaskConical className="w-4 h-4" />, id: "batches" },
    { name: "AI Coach", icon: <Brain className="w-4 h-4" />, id: "ai-coach" },
    { name: "Reports", icon: <FileText className="w-4 h-4" />, id: "reports" },
    { name: "Settings", icon: <Settings className="w-4 h-4" />, id: "settings" }
  ]

  const handleModuleClick = (moduleName: string) => {
    setActiveModule(moduleName)
    console.log(`Opening ${moduleName} module`)
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className={`${sidebarExpanded ? 'w-64' : 'w-16'} bg-muted/30 border-r flex flex-col transition-all duration-300`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {sidebarExpanded && (
              <div className="flex items-center gap-2">
                <CroweLogo 
                  variant="official-circle"
                  size={32}
                  systemBranding={true}
                  darkTheme={theme === 'dark'}
                />
                <span className="font-semibold">Platform</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-2"
            >
              {sidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="p-2 space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start gap-3 ${!sidebarExpanded ? 'px-2' : ''}`}
                onClick={() => setActiveModule(item.id)}
              >
                {item.icon}
                {sidebarExpanded && <span>{item.name}</span>}
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-2 border-t">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="flex-1"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            {sidebarExpanded && (
              <>
                <Button variant="ghost" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="h-16 border-b bg-background/80 backdrop-blur-sm flex items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">CroweOS Systems Platform</h1>
            <p className="text-sm text-muted-foreground">
              Professional Mycology Platform v3.1
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Brain className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Batch
            </Button>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <ScrollArea className="flex-1 p-6 custom-scrollbar">
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Active Batches</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Success Rate</p>
                      <p className="text-2xl font-bold">96.5%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">Alerts</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Yield (kg)</p>
                      <p className="text-2xl font-bold">147.2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Output Tags */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Output Tags & Classification</h2>
              <div className="flex flex-wrap gap-2">
                {outputTags.map((tag, idx) => (
                  <Badge key={idx} className={tag.color}>
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Module Grid */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Platform Modules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module, idx) => (
                  <ModuleCard
                    key={idx}
                    name={module.name}
                    icon={module.icon}
                    description={module.description}
                    features={module.features}
                    sources={module.sources}
                    onClick={() => handleModuleClick(module.name)}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
