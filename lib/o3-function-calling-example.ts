// O3/O4-Mini Function Calling Implementation Example
// Practical implementation of the best practices for Crowe Logic AI

import { OpenAI } from 'openai';

// Initialize OpenAI client with o3/o4-mini support
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enhanced system prompt following o3/o4-mini best practices
export const CROWE_LOGIC_SYSTEM_PROMPT = `You are Crowe Logic AI, an expert mycology assistant with deep knowledge of fungal biotechnology, substrate optimization, and cultivation techniques.

As a mycology AI agent, you can help users with substrate analysis, contamination detection, yield predictions, and environmental monitoring using specialized tools.

TOOL USAGE GUIDELINES:
- Be proactive in using tools to accomplish the user's goal
- If a task cannot be completed with a single step, keep going and use multiple tools as needed until the task is completed
- Do not stop at the first failure. Try alternative steps or tool combinations until you succeed

For substrate optimization, follow this sequence:
1. Analyze current substrate composition using substrate_analyzer
2. Check for contamination risks using contamination_detector  
3. Calculate potential yields using yield_calculator
4. Provide optimization recommendations

Use tools when:
- User asks for substrate analysis or formulation advice
- User reports contamination issues or suspicious growth
- User requests yield predictions or harvest estimates
- User needs environmental condition assessment
- User wants specific calculations or data analysis

Do not use tools when:
- User asks general mycology theory questions
- User requests basic cultivation principles
- User asks about mushroom identification without analysis needs

CRITICAL: Do NOT promise to call a function later. If a function call is required, emit it now; otherwise respond normally.`;

// Tool definitions following o3/o4-mini best practices
export const MYCOLOGY_TOOLS = [
  {
    type: "function",
    name: "substrate_analyzer",
    description: `Analyzes substrate composition and provides optimization recommendations for mushroom cultivation.

Use this tool when users ask about:
- Substrate formulation or composition analysis
- Nutrient balance optimization  
- C:N ratio calculations
- Moisture content assessment
- pH level evaluation

Do NOT use for general substrate questions - only when specific analysis is needed.
Always ensure you have substrate composition data before calling this function.`,
    parameters: {
      type: "object",
      properties: {
        substrate_type: {
          type: "string",
          description: "Primary substrate material",
          enum: ["sawdust", "straw", "grain", "hardwood", "softwood", "agricultural_waste", "synthetic", "mixed"]
        },
        composition: {
          type: "object",
          properties: {
            carbon_sources: {
              type: "array",
              items: { type: "string" },
              description: "List of carbon-rich materials (e.g., sawdust, cellulose)"
            },
            nitrogen_sources: {
              type: "array", 
              items: { type: "string" },
              description: "List of nitrogen-rich materials (e.g., bran, soybean meal)"
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
              description: "pH level (0-14)"
            },
            additives: {
              type: "array",
              items: { type: "string" },
              description: "Additional supplements or additives"
            }
          },
          required: ["carbon_sources", "nitrogen_sources"]
        },
        target_species: {
          type: "string",
          description: "Target mushroom species for cultivation (e.g., 'Pleurotus ostreatus', 'Shiitake')"
        },
        cultivation_scale: {
          type: "string",
          enum: ["laboratory", "pilot", "commercial"],
          description: "Scale of cultivation operation"
        }
      },
      required: ["substrate_type", "composition", "target_species"],
      additionalProperties: false
    },
    strict: true
  },

  {
    type: "function",
    name: "contamination_detector",
    description: `Detects and identifies contamination in mushroom cultivation environments.

Only call this function when users report:
- Visible contamination symptoms
- Suspicious growth patterns
- Off-colors or unusual appearance
- Bad odors or unexpected changes
- Active contamination analysis needs

Do NOT use for:
- General contamination prevention advice
- Theoretical contamination discussions
- Sterile technique guidance

Validate symptoms are present before calling this function.`,
    parameters: {
      type: "object",
      properties: {
        visual_symptoms: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "green_mold", "black_spots", "blue_mold", "pink_coloration",
              "slimy_texture", "fuzzy_growth", "discolored_patches",
              "unusual_mycelium", "dark_streaks", "orange_spots"
            ]
          },
          description: "Observed visual contamination symptoms"
        },
        odor_symptoms: {
          type: "array",
          items: {
            type: "string", 
            enum: ["sour", "ammonia", "sweet", "putrid", "alcoholic", "musty", "none"]
          },
          description: "Odor characteristics observed"
        },
        growth_stage: {
          type: "string",
          enum: ["inoculation", "spawn_run", "pinning", "fruiting", "harvest"],
          description: "Growth stage when contamination first appeared"
        },
        affected_area: {
          type: "string",
          enum: ["localized", "spreading", "widespread", "isolated_spots"],
          description: "Extent of contamination spread"
        },
        environmental_conditions: {
          type: "object",
          properties: {
            temperature: { type: "number", description: "Temperature in Celsius" },
            humidity: { type: "number", minimum: 0, maximum: 100, description: "Relative humidity %" },
            air_circulation: { 
              type: "string", 
              enum: ["poor", "adequate", "good", "excessive"],
              description: "Air circulation quality"
            },
            days_since_inoculation: { type: "integer", minimum: 0 }
          }
        }
      },
      required: ["visual_symptoms", "growth_stage"],
      additionalProperties: false
    },
    strict: true
  },

  {
    type: "function", 
    name: "yield_calculator",
    description: `Calculates predicted mushroom yields based on cultivation parameters.

Use when users ask for:
- Yield predictions or harvest estimates
- Production planning calculations
- Biological efficiency assessments
- ROI calculations for cultivation projects

Prerequisites:
- Always complete substrate analysis first using substrate_analyzer
- Ensure substrate composition data is available
- Verify environmental parameters are specified

Do NOT use for theoretical yield discussions or general productivity questions.`,
    parameters: {
      type: "object",
      properties: {
        substrate_data: {
          type: "object",
          properties: {
            total_weight_kg: { 
              type: "number", 
              minimum: 0.1,
              description: "Total substrate weight in kilograms" 
            },
            dry_weight_kg: { 
              type: "number", 
              minimum: 0.05,
              description: "Dry substrate weight in kilograms" 
            },
            substrate_type: { type: "string" },
            carbon_nitrogen_ratio: { type: "number" }
          },
          required: ["total_weight_kg", "substrate_type"]
        },
        cultivation_parameters: {
          type: "object",
          properties: {
            species: { 
              type: "string",
              description: "Scientific name of mushroom species"
            },
            cultivation_method: {
              type: "string",
              enum: ["bag_cultivation", "block_method", "log_cultivation", "tray_system", "shelf_system"],
              description: "Cultivation method being used"
            },
            inoculation_rate: {
              type: "number",
              minimum: 0.01,
              maximum: 0.5, 
              description: "Spawn to substrate ratio (0.01-0.5)"
            },
            cycles_planned: {
              type: "integer",
              minimum: 1,
              maximum: 10,
              description: "Number of harvest cycles expected"
            }
          },
          required: ["species", "cultivation_method"]
        },
        environmental_parameters: {
          type: "object",
          properties: {
            temperature_range: { 
              type: "string",
              pattern: "^\\d+-\\d+°C$",
              description: "Temperature range (e.g., '20-25°C')"
            },
            humidity_range: { 
              type: "string", 
              pattern: "^\\d+-\\d+%$",
              description: "Humidity range (e.g., '80-90%')"
            },
            co2_levels_ppm: { 
              type: "number",
              minimum: 300,
              maximum: 5000,
              description: "CO2 concentration in ppm"
            },
            light_hours_daily: { 
              type: "number",
              minimum: 0,
              maximum: 24
            }
          }
        }
      },
      required: ["substrate_data", "cultivation_parameters"],
      additionalProperties: false
    },
    strict: true
  }
];

