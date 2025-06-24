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
  // Anthropic Claude Models
  'claude-3-opus': {
    name: 'Claude 3 Opus',
    endpoint: process.env.ANTHROPIC_API_ENDPOINT || 'https://api.anthropic.com/v1/messages',
    apiKey: process.env.ANTHROPIC_API_KEY,
    type: 'anthropic',
  },
  'claude-3-sonnet': {
    name: 'Claude 3 Sonnet',
    endpoint: process.env.ANTHROPIC_API_ENDPOINT || 'https://api.anthropic.com/v1/messages',
    apiKey: process.env.ANTHROPIC_API_KEY,
    type: 'anthropic',
  },
  'claude-3-haiku': {
    name: 'Claude 3 Haiku',
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

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json()
    const { prompt, model = 'claude-3-opus', temperature = 0.3, max_tokens = 4096, system_prompt } = body

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

    // Call your AI model based on type
    if (modelConfig.endpoint) {
      let response: Response
      let requestBody: any

      if (modelConfig.type === 'anthropic') {
        // Anthropic Claude API format
        requestBody = {
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          system: system_prompt || 'You are an expert mycology assistant with deep knowledge of fungal biotechnology, substrate optimization, and cultivation techniques.',
          max_tokens: max_tokens,
          temperature: temperature,
        }

        response = await fetch(modelConfig.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': modelConfig.apiKey || '',
            'anthropic-version': process.env.ANTHROPIC_API_VERSION || '2023-06-01',
          },
          body: JSON.stringify(requestBody),
        })
      } else {
        // OpenAI API format (default)
        requestBody = aiRequest

        response = await fetch(modelConfig.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${modelConfig.apiKey}`,
            ...(process.env.OPENAI_ORG_ID && { 'OpenAI-Organization': process.env.OPENAI_ORG_ID }),
          },
          body: JSON.stringify(requestBody),
        })
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('AI API Error:', errorData)
        throw new Error(`AI model error: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Format response based on model type
      let responseContent: string
      let usage: any

      if (modelConfig.type === 'anthropic') {
        responseContent = data.content?.[0]?.text || 'No response generated'
        usage = {
          prompt_tokens: data.usage?.input_tokens || 0,
          completion_tokens: data.usage?.output_tokens || 0,
          total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
        }
      } else {
        // OpenAI format
        responseContent = data.choices?.[0]?.message?.content || 'No response generated'
        usage = data.usage
      }

      const aiResponse: AIResponse = {
        response: responseContent,
        model: modelConfig.name,
        usage: usage,
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