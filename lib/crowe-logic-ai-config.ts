// Crowe Logic AI Configuration
// Central configuration for all AI models and system settings

export const CROWE_LOGIC_AI_CONFIG = {
  identity: {
    name: 'Crowe Logic AI',
    version: '2.0',
    tagline: 'Expert AI in Mycology, Environmental Intelligence & Business Strategy',
    logo: '/crowe-avatar.png',
  },
  
  expertise: [
    'Mycology and Fungal Cultivation',
    'Environmental Intelligence Systems',
    'Business Strategy for Sustainable Operations',
    'Mycelium Network Behaviors',
    'Biotechnology and Bioremediation',
    'Ecological Pattern Recognition',
    'Climate Impact Analysis',
    'Quantum Environmental Modeling',
  ],
  
  systemPrompts: {
    default: `You are Crowe Logic AI, an expert AI in mycology, environmental intelligence and business strategy.`,
    
    mycology: `You are Crowe Logic AI, specializing in mycology and fungal cultivation. You provide expert guidance on:
    - Substrate optimization and formulation
    - Contamination prevention and sterile techniques
    - Species-specific cultivation parameters
    - Yield optimization strategies
    - Commercial-scale production methods`,
    
    environmental: `You are Crowe Logic AI, focusing on environmental intelligence and ecological systems. You analyze:
    - Climate patterns and weather impacts
    - Ecosystem health indicators
    - Biodiversity metrics
    - Environmental risk assessment
    - Sustainable resource management`,
    
    business: `You are Crowe Logic AI, advising on business strategy for sustainable operations. You provide insights on:
    - Market analysis for mycology products
    - Operational efficiency optimization
    - Supply chain sustainability
    - ROI calculations for cultivation systems
    - Strategic growth planning`,
    
    mei_platform: `You are Crowe Logic AI analyzing the Mycelium Ecological Intelligence (MEI) platform. 
    You understand the integration of WeatherHub, EcoMesh, CroweOS Link, QuantumNexusAI, and Biome Nodes.
    Provide insights on system optimization, ecological impact, and strategic implementation.`,
  },
  
  modelPreferences: {
    complex_analysis: 'claude-3-opus',
    quick_responses: 'claude-3-haiku',
    balanced_tasks: 'claude-3-sonnet',
    creative_work: 'claude-3-opus',
    cost_effective: 'claude-3-haiku',
  },
  
  responseSettings: {
    defaultTemperature: 0.3,     // Lower default for accuracy
    scientificTemperature: 0.2,  // Very low for maximum factual accuracy
    creativeTemperature: 0.7,    // Moderate for creative but grounded solutions
    defaultMaxTokens: 4096,
    detailedMaxTokens: 6144,
    comprehensiveMaxTokens: 8192,
  },
  
  features: {
    thinkingMode: true,           // Show reasoning process
    citations: true,              // Include scientific references
    calculations: true,           // Perform yield/cost calculations
    visualizations: true,         // Generate data visualizations
    multiModal: true,            // Support image analysis
  },
  
  integrations: {
    mei: {
      modules: ['WeatherHub', 'EcoMesh', 'CroweOS Link', 'QuantumNexusAI', 'Biome Nodes'],
      apis: ['/v2/eco/forecast', '/v2/humanimpact/score', '/v2/climate/scenario'],
      dataInputs: ['Weather APIs', 'Remote Sensing', 'IoT sensors', 'Human Observations'],
    },
    external: {
      weather: ['Tomorrow.io', 'OpenWeatherMap'],
      databases: ['Supabase', 'PostgreSQL'],
      monitoring: ['Datadog', 'Sentry'],
    },
  },
}

// Helper function to select appropriate model based on query
export function selectModelForTask(taskType: string): string {
  const modelMap: Record<string, string> = {
    'analysis': CROWE_LOGIC_AI_CONFIG.modelPreferences.complex_analysis,
    'quick': CROWE_LOGIC_AI_CONFIG.modelPreferences.quick_responses,
    'general': CROWE_LOGIC_AI_CONFIG.modelPreferences.balanced_tasks,
    'creative': CROWE_LOGIC_AI_CONFIG.modelPreferences.creative_work,
    'budget': CROWE_LOGIC_AI_CONFIG.modelPreferences.cost_effective,
  }
  
  return modelMap[taskType] || CROWE_LOGIC_AI_CONFIG.modelPreferences.balanced_tasks
}

// Helper function to get appropriate system prompt
export function getSystemPrompt(domain: keyof typeof CROWE_LOGIC_AI_CONFIG.systemPrompts): string {
  return CROWE_LOGIC_AI_CONFIG.systemPrompts[domain] || CROWE_LOGIC_AI_CONFIG.systemPrompts.default
}

// Helper function to determine temperature based on task
export function getTemperatureSetting(taskType: 'scientific' | 'creative' | 'general' = 'general'): number {
  const settings = CROWE_LOGIC_AI_CONFIG.responseSettings
  
  switch (taskType) {
    case 'scientific':
      return settings.scientificTemperature
    case 'creative':
      return settings.creativeTemperature
    default:
      return settings.defaultTemperature
  }
}

// Export for use across the platform
export default CROWE_LOGIC_AI_CONFIG 