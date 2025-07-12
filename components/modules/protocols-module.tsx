import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  BookOpen, 
  Search, 
  Calculator, 
  FileText, 
  Clock, 
  ThermometerSun,
  Droplets,
  Scale,
  PlayCircle,
  CheckCircle
} from "lucide-react"

interface Protocol {
  id: string
  title: string
  category: "substrate" | "inoculation" | "fruiting" | "harvest" | "processing"
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: string
  steps: Array<{
    id: string
    title: string
    description: string
    duration?: string
    temperature?: string
    humidity?: string
    equipment?: string[]
  }>
  tags: string[]
}

interface SubstrateCalculation {
  ingredient: string
  percentage: number
  weight: number
}

export default function ProtocolsModule() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [calculatorBags, setCalculatorBags] = useState(10)
  const [calculatorResults, setCalculatorResults] = useState<SubstrateCalculation[]>([])

  const protocols: Protocol[] = [
    {
      id: "hardwood-substrate",
      title: "Hardwood Sawdust Substrate Preparation",
      category: "substrate",
      difficulty: "intermediate",
      duration: "3-4 hours",
      steps: [
        {
          id: "step-1",
          title: "Ingredient Preparation",
          description: "Combine hardwood sawdust pellets with soy hulls in 70:30 ratio",
          duration: "30 minutes",
          equipment: ["Large mixing container", "Scale", "Measuring cups"]
        },
        {
          id: "step-2", 
          title: "Hydration",
          description: "Add water gradually while mixing until 60-65% moisture content achieved",
          duration: "45 minutes",
          equipment: ["Spray bottle", "Moisture meter"]
        },
        {
          id: "step-3",
          title: "pH Adjustment",
          description: "Test pH and adjust to 6.0-6.5 using lime if necessary",
          duration: "15 minutes",
          equipment: ["pH meter", "Lime (if needed)"]
        },
        {
          id: "step-4",
          title: "Bag Filling",
          description: "Fill sterilization bags with 3-4 lbs of prepared substrate",
          duration: "30 minutes",
          equipment: ["Sterilization bags", "Scale", "Twist ties"]
        },
        {
          id: "step-5",
          title: "Sterilization",
          description: "Pressure cook at 15 PSI for 90 minutes",
          duration: "90 minutes",
          temperature: "250°F",
          equipment: ["Pressure cooker", "Timer"]
        }
      ],
      tags: ["SUBSTRATE", "HARDWOOD", "STERILIZATION", "EQUIPMENT"]
    },
    {
      id: "lions-mane-fruiting",
      title: "Lion's Mane Fruiting Protocol",
      category: "fruiting",
      difficulty: "beginner",
      duration: "14-21 days",
      steps: [
        {
          id: "step-1",
          title: "Initial Fruiting Conditions",
          description: "Move colonized blocks to fruiting chamber with high humidity",
          temperature: "65-75°F",
          humidity: "85-95%",
          equipment: ["Humidity controller", "Thermometer", "Hygrometer"]
        },
        {
          id: "step-2",
          title: "First Flush Initiation",
          description: "Create small cuts in plastic and maintain consistent conditions",
          duration: "3-5 days",
          equipment: ["Sterile knife", "Spray bottle"]
        },
        {
          id: "step-3",
          title: "Pin Formation",
          description: "Monitor for pin formation and adjust humidity if needed",
          duration: "5-7 days",
          temperature: "65-70°F",
          humidity: "90-95%"
        },
        {
          id: "step-4",
          title: "Mushroom Development",
          description: "Allow mushrooms to develop until they reach harvest size",
          duration: "7-10 days",
          temperature: "65-70°F",
          humidity: "85-90%"
        }
      ],
      tags: ["PHASE", "MUSHROOM", "AUTOMATION"]
    }
  ]

  const calculateSubstrate = () => {
    const baseRecipe = [
      { ingredient: "Hardwood Sawdust Pellets", percentage: 70 },
      { ingredient: "Soy Hulls", percentage: 25 },
      { ingredient: "Wheat Bran", percentage: 5 }
    ]

    const weightPerBag = 3.5 // lbs
    const totalWeight = calculatorBags * weightPerBag

    const results = baseRecipe.map(item => ({
      ingredient: item.ingredient,
      percentage: item.percentage,
      weight: (totalWeight * item.percentage) / 100
    }))

    setCalculatorResults(results)
  }

  const filteredProtocols = protocols.filter(protocol => {
    const matchesSearch = protocol.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         protocol.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || protocol.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-600 bg-green-100"
      case "intermediate": return "text-yellow-600 bg-yellow-100"
      case "advanced": return "text-red-600 bg-red-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "substrate": return <Scale className="h-4 w-4" />
      case "inoculation": return <PlayCircle className="h-4 w-4" />
      case "fruiting": return <Droplets className="h-4 w-4" />
      case "harvest": return <CheckCircle className="h-4 w-4" />
      case "processing": return <FileText className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Protocols</h2>
          <p className="text-muted-foreground">Standard Operating Procedures and workflow management</p>
        </div>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Create SOP
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search protocols, tags, or procedures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {["all", "substrate", "inoculation", "fruiting", "harvest", "processing"].map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Protocols List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold">Available Protocols ({filteredProtocols.length})</h3>
          
          {filteredProtocols.map((protocol) => (
            <Card key={protocol.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getCategoryIcon(protocol.category)}
                    <div>
                      <CardTitle className="text-lg">{protocol.title}</CardTitle>
                      <CardDescription className="capitalize">{protocol.category} protocol</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getDifficultyColor(protocol.difficulty)}>
                      {protocol.difficulty}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {protocol.duration}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Steps Preview */}
                  <div>
                    <h4 className="font-medium mb-2">Steps ({protocol.steps.length})</h4>
                    <div className="space-y-2">
                      {protocol.steps.slice(0, 3).map((step, idx) => (
                        <div key={step.id} className="flex items-start space-x-3 text-sm">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-medium">{step.title}</p>
                            <p className="text-muted-foreground">{step.description}</p>
                            {step.duration && (
                              <p className="text-xs text-muted-foreground mt-1">Duration: {step.duration}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      {protocol.steps.length > 3 && (
                        <p className="text-sm text-muted-foreground">+{protocol.steps.length - 3} more steps...</p>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {protocol.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        [{tag}]
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="default" size="sm">
                      <PlayCircle className="h-3 w-3 mr-1" />
                      Start Protocol
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Substrate Calculator */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Substrate Calculator
              </CardTitle>
              <CardDescription>Calculate ingredient amounts for your batch size</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Number of Bags</label>
                  <Input
                    type="number"
                    value={calculatorBags}
                    onChange={(e) => setCalculatorBags(parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                
                <Button onClick={calculateSubstrate} className="w-full">
                  Calculate Amounts
                </Button>

                {calculatorResults.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Recipe for {calculatorBags} bags:</h4>
                    {calculatorResults.map((result, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span>{result.ingredient}</span>
                        <div className="text-right">
                          <div className="font-medium">{result.weight.toFixed(1)} lbs</div>
                          <div className="text-muted-foreground">{result.percentage}%</div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total Weight</span>
                      <span>{(calculatorBags * 3.5).toFixed(1)} lbs</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Environmental Ranges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="flex items-center">
                    <ThermometerSun className="h-3 w-3 mr-2" />
                    Incubation
                  </span>
                  <span>75-80°F</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center">
                    <ThermometerSun className="h-3 w-3 mr-2" />
                    Fruiting
                  </span>
                  <span>65-75°F</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center">
                    <Droplets className="h-3 w-3 mr-2" />
                    Humidity
                  </span>
                  <span>85-95%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
