import { NextRequest, NextResponse } from 'next/server';

// This function handles POST requests to the /api/chat endpoint
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, config } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Use the working AI endpoint instead of missing Python backend
    const origin = new URL(req.url).origin;

    // Create mycology-specialized system prompt
    const systemPrompt = `You are Crowe Logic GPT, an advanced AI assistant specializing in mycology, fungal biology, biotechnology, and environmental applications. You have deep expertise in:

- Fungal identification and taxonomy
- Cultivation techniques and protocols
- Biotechnology and fermentation
- Environmental applications (mycoremediation, carbon sequestration)
- Research methodologies and data analysis
- Food safety and regulatory compliance

Provide scientifically accurate, detailed responses with practical applications. When discussing protocols, include specific steps. For research topics, cite relevant principles and methodologies.`;

    // Forward to the working AI endpoint
    const aiResponse = await fetch(`${origin}/api/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: message,
        model: config?.modelName || 'gpt-4',
        temperature: config?.temperature || 0.3,
        max_tokens: config?.maxTokens || 4096,
        system_prompt: systemPrompt
      }),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      return NextResponse.json({ error: errorData.error || 'AI service error' }, { status: aiResponse.status });
    }

    const data = await aiResponse.json();
    return NextResponse.json({ response: data.response });

  } catch (error) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
