'use client'

import React, { useState } from 'react'
import { FileUpload } from '@/components/file-upload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Image as ImageIcon,
  Brain,
  Loader2,
  CheckCircle,
  AlertTriangle,
  BarChart,
  Eye,
  Microscope
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface AnalysisResult {
  species?: {
    name: string
    confidence: number
    alternatives: Array<{ name: string; confidence: number }>
  }
  growth?: {
    stage: string
    estimated_area: number
    health_score: number
  }
  recommendations?: string[]
  timestamp: string
}

export default function VisionAnalysisPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  const handleFileUpload = async (file: File) => {
    setError(null)
    setSelectedImage(URL.createObjectURL(file))
    setIsAnalyzing(true)
    
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('image', file)
      formData.append('analysis_type', 'comprehensive')
      
      // In production, this would upload to your storage and call ML API
      // For now, we'll simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock analysis results (in production, call your ML API)
      const mockResults: AnalysisResult = {
        species: {
          name: 'Pleurotus ostreatus (Oyster Mushroom)',
          confidence: 0.92,
          alternatives: [
            { name: 'Pleurotus pulmonarius', confidence: 0.06 },
            { name: 'Pleurotus citrinopileatus', confidence: 0.02 }
          ]
        },
        growth: {
          stage: 'Mature - Ready for harvest',
          estimated_area: 145.7,
          health_score: 0.88
        },
        recommendations: [
          'Optimal harvest window in next 24-48 hours',
          'Maintain humidity at 85-90% for best quality',
          'Check for spore release to avoid over-maturity'
        ],
        timestamp: new Date().toISOString()
      }
      
      setAnalysisResults(mockResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const runMLAnalysis = async () => {
    if (!selectedImage) return
    
    setIsAnalyzing(true)
    setError(null)
    
    try {
      // Call your ML API endpoint
      const response = await fetch('/api/ml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: 'vision-analysis',
          parameters: {
            image_path: selectedImage,
            analysis_type: 'species_identification'
          }
        })
      })
      
      if (!response.ok) {
        throw new Error('Vision analysis failed')
      }
      
      const data = await response.json()
      setAnalysisResults(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Vision Analysis</h1>
        <p className="text-muted-foreground">
          Upload mushroom images for AI-powered species identification and growth analysis
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Image Upload
              </CardTitle>
              <CardDescription>
                Upload clear images of mushrooms for best results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload 
                onUpload={handleFileUpload}
                accept={{
                  'image/*': ['.png', '.jpg', '.jpeg', '.webp']
                }}
                maxSize={20 * 1024 * 1024} // 20MB
              />
              
              {selectedImage && (
                <div className="mt-4">
                  <img
                    src={selectedImage}
                    alt="Selected mushroom"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {isAnalyzing && (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Analyzing image with AI models...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {analysisResults && !isAnalyzing && (
            <Tabs defaultValue="species" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="species">
                  <Microscope className="h-4 w-4 mr-2" />
                  Species
                </TabsTrigger>
                <TabsTrigger value="growth">
                  <BarChart className="h-4 w-4 mr-2" />
                  Growth
                </TabsTrigger>
                <TabsTrigger value="insights">
                  <Brain className="h-4 w-4 mr-2" />
                  Insights
                </TabsTrigger>
              </TabsList>

              <TabsContent value="species">
                <Card>
                  <CardHeader>
                    <CardTitle>Species Identification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysisResults.species && (
                      <>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            {analysisResults.species.name}
                          </h3>
                          <Badge variant="default">
                            {(analysisResults.species.confidence * 100).toFixed(0)}% confident
                          </Badge>
                        </div>
                        
                        {analysisResults.species.alternatives.length > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Alternative possibilities:
                            </p>
                            <div className="space-y-1">
                              {analysisResults.species.alternatives.map((alt, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                  <span>{alt.name}</span>
                                  <span className="text-muted-foreground">
                                    {(alt.confidence * 100).toFixed(0)}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="growth">
                <Card>
                  <CardHeader>
                    <CardTitle>Growth Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysisResults.growth && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Growth Stage</p>
                            <p className="font-medium">{analysisResults.growth.stage}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Estimated Area</p>
                            <p className="font-medium">{analysisResults.growth.estimated_area.toFixed(1)} cm²</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Health Score</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${analysisResults.growth.health_score * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {(analysisResults.growth.health_score * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysisResults.recommendations && (
                      <div className="space-y-2">
                        {analysisResults.recommendations.map((rec, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <p className="text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {!selectedImage && !isAnalyzing && (
            <Card className="border-dashed">
              <CardContent className="py-12">
                <div className="flex flex-col items-center gap-4 text-center">
                  <Eye className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold">No image selected</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload an image to begin analysis
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 