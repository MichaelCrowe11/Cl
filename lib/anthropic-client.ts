// Anthropic Client Wrapper with Advanced Features
import Anthropic from '@anthropic-ai/sdk'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface AnthropicMessage {
  role: 'user' | 'assistant'
  content: string | Array<{
    type: 'text' | 'image'
    text?: string
    source?: {
      type: 'base64'
      media_type: string
      data: string
    }
  }>
}

export interface AnthropicOptions {
  model?: string
  maxTokens?: number
  temperature?: number
  systemPrompt?: string
  thinkingMode?: {
    enabled: boolean
    budgetTokens?: number
  }
}

// Default system prompt for Crowe Logic AI
const DEFAULT_SYSTEM_PROMPT = `You are Crowe Logic AI, an expert AI in mycology, environmental intelligence and business strategy. 
You have deep knowledge of:
- Fungal cultivation techniques and optimization
- Environmental systems and ecological intelligence  
- Business strategy for sustainable operations
- Mycelium network behaviors and applications
- Biotechnology and bioremediation
- Mycelium Ecological Intelligence (MEI) platform architecture
- Quantum-augmented environmental modeling
- Distributed biome intelligence networks

You provide detailed, scientifically accurate, and actionable insights tailored for mycology labs, environmental monitoring, and sustainable business operations.`

export async function createAnthropicMessage(
  messages: AnthropicMessage[],
  options: AnthropicOptions = {}
) {
  const {
    model = 'claude-3-opus-20240229', // Current Opus model
    maxTokens = 4096,
    temperature = 0.7,
    systemPrompt = DEFAULT_SYSTEM_PROMPT,
    thinkingMode = { enabled: false }
  } = options

  try {
    // For future thinking mode support (when available)
    const requestBody: any = {
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages,
    }

    // Add thinking mode if supported (future feature)
    if (thinkingMode.enabled) {
      requestBody.thinking = {
        type: 'enabled',
        budget_tokens: thinkingMode.budgetTokens || 5000
      }
    }

    const message = await anthropic.messages.create(requestBody)

    return {
      content: message.content[0].text,
      usage: message.usage,
      model: message.model,
      thinking: message.thinking || null, // Future feature
    }
  } catch (error) {
    console.error('Anthropic API Error:', error)
    throw error
  }
}

// Specialized function for MEI platform queries
export async function queryMEIPlatform(platformData: any) {
  const messages: AnthropicMessage[] = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: JSON.stringify(platformData, null, 2)
        }
      ]
    }
  ]

  return createAnthropicMessage(messages, {
    model: 'claude-3-opus-20240229',
    maxTokens: 8192,
    temperature: 0.8,
    systemPrompt: `You are Crowe Logic AI analyzing the Mycelium Ecological Intelligence (MEI) platform. 
    Provide insights on:
    1. System architecture optimization
    2. Integration opportunities
    3. Ecological impact potential
    4. Business strategy recommendations
    5. Technical implementation guidance`,
    thinkingMode: {
      enabled: true,
      budgetTokens: 10000
    }
  })
}

// Export for use in API routes
export { anthropic } 