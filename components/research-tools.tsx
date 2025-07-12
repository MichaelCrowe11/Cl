"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Microscope, 
  Search, 
  FileText, 
  Database, 
  Download, 
  BookOpen, 
  FlaskConical,
  BarChart3,
  Leaf,
  Activity
} from 'lucide-react'

interface ResearchTool {
  id: string
  name: string
  description: string
  icon: React.ElementType
  category: 'identification' | 'protocols' | 'analysis' | 'environment'
}

const RESEARCH_TOOLS: ResearchTool[] = [
  {
    id: 'species-id',
    name: 'Species Identification',
    description: 'AI-powered mushroom and fungi identification using morphological characteristics',
    icon: Microscope,
    category: 'identification'
  },
  {
    id: 'literature-search',
    name: 'Literature Search',
    description: 'Search and analyze mycological research papers and publications',
    icon: Search,
    category: 'analysis'
  },
  {
    id: 'protocol-generator',
    name: 'Protocol Generator',
    description: 'Generate standardized cultivation and experimental protocols',
    icon: FileText,
    category: 'protocols'
  },
  {
    id: 'substrate-calculator',
    name: 'Substrate Calculator',
    description: 'Calculate optimal substrate compositions and nutritional requirements',
    icon: FlaskConical,
    category: 'protocols'
  },
  {
    id: 'yield-optimizer',
    name: 'Yield Optimizer',
    description: 'Analyze and optimize growing conditions for maximum yield',
    icon: BarChart3,
    category: 'analysis'
  },
  {
    id: 'environmental-impact',
    name: 'Environmental Impact Assessment',
    description: 'Evaluate mycoremediation potential and ecological applications',
    icon: Leaf,
    category: 'environment'
  }
]

export function ResearchTools() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId)
    setResults([])
  }

  const handleSearch = async () => {
    if (!searchQuery.trim() || !selectedTool) return
    
    setIsLoading(true)
    try {
      // Simulate research tool API call
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: selectedTool,
          query: searchQuery
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
      }
    } catch (error) {
      console.error('Research tool error:', error)
      // Show sample results for demo
      setResults([
        {
          title: 'Sample Research Result',
          description: 'This is a demonstration of the research tools interface. In production, this would show real research data.',
          confidence: 85,
          category: 'identification'
        }
      ])
    }
    setIsLoading(false)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'identification': return 'border-l-blue-500'
      case 'protocols': return 'border-l-green-500'
      case 'analysis': return 'border-l-purple-500'
      case 'environment': return 'border-l-emerald-500'
      default: return 'border-l-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Research Tools</h2>
        <p className="text-gray-600">Advanced AI-powered tools for mycological research and analysis</p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {RESEARCH_TOOLS.map((tool) => {
          const Icon = tool.icon
          const isSelected = selectedTool === tool.id
          return (
            <Card 
              key={tool.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${getCategoryColor(tool.category)} ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleToolSelect(tool.id)}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                  </div>
                </div>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      {/* Research Interface */}
      {selectedTool && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>{RESEARCH_TOOLS.find(t => t.id === selectedTool)?.name}</span>
            </CardTitle>
            <CardDescription>
              Enter your research query or parameters below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter your research query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <Activity className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Results</h4>
                {results.map((result, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <h5 className="font-medium text-gray-900">{result.title}</h5>
                    <p className="text-gray-600 text-sm mt-1">{result.description}</p>
                    {result.confidence && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Confidence:</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{result.confidence}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
