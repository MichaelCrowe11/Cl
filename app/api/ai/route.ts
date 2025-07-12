import { NextRequest, NextResponse } from 'next/server'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface AIRequest {
  messages: ChatMessage[]
  model?: string
  temperature?: number
  maxTokens?: number
}

export async function POST(request: NextRequest) {
  try {
    // Add better JSON parsing with error handling
    let body: AIRequest
    try {
      const rawBody = await request.text()
      if (!rawBody || rawBody.trim() === '') {
        throw new Error('Empty request body')
      }
      body = JSON.parse(rawBody)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body', details: parseError instanceof Error ? parseError.message : 'Unknown parsing error' },
        { status: 400 }
      )
    }

    const { messages, model = 'gpt-4', temperature = 0.3, maxTokens = 2000 } = body

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and cannot be empty' },
        { status: 400 }
      )
    }

    // Get API keys from environment
    const openaiKey = process.env.OPENAI_API_KEY
    const anthropicKey = process.env.ANTHROPIC_API_KEY

    // Add Crowe Logic AI system prompt
    const systemPrompt = {
      role: 'system' as const,
      content: `You are Crowe Logic AI, a specialized mycology lab assistant with expertise in:

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

Respond as Crowe Logic AI, the expert mycology assistant.`
    }

    const enhancedMessages = [systemPrompt, ...messages]

    // Determine which AI service to use - prefer OpenAI for reliability
    let response: Response
    let aiResponse: string
    let usedModel = model

    // Always try OpenAI first since it's more reliable
    if (openaiKey) {
      try {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: model.includes('gpt') ? model : 'gpt-4',
            messages: enhancedMessages,
            temperature,
            max_tokens: maxTokens
          })
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
        }

        const data = await response.json()
        aiResponse = data.choices?.[0]?.message?.content || 'No response generated'
        usedModel = model.includes('gpt') ? model : 'gpt-4'

      } catch (openaiError) {
        console.error('OpenAI failed:', openaiError)
        
        // Only try Anthropic if specifically requested and available
        if (anthropicKey && model.includes('claude')) {
          try {
            response = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': anthropicKey,
                'anthropic-version': '2023-06-01'
              },
              body: JSON.stringify({
                model: model.includes('claude-3-5') ? 'claude-3-5-sonnet-20241022' : 'claude-3-opus-20240229',
                max_tokens: maxTokens,
                temperature,
                messages: enhancedMessages.filter(msg => msg.role !== 'system'),
                system: systemPrompt.content
              })
            })

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}))
              throw new Error(`Anthropic API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
            }

            const data = await response.json()
            aiResponse = data.content?.[0]?.text || 'No response generated'
          } catch (anthropicError) {
            console.error('Anthropic also failed:', anthropicError)
            throw openaiError // Return the original OpenAI error
          }
        } else {
          throw openaiError
        }
      }
    } else if (anthropicKey && model.includes('claude')) {
      // Only use Anthropic if OpenAI is not available
      try {
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: model.includes('claude-3-5') ? 'claude-3-5-sonnet-20241022' : 'claude-3-opus-20240229',
            max_tokens: maxTokens,
            temperature,
            messages: enhancedMessages.filter(msg => msg.role !== 'system'),
            system: systemPrompt.content
          })
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(`Anthropic API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
        }

        const data = await response.json()
        aiResponse = data.content?.[0]?.text || 'No response generated'

      } catch (anthropicError) {
        console.error('Anthropic failed:', anthropicError)
        throw anthropicError
      }
    } else {
      // No valid API configuration
      aiResponse = `I'm Crowe Logic AI, your mycology lab assistant! 

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
      usedModel = 'fallback'
    }

    return NextResponse.json({
      response: aiResponse,
      model: usedModel,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process AI request',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Crowe Logic AI API is running',
    availableModels: [
      'gpt-4',
      'gpt-4-turbo',
      'claude-3-opus',
      'claude-3-5-sonnet'
    ],
    timestamp: new Date().toISOString()
  })
}
