'use client'

import React, { useState, useEffect } from 'react'
import { UnifiedChatInterface } from '@/components/unified-chat-interface'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { 
  MessageSquare, 
  Code, 
  BarChart3, 
  FlaskConical,
  Activity,
  Database,
  Brain,
  FileCode,
  Shield,
  Settings,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Beaker
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface DashboardMetric {
  label: string
  value: string | number
  change?: number
  status?: 'success' | 'warning' | 'error'
  icon: React.ElementType
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeProjects, setActiveProjects] = useState(3)
  const [mlJobsCompleted, setMlJobsCompleted] = useState(42)
  const [storageUsed, setStorageUsed] = useState(65)

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  const metrics: DashboardMetric[] = [
    {
      label: 'Active Projects',
      value: activeProjects,
      change: 12,
      status: 'success',
      icon: FlaskConical
    },
    {
      label: 'ML Jobs Today',
      value: mlJobsCompleted,
      change: 8,
      status: 'success',
      icon: Brain
    },
    {
      label: 'Storage Used',
      value: `${storageUsed}%`,
      change: 5,
      status: storageUsed > 80 ? 'warning' : 'success',
      icon: Database
    },
    {
      label: 'System Health',
      value: 'Optimal',
      status: 'success',
      icon: Activity
    }
  ]

  const quickActions = [
    {
      title: 'New Yield Prediction',
      description: 'Calculate expected mushroom yields',
      icon: BarChart3,
      href: '#',
      color: 'text-blue-500'
    },
    {
      title: 'Substrate Calculator',
      description: 'Optimize substrate mixtures',
      icon: Beaker,
      href: '#',
      color: 'text-green-500'
    },
    {
      title: 'Contamination Check',
      description: 'Analyze contamination risks',
      icon: AlertTriangle,
      href: '#',
      color: 'text-orange-500'
    },
    {
      title: 'Open IDE',
      description: 'Code and analyze data',
      icon: Code,
      href: '/ide',
      color: 'text-purple-500'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'prediction',
      title: 'Yield Prediction Completed',
      description: 'Oyster mushrooms - 12.5kg expected',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'analysis',
      title: 'Contamination Risk Low',
      description: 'Lab environment analysis passed',
      time: '4 hours ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'calculation',
      title: 'Substrate Mix Optimized',
      description: 'Shiitake substrate formula updated',
      time: '6 hours ago',
      status: 'success'
    }
  ]

  if (!user) {
    return null // Loading state handled by useEffect redirect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4 md:px-6">
          <h1 className="text-xl font-semibold">Crowe Logic AI Dashboard</h1>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Researcher'}
              </h2>
              <p className="text-muted-foreground">
                Here's your mycology research overview for today
              </p>
            </div>
            <Button asChild>
              <Link href="/chat">
                Start New Research
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.label}
                  </CardTitle>
                  <metric.icon className={cn(
                    "h-4 w-4",
                    metric.status === 'success' && "text-green-500",
                    metric.status === 'warning' && "text-yellow-500",
                    metric.status === 'error' && "text-red-500"
                  )} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  {metric.change && (
                    <p className={cn(
                      "text-xs flex items-center gap-1",
                      metric.change > 0 ? "text-green-500" : "text-red-500"
                    )}>
                      <TrendingUp className="h-3 w-3" />
                      {metric.change > 0 ? '+' : ''}{metric.change}% from last week
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="chat" className="flex-1">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chat" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                AI Chat
              </TabsTrigger>
              <TabsTrigger value="tools" className="gap-2">
                <FlaskConical className="h-4 w-4" />
                ML Tools
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-2">
                <Activity className="h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="mt-6">
              <Card className="h-[600px]">
                <UnifiedChatInterface />
              </Card>
            </TabsContent>

            {/* ML Tools Tab */}
            <TabsContent value="tools" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {quickActions.map((action, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href={action.href}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg bg-muted", action.color)}>
                              <action.icon className="h-6 w-6" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{action.title}</CardTitle>
                              <CardDescription>{action.description}</CardDescription>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardHeader>
                    </Link>
                  </Card>
                ))}
              </div>

              {/* Recent ML Jobs */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent ML Jobs</CardTitle>
                  <CardDescription>Your latest machine learning analyses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Yield Prediction - Oyster', progress: 100, status: 'completed' },
                      { name: 'Substrate Optimization', progress: 100, status: 'completed' },
                      { name: 'Vision Analysis - Batch 42', progress: 75, status: 'running' },
                      { name: 'Contamination Risk Assessment', progress: 100, status: 'completed' }
                    ].map((job, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{job.name}</span>
                          <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                            {job.status}
                          </Badge>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your research activity timeline</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                        <div className={cn(
                          "p-2 rounded-full",
                          activity.status === 'success' ? "bg-green-100 dark:bg-green-900" : "bg-orange-100 dark:bg-orange-900"
                        )}>
                          {activity.status === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Encryption</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">2FA Status</span>
                        <Badge variant="secondary">Not Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Last Login</span>
                        <span className="text-sm text-muted-foreground">2 hours ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Data Privacy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">GDPR Compliance</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Data Retention</span>
                        <span className="text-sm text-muted-foreground">90 days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Backup Status</span>
                        <Badge variant="default">Daily</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Quick Security Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button variant="outline" size="sm">Enable 2FA</Button>
                  <Button variant="outline" size="sm">Download Data</Button>
                  <Button variant="outline" size="sm">View Audit Log</Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/security">
                      Full Security Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        {/* Right Sidebar - Quick Stats */}
        <aside className="hidden xl:block w-80 border-l p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-4">Storage Usage</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Used</span>
                <span>{storageUsed}%</span>
              </div>
              <Progress value={storageUsed} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {(storageUsed * 0.5).toFixed(1)}GB of 50GB used
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">Active Models</h3>
            <div className="space-y-2">
              {['o3', 'GPT-4', 'Claude 3 Opus'].map((model) => (
                <div key={model} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                  <span className="text-sm">{model}</span>
                  <Badge variant="outline" className="text-xs">Active</Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">Quick Links</h3>
            <div className="space-y-1">
              {[
                { label: 'Documentation', href: '/docs' },
                { label: 'API Reference', href: '/api-docs' },
                { label: 'Support', href: '/support' },
                { label: 'Release Notes', href: '/changelog' }
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
