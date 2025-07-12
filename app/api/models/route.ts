import { NextResponse } from 'next/server'

export interface AIModel {
  id: string
  name: string
  provider: 'openai' | 'anthropic'
  description: string
  capabilities: string[]
  maxTokens: number
  costPer1kTokens: {
    input: number
    output: number
  }
}

const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    description: 'Most capable OpenAI model, excellent for complex reasoning',
    capabilities: ['text', 'analysis', 'coding', 'reasoning'],
    maxTokens: 8192,
    costPer1kTokens: { input: 0.03, output: 0.06 }
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai', 
    description: 'Faster GPT-4 with larger context window',
    capabilities: ['text', 'analysis', 'coding', 'reasoning'],
    maxTokens: 128000,
    costPer1kTokens: { input: 0.01, output: 0.03 }
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    description: 'Most powerful Claude model for complex tasks',
    capabilities: ['text', 'analysis', 'coding', 'reasoning', 'long-context'],
    maxTokens: 200000,
    costPer1kTokens: { input: 0.015, output: 0.075 }
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    description: 'Balanced performance and speed, great for most tasks',
    capabilities: ['text', 'analysis', 'coding', 'reasoning'],
    maxTokens: 200000,
    costPer1kTokens: { input: 0.003, output: 0.015 }
  }
]

export async function GET() {
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY)
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY)

  const availableModels = AVAILABLE_MODELS.filter(model => {
    if (model.provider === 'openai') return hasOpenAI
    if (model.provider === 'anthropic') return hasAnthropic
    return false
  })

  return NextResponse.json({
    models: availableModels,
    configuration: {
      hasOpenAI,
      hasAnthropic,
      defaultModel: process.env.DEFAULT_MODEL || 'claude-3-5-sonnet',
      fallbackModel: process.env.FALLBACK_MODEL || 'gpt-4'
    },
    timestamp: new Date().toISOString()
  })
}
