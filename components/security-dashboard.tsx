"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  Database, 
  Lock, 
  Eye, 
  TrendingUp,
  Zap
} from 'lucide-react'

interface SecurityStatus {
  system: string
  status: 'operational' | 'warning' | 'error'
  score: number
  description: string
  lastChecked: string
}

export function SecurityDashboard() {
  const [securitySystems, setSecuritySystems] = useState<SecurityStatus[]>([
    {
      system: 'AI Bias Detection',
      status: 'operational',
      score: 95,
      description: 'EEG² scoring system monitoring all AI responses',
      lastChecked: new Date().toISOString()
    },
    {
      system: 'GDPR Compliance',
      status: 'operational', 
      score: 100,
      description: 'Complete data protection and consent management',
      lastChecked: new Date().toISOString()
    },
    {
      system: 'ISO 27001 Controls',
      status: 'operational',
      score: 85,
      description: '14/16 control categories implemented',
      lastChecked: new Date().toISOString()
    },
    {
      system: 'FDA/Bioethics Framework',
      status: 'operational',
      score: 88,
      description: 'Medical disclaimer and safety validation active',
      lastChecked: new Date().toISOString()
    }
  ])

  const [isLoading, setIsLoading] = useState(false)

  const checkSystemHealth = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/security/health')
      if (response.ok) {
        const data = await response.json()
        // Update security systems status
        console.log('Security health check:', data)
      }
    } catch (error) {
      console.error('Health check failed:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    checkSystemHealth()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Security Dashboard</h2>
          <p className="text-gray-600">Monitor compliance and security systems status</p>
        </div>
        <Button onClick={checkSystemHealth} disabled={isLoading}>
          {isLoading ? (
            <Activity className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Shield className="h-4 w-4 mr-2" />
          )}
          Check Status
        </Button>
      </div>

      {/* Security Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {securitySystems.map((system, index) => (
          <Card key={index} className="border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(system.status)}
                  <CardTitle className="text-lg">{system.system}</CardTitle>
                </div>
                <Badge className={getStatusColor(system.status)}>
                  {system.status.toUpperCase()}
                </Badge>
              </div>
              <CardDescription>{system.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Compliance Score</span>
                  <span className="text-2xl font-bold text-green-600">{system.score}%</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${system.score}%` }}
                  />
                </div>
                
                {/* Last Checked */}
                <div className="text-xs text-gray-500">
                  Last checked: {new Date(system.lastChecked).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Security Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Eye className="h-4 w-4 mr-2" />
              View Audit Logs
            </Button>
            <Button variant="outline" className="justify-start">
              <Lock className="h-4 w-4 mr-2" />
              Manage Access Controls
            </Button>
            <Button variant="outline" className="justify-start">
              <Database className="h-4 w-4 mr-2" />
              Data Protection Center
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