// Tool execution functions
export async function executeToolCall(toolCall: any): Promise<string> {
  const { name, arguments: args } = toolCall;
  
  try {
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
  } catch (error) {
    console.error(`Tool execution error for ${name}:`, error);
    return JSON.stringify({ 
      error: `Failed to execute ${name}`, 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

// Substrate analysis implementation
async function analyzeSubstrate(params: any): Promise<string> {
  const { substrate_type, composition, target_species, cultivation_scale } = params;
  
  // Calculate C:N ratio
  const carbonWeight = composition.carbon_sources.length * 50; // Simplified calculation
  const nitrogenWeight = composition.nitrogen_sources.length * 5;
  const cnRatio = carbonWeight / nitrogenWeight;
  
  // Assess pH
  const optimalPH = getOptimalPH(target_species);
  const phAssessment = assessPHLevel(composition.ph_level, optimalPH);
  
  // Evaluate moisture
  const moistureAssessment = evaluateMoisture(composition.moisture_content, substrate_type);
  
  // Generate recommendations
  const recommendations = generateSubstrateRecommendations(
    substrate_type, 
    target_species, 
    cnRatio, 
    composition.ph_level,
    composition.moisture_content
  );
  
  const analysis = {
    substrate_analysis: {
      substrate_type,
      target_species,
      cultivation_scale,
      composition_assessment: {
        carbon_nitrogen_ratio: {
          calculated: Math.round(cnRatio * 10) / 10,
          optimal_range: "20-30:1",
          status: cnRatio >= 20 && cnRatio <= 30 ? "optimal" : "needs_adjustment"
        },
        ph_assessment: phAssessment,
        moisture_assessment: moistureAssessment,
        additive_analysis: analyzeAdditives(composition.additives || [])
      },
      optimization_recommendations: recommendations,
      expected_performance: predictPerformance(cnRatio, composition.ph_level, composition.moisture_content)
    }
  };
  
  return JSON.stringify(analysis, null, 2);
}

// Contamination detection implementation  
async function detectContamination(params: any): Promise<string> {
  const { visual_symptoms, odor_symptoms, growth_stage, affected_area, environmental_conditions } = params;
  
  // Identify likely contaminants based on symptoms
  const contaminants = identifyContaminants(visual_symptoms, odor_symptoms || []);
  
  // Assess severity
  const severity = assessContaminationSeverity(visual_symptoms, affected_area, growth_stage);
  
  // Generate treatment recommendations
  const treatments = generateTreatmentRecommendations(contaminants, severity, growth_stage);
  
  // Prevention strategies
  const prevention = generatePreventionStrategies(contaminants, environmental_conditions);
  
  const detection = {
    contamination_analysis: {
      identified_contaminants: contaminants,
      severity_assessment: severity,
      growth_stage_impact: analyzeGrowthStageImpact(growth_stage, severity),
      affected_area_analysis: analyzeAffectedArea(affected_area),
      environmental_factors: analyzeEnvironmentalFactors(environmental_conditions)
    },
    treatment_plan: treatments,
    prevention_strategies: prevention,
    prognosis: generatePrognosis(contaminants, severity, growth_stage)
  };
  
  return JSON.stringify(detection, null, 2);
}

// Yield calculation implementation
async function calculateYield(params: any): Promise<string> {
  const { substrate_data, cultivation_parameters, environmental_parameters } = params;
  
  // Get species-specific data
  const speciesData = getSpeciesData(cultivation_parameters.species);
  const biologicalEfficiency = speciesData.typical_be || 0.8;
  
  // Calculate expected yields
  const dryWeight = substrate_data.dry_weight_kg || (substrate_data.total_weight_kg * 0.4);
  const expectedYield = dryWeight * biologicalEfficiency;
  
  // Factor in environmental conditions
  const environmentalMultiplier = calculateEnvironmentalMultiplier(environmental_parameters);
  const adjustedYield = expectedYield * environmentalMultiplier;
  
  // Calculate timeline
  const timeline = calculateHarvestTimeline(
    cultivation_parameters.species,
    cultivation_parameters.cultivation_method,
    environmental_parameters
  );
  
  // Generate optimization recommendations
  const optimizations = generateYieldOptimizations(
    substrate_data,
    cultivation_parameters,
    environmental_parameters,
    adjustedYield
  );
  
  const calculation = {
    yield_prediction: {
      substrate_input: {
        total_weight_kg: substrate_data.total_weight_kg,
        dry_weight_kg: dryWeight,
        substrate_type: substrate_data.substrate_type
      },
      estimated_yields: {
        fresh_weight_kg: Math.round(adjustedYield * 100) / 100,
        biological_efficiency_percent: Math.round(biologicalEfficiency * 100),
        cycles_planned: cultivation_parameters.cycles_planned || 1,
        total_expected_kg: Math.round(adjustedYield * (cultivation_parameters.cycles_planned || 1) * 100) / 100
      },
      harvest_timeline: timeline,
      environmental_impact: {
        temperature_effect: analyzeTemperatureEffect(environmental_parameters?.temperature_range),
        humidity_effect: analyzeHumidityEffect(environmental_parameters?.humidity_range),
        co2_effect: analyzeCO2Effect(environmental_parameters?.co2_levels_ppm)
      }
    },
    optimization_recommendations: optimizations,
    economic_analysis: calculateEconomicAnalysis(adjustedYield, substrate_data.total_weight_kg)
  };
  
  return JSON.stringify(calculation, null, 2);
}

// Helper functions (simplified implementations)
function getOptimalPH(species: string): number {
  const phMap: Record<string, number> = {
    'Pleurotus ostreatus': 6.5,
    'Shiitake': 5.5,
    'Reishi': 5.0,
    default: 6.0
  };
  return phMap[species] || phMap.default;
}

function assessPHLevel(currentPH: number, optimalPH: number) {
  const difference = Math.abs(currentPH - optimalPH);
  if (difference <= 0.5) return { status: "optimal", recommendation: "pH level is within optimal range" };
  if (difference <= 1.0) return { status: "acceptable", recommendation: "Minor pH adjustment recommended" };
  return { status: "needs_adjustment", recommendation: `Adjust pH from ${currentPH} toward ${optimalPH}` };
}

function evaluateMoisture(moisture: number, substrateType: string) {
  const optimalRanges: Record<string, [number, number]> = {
    sawdust: [60, 70],
    straw: [70, 75],
    grain: [45, 55],
    default: [55, 65]
  };
  
  const [min, max] = optimalRanges[substrateType] || optimalRanges.default;
  
  if (moisture >= min && moisture <= max) {
    return { status: "optimal", recommendation: "Moisture content is optimal" };
  } else if (moisture < min) {
    return { status: "too_low", recommendation: `Increase moisture to ${min}-${max}%` };
  } else {
    return { status: "too_high", recommendation: `Reduce moisture to ${min}-${max}%` };
  }
}

function analyzeAdditives(additives: string[]) {
  return additives.map(additive => ({
    name: additive,
    purpose: "nutrient_supplement", // Simplified
    recommendation: "Continue use if showing positive results"
  }));
}

function generateSubstrateRecommendations(
  substrateType: string, 
  species: string, 
  cnRatio: number, 
  ph: number, 
  moisture: number
) {
  const recommendations = [];
  
  if (cnRatio < 20) recommendations.push("Add more carbon-rich materials to increase C:N ratio");
  if (cnRatio > 30) recommendations.push("Add nitrogen-rich supplements to decrease C:N ratio");
  if (ph < 5.5) recommendations.push("Add lime or calcium carbonate to raise pH");
  if (ph > 7.0) recommendations.push("Add organic acids or sulfur to lower pH");
  if (moisture < 55) recommendations.push("Increase moisture content gradually");
  if (moisture > 75) recommendations.push("Reduce moisture to prevent anaerobic conditions");
  
  return recommendations;
}

function predictPerformance(cnRatio: number, ph: number, moisture: number) {
  let score = 0;
  if (cnRatio >= 20 && cnRatio <= 30) score += 30;
  if (ph >= 5.5 && ph <= 7.0) score += 30;
  if (moisture >= 55 && moisture <= 75) score += 40;
  
  return {
    performance_score: score,
    expected_outcome: score >= 80 ? "excellent" : score >= 60 ? "good" : "needs_improvement"
  };
}

function identifyContaminants(visualSymptoms: string[], odorSymptoms: string[]) {
  const contaminantMap: Record<string, string[]> = {
    'Trichoderma': ['green_mold', 'fuzzy_growth'],
    'Aspergillus': ['black_spots', 'dark_streaks'],
    'Penicillium': ['blue_mold', 'fuzzy_growth'],
    'Bacterial': ['slimy_texture', 'sour', 'putrid'],
    'Yeast': ['sweet', 'alcoholic', 'slimy_texture']
  };
  
  const identified = [];
  const allSymptoms = [...visualSymptoms, ...odorSymptoms];
  
  for (const [contaminant, symptoms] of Object.entries(contaminantMap)) {
    if (symptoms.some(symptom => allSymptoms.includes(symptom))) {
      identified.push({
        name: contaminant,
        confidence: "medium", // Simplified
        typical_symptoms: symptoms.filter(s => allSymptoms.includes(s))
      });
    }
  }
  
  return identified;
}

function assessContaminationSeverity(visualSymptoms: string[], affectedArea: string, growthStage: string) {
  let severityScore = 0;
  
  // Severity based on symptoms
  severityScore += visualSymptoms.length * 10;
  
  // Severity based on affected area
  const areaScores: Record<string, number> = {
    localized: 10,
    isolated_spots: 20,
    spreading: 40,
    widespread: 70
  };
  severityScore += areaScores[affectedArea] || 30;
  
  // Severity based on growth stage
  const stageScores: Record<string, number> = {
    inoculation: 20,
    spawn_run: 30,
    pinning: 50,
    fruiting: 40,
    harvest: 10
  };
  severityScore += stageScores[growthStage] || 30;
  
  return {
    severity_score: severityScore,
    level: severityScore < 40 ? "low" : severityScore < 70 ? "medium" : "high",
    urgency: severityScore > 60 ? "immediate_action_required" : "monitor_closely"
  };
}

function generateTreatmentRecommendations(contaminants: any[], severity: any, growthStage: string) {
  const treatments = [];
  
  if (severity.level === "high") {
    treatments.push("Isolate contaminated materials immediately");
    treatments.push("Consider discarding severely affected substrates");
  }
  
  if (contaminants.some(c => c.name === 'Trichoderma')) {
    treatments.push("Increase air circulation and reduce humidity");
    treatments.push("Apply lime water treatment if in early stages");
  }
  
  if (contaminants.some(c => c.name === 'Bacterial')) {
    treatments.push("Reduce moisture levels immediately");
    treatments.push("Improve drainage and air flow");
  }
  
  return treatments;
}

function generatePreventionStrategies(contaminants: any[], environmentalConditions: any) {
  const strategies = [
    "Maintain strict sterile procedures during inoculation",
    "Regular monitoring of temperature and humidity",
    "Proper substrate pasteurization or sterilization"
  ];
  
  if (environmentalConditions?.humidity > 90) {
    strategies.push("Reduce humidity to below 85%");
  }
  
  if (environmentalConditions?.temperature > 25) {
    strategies.push("Lower temperature to species-optimal range");
  }
  
  return strategies;
}

function analyzeGrowthStageImpact(growthStage: string, severity: any) {
  const impacts: Record<string, string> = {
    inoculation: "Early contamination - high impact on final yield",
    spawn_run: "Medium impact - may still recover with treatment", 
    pinning: "Significant impact on current flush",
    fruiting: "Limited impact on current harvest",
    harvest: "Minimal impact - focus on next cycle prevention"
  };
  
  return impacts[growthStage] || "Impact assessment needed";
}

function analyzeAffectedArea(affectedArea: string) {
  const analysis: Record<string, string> = {
    localized: "Contamination contained - good chance of recovery",
    isolated_spots: "Multiple infection points - monitor closely",
    spreading: "Active contamination spread - immediate action needed",
    widespread: "Severe contamination - consider disposal"
  };
  
  return analysis[affectedArea] || "Assessment needed";
}

function analyzeEnvironmentalFactors(conditions: any) {
  if (!conditions) return "Environmental data not provided";
  
  const factors = [];
  
  if (conditions.temperature > 25) factors.push("High temperature favors contamination");
  if (conditions.humidity > 90) factors.push("Excessive humidity promotes mold growth");
  if (conditions.air_circulation === "poor") factors.push("Poor air circulation allows contamination buildup");
  
  return factors.length > 0 ? factors : ["Environmental conditions appear favorable"];
}

function generatePrognosis(contaminants: any[], severity: any, growthStage: string) {
  if (severity.level === "high") {
    return "Poor - recommend disposal and restart";
  } else if (severity.level === "medium") {
    return "Guarded - treatment may be successful with immediate action";
  } else {
    return "Good - early intervention should resolve contamination";
  }
}

function getSpeciesData(species: string) {
  const speciesDatabase: Record<string, any> = {
    'Pleurotus ostreatus': { typical_be: 0.8, growth_days: 14 },
    'Shiitake': { typical_be: 0.6, growth_days: 21 },
    'Reishi': { typical_be: 0.4, growth_days: 35 },
    default: { typical_be: 0.7, growth_days: 18 }
  };
  
  return speciesDatabase[species] || speciesDatabase.default;
}

function calculateEnvironmentalMultiplier(environmental: any) {
  if (!environmental) return 1.0;
  
  let multiplier = 1.0;
  
  // Temperature effect (simplified)
  if (environmental.temperature_range?.includes('20-25')) multiplier *= 1.1;
  if (environmental.humidity_range?.includes('80-90')) multiplier *= 1.05;
  if (environmental.co2_levels_ppm && environmental.co2_levels_ppm > 1000) multiplier *= 0.95;
  
  return Math.round(multiplier * 100) / 100;
}

function calculateHarvestTimeline(species: string, method: string, environmental: any) {
  const speciesData = getSpeciesData(species);
  const baseDays = speciesData.growth_days;
  
  const methodMultipliers: Record<string, number> = {
    bag_cultivation: 1.0,
    block_method: 1.1,
    log_cultivation: 1.5,
    tray_system: 0.9,
    shelf_system: 0.95
  };
  
  const adjustedDays = baseDays * (methodMultipliers[method] || 1.0);
  
  return {
    spawn_run_days: Math.round(adjustedDays * 0.6),
    pinning_days: Math.round(adjustedDays * 0.2),
    fruiting_days: Math.round(adjustedDays * 0.2),
    total_days: Math.round(adjustedDays),
    first_harvest: `${Math.round(adjustedDays)} days from inoculation`
  };
}

function generateYieldOptimizations(substrate: any, cultivation: any, environmental: any, currentYield: number) {
  const optimizations = [];
  
  if (currentYield < substrate.total_weight_kg * 0.5) {
    optimizations.push("Yield below potential - review substrate formulation");
  }
  
  if (!environmental?.temperature_range) {
    optimizations.push("Optimize temperature control for better yields");
  }
  
  if (!environmental?.humidity_range) {
    optimizations.push("Implement proper humidity management");
  }
  
  if (cultivation.inoculation_rate && cultivation.inoculation_rate < 0.05) {
    optimizations.push("Consider increasing inoculation rate");
  }
  
  return optimizations;
}

function analyzeTemperatureEffect(tempRange: string | undefined) {
  if (!tempRange) return "Temperature data not provided";
  if (tempRange.includes('20-25')) return "Optimal temperature range";
  return "Review temperature settings for species requirements";
}

function analyzeHumidityEffect(humidityRange: string | undefined) {
  if (!humidityRange) return "Humidity data not provided";
  if (humidityRange.includes('80-90')) return "Good humidity range for fruiting";
  return "Adjust humidity to species-specific requirements";
}

function analyzeCO2Effect(co2Level: number | undefined) {
  if (!co2Level) return "CO2 data not provided";
  if (co2Level < 1000) return "Good CO2 levels for fruiting";
  if (co2Level > 2000) return "High CO2 - increase ventilation";
  return "Moderate CO2 levels";
}

function calculateEconomicAnalysis(yieldKg: number, substrateKg: number) {
  const substrateUnitCost = 2.50; // USD per kg
  const mushroomPrice = 12.00; // USD per kg fresh weight
  
  const revenue = yieldKg * mushroomPrice;
  const substrateCost = substrateKg * substrateUnitCost;
  const profit = revenue - substrateCost;
  const roi = (profit / substrateCost) * 100;
  
  return {
    revenue_usd: Math.round(revenue * 100) / 100,
    substrate_cost_usd: Math.round(substrateCost * 100) / 100,
    estimated_profit_usd: Math.round(profit * 100) / 100,
    roi_percent: Math.round(roi * 100) / 100,
    profit_per_kg_substrate: Math.round((profit / substrateKg) * 100) / 100
  };
}

// Main function calling implementation using Responses API
export async function processWithO3FunctionCalling(
  messages: any[],
  contextId?: string
): Promise<any> {
  try {
    // Load previous context if exists
    const context = contextId ? await loadPreviousContext(contextId, messages) : messages;
    
    // First API call with tools
    const response = await openai.responses.create({
      model: "o3-mini",
      input: [
        {
          role: "developer",
          content: CROWE_LOGIC_SYSTEM_PROMPT
        },
        ...context
      ],
      tools: MYCOLOGY_TOOLS,
      store: false,
      include: ["reasoning.encrypted_content"]
    });

    // Handle tool calls if present
    if (response.output.some((item: any) => item.type === 'function_call')) {
      const updatedContext = [...context, ...response.output];
      
      // Execute all tool calls
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

      // Final response with tool results
      const finalResponse = await openai.responses.create({
        model: "o3-mini",
        input: [
          {
            role: "developer", 
            content: CROWE_LOGIC_SYSTEM_PROMPT
          },
          ...updatedContext
        ],
        tools: MYCOLOGY_TOOLS,
        store: false,
        include: ["reasoning.encrypted_content"]
      });

      return {
        response: finalResponse.output_text,
        reasoning: finalResponse.reasoning,
        tool_calls: response.output.filter((item: any) => item.type === 'function_call'),
        context_id: contextId || generateContextId()
      };
    }

    // No tool calls needed
    return {
      response: response.output_text,
      reasoning: response.reasoning,
      context_id: contextId || generateContextId()
    };

  } catch (error) {
    console.error('O3 Function Calling Error:', error);
    throw error;
  }
}

// Helper functions for context management
async function loadPreviousContext(contextId: string, newMessages: any[]): Promise<any[]> {
  // Implementation would load from database/cache
  // For now, return just the new messages
  return newMessages;
}

function generateContextId(): string {
  return `crowe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default {
  CROWE_LOGIC_SYSTEM_PROMPT,
  MYCOLOGY_TOOLS,
  processWithO3FunctionCalling,
  executeToolCall
};