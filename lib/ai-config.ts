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
  'gpt-4': {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'OpenAI GPT-4 model for advanced reasoning',
    defaultTemperature: 0.7,
    defaultMaxTokens: 2048,
    supportedFeatures: ['chat', 'completion', 'function-calling'],
  },
  'claude-3': {
    id: 'claude-3',
    name: 'Claude 3',
    description: 'Anthropic Claude 3 for detailed analysis',
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096,
    supportedFeatures: ['chat', 'completion', 'long-context'],
  },
  'llama-2': {
    id: 'llama-2',
    name: 'Llama 2',
    description: 'Meta Llama 2 for local deployment',
    defaultTemperature: 0.8,
    defaultMaxTokens: 2048,
    supportedFeatures: ['chat', 'completion'],
  },
  'custom-mycology': {
    id: 'custom-mycology',
    name: 'Mycology Expert',
    description: 'Custom fine-tuned model for mycology expertise',
    defaultTemperature: 0.6,
    defaultMaxTokens: 2048,
    supportedFeatures: ['chat', 'completion', 'domain-specific'],
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