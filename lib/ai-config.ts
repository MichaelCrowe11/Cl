// AI Model Configuration and Integration Helpers

export interface AIModelConfig {
  id: string
  name: string
  description: string
  endpoint?: string
  apiKey?: string
  defaultTemperature?: number
  defaultMaxTokens?: number
  supportedFeatures?: string[]
}

// Define your AI models here
export const AI_MODELS: Record<string, AIModelConfig> = {
  // OpenAI Models
  'gpt-4': {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable OpenAI model for complex reasoning and analysis',
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096,
    supportedFeatures: ['chat', 'completion', 'function-calling', 'vision'],
  },
  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Faster GPT-4 with updated knowledge and lower cost',
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096,
    supportedFeatures: ['chat', 'completion', 'function-calling', 'vision', 'json-mode'],
  },
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient model for most tasks',
    defaultTemperature: 0.7,
    defaultMaxTokens: 2048,
    supportedFeatures: ['chat', 'completion', 'function-calling'],
  },
  // Anthropic Claude Models
  'claude-3-opus': {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Most powerful Claude model for complex analysis and creativity',
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096,
    supportedFeatures: ['chat', 'completion', 'long-context', 'vision'],
  },
  'claude-3-sonnet': {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Balanced Claude model for most tasks',
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096,
    supportedFeatures: ['chat', 'completion', 'long-context', 'vision'],
  },
  'claude-3-haiku': {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Fast and efficient Claude model',
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096,
    supportedFeatures: ['chat', 'completion', 'long-context'],
  },
}

// Helper function to format prompts for mycology context
export function formatMycologyPrompt(userInput: string, context?: any): string {
  const systemContext = `You are an expert mycology assistant with specialized knowledge in:
- Fungal cultivation techniques and substrate optimization
- Contamination prevention and sterile procedures
- Yield prediction and growth parameter optimization
- Species-specific cultivation requirements
- Lab protocols and standard operating procedures
- Biotechnology applications of fungi`

  if (context) {
    return `${systemContext}\n\nAdditional Context: ${JSON.stringify(context)}\n\nUser Query: ${userInput}`
  }

  return `${systemContext}\n\nUser Query: ${userInput}`
}

// Helper to select the best model based on the query type
export function selectModelForQuery(query: string): string {
  const lowerQuery = query.toLowerCase()
  
  // Domain-specific model selection logic
  if (lowerQuery.includes('substrate') || lowerQuery.includes('cultivation') || lowerQuery.includes('contamination')) {
    return 'custom-mycology'
  }
  
  if (lowerQuery.includes('analyze') || lowerQuery.includes('predict') || lowerQuery.includes('calculate')) {
    return 'gpt-4'
  }
  
  // Default to a general model
  return 'gpt-4'
}

// Integration helper for different model APIs
export async function callAIModel(
  modelId: string,
  prompt: string,
  options?: {
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
  }
): Promise<string> {
  const model = AI_MODELS[modelId]
  if (!model) {
    throw new Error(`Model ${modelId} not found`)
  }

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      model: modelId,
      temperature: options?.temperature ?? model.defaultTemperature,
      max_tokens: options?.maxTokens ?? model.defaultMaxTokens,
      system_prompt: options?.systemPrompt,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to get AI response')
  }

  const data = await response.json()
  return data.response
} 