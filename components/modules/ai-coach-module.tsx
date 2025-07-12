import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MessageSquare, 
  Brain, 
  Target, 
  TrendingUp, 
  Lightbulb,
  CheckCircle,
  Calendar,
  Send
} from "lucide-react"

interface CoachingMessage {
  id: string
  type: "motivational" | "operational" | "checkpoint" | "user"
  content: string
  timestamp: string
  priority?: "high" | "medium" | "low"
}

interface WeeklyGoal {
  id: string
  title: string
  description: string
  progress: number
  deadline: string
  priority: "high" | "medium" | "low"
  status: "pending" | "in-progress" | "completed"
}

export default function AICoachModule() {
  const [userInput, setUserInput] = useState("")
  const [messages, setMessages] = useState<CoachingMessage[]>([
    {
      id: "1",
      type: "motivational",
      content: "Good morning! Your contamination rate is at an all-time low of 2.1% - excellent sterile technique work! Today's focus should be on preparing substrates for your upcoming Lion's Mane expansion.",
      timestamp: "2025-07-12 08:00",
      priority: "high"
    },
    {
      id: "2", 
      type: "operational",
      content: "Reminder: Batch CLX-LM-001 will be ready for harvest in 3-4 days based on current growth patterns. Consider preparing your drying equipment and packaging materials.",
      timestamp: "2025-07-12 09:15",
      priority: "medium"
    },
    {
      id: "3",
      type: "checkpoint",
      content: "Weekly Check-in: You've completed 2 of 3 goals this week. Outstanding work on yield optimization! The substrate cost reduction goal needs attention - consider bulk purchasing for better margins.",
      timestamp: "2025-07-12 10:30",
      priority: "medium"
    }
  ])

  const weeklyGoals: WeeklyGoal[] = [
    {
      id: "goal-1",
      title: "Reduce Substrate Costs",
      description: "Negotiate bulk pricing with suppliers to reduce per-unit costs by 15%",
      progress: 25,
      deadline: "2025-07-18",
      priority: "high",
      status: "in-progress"
    },
    {
      id: "goal-2",
      title: "Optimize Fruiting Conditions",
      description: "Fine-tune environmental controls to increase average yield by 5%",
      progress: 100,
      deadline: "2025-07-15",
      priority: "medium",
      status: "completed"
    },
    {
      id: "goal-3",
      title: "Document New SOPs",
      description: "Create standardized procedures for the new substrate mixing process",
      progress: 80,
      deadline: "2025-07-16",
      priority: "medium",
      status: "in-progress"
    }
  ]

  const coachingTips = [
    {
      icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
      title: "Mindset Boost",
      content: "Remember: Every contaminated batch is a learning opportunity. Your current 2.1% rate shows remarkable improvement from last month's 4.3%!"
    },
    {
      icon: <Target className="h-5 w-5 text-blue-500" />,
      title: "Focus Area",
      content: "This week, concentrate on scaling your Lion's Mane production. The market demand is high and your quality is exceptional."
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      title: "Growth Metric",
      content: "Your ROI has increased 23% this month. Consider reinvesting in automated humidity controls for the next phase."
    }
  ]

  const handleSendMessage = () => {
    if (!userInput.trim()) return

    const newMessage: CoachingMessage = {
      id: Date.now().toString(),
      type: "user",
      content: userInput,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
    }

    setMessages([...messages, newMessage])
    setUserInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: CoachingMessage = {
        id: (Date.now() + 1).toString(),
        type: "operational",
        content: "I understand your concern. Based on your current production data, I recommend focusing on temperature consistency during the colonization phase. This typically resolves 80% of yield variance issues.",
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        priority: "medium"
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1500)
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high": return "border-l-red-500 bg-red-50"
      case "medium": return "border-l-yellow-500 bg-yellow-50"
      case "low": return "border-l-green-500 bg-green-50"
      default: return "border-l-blue-500 bg-blue-50"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-100"
      case "in-progress": return "text-blue-600 bg-blue-100"
      case "pending": return "text-gray-600 bg-gray-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">AI Coach</h2>
          <p className="text-muted-foreground">Your personal mycology mentor and growth assistant</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
      </div>

      {/* Coaching Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coachingTips.map((tip, idx) => (
          <Card key={idx} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                {tip.icon}
                <div>
                  <h3 className="font-semibold text-sm">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{tip.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Interface */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Coaching Chat
            </CardTitle>
            <CardDescription>Ask questions or share updates about your operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Messages */}
              <div className="h-80 overflow-y-auto space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`p-3 rounded-lg border-l-4 ${getPriorityColor(message.priority)}`}>
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.type === "user" ? "/placeholder-user.jpg" : "/crowe-avatar.png"} />
                        <AvatarFallback>
                          {message.type === "user" ? "U" : <Brain className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">
                            {message.type === "user" ? "You" : "AI Coach"}
                          </span>
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                        </div>
                        <p className="text-sm mt-1">{message.content}</p>
                        {message.priority && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {message.type} • {message.priority} priority
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Ask about operations, share updates, or request guidance..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[60px]"
                />
                <Button onClick={handleSendMessage} className="px-3">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Weekly Goals
            </CardTitle>
            <CardDescription>Track your progress on key objectives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyGoals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm">{goal.title}</h3>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Due: {goal.deadline}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {goal.priority} priority
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
