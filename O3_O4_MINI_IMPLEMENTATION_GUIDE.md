# O3/O4-Mini Function Calling Implementation Guide for Crowe Logic AI

## Current State Analysis

Based on the analysis of your existing codebase, your AI implementation currently uses traditional chat completion APIs without advanced function calling capabilities. This document provides recommendations for upgrading to o3/o4-mini models with optimized function calling.

## Key Improvements Needed

### 1. Migration to Responses API

**Current**: Using traditional chat completions
**Recommended**: Migrate to Responses API for better reasoning persistence

```typescript
// Current implementation in app/api/ai/route.ts
// Uses basic chat completions without function calling

// Recommended: New implementation with Responses API
const response = await openai.responses.create({
  model: "o3-mini",
  input: context,
  tools: tools,
  store: false,
  include: ["reasoning.encrypted_content"]
});
```

### 2. Enhanced System Prompts for Function Calling

**Current System Prompt Issues**:
- Generic mycology focus without function calling guidance
- No tool usage boundaries defined
- Missing explicit instructions for tool ordering

**Recommended Enhancement**:
```typescript
export const ENHANCED_SYSTEM_PROMPTS = {
  mycology_with_tools: `You are Crowe Logic AI, an expert in mycology, environmental intelligence and business strategy.

As a mycology AI agent, you can help users with:
- Substrate analysis and optimization using the substrate_analyzer tool
- Contamination detection using the contamination_detector tool
- Yield predictions using the yield_calculator tool
- Environmental monitoring using the environmental_sensor tool
- Business calculations using the roi_calculator tool

TOOL USAGE GUIDELINES:
- Be proactive in using tools to accomplish the user's goal
- For substrate optimization, always follow this sequence:
  1. Analyze current substrate with substrate_analyzer
  2. Check environmental conditions with environmental_sensor
  3. Calculate potential yields with yield_calculator
  4. Provide ROI analysis with roi_calculator

- Use tools when:
  - User asks for substrate analysis or optimization
  - User needs contamination detection
  - User requests yield predictions or calculations
  - User wants environmental monitoring data
  - User asks for business/financial analysis

- Do not use tools when:
  - User asks general mycology questions
  - User requests theoretical information
  - User asks about basic cultivation principles

Do NOT promise to call functions later. If a function call is required, emit it now.`,
}
```

### 3. Structured Tool Definitions

**Missing**: No function calling tools defined
**Recommended**: Implement comprehensive tool suite

```typescript
export const MYCOLOGY_TOOLS = [
  {
    type: "function",
    name: "substrate_analyzer",
    description: "Analyzes substrate composition and provides optimization recommendations. Use this when users ask about substrate formulation, nutrient analysis, or substrate optimization. Do not use for general substrate questions - only when specific analysis is needed.",
    parameters: {
      type: "object",
      properties: {
        substrate_type: {
          type: "string",
          description: "Type of substrate (e.g., 'sawdust', 'straw', 'grain', 'synthetic')"
        },
        composition: {
          type: "object",
          properties: {
            carbon_sources: { type: "array", items: { type: "string" } },
            nitrogen_sources: { type: "array", items: { type: "string" } },
            moisture_content: { type: "number" },
            ph_level: { type: "number" }
          }
        },
        target_species: {
          type: "string",
          description: "Target mushroom species for cultivation"
        }
      },
      required: ["substrate_type", "target_species"],
      additionalProperties: false
    },
    strict: true
  },
  
  {
    type: "function", 
    name: "contamination_detector",
    description: "Detects and identifies contamination in cultivation environments. Only call this function when users report contamination issues, suspicious growth, or when conducting contamination analysis. Do not use for prevention advice - use only for active detection and identification.",
    parameters: {
      type: "object",
      properties: {
        symptoms: {
          type: "array",
          items: { type: "string" },
          description: "Visual symptoms observed (e.g., 'green_mold', 'black_spots', 'bad_odor')"
        },
        growth_stage: {
          type: "string",
          description: "Current growth stage when contamination appeared"
        },
        environmental_conditions: {
          type: "object",
          properties: {
            temperature: { type: "number" },
            humidity: { type: "number" },
            air_flow: { type: "string" }
          }
        }
      },
      required: ["symptoms"],
      additionalProperties: false
    },
    strict: true
  },

  {
    type: "function",
    name: "yield_calculator", 
    description: "Calculates predicted yields based on cultivation parameters. Use when users ask for yield predictions, harvest estimates, or production planning. Always ensure substrate analysis is completed first using substrate_analyzer before calling this function.",
    parameters: {
      type: "object",
      properties: {
        substrate_weight: { type: "number", description: "Weight of substrate in kilograms" },
        species: { type: "string", description: "Mushroom species being cultivated" },
        cultivation_method: { type: "string", description: "Method used (e.g., 'bags', 'blocks', 'logs')" },
        environmental_parameters: {
          type: "object",
          properties: {
            temperature_range: { type: "string" },
            humidity_range: { type: "string" },
            co2_levels: { type: "number" }
          }
        }
      },
      required: ["substrate_weight", "species", "cultivation_method"],
      additionalProperties: false
    },
    strict: true
  }
];
```

### 4. Context Management and Reasoning Persistence

**Current**: No context persistence between calls
**Recommended**: Implement proper context management

```typescript
// Enhanced API route with reasoning persistence
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, tools, context_id } = body;

    // Retrieve previous context if exists
    let context = messages;
    if (context_id) {
      // Load previous reasoning context
      const previousContext = await loadContext(context_id);
      context = [...previousContext, ...messages];
    }

    const response = await openai.responses.create({
      model: "o3-mini",
      input: context,
      tools: MYCOLOGY_TOOLS,
      store: false,
      include: ["reasoning.encrypted_content"]
    });

    // Handle tool calls
    if (response.output.some(item => item.type === 'function_call')) {
      const updatedContext = [...context, ...response.output];
      
      // Execute tool calls
      for (const item of response.output) {
        if (item.type === 'function_call') {
          const result = await executeToolCall(item);
          updatedContext.push({
            type: "function_call_output",
            call_id: item.call_id,
            output: result
          });
        }
      }

      // Continue conversation with tool results
      const finalResponse = await openai.responses.create({
        model: "o3-mini",
        input: updatedContext,
        tools: MYCOLOGY_TOOLS,
        store: false,
        include: ["reasoning.encrypted_content"]
      });

      return NextResponse.json({
        response: finalResponse.output_text,
        reasoning: finalResponse.reasoning,
        tool_calls: response.output.filter(item => item.type === 'function_call')
      });
    }

    return NextResponse.json({
      response: response.output_text,
      reasoning: response.reasoning
    });

  } catch (error) {
    console.error('O3/O4-Mini API Error:', error);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}
```

### 5. Tool Implementation Functions

**Missing**: Actual tool execution logic
**Recommended**: Implement tool functions

```typescript
// lib/mycology-tools.ts
export async function executeToolCall(toolCall: any): Promise<string> {
  const { name, arguments: args } = toolCall;
  const parsedArgs = JSON.parse(args);

  switch (name) {
    case 'substrate_analyzer':
      return await analyzeSubstrate(parsedArgs);
    
    case 'contamination_detector':
      return await detectContamination(parsedArgs);
    
    case 'yield_calculator':
      return await calculateYield(parsedArgs);
    
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function analyzeSubstrate(params: any): Promise<string> {
  // Implement substrate analysis logic
  const { substrate_type, composition, target_species } = params;
  
  // Example analysis logic
  const analysis = {
    carbon_nitrogen_ratio: calculateCNRatio(composition),
    ph_assessment: assessPH(composition.ph_level),
    moisture_evaluation: evaluateMoisture(composition.moisture_content),
    optimization_recommendations: generateOptimizationRecommendations(substrate_type, target_species)
  };
  
  return JSON.stringify(analysis, null, 2);
}

async function detectContamination(params: any): Promise<string> {
  // Implement contamination detection logic
  const { symptoms, growth_stage, environmental_conditions } = params;
  
  const detection = {
    likely_contaminants: identifyContaminants(symptoms),
    severity_level: assessSeverity(symptoms, growth_stage),
    treatment_recommendations: generateTreatmentPlan(symptoms),
    prevention_strategies: generatePreventionPlan(environmental_conditions)
  };
  
  return JSON.stringify(detection, null, 2);
}

async function calculateYield(params: any): Promise<string> {
  // Implement yield calculation logic
  const { substrate_weight, species, cultivation_method, environmental_parameters } = params;
  
  const calculation = {
    estimated_yield_kg: calculateEstimatedYield(substrate_weight, species, cultivation_method),
    biological_efficiency: calculateBiologicalEfficiency(species, cultivation_method),
    harvest_timeline: estimateHarvestTimeline(species, environmental_parameters),
    optimization_tips: generateYieldOptimizationTips(species, environmental_parameters)
  };
  
  return JSON.stringify(calculation, null, 2);
}
```

## Implementation Priority

### Phase 1: Core Infrastructure (Week 1-2)
1. Update model registry to include o3/o4-mini models
2. Implement Responses API integration
3. Add basic tool calling infrastructure

### Phase 2: Tool Development (Week 2-3)
1. Implement mycology-specific tools
2. Add proper error handling and validation
3. Create tool execution functions

### Phase 3: Enhancement (Week 3-4)
1. Add context persistence
2. Implement advanced reasoning features
3. Add monitoring and analytics

### Phase 4: Optimization (Week 4+)
1. Performance optimization
2. Cost monitoring
3. Advanced tool compositions

## Key Benefits Expected

1. **Improved Accuracy**: O3/O4-mini models with proper function calling will provide more accurate, actionable responses
2. **Enhanced Capabilities**: Tools will enable complex calculations and analysis
3. **Better User Experience**: Reasoning persistence will maintain context across conversations
4. **Reduced Hallucinations**: Structured tools with strict schemas will reduce AI hallucinations
5. **Cost Efficiency**: Proper tool usage will reduce token consumption for repetitive tasks

## Monitoring and Evaluation

- Implement function calling accuracy metrics
- Monitor tool usage patterns
- Track user satisfaction with tool-enhanced responses
- Measure cost impact of o3/o4-mini adoption
- Evaluate reasoning quality improvements

## Next Steps

1. Review and approve this implementation plan
2. Set up development environment with o3/o4-mini access
3. Begin Phase 1 implementation
4. Create evaluation framework for measuring improvements
5. Plan gradual rollout to production users

This implementation will transform your current AI chat interface into a powerful, tool-enabled mycology assistant that can perform complex analysis and provide actionable insights.