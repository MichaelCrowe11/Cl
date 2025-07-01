'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { 
  Brain, 
  FlaskConical, 
  TrendingUp, 
  Activity,
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()

  // Mock data - replace with real data from your database
  const stats = [
    {
      title: 'AI Queries',
      value: '1,234',
      change: '+12%',
      trend: 'up',
      icon: Brain,
      color: 'text-purple-600'
    },
    {
      title: 'Active Experiments',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: FlaskConical,
      color: 'text-blue-600'
    },
    {
      title: 'Success Rate',
      value: '94.3%',
      change: '+3.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Yield Average',
      value: '287g/m²',
      change: '+15g',
      trend: 'up',
      icon: Activity,
      color: 'text-orange-600'
    }
  ]

  const recentExperiments = [
    {
      id: '1',
      name: 'Oyster Substrate Optimization',
      status: 'active',
      progress: 65,
      daysRemaining: 12
    },
    {
      id: '2',
      name: 'Lion\'s Mane Temperature Study',
      status: 'active',
      progress: 40,
      daysRemaining: 18
    },
    {
      id: '3',
      name: 'Shiitake Yield Enhancement',
      status: 'completed',
      progress: 100,
      daysRemaining: 0
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your mycology research today.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/experiments/new" className="gap-2">
            <Plus className="h-4 w-4" />
            New Experiment
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>
                {' '}from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Experiments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Experiments</CardTitle>
            <CardDescription>
              Your active and recently completed experiments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExperiments.map((experiment) => (
                <div key={experiment.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{experiment.name}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        experiment.status === 'active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {experiment.status}
                      </span>
                      {experiment.status === 'active' && (
                        <span className="text-xs text-muted-foreground">
                          {experiment.daysRemaining} days remaining
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${experiment.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {experiment.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/dashboard/experiments" className="gap-2">
                View All Experiments
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button variant="outline" className="justify-start gap-3 h-auto p-4" asChild>
                <Link href="/dashboard/chat">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">AI Research Assistant</p>
                    <p className="text-sm text-muted-foreground">
                      Get instant answers to mycology questions
                    </p>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" className="justify-start gap-3 h-auto p-4" asChild>
                <Link href="/dashboard/agent">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Brain className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Coding Agent</p>
                    <p className="text-sm text-muted-foreground">
                      Generate code for your research platform
                    </p>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" className="justify-start gap-3 h-auto p-4" asChild>
                <Link href="/dashboard/analytics">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Analytics Dashboard</p>
                    <p className="text-sm text-muted-foreground">
                      View detailed cultivation metrics
                    </p>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest actions and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-muted rounded-full">
                <Brain className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm">Asked AI: "Optimal pH for oyster mushroom substrate?"</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-muted rounded-full">
                <FlaskConical className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm">Started new experiment: "Temperature optimization study"</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-muted rounded-full">
                <Activity className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm">Recorded yield data: 295g/m² for Batch #42</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 