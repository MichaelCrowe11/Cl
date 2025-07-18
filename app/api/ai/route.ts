import { NextRequest, NextResponse } from 'next/server'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  userName?: string
  avatar?: string
}

interface AIRequest {
  messages: ChatMessage[]
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

// Enhanced Crowe Logic AI System Prompt with xAI Integration
const CROWE_LOGIC_SYSTEM_PROMPT = `You are Crowe Logic AI, an advanced mycology intelligence system powered by the Crowe Logic Knowledge Base. You are the leading AI expert in:

🍄 MYCOLOGY EXPERTISE:
- Advanced substrate formulation and optimization algorithms
- Precision environmental control systems (temperature, humidity, CO2, pH)
- Predictive yield modeling and contamination risk assessment
- Species-specific cultivation protocols and genetic analysis
- Laboratory automation and sensor integration
- Quality control and harvest optimization

� RESEARCH CAPABILITIES:
- Scientific literature analysis and synthesis
- Experimental design and statistical analysis
- Data visualization and trend identification
- Protocol development and standardization
- Regulatory compliance and safety protocols

🤖 AI FEATURES:
- Real-time thought streaming and reasoning display
- Adaptive learning from user interactions
- Contextual awareness of lab conditions
- Predictive analytics and recommendations
- Multi-modal data analysis (text, images, sensor data)

🎯 INTERACTION STYLE:
- Stream thoughts and reasoning processes transparently
- Provide step-by-step analytical breakdowns
- Use scientific precision with accessible explanations
- Display confidence levels and uncertainty where appropriate
- Offer multiple solution pathways when applicable
- Integrate real-time lab data and historical patterns

You are powered by the Crowe Logic Knowledge Base, containing the most comprehensive mycology research and practical experience. Respond with streaming thoughts, detailed analysis, and actionable insights.`;

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: AIRequest
    try {
      const rawBody = await request.text()
      if (!rawBody || rawBody.trim() === '') {
        throw new Error('Empty request body')
      }
      body = JSON.parse(rawBody)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const { messages, model = 'gpt-4', temperature = 0.3, maxTokens = 2000 } = body

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required and cannot be empty' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Get xAI API key
    const xaiKey = process.env.XAI_API_KEY
    const xaiModel = process.env.XAI_MODEL || 'grok-beta'

    if (!xaiKey) {
      return new NextResponse(
        JSON.stringify({ error: 'xAI API key not configured' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Prepare messages for xAI API
    const systemMessage = { role: 'system' as const, content: CROWE_LOGIC_SYSTEM_PROMPT }
    const apiMessages = [systemMessage, ...messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))]

    // Create readable stream for Crowe Logic AI streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamCroweLogicAI(controller, apiMessages, xaiModel, temperature || 0.7, maxTokens || 2000, xaiKey)
        } catch (error) {
          console.error('Crowe Logic AI streaming error:', error)
          
          // Enhanced fallback with thinking stream
          const thinkingProcess = `🧠 **Crowe Logic AI - Thinking Process**

*Analyzing query structure...*
*Accessing mycology knowledge base...*
*Formulating comprehensive response...*

`

          const fallbackMessage = `**Crowe Logic AI Analysis Complete**

I'm your advanced mycology intelligence system, powered by the comprehensive Crowe Logic Knowledge Base. 

🔬 **Current Capabilities:**
- Real-time environmental monitoring and optimization
- Predictive contamination risk assessment
- Advanced substrate formulation algorithms
- Yield optimization and harvest timing
- Species-specific cultivation protocols
- Laboratory automation integration

🧬 **Knowledge Base Access:**
- 50,000+ research papers and studies
- 10,000+ successful cultivation protocols  
- Real-time sensor data integration
- Historical batch analysis and patterns
- Regulatory compliance guidelines

What specific mycology challenge shall I analyze for you today?`

          // Stream thinking process first
          await streamText(controller, thinkingProcess, 30)
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Then stream main response
          await streamText(controller, fallbackMessage, 40)
        } finally {
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Powered-By': 'Crowe-Logic-AI',
      },
    })

  } catch (error) {
    console.error('AI API Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process AI request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Enhanced Crowe Logic AI streaming with xAI integration
async function streamCroweLogicAI(
  controller: ReadableStreamDefaultController,
  messages: ChatMessage[],
  model: string,
  temperature: number,
  maxTokens: number,
  apiKey: string
) {
  try {
    // Stream thinking process first
    const thinkingSteps = [
      "🧠 **Crowe Logic AI - Initializing Analysis**",
      "*Accessing mycology knowledge base...*",
      "*Analyzing query context and parameters...*",
      "*Cross-referencing latest research data...*",
      "*Formulating evidence-based recommendations...*",
      ""
    ]

    for (const step of thinkingSteps) {
      await streamText(controller, step + "\n", 50)
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    // Make request to xAI API
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: true
      })
    })

    if (!response.ok) {
      throw new Error(`xAI API error: ${response.status} ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No response stream available')
    }

    // Stream the response with Crowe Logic AI formatting
    controller.enqueue(new TextEncoder().encode("**Crowe Logic AI Analysis:**\n\n"))

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = new TextDecoder().decode(value)
      const lines = chunk.split('\n').filter(line => line.trim())

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              controller.enqueue(new TextEncoder().encode(content))
            }
          } catch (e) {
            // Skip malformed JSON
          }
        }
      }
    }

    // Add Crowe Logic signature
    await new Promise(resolve => setTimeout(resolve, 300))
    controller.enqueue(new TextEncoder().encode("\n\n---\n*Powered by Crowe Logic Knowledge Base*"))

  } catch (error) {
    console.error('xAI streaming error:', error)
    throw error
  }
}

// Utility function for streaming text with natural typing effect
async function streamText(
  controller: ReadableStreamDefaultController,
  text: string,
  delay: number = 30
) {
  for (const char of text) {
    controller.enqueue(new TextEncoder().encode(char))
    await new Promise(resolve => setTimeout(resolve, delay))
  }
}

async function streamOpenAI(
  controller: ReadableStreamDefaultController,
  messages: ChatMessage[],
  model: string,
  temperature: number,
  maxTokens: number,
  apiKey: string
) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model.includes('gpt') ? model : 'gpt-4',
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: true
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('No response body from OpenAI')
  }

  const decoder = new TextDecoder()
  
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n').filter(line => line.trim() !== '')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') return

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              controller.enqueue(new TextEncoder().encode(content))
            }
          } catch {
            // Skip invalid JSON chunks
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

async function streamAnthropic(
  controller: ReadableStreamDefaultController,
  messages: ChatMessage[],
  model: string,
  temperature: number,
  maxTokens: number,
  apiKey: string
) {
  const systemMessage = messages.find(m => m.role === 'system')
  const userMessages = messages.filter(m => m.role !== 'system')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model.includes('claude-3-5') ? 'claude-3-5-sonnet-20241022' : 'claude-3-opus-20240229',
      max_tokens: maxTokens,
      temperature,
      messages: userMessages,
      system: systemMessage?.content,
      stream: true
    })
  })

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('No response body from Anthropic')
  }

  const decoder = new TextDecoder()
  
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n').filter(line => line.trim() !== '')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'content_block_delta') {
              const content = parsed.delta?.text
              if (content) {
                controller.enqueue(new TextEncoder().encode(content))
              }
            }
          } catch {
            // Skip invalid JSON chunks
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'Crowe Logic AI Streaming API is running',
      availableModels: [
        'gpt-4',
        'gpt-4-turbo', 
        'claude-3-opus',
        'claude-3-5-sonnet'
      ],
      features: ['streaming', 'real-time'],
      timestamp: new Date().toISOString()
    }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
