import { NextRequest, NextResponse } from 'next/server'
import { callO3WithFunctions, executeMycologyFunction, MYCOLOGY_FUNCTIONS, ENHANCED_SYSTEM_PROMPT } from '../../../lib/o3-function-calling'

// Request interface for o3/o4-mini function calling
interface O3Request {
  message: string
  model?: 'o3' | 'o4-mini'
  context?: any
  tools?: any[]
  domain?: 'mycology' | 'environmental' | 'business' | 'general'
}

// Response interface
interface O3Response {
  response: string
  toolCalls?: any[]
  reasoning?: any
  usage?: any
  context?: any
  model: string
}

export async function POST(request: NextRequest) {
  try {
    const body: O3Request = await request.json()
    const { 
      message, 
      model = 'o4-mini', 
      context = { messages: [] },
      tools = MYCOLOGY_FUNCTIONS,
      domain = 'mycology'
    } = body

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Step 1: Initial function calling with o3/o4-mini
    console.log('Calling o3/o4-mini with message:', message)
    const initialResponse = await callO3WithFunctions(
      message,
      tools,
      context,
      model
    )

    let finalResponse = initialResponse.outputText
    let allToolCalls = [...initialResponse.toolCalls]
    let currentContext = initialResponse.context

    // Step 2: Execute any function calls
    if (initialResponse.toolCalls.length > 0) {
      console.log('Executing function calls:', initialResponse.toolCalls.length)
      
      for (const toolCall of initialResponse.toolCalls) {
        try {
          const args = JSON.parse(toolCall.arguments)
          console.log(`Executing function: ${toolCall.name}`, args)
          
          const functionResult = await executeMycologyFunction(toolCall.name, args)
          
          // Add function result to context
          currentContext.messages.push({
            type: 'function_call_output',
            call_id: toolCall.call_id,
            output: functionResult
          })
          
        } catch (error) {
          console.error(`Error executing function ${toolCall.name}:`, error)
          
          // Add error to context
          currentContext.messages.push({
            type: 'function_call_output',
            call_id: toolCall.call_id,
            output: `Error executing function: ${error.message}`
          })
        }
      }

      // Step 3: Get final response with function results
      console.log('Getting final response with function results')
      const finalCallResponse = await callO3WithFunctions(
        '', // Empty message as we're continuing the conversation
        tools,
        currentContext,
        model
      )

      finalResponse = finalCallResponse.outputText
      currentContext = finalCallResponse.context
      
      // Add any additional tool calls
      if (finalCallResponse.toolCalls.length > 0) {
        allToolCalls.push(...finalCallResponse.toolCalls)
      }
    }

    // Format response
    const o3Response: O3Response = {
      response: finalResponse || 'No response generated',
      toolCalls: allToolCalls,
      reasoning: currentContext.reasoning ? {
        summary: 'Reasoning preserved between function calls',
        encrypted: true
      } : undefined,
      usage: {
        // Note: o3/o4-mini usage metrics may be different
        reasoning_tokens: currentContext.reasoning ? 'encrypted' : 0,
        function_calls: allToolCalls.length,
      },
      context: currentContext,
      model: model.toUpperCase()
    }

    console.log('Sending response:', {
      responseLength: finalResponse.length,
      toolCallsCount: allToolCalls.length,
      hasReasoning: !!currentContext.reasoning
    })

    return NextResponse.json(o3Response)

  } catch (error) {
    console.error('o3/o4-mini API Error:', error)
    
    // Enhanced error handling
    if (error.message?.includes('model not found')) {
      return NextResponse.json(
        { error: 'o3/o4-mini models not available. Please check your OpenAI API access.' },
        { status: 400 }
      )
    }
    
    if (error.message?.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to process o3/o4-mini request',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve available models and functions
export async function GET() {
  const modelInfo = {
    available_models: [
      {
        id: 'o3',
        name: 'OpenAI o3',
        description: 'Most capable reasoning model with advanced function calling',
        supports_tools: true,
        supports_reasoning: true
      },
      {
        id: 'o4-mini',
        name: 'OpenAI o4-mini',
        description: 'Efficient reasoning model optimized for function calling',
        supports_tools: true,
        supports_reasoning: true
      }
    ],
    available_functions: MYCOLOGY_FUNCTIONS.map(func => ({
      name: func.name,
      description: func.description,
      parameters: Object.keys(func.parameters.properties || {}),
      required: func.parameters.required || []
    })),
    features: {
      reasoning_persistence: true,
      encrypted_context: true,
      multi_step_function_calling: true,
      domain_specialization: ['mycology', 'environmental', 'business']
    },
    system_prompt: ENHANCED_SYSTEM_PROMPT
  }

  return NextResponse.json(modelInfo)
}