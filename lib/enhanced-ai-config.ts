// Enhanced AI Configuration with o3/o4-mini Support
// Integrates function calling best practices with existing Crowe Logic AI system

import { CROWE_LOGIC_AI_CONFIG } from './crowe-logic-ai-config'
import { MYCOLOGY_FUNCTIONS } from './o3-function-calling'

export interface EnhancedAIModelConfig {
  id: string
  name: string
  description: string
  endpoint?: string
  apiKey?: string
  defaultTemperature?: number
  defaultMaxTokens?: number
  supportedFeatures?: string[]
  supportsTools?: boolean
  supportsReasoning?: boolean
  type: 'openai' | 'anthropic' | 'openai-responses'
}

// Enhanced model registry with o3/o4-mini support
export const ENHANCED_AI_MODELS: Record<string, EnhancedAIModelConfig> = {
  // New o3/o4-mini models with function calling
  'o3': {
    id: 'o3',
    name: 'OpenAI o3',
    description: 'Most capable reasoning model with advanced function calling for complex mycology analysis',
    endpoint: 'https://api.openai.com/v1/responses',
    defaultTemperature: 0.3, // Lower for scientific accuracy
    defaultMaxTokens: 8192,
    supportedFeatures: ['reasoning', 'function-calling', 'multi-step-planning', 'context-persistence'],
    supportsTools: true,
    supportsReasoning: true,
    type: 'openai-responses'
  },
  'o4-mini': {
    id: 'o4-mini',
    name: 'OpenAI o4-mini',
    description: 'Efficient reasoning model optimized for mycology function calling and environmental analysis',
    endpoint: 'https://api.openai.com/v1/responses',
    defaultTemperature: 0.3,
    defaultMaxTokens: 4096,
    supportedFeatures: ['reasoning', 'function-calling', 'efficient-processing', 'context-persistence'],
    supportsTools: true,
    supportsReasoning: true,
    type: 'openai-responses'
  },
  
  // Existing models (for backward compatibility)
  'gpt-4': {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Traditional GPT-4 for general mycology discussions',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096,
    supportedFeatures: ['chat', 'completion', 'basic-function-calling'],
    supportsTools: false,
    supportsReasoning: false,
    type: 'openai'
  },
  'claude-3-opus': {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Anthropic Claude for comprehensive mycology analysis',
    endpoint: 'https://api.anthropic.com/v1/messages',
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096,
    supportedFeatures: ['chat', 'completion', 'long-context', 'vision'],
    supportsTools: false,
    supportsReasoning: false,
    type: 'anthropic'
  }
}

// Task-specific model selection with o3/o4-mini priority
export function selectEnhancedModelForTask(taskType: string, complexity: 'low' | 'medium' | 'high' = 'medium'): string {
  const taskTypeMap: Record<string, Record<string, string>> = {
    'substrate_analysis': {
      'low': 'o4-mini',
      'medium': 'o4-mini',
      'high': 'o3'
    },
    'environment_monitoring': {
      'low': 'o4-mini',
      'medium': 'o4-mini',
      'high': 'o3'
    },
    'yield_calculation': {
      'low': 'o4-mini',
      'medium': 'o4-mini',
      'high': 'o3'
    },
    'contamination_diagnosis': {
      'low': 'o4-mini',
      'medium': 'o3',
      'high': 'o3'
    },
    'business_analysis': {
      'low': 'o4-mini',
      'medium': 'o3',
      'high': 'o3'
    },
    'general_chat': {
      'low': 'claude-3-haiku',
      'medium': 'claude-3-sonnet',
      'high': 'claude-3-opus'
    }
  }

  return taskTypeMap[taskType]?.[complexity] || 'o4-mini'
}

// Enhanced prompt templates with function calling guidance
export const ENHANCED_PROMPTS = {
  mycology_function_calling: `You are Crowe Logic AI, specializing in mycology with advanced function calling capabilities.

CORE CAPABILITIES:
- Substrate composition analysis and optimization
- Environmental parameter monitoring and adjustment
- Yield prediction and ROI calculations
- Contamination prevention and diagnosis
- Species-specific cultivation guidance

FUNCTION CALLING PROTOCOL:
1. Always check cultivation environment first for any growing-related queries
2. Analyze substrate composition for optimization questions
3. Calculate yields for business/production questions
4. Query weather data for location-based recommendations
5. Provide integrated analysis based on all function results

TOOL USAGE RULES:
- Use functions for data-driven analysis and calculations
- Do not use functions for general mycology education
- Always validate parameters before function calls
- Combine multiple function results for comprehensive recommendations

CRITICAL: Execute all required function calls immediately. Do not promise future calls.`,

  environmental_analysis: `You are Crowe Logic AI, focusing on environmental intelligence with MEI platform integration.

Analyze environmental factors affecting:
- Cultivation facility climate control
- Outdoor growing conditions
- Seasonal planning and optimization
- Weather impact on mushroom production
- Ecosystem health for sustainable operations

Use environmental functions to provide data-driven insights.`,

  business_strategy: `You are Crowe Logic AI, providing business strategy for mycology operations.

Focus on:
- Production scaling and optimization
- Cost analysis and ROI calculations
- Market analysis for mushroom products
- Operational efficiency improvements
- Supply chain optimization

Use calculation functions to support strategic recommendations with concrete data.`
}

// Function calling configuration
export const FUNCTION_CALLING_CONFIG = {
  defaultTools: MYCOLOGY_FUNCTIONS,
  
  domainTools: {
    mycology: MYCOLOGY_FUNCTIONS,
    environmental: MYCOLOGY_FUNCTIONS.filter(f => 
      f.name.includes('environment') || f.name.includes('weather')
    ),
    business: MYCOLOGY_FUNCTIONS.filter(f => 
      f.name.includes('yield') || f.name.includes('calculate')
    )
  },
  
  maxFunctionCalls: 5,
  reasoningPersistence: true,
  strictMode: true,
  
  // Model-specific settings
  modelSettings: {
    'o3': {
      temperature: 0.2, // Very low for maximum accuracy
      maxTokens: 8192,
      reasoningBudget: 10000
    },
    'o4-mini': {
      temperature: 0.3,
      maxTokens: 4096,
      reasoningBudget: 5000
    }
  }
}

// Enhanced helper function for AI calls with function calling
export async function callEnhancedAI(
  message: string,
  options: {
    model?: string
    domain?: 'mycology' | 'environmental' | 'business' | 'general'
    complexity?: 'low' | 'medium' | 'high'
    tools?: any[]
    context?: any
  } = {}
): Promise<any> {
  const {
    model,
    domain = 'mycology',
    complexity = 'medium',
    tools,
    context
  } = options

  // Select appropriate model
  const selectedModel = model || selectEnhancedModelForTask(
    domain === 'general' ? 'general_chat' : `${domain}_analysis`,
    complexity
  )

  const modelConfig = ENHANCED_AI_MODELS[selectedModel]
  if (!modelConfig) {
    throw new Error(`Model ${selectedModel} not found`)
  }

  // Use function calling for o3/o4-mini models
  if (modelConfig.supportsTools) {
    const response = await fetch('/api/ai/o3-route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        model: selectedModel,
        tools: tools || FUNCTION_CALLING_CONFIG.domainTools[domain],
        context,
        domain
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get enhanced AI response')
    }

    return await response.json()
  } else {
    // Fallback to traditional chat for non-function-calling models
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: message,
        model: selectedModel,
        temperature: modelConfig.defaultTemperature,
        max_tokens: modelConfig.defaultMaxTokens,
        system_prompt: ENHANCED_PROMPTS[`${domain}_function_calling`] || ENHANCED_PROMPTS.mycology_function_calling
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }

    const data = await response.json()
    return {
      response: data.response,
      model: data.model,
      usage: data.usage,
      toolCalls: [],
      reasoning: null
    }
  }
}

// Integration with existing Crowe Logic AI config
export const INTEGRATED_CROWE_CONFIG = {
  ...CROWE_LOGIC_AI_CONFIG,
  
  // Enhanced model preferences
  modelPreferences: {
    ...CROWE_LOGIC_AI_CONFIG.modelPreferences,
    advanced_analysis: 'o3',
    efficient_analysis: 'o4-mini',
    function_calling: 'o4-mini',
    complex_reasoning: 'o3'
  },
  
  // Enhanced features
  features: {
    ...CROWE_LOGIC_AI_CONFIG.features,
    functionCalling: true,
    reasoningPersistence: true,
    multiStepPlanning: true,
    encryptedContext: true
  },
  
  // Tool integration
  tools: {
    mycology: MYCOLOGY_FUNCTIONS,
    available: MYCOLOGY_FUNCTIONS.map(f => f.name),
    capabilities: [
      'substrate_analysis',
      'environment_monitoring',
      'yield_calculation',
      'weather_integration'
    ]
  }
}

export default {
  ENHANCED_AI_MODELS,
  selectEnhancedModelForTask,
  callEnhancedAI,
  ENHANCED_PROMPTS,
  FUNCTION_CALLING_CONFIG,
  INTEGRATED_CROWE_CONFIG
}