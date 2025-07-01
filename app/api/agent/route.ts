import { NextRequest, NextResponse } from 'next/server'

// Agent-specific system prompt
const CROWE_LOGIC_AGENT_PROMPT = `You are the Crowe Logic Coding Agent, specialized in:

1. **Mycology Platform Development**
   - Substrate optimization algorithms
   - Contamination detection systems
   - Growth monitoring features
   - Yield prediction models

2. **Technical Stack**
   - Next.js 15 with App Router
   - TypeScript with strict typing
   - Supabase for data persistence
   - Vercel deployment
   - Radix UI + Tailwind CSS

3. **Code Standards**
   - Production-ready implementations
   - Comprehensive error handling
   - Performance optimized
   - Well-documented code

When implementing features, always consider:
- Lab safety protocols
- Data accuracy requirements
- Real-time monitoring needs
- Scientific reproducibility`;

interface AgentRequest {
  task: string
  context?: string
  model?: string
  thinking_budget?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: AgentRequest = await request.json()
    const { 
      task, 
      context, 
      model = 'claude-3-opus-20240229',
      thinking_budget = 10000 
    } = body

    // Prepare the enhanced prompt
    const enhancedPrompt = `
${context ? `Context: ${context}\n\n` : ''}
Task: ${task}

Please provide a complete, production-ready implementation following Crowe Logic standards.
`;

    // Call the Anthropic API with specialized settings
    const response = await fetch(process.env.ANTHROPIC_API_ENDPOINT || 'https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model,
        system: CROWE_LOGIC_AGENT_PROMPT,
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        max_tokens: 8192,
        temperature: 0.2, // Lower for consistent code generation
        // Note: thinking parameter might be available in newer API versions
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      content: data.content?.[0]?.text || 'No response generated',
      model: model,
      usage: data.usage,
      agent: 'crowe-logic-specialist'
    })

  } catch (error) {
    console.error('Agent API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process agent request' },
      { status: 500 }
    )
  }
}

// GET endpoint to check agent status
export async function GET() {
  return NextResponse.json({
    agent: 'crowe-logic-specialist',
    version: '1.0.0',
    capabilities: [
      'feature-implementation',
      'code-optimization',
      'database-schema-generation',
      'mycology-algorithms',
      'platform-architecture'
    ],
    models: [
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307'
    ]
  })
} 