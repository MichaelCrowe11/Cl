import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Calendar,
  Activity,
  CheckCircle,
  Clock,
  ThermometerSun
} from "lucide-react"

interface BatchSummary {
  id: string
  strain: string
  substrate: string
  inoculationDate: string
  currentPhase: string
  progress: number
  expectedYield: number
  contaminationRisk: "low" | "medium" | "high"
  temperature: number
  humidity: number
}

interface OKR {
  period: "30" | "60" | "90"
  objective: string
  keyResults: Array<{
    metric: string
    current: number
    target: number
    unit: string
  }>
}

export default function DashboardModule() {
  const activeBatches: BatchSummary[] = [
    {
      id: "CLX-LM-001",
      strain: "Lion's Mane",
      substrate: "Hardwood Pellets + Soy Hull",
      inoculationDate: "2025-07-01",
      currentPhase: "Fruiting",
      progress: 78,
      expectedYield: 2.3,
      contaminationRisk: "low",
      temperature: 65,
      humidity: 85
    },
    {
      id: "CLX-SH-002", 
      strain: "Shiitake",
      substrate: "Oak Sawdust",
      inoculationDate: "2025-06-28",
      currentPhase: "Colonization",
      progress: 45,
      expectedYield: 1.8,
      contaminationRisk: "medium",
      temperature: 75,
      humidity: 60
    },
    {
      id: "CLX-OY-003",
      strain: "Oyster",
      substrate: "Straw Pellets",
      inoculationDate: "2025-07-05",
      currentPhase: "Incubation",
      progress: 23,
      expectedYield: 3.1,
      contaminationRisk: "low",
      temperature: 72,
      humidity: 75
    }
  ]

  const okrs: OKR[] = [
    {
      period: "30",
      objective: "Optimize Current Production Cycle",
      keyResults: [
        { metric: "Contamination Rate", current: 2.1, target: 3.0, unit: "%" },
        { metric: "Average Yield", current: 89, target: 85, unit: "%" },
        { metric: "Batch Completion Time", current: 28, target: 30, unit: "days" }
      ]
    },
    {
      period: "60",
      objective: "Scale Production Operations",
      keyResults: [
        { metric: "Active Batches", current: 24, target: 30, unit: "batches" },
        { metric: "Revenue Growth", current: 23, target: 25, unit: "%" },
        { metric: "Automation Level", current: 45, target: 60, unit: "%" }
      ]
    },
    {
      period: "90",
      objective: "Market Expansion & Innovation",
      keyResults: [
        { metric: "New Strain Varieties", current: 2, target: 5, unit: "strains" },
        { metric: "Extract Production", current: 15, target: 40, unit: "kg/month" },
        { metric: "Customer Retention", current: 94, target: 95, unit: "%" }
      ]
    }
  ]

  const getContaminationColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-600 bg-green-100"
      case "medium": return "text-yellow-600 bg-yellow-100"
      case "high": return "text-red-600 bg-red-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "Incubation": return <Clock className="h-4 w-4" />
      case "Colonization": return <Activity className="h-4 w-4" />
      case "Fruiting": return <CheckCircle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Production Dashboard</h2>
          <p className="text-muted-foreground">Real-time batch monitoring and analytics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button variant="outline" size="sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alerts
          </Button>
        </div>
      </div>

      {/* Active Batches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Active Batches ({activeBatches.length})
          </CardTitle>
          <CardDescription>Current production status and environmental conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeBatches.map((batch) => (
              <div key={batch.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{batch.id} - {batch.strain}</h3>
                    <p className="text-sm text-muted-foreground">{batch.substrate}</p>
                  </div>
                  <Badge className={getContaminationColor(batch.contaminationRisk)}>
                    {batch.contaminationRisk} risk
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    {getPhaseIcon(batch.currentPhase)}
                    <span>{batch.currentPhase}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ThermometerSun className="h-4 w-4" />
                    <span>{batch.temperature}°F • {batch.humidity}% RH</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>{batch.expectedYield}kg expected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Day {Math.floor((Date.now() - new Date(batch.inoculationDate).getTime()) / (1000 * 60 * 60 * 24))}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{batch.progress}%</span>
                  </div>
                  <Progress value={batch.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* OKRs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {okrs.map((okr) => (
          <Card key={okr.period}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                {okr.period}-Day OKRs
              </CardTitle>
              <CardDescription>{okr.objective}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {okr.keyResults.map((kr, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{kr.metric}</span>
                      <span>{kr.current}{kr.unit} / {kr.target}{kr.unit}</span>
                    </div>
                    <Progress 
                      value={(kr.current / kr.target) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common dashboard operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              Generate Report
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Check Alerts
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Yield Forecast
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Schedule Batch
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
