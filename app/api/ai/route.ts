import { NextRequest, NextResponse } from 'next/server'

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

// Model Registry - Add your custom models here
const MODEL_REGISTRY = {
  'default': {
    name: 'Default Model',
    endpoint: process.env.DEFAULT_AI_ENDPOINT,
    apiKey: process.env.DEFAULT_AI_API_KEY,
  },
  'custom-llm': {
    name: 'Custom LLM',
    endpoint: process.env.CUSTOM_LLM_ENDPOINT,
    apiKey: process.env.CUSTOM_LLM_API_KEY,
  },
  'local-model': {
    name: 'Local Model',
    endpoint: process.env.LOCAL_MODEL_ENDPOINT || 'http://localhost:8000',
    apiKey: process.env.LOCAL_MODEL_API_KEY,
  },
  // Add more models as needed
}

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json()
    const { prompt, model = 'default', temperature = 0.7, max_tokens = 2048, system_prompt } = body

    // Validate model
    const modelConfig = MODEL_REGISTRY[model as keyof typeof MODEL_REGISTRY]
    if (!modelConfig) {
      return NextResponse.json(
        { error: 'Invalid model specified' },
        { status: 400 }
      )
    }

    // Prepare the request based on your AI model's API format
    // This is a generic example - adjust based on your specific model
    const aiRequest = {
      messages: [
        {
          role: 'system',
          content: system_prompt || 'You are an expert mycology assistant with deep knowledge of fungal biotechnology, substrate optimization, and cultivation techniques.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: model,
      temperature: temperature,
      max_tokens: max_tokens,
    }

    // Call your AI model
    // Example for OpenAI-compatible APIs:
    if (modelConfig.endpoint) {
      const response = await fetch(modelConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${modelConfig.apiKey}`,
        },
        body: JSON.stringify(aiRequest),
      })

      if (!response.ok) {
        throw new Error(`AI model error: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Format response based on your model's output
      const aiResponse: AIResponse = {
        response: data.choices?.[0]?.message?.content || data.response || 'No response generated',
        model: modelConfig.name,
        usage: data.usage,
      }

      return NextResponse.json(aiResponse)
    }

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