// Anthropic Client Wrapper with Advanced Features
// import Anthropic from '@anthropic-ai/sdk'

// Initialize Anthropic client
// const anthropic = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
// })

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
  throw new Error('Anthropic API is no longer supported. Please use Gemini integration.')
}

// Specialized function for MEI platform queries
export async function queryMEIPlatform(platformData: any) {
  throw new Error('Anthropic API is no longer supported. Please use Gemini integration.')
}

// No longer exporting anthropic client