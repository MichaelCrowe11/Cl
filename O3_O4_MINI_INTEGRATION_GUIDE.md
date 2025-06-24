# Crowe Logic AI: o3/o4-mini Integration Guide

## Overview
This guide outlines how to integrate OpenAI's o3/o4-mini function calling best practices into your existing Crowe Logic AI system for enhanced mycology and environmental intelligence capabilities.

## Current Implementation Analysis

### What You Have Now
- Traditional chat completion endpoints (OpenAI/Anthropic)
- Specialized mycology and environmental system prompts
- Model selection based on task complexity
- Domain-specific configuration for MEI platform

### What You're Missing
- o3/o4-mini models with native function calling
- Responses API with reasoning persistence
- Structured tool definitions
- Function calling best practices implementation

## Implementation Strategy

### 1. Add o3/o4-mini Models to Your Registry

```typescript
// Add to app/api/ai/route.ts MODEL_REGISTRY
'o3': {
  name: 'OpenAI o3',
  endpoint: 'https://api.openai.com/v1/responses',
  apiKey: process.env.OPENAI_API_KEY,
  type: 'openai-responses',
  supportsTools: true,
},
'o4-mini': {
  name: 'OpenAI o4-mini',
  endpoint: 'https://api.openai.com/v1/responses',
  apiKey: process.env.OPENAI_API_KEY,
  type: 'openai-responses',
  supportsTools: true,
},
```

### 2. Function Definitions for Mycology Domain

Based on your Crowe Logic AI specialization, here are recommended function definitions:

#### Substrate Analysis Function
```typescript
const substrateAnalysisFunction = {
  type: "function",
  name: "analyze_substrate_composition",
  description: "Analyzes substrate composition for optimal fungal cultivation. Use when users ask about substrate optimization, contamination prevention, or yield improvement. Always check environmental conditions first using check_cultivation_environment before making substrate recommendations.",
  parameters: {
    type: "object",
    properties: {
      substrate_type: {
        type: "string",
        enum: ["straw", "sawdust", "coffee_grounds", "coco_coir", "vermiculite", "perlite", "custom"],
        description: "Primary substrate material"
      },
      moisture_content: {
        type: "number",
        minimum: 0,
        maximum: 100,
        description: "Moisture percentage (0-100%)"
      },
      ph_level: {
        type: "number",
        minimum: 0,
        maximum: 14,
        description: "pH level of substrate"
      },
      target_species: {
        type: "string",
        description: "Mushroom species to cultivate (e.g., oyster, shiitake, lion's mane)"
      }
    },
    required: ["substrate_type", "target_species"],
    additionalProperties: false
  },
  strict: true
}
```

#### Environmental Monitoring Function
```typescript
const environmentalMonitoringFunction = {
  type: "function",
  name: "check_cultivation_environment",
  description: "Monitors cultivation environment parameters for optimal growth conditions. Use when analyzing growing conditions, troubleshooting contamination, or optimizing yield. Essential prerequisite before substrate analysis.",
  parameters: {
    type: "object",
    properties: {
      temperature: {
        type: "number",
        description: "Temperature in Celsius"
      },
      humidity: {
        type: "number",
        minimum: 0,
        maximum: 100,
        description: "Relative humidity percentage"
      },
      co2_level: {
        type: "number",
        description: "CO2 concentration in ppm"
      },
      airflow_rate: {
        type: "number",
        description: "Air changes per hour"
      },
      light_exposure: {
        type: "string",
        enum: ["none", "low", "medium", "high"],
        description: "Light exposure level"
      }
    },
    required: ["temperature", "humidity"],
    additionalProperties: false
  },
  strict: true
}
```

### 3. Enhanced Developer Prompts

Based on your Crowe Logic AI configuration, here's an enhanced developer prompt following o3/o4-mini best practices:

```typescript
const enhancedSystemPrompt = `You are Crowe Logic AI, an expert in mycology, environmental intelligence, and business strategy.

As a mycology expert, you can help users:
- Analyze and optimize substrate compositions for specific mushroom species
- Monitor and adjust cultivation environment parameters
- Diagnose contamination issues and recommend prevention strategies
- Calculate yield predictions and ROI for cultivation operations
- Provide species-specific cultivation guidance

FUNCTION CALL ORDERING:
Always follow this sequence for cultivation optimization:
1. Check cultivation environment first: use check_cultivation_environment
2. Analyze substrate composition: use analyze_substrate_composition
3. Provide integrated recommendations based on both results

TOOL USAGE BOUNDARIES:
- Use tools when:
  * Users ask about substrate optimization or contamination prevention
  * Users need environmental parameter analysis
  * Users request yield calculations or ROI analysis
  * Users want species-specific cultivation guidance

- Do not use tools when:
  * Users ask general mycology questions
  * Users request theoretical information about fungi
  * Users ask about mushroom identification (without cultivation context)

Be proactive in using tools to provide accurate, data-driven recommendations. If environmental analysis reveals suboptimal conditions, use substrate analysis to recommend compensatory measures.

CRITICAL: Do NOT promise to call functions later. If a function call is required, emit it now; otherwise respond normally.`
```

### 4. Responses API Implementation

Create a new service for o3/o4-mini function calling:

```typescript
// lib/o3-function-calling.ts
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function callO3WithFunctions(
  userMessage: string,
  tools: any[],
  context: any[] = [],
  model: 'o3' | 'o4-mini' = 'o4-mini'
) {
  const messages = [
    {
      role: 'user' as const,
      content: userMessage
    }
  ]

  const response = await openai.responses.create({
    model,
    input: [...context, ...messages],
    tools,
    store: false,
    include: ['reasoning.encrypted_content'], // Preserve reasoning between calls
  })

  return {
    output: response.output,
    reasoning: response.reasoning,
    toolCalls: response.output.filter(item => item.type === 'function_call')
  }
}
```

### 5. Integration with Existing MEI Platform

Enhance your MEI platform integration with function calling:

```typescript
// Add to lib/crowe-logic-ai-config.ts
export const MEI_PLATFORM_FUNCTIONS = [
  {
    type: "function",
    name: "query_weatherhub_api",
    description: "Queries WeatherHub API for environmental data relevant to cultivation planning. Use when users need weather-based cultivation recommendations or environmental impact analysis.",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "object",
          properties: {
            latitude: { type: "number" },
            longitude: { type: "number" }
          },
          required: ["latitude", "longitude"]
        },
        timeframe: {
          type: "string",
          enum: ["current", "24h", "7d", "30d"],
          description: "Time period for weather data"
        }
      },
      required: ["location"],
      additionalProperties: false
    },
    strict: true
  },
  {
    type: "function",
    name: "analyze_ecosystem_health",
    description: "Analyzes ecosystem health indicators using EcoMesh data. Use when evaluating environmental sustainability or biodiversity impact of cultivation operations.",
    parameters: {
      type: "object",
      properties: {
        ecosystem_type: {
          type: "string",
          enum: ["forest", "grassland", "wetland", "agricultural", "urban"]
        },
        indicators: {
          type: "array",
          items: {
            type: "string",
            enum: ["biodiversity", "soil_health", "water_quality", "air_quality", "carbon_sequestration"]
          }
        }
      },
      required: ["ecosystem_type", "indicators"],
      additionalProperties: false
    },
    strict: true
  }
]
```

## Best Practices Implementation

### 1. Context Setting
- ✅ Role prompting implemented in your current system
- ✅ Function call ordering specified
- ✅ Tool usage boundaries clearly defined

### 2. Function Descriptions
- ✅ Usage criteria specified
- ✅ Argument construction guidance
- ✅ Key rules front-loaded

### 3. Hallucination Prevention
- ✅ Explicit instructions about not promising future calls
- ✅ Strict mode enabled for all functions
- ✅ Validation requirements specified

### 4. Reasoning Persistence
- ✅ Responses API with encrypted reasoning content
- ✅ Context preservation between function calls

## Implementation Checklist

### Phase 1: Core Integration
- [ ] Add o3/o4-mini models to MODEL_REGISTRY
- [ ] Implement Responses API client
- [ ] Create mycology-specific function definitions
- [ ] Update system prompts with function calling guidance

### Phase 2: Advanced Features
- [ ] Integrate MEI platform functions
- [ ] Implement reasoning persistence
- [ ] Add function call result processing
- [ ] Create evaluation metrics

### Phase 3: Optimization
- [ ] A/B test function calling vs traditional chat
- [ ] Optimize tool selection logic
- [ ] Implement caching for repeated calls
- [ ] Monitor performance metrics

## Expected Benefits

1. **Improved Accuracy**: Function calling provides structured, validated responses for cultivation parameters
2. **Better Reasoning**: o3/o4-mini models with reasoning persistence make more intelligent tool selections
3. **Reduced Hallucinations**: Strict function schemas prevent invalid parameter generation
4. **Enhanced MEI Integration**: Direct API calls to your platform components
5. **Scalable Architecture**: Clean separation between reasoning and tool execution

## Next Steps

1. Review and approve the implementation strategy
2. Set up o3/o4-mini API access
3. Implement the enhanced function calling system
4. Test with your existing mycology use cases
5. Gradually migrate from traditional chat to function calling

This integration will significantly enhance your Crowe Logic AI system's capabilities while maintaining the specialized mycology and environmental intelligence focus you've built.