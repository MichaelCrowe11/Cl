// OpenAI o3/o4-mini Function Calling Service
// Implements best practices for enhanced reasoning and tool use

import { OpenAI } from 'openai'
import { CROWE_LOGIC_AI_CONFIG, getSystemPrompt } from './crowe-logic-ai-config'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Enhanced system prompt following o3/o4-mini best practices
export const ENHANCED_SYSTEM_PROMPT = `You are Crowe Logic AI, an expert in mycology, environmental intelligence, and business strategy.

As a mycology expert, you can help users:
- Analyze and optimize substrate compositions for specific mushroom species
- Monitor and adjust cultivation environment parameters
- Diagnose contamination issues and recommend prevention strategies
- Calculate yield predictions and ROI for cultivation operations
- Provide species-specific cultivation guidance

FUNCTION CALL ORDERING:
Always follow this sequence for cultivation optimization:
1. Check cultivation environment first: use \`check_cultivation_environment\`
2. Analyze substrate composition: use \`analyze_substrate_composition\`
3. Query weather data if location-based: use \`query_weatherhub_api\`
4. Provide integrated recommendations based on all results

TOOL USAGE BOUNDARIES:
- Use tools when:
  * Users ask about substrate optimization or contamination prevention
  * Users need environmental parameter analysis
  * Users request yield calculations or ROI analysis
  * Users want species-specific cultivation guidance
  * Users ask for weather-based cultivation recommendations

- Do not use tools when:
  * Users ask general mycology questions
  * Users request theoretical information about fungi
  * Users ask about mushroom identification (without cultivation context)
  * Users ask questions outside your mycology/environmental domain

Be proactive in using tools to accomplish the user's goal. If a task cannot be completed with a single step, keep going and use multiple tools as needed until the task is completed. Do not stop at the first failure. Try alternative steps or tool combinations until you succeed.

CRITICAL: Do NOT promise to call functions later. If a function call is required, emit it now; otherwise respond normally.

Validate arguments against the schema format before sending the call; if you are unsure, ask for clarification instead of guessing.`

// Mycology-specific function definitions
export const MYCOLOGY_FUNCTIONS = [
  {
    type: "function",
    name: "analyze_substrate_composition",
    description: "Analyzes substrate composition for optimal fungal cultivation. Use when users ask about substrate optimization, contamination prevention, or yield improvement. Always check environmental conditions first using check_cultivation_environment before making substrate recommendations. Do not use for general substrate questions without specific cultivation context.",
    parameters: {
      type: "object",
      properties: {
        substrate_type: {
          type: "string",
          enum: ["straw", "sawdust", "coffee_grounds", "coco_coir", "vermiculite", "perlite", "hardwood", "softwood", "manure", "custom"],
          description: "Primary substrate material type"
        },
        moisture_content: {
          type: "number",
          minimum: 0,
          maximum: 100,
          description: "Current moisture percentage (0-100%)"
        },
        ph_level: {
          type: "number",
          minimum: 0,
          maximum: 14,
          description: "pH level of substrate (0-14 scale)"
        },
        target_species: {
          type: "string",
          description: "Target mushroom species for cultivation (e.g., 'oyster', 'shiitake', 'lion's mane', 'reishi')"
        },
        sterilization_method: {
          type: "string",
          enum: ["steam", "pressure_cooker", "pasteurization", "lime_treatment", "none"],
          description: "Sterilization method used or planned"
        },
        cultivation_scale: {
          type: "string",
          enum: ["hobby", "small_commercial", "large_commercial", "research"],
          description: "Scale of cultivation operation"
        }
      },
      required: ["substrate_type", "target_species"],
      additionalProperties: false
    },
    strict: true
  },
  {
    type: "function",
    name: "check_cultivation_environment",
    description: "Monitors and analyzes cultivation environment parameters for optimal mushroom growth conditions. Use when analyzing growing conditions, troubleshooting contamination, or optimizing yield. Essential prerequisite before substrate analysis. Use for any environment-related cultivation questions.",
    parameters: {
      type: "object",
      properties: {
        temperature: {
          type: "number",
          description: "Current temperature in Celsius"
        },
        humidity: {
          type: "number",
          minimum: 0,
          maximum: 100,
          description: "Current relative humidity percentage (0-100%)"
        },
        co2_level: {
          type: "number",
          minimum: 0,
          description: "CO2 concentration in parts per million (ppm)"
        },
        airflow_rate: {
          type: "number",
          minimum: 0,
          description: "Air changes per hour (ACH)"
        },
        light_exposure: {
          type: "string",
          enum: ["none", "low", "medium", "high"],
          description: "Current light exposure level"
        },
        growth_stage: {
          type: "string",
          enum: ["inoculation", "colonization", "pinning", "fruiting", "harvest"],
          description: "Current growth stage of mushroom cultivation"
        },
        contamination_signs: {
          type: "boolean",
          description: "Whether contamination signs are visible"
        }
      },
      required: ["temperature", "humidity"],
      additionalProperties: false
    },
    strict: true
  },
  {
    type: "function",
    name: "calculate_yield_prediction",
    description: "Calculates expected yield and ROI for mushroom cultivation operations. Use when users ask about production planning, business viability, or profit calculations. Requires substrate and environmental data to be accurate.",
    parameters: {
      type: "object",
      properties: {
        substrate_weight: {
          type: "number",
          minimum: 0,
          description: "Total substrate weight in kilograms"
        },
        mushroom_species: {
          type: "string",
          description: "Species being cultivated"
        },
        expected_be_ratio: {
          type: "number",
          minimum: 0,
          maximum: 300,
          description: "Expected biological efficiency ratio as percentage (0-300%)"
        },
        cultivation_cycles: {
          type: "integer",
          minimum: 1,
          description: "Number of cultivation cycles per year"
        },
        cost_per_kg_substrate: {
          type: "number",
          minimum: 0,
          description: "Cost per kilogram of substrate in local currency"
        },
        selling_price_per_kg: {
          type: "number",
          minimum: 0,
          description: "Selling price per kilogram of fresh mushrooms"
        }
      },
      required: ["substrate_weight", "mushroom_species"],
      additionalProperties: false
    },
    strict: true
  },
  {
    type: "function",
    name: "query_weatherhub_api",
    description: "Queries WeatherHub API for environmental data relevant to cultivation planning and outdoor growing considerations. Use when users need weather-based cultivation recommendations, seasonal planning, or environmental impact analysis. Essential for greenhouse or outdoor cultivation optimization.",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "object",
          properties: {
            latitude: {
              type: "number",
              minimum: -90,
              maximum: 90,
              description: "Latitude coordinate"
            },
            longitude: {
              type: "number",
              minimum: -180,
              maximum: 180,
              description: "Longitude coordinate"
            }
          },
          required: ["latitude", "longitude"],
          additionalProperties: false
        },
        timeframe: {
          type: "string",
          enum: ["current", "24h", "7d", "30d"],
          description: "Time period for weather data analysis"
        },
        parameters: {
          type: "array",
          items: {
            type: "string",
            enum: ["temperature", "humidity", "precipitation", "wind_speed", "atmospheric_pressure", "uv_index"]
          },
          description: "Specific weather parameters to retrieve"
        }
      },
      required: ["location"],
      additionalProperties: false
    },
    strict: true
  }
]

// Function call interface
export interface FunctionCallContext {
  messages: Array<{
    role: 'user' | 'assistant' | 'function_call_output'
    content?: string
    call_id?: string
    output?: string
    type?: string
  }>
  reasoning?: any
}

// Main function calling service
export async function callO3WithFunctions(
  userMessage: string,
  tools: any[] = MYCOLOGY_FUNCTIONS,
  context: FunctionCallContext = { messages: [] },
  model: 'o3' | 'o4-mini' = 'o4-mini'
) {
  try {
    const input = [
      ...context.messages,
      {
        role: 'user' as const,
        content: userMessage
      }
    ]

    const response = await openai.responses.create({
      model,
      input,
      tools,
      store: false, // Don't store on OpenAI's servers
      include: ['reasoning.encrypted_content'], // Preserve reasoning between calls
    })

    return {
      output: response.output,
      reasoning: response.reasoning,
      toolCalls: response.output.filter(item => item.type === 'function_call'),
      outputText: response.output_text,
      context: {
        messages: [...input, ...response.output],
        reasoning: response.reasoning
      }
    }
  } catch (error) {
    console.error('o3/o4-mini Function Calling Error:', error)
    throw error
  }
}

// Function execution simulator (replace with actual implementations)
export async function executeMycologyFunction(
  functionName: string,
  args: any
): Promise<string> {
  switch (functionName) {
    case 'analyze_substrate_composition':
      return simulateSubstrateAnalysis(args)
    
    case 'check_cultivation_environment':
      return simulateEnvironmentCheck(args)
    
    case 'calculate_yield_prediction':
      return simulateYieldCalculation(args)
    
    case 'query_weatherhub_api':
      return simulateWeatherQuery(args)
    
    default:
      throw new Error(`Unknown function: ${functionName}`)
  }
}

// Simulation functions (replace with actual implementations)
function simulateSubstrateAnalysis(args: any): string {
  const { substrate_type, target_species, moisture_content, ph_level } = args
  
  return `Substrate Analysis Results:
- Substrate: ${substrate_type}
- Target Species: ${target_species}
- Moisture: ${moisture_content || 'Not specified'}%
- pH: ${ph_level || 'Not specified'}

Recommendations:
- Optimal moisture for ${target_species}: 60-65%
- Optimal pH range: 6.0-7.0
- Sterilization recommended for contamination prevention
- Consider supplementation for improved yields`
}

function simulateEnvironmentCheck(args: any): string {
  const { temperature, humidity, growth_stage } = args
  
  return `Environment Assessment:
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- Growth Stage: ${growth_stage || 'Not specified'}

Status: ${temperature >= 20 && temperature <= 25 && humidity >= 80 ? 'Optimal' : 'Needs adjustment'}

Recommendations:
- Target temperature: 20-25°C for most species
- Target humidity: 80-90% for fruiting
- Ensure adequate air circulation
- Monitor for contamination signs`
}

function simulateYieldCalculation(args: any): string {
  const { substrate_weight, mushroom_species, expected_be_ratio = 100 } = args
  const expectedYield = (substrate_weight * expected_be_ratio) / 100
  
  return `Yield Prediction:
- Substrate Weight: ${substrate_weight}kg
- Species: ${mushroom_species}
- Expected BE Ratio: ${expected_be_ratio}%
- Predicted Yield: ${expectedYield.toFixed(2)}kg
- Biological Efficiency: Within typical range for ${mushroom_species}`
}

function simulateWeatherQuery(args: any): string {
  const { location, timeframe } = args
  
  return `Weather Data for ${location.latitude}, ${location.longitude}:
- Timeframe: ${timeframe}
- Temperature: 22°C (optimal for greenhouse cultivation)
- Humidity: 65% (supplemental humidification recommended)
- Conditions: Suitable for controlled environment cultivation
- Seasonal considerations: Monitor for extreme weather events`
}

export default {
  callO3WithFunctions,
  executeMycologyFunction,
  MYCOLOGY_FUNCTIONS,
  ENHANCED_SYSTEM_PROMPT
}