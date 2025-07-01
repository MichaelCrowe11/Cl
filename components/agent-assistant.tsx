'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Code, Loader2, Sparkles } from 'lucide-react'

export function AgentAssistant() {
  const [task, setTask] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  // Example tasks for quick access
  const exampleTasks = [
    {
      title: 'Database Schema',
      task: 'Create a Supabase schema for tracking mushroom cultivation batches with environmental data'
    },
    {
      title: 'Contamination Detection',
      task: 'Implement a contamination detection algorithm using image analysis'
    },
    {
      title: 'Yield Prediction',
      task: 'Create a yield prediction model based on substrate composition and environmental factors'
    },
    {
      title: 'Authentication',
      task: 'Implement user authentication with role-based access for lab technicians and researchers'
    }
  ]

  const callAgent = async () => {
    if (!task.trim()) return

    setLoading(true)
    setResponse('')

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task,
          context: 'Building the Crowe Logic Platform for mycology research and cultivation management',
          model: 'claude-3-opus-20240229'
        })
      })

      const data = await res.json()
      setResponse(data.content || 'No response generated')
    } catch (error) {
      console.error('Agent error:', error)
      setResponse('Error: Failed to get response from agent')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Crowe Logic Coding Agent
        </CardTitle>
        <CardDescription>
          Specialized AI assistant for implementing mycology platform features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick task buttons */}
        <div className="grid grid-cols-2 gap-2">
          {exampleTasks.map((example) => (
            <Button
              key={example.title}
              variant="outline"
              size="sm"
              onClick={() => setTask(example.task)}
              className="justify-start text-left"
            >
              <Code className="h-4 w-4 mr-2" />
              {example.title}
            </Button>
          ))}
        </div>

        {/* Task input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Describe what you want to build:</label>
          <Textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="E.g., Create a real-time monitoring dashboard for temperature and humidity..."
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Submit button */}
        <Button 
          onClick={callAgent} 
          disabled={loading || !task.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating implementation...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Code
            </>
          )}
        </Button>

        {/* Response display */}
        {response && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Agent Response:</label>
            <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm">{response}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 