import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

// ML Service Registry
const ML_SERVICES = {
  'yield-prediction': {
    script: 'workspace/yield_predictor.py',
    description: 'Predict mushroom yields based on environmental conditions',
    params: ['species', 'substrate_weight', 'temperature', 'humidity', 'co2_level']
  },
  'substrate-calculation': {
    script: 'workspace/substrate_calculator.py',
    description: 'Calculate optimal substrate ratios',
    params: ['mushroom_type', 'total_weight']
  },
  'contamination-analysis': {
    script: 'workspace/contamination_analyzer.py',
    description: 'Analyze contamination risks',
    params: ['temperature', 'humidity', 'air_flow', 'sterilization_minutes', 'cleanliness_score']
  },
  'vision-analysis': {
    script: 'workspace/vision.py',
    description: 'Computer vision for mushroom identification',
    params: ['image_path', 'analysis_type']
  }
}

export async function POST(request: NextRequest) {
  try {
    const { service, parameters } = await request.json()

    if (!service || !ML_SERVICES[service as keyof typeof ML_SERVICES]) {
      return NextResponse.json(
        { error: 'Invalid service specified' },
        { status: 400 }
      )
    }

    const serviceConfig = ML_SERVICES[service as keyof typeof ML_SERVICES]
    
    // Validate parameters
    const missingParams = serviceConfig.params.filter(
      param => !parameters[param]
    )
    
    if (missingParams.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required parameters',
          missing: missingParams,
          required: serviceConfig.params
        },
        { status: 400 }
      )
    }

    // Build command based on service
    let command = ''
    const scriptPath = path.join(process.cwd(), serviceConfig.script)

    switch (service) {
      case 'yield-prediction':
        command = `python "${scriptPath}" ${parameters.species} ${parameters.substrate_weight} ${parameters.temperature} ${parameters.humidity} ${parameters.co2_level}`
        break
      
      case 'substrate-calculation':
        command = `python "${scriptPath}" ${parameters.mushroom_type} ${parameters.total_weight}`
        break
      
      case 'contamination-analysis':
        // For contamination analysis, we'll pass parameters as JSON
        command = `python "${scriptPath}" --json '${JSON.stringify(parameters)}'`
        break
      
      case 'vision-analysis':
        command = `python "${scriptPath}" --image "${parameters.image_path}" --type ${parameters.analysis_type}`
        break
    }

    // Execute Python script
    const { stdout, stderr } = await execAsync(command)
    
    if (stderr && !stderr.includes('Warning')) {
      console.error('Python script error:', stderr)
      return NextResponse.json(
        { error: 'ML service execution failed', details: stderr },
        { status: 500 }
      )
    }

    // Parse output based on service
    let result
    try {
      // Try to parse as JSON first
      result = JSON.parse(stdout)
    } catch {
      // If not JSON, parse the text output
      result = parseTextOutput(stdout, service)
    }

    return NextResponse.json({
      service,
      parameters,
      result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('ML API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET endpoint to list available services
export async function GET() {
  const services = Object.entries(ML_SERVICES).map(([key, config]) => ({
    id: key,
    ...config,
    endpoint: `/api/ml`,
    method: 'POST',
    example: getExampleRequest(key)
  }))

  return NextResponse.json({ services })
}

function parseTextOutput(output: string, service: string): any {
  // Parse text output from Python scripts into structured data
  const lines = output.split('\n').filter(line => line.trim())
  
  switch (service) {
    case 'yield-prediction':
      // Parse yield prediction output
      const yieldMatch = output.match(/Predicted Yield: ([\d.]+) kg/)
      const efficiencyMatch = output.match(/Efficiency: ([\d.]+)%/)
      const harvestMatch = output.match(/Expected Harvest Date: (\d{4}-\d{2}-\d{2})/)
      
      return {
        predicted_yield_kg: yieldMatch ? parseFloat(yieldMatch[1]) : null,
        efficiency_percent: efficiencyMatch ? parseFloat(efficiencyMatch[1]) : null,
        harvest_date: harvestMatch ? harvestMatch[1] : null,
        raw_output: output
      }
    
    case 'substrate-calculation':
      // Parse substrate calculation output
      const components: Record<string, number> = {}
      const regex = /(\w+): ([\d.]+) kg/g
      let match: RegExpExecArray | null
      
      while ((match = regex.exec(output)) !== null) {
        components[match[1].toLowerCase()] = parseFloat(match[2])
      }
      
      return {
        components,
        total_kg: Object.values(components).reduce((sum, val) => sum + val, 0),
        raw_output: output
      }
    
    default:
      return { raw_output: output }
  }
}

function getExampleRequest(service: string): any {
  const examples: Record<string, any> = {
    'yield-prediction': {
      service: 'yield-prediction',
      parameters: {
        species: 'oyster',
        substrate_weight: 10,
        temperature: 22,
        humidity: 85,
        co2_level: 800
      }
    },
    'substrate-calculation': {
      service: 'substrate-calculation',
      parameters: {
        mushroom_type: 'shiitake',
        total_weight: 20
      }
    },
    'contamination-analysis': {
      service: 'contamination-analysis',
      parameters: {
        temperature: 24,
        humidity: 82,
        air_flow: 'good',
        sterilization_minutes: 90,
        cleanliness_score: 8
      }
    },
    'vision-analysis': {
      service: 'vision-analysis',
      parameters: {
        image_path: '/uploads/mushroom.jpg',
        analysis_type: 'species_identification'
      }
    }
  }
  
  return examples[service] || {}
} 