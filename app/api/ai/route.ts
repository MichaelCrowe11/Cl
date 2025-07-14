import { NextRequest } from 'next/server'

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
}

// System prompt for Crowe Logic AI
const SYSTEM_PROMPT = `You are Crowe Logic AI, a specialized mycology lab assistant with expertise in:

🍄 CORE CAPABILITIES:
- Substrate composition analysis and optimization
- Environmental parameter monitoring and adjustment  
- Yield prediction and ROI calculations
- Contamination prevention and diagnosis
- Species-specific cultivation guidance
- Lab protocol development and SOPs

🧪 BEHAVIORAL GUIDELINES:
- Provide precise, actionable advice for mycology operations
- Use scientific terminology appropriately
- Always consider safety and contamination prevention
- Reference specific parameters (temperature, humidity, pH, etc.)
- Suggest practical solutions and next steps
- Ask clarifying questions when context is unclear

🎯 RESPONSE STYLE:
- Professional but approachable
- Structured and organized
- Include specific recommendations
- Provide rationale for suggestions
- Use emojis sparingly but effectively

Respond as Crowe Logic AI, the expert mycology assistant.`;

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

    // Get API keys
    const openaiKey = process.env.OPENAI_API_KEY
    const anthropicKey = process.env.ANTHROPIC_API_KEY

    // Prepare messages for API
    const systemMessage = { role: 'system' as const, content: SYSTEM_PROMPT }
    const apiMessages = [systemMessage, ...messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))]

    // Create readable stream for streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (openaiKey && (model.includes('gpt') || !model.includes('claude'))) {
            // Use OpenAI for GPT models
            await streamOpenAI(controller, apiMessages, model, temperature, maxTokens, openaiKey)
          } else if (anthropicKey && model.includes('claude')) {
            // Use Anthropic for Claude models  
            await streamAnthropic(controller, apiMessages, model, temperature, maxTokens, anthropicKey)
          } else {
            // Fallback response
            const fallbackMessage = `I'm Crowe Logic AI, your mycology lab assistant! 

I notice there may be an API configuration issue. Current status:
- OpenAI: ${openaiKey ? 'Configured' : 'Not configured'}
- Anthropic: ${anthropicKey ? 'Configured' : 'Not configured'}

Please ensure at least one API provider is properly configured.

I'll provide expert guidance on:
🍄 Substrate optimization
🌡️ Environmental controls  
📊 Yield calculations
🔬 Contamination prevention
📋 Protocol development

What mycology challenge can I help you solve today?`

            // Stream the fallback message word by word
            const words = fallbackMessage.split(' ')
            for (const word of words) {
              controller.enqueue(new TextEncoder().encode(word + ' '))
              await new Promise(resolve => setTimeout(resolve, 50))
            }
          }
        } catch (error) {
          console.error('Streaming error:', error)
          const errorMsg = `⚠️ I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`
          controller.enqueue(new TextEncoder().encode(errorMsg))
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
