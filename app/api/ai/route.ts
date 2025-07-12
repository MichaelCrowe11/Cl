import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { qfolAnalyzer } from '@/lib/qfol'

// AI Model Configuration Types
interface AIRequest {
  prompt: string
  model?: string
  temperature?: number
  max_tokens?: number
  system_prompt?: string
}

interface AIResponse {
  response: string
  model: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// Model Registry - OpenAI and Anthropic models
const MODEL_REGISTRY = {
  // OpenAI Models
  'gpt-4': {
    name: 'GPT-4',
    endpoint: process.env.OPENAI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
    apiKey: process.env.OPENAI_API_KEY,
    type: 'openai',
  },
  'gpt-4-turbo': {
    name: 'GPT-4 Turbo',
    endpoint: process.env.OPENAI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
    apiKey: process.env.OPENAI_API_KEY,
    type: 'openai',
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    endpoint: process.env.OPENAI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
    apiKey: process.env.OPENAI_API_KEY,
    type: 'openai',
  },
  // Anthropic Claude Models (Latest)
  'claude-3-5-sonnet-20241022': {
    name: 'Claude 3.5 Sonnet',
    endpoint: process.env.ANTHROPIC_API_ENDPOINT || 'https://api.anthropic.com/v1/messages',
    apiKey: process.env.ANTHROPIC_API_KEY,
    type: 'anthropic',
  },
  'claude-3-5-haiku-20241022': {
    name: 'Claude 3.5 Haiku',
    endpoint: process.env.ANTHROPIC_API_ENDPOINT || 'https://api.anthropic.com/v1/messages',
    apiKey: process.env.ANTHROPIC_API_KEY,
    type: 'anthropic',
  },
  // Default fallback
  'default': {
    name: 'Default Model',
    endpoint: process.env.DEFAULT_AI_ENDPOINT,
    apiKey: process.env.DEFAULT_AI_API_KEY,
    type: 'openai',
  },
}

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const sessionId = request.headers.get('x-session-id') || `session_${Date.now()}`
  
  try {
    const body: AIRequest = await request.json()
    const { prompt, model = 'gpt-4', temperature = 0.3, max_tokens = 4096, system_prompt } = body

    // Log QFOL query event
    qfolAnalyzer.logEvent({
      type: 'query',
      sessionId,
      data: {
        input: prompt,
        model,
        metadata: { temperature, max_tokens }
      }
    })

    // Check QFOL deployment gate
    const deploymentCheck = qfolAnalyzer.shouldGateDeployment()
    if (deploymentCheck.gate) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable for safety review', reason: deploymentCheck.reason },
        { status: 503 }
      )
    }

    // Validate model
    const modelConfig = MODEL_REGISTRY[model as keyof typeof MODEL_REGISTRY]
    if (!modelConfig) {
      return NextResponse.json(
        { error: 'Invalid model specified' },
        { status: 400 }
      )
    }

    // Enhanced mycology system prompt with safety warnings
    const systemPrompt = system_prompt || `You are an expert mycologist and AI assistant specializing in mushroom cultivation, identification, and research. You have deep knowledge of:

- Mushroom cultivation techniques and substrates
- Species identification and characteristics  
- Growing conditions and environmental factors
- Contamination prevention and treatment
- Harvesting and post-harvest handling
- Commercial and home cultivation methods
- Medicinal and culinary mushroom properties

IMPORTANT SAFETY GUIDELINES:
- Always include safety warnings for potentially toxic species
- Recommend consulting experts for wild mushroom identification
- Emphasize proper sterilization and contamination prevention
- Include disclaimers about medical claims
- Prioritize food safety in all recommendations

Provide accurate, practical, and safety-conscious advice with clear explanations and citations when possible.`

    // Call AI model using proper SDKs
    let responseContent: string
    let usage: any

    if (modelConfig.type === 'anthropic') {
      const completion = await anthropic.messages.create({
        model: model,
        max_tokens: max_tokens,
        temperature: temperature,
        messages: [{ role: 'user', content: prompt }],
        system: systemPrompt
      })

      responseContent = completion.content[0]?.type === 'text' ? completion.content[0].text : 'No response generated'
      usage = {
        prompt_tokens: completion.usage.input_tokens,
        completion_tokens: completion.usage.output_tokens,
        total_tokens: completion.usage.input_tokens + completion.usage.output_tokens,
      }
    } else {
      // OpenAI
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: temperature,
        max_tokens: max_tokens,
      })

      responseContent = completion.choices[0]?.message?.content || 'No response generated'
      usage = completion.usage
    }

    const responseTime = Date.now() - startTime

    // Log QFOL response event
    qfolAnalyzer.logEvent({
      type: 'response',
      sessionId,
      data: {
        input: prompt,
        output: responseContent,
        model,
        tokensUsed: usage?.total_tokens,
        responseTime
      }
    })

    const aiResponse: AIResponse = {
      response: responseContent,
      model: modelConfig.name,
      usage: usage,
    }

    return NextResponse.json(aiResponse)

    // Fallback for development/testing
    const mockResponse: AIResponse = {
      response: `[${modelConfig.name}] Processing: "${prompt}"\n\nThis is a placeholder response. Configure your AI model endpoint in the environment variables.`,
      model: modelConfig.name,
      usage: {
        prompt_tokens: prompt.length,
        completion_tokens: 100,
        total_tokens: prompt.length + 100,
      }
    }

    return NextResponse.json(mockResponse)

  } catch (error) {
    console.error('AI API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    )
  }
}

// Optional: Add GET endpoint for model information
export async function GET() {
  const models = Object.entries(MODEL_REGISTRY).map(([key, config]) => ({
    id: key,
    name: config.name,
    available: !!config.endpoint,
  }))

  return NextResponse.json({ models })
} 