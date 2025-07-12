import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Brain
} from "lucide-react"

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

export default function CroweLogicDashboard() {
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

  const handleModuleClick = (moduleName: string) => {
    console.log(`Opening ${moduleName} module`)
    // Navigation logic will be implemented here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                Crowe Logic AI
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Professional Mycology Platform v3.1
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Brain className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Button variant="outline" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                System Status
              </Button>
            </div>
          </div>
          
          {/* Output Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 mr-2">
              Output Tags:
            </span>
            {outputTags.map((tag, idx) => (
              <Badge key={idx} className={`${tag.color} text-xs font-medium`}>
                [{tag.name}]
              </Badge>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Batches</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Contamination Rate</p>
                    <p className="text-2xl font-bold text-green-600">2.1%</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Yield</p>
                    <p className="text-2xl font-bold">89%</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">ROI This Month</p>
                    <p className="text-2xl font-bold text-green-600">+23%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Module Grid */}
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

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>Formatting Standard: Markdown → JSON → SOPs → Diagram (optional)</p>
          <p className="mt-2">Powered by Crowe Logic AI • Professional Mycology Solutions</p>
        </div>
      </div>
    </div>
  )
}
