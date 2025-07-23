import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface AIRequest {
  messages: ChatMessage[]
  model?: 'crowe-logic-assistant' | 'crowe-logic-coder'
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

const CoderSystemPrompt = `You are the Crowe Logic Coder, an expert-level AI programming assistant. Your purpose is to help users achieve their development goals by providing flawless, production-ready code.

Key Directives:
- Prioritize creating complete, runnable, and bug-free code.
- Adhere strictly to the user's requirements and specifications.
- Proactively identify and resolve potential issues, edge cases, and vulnerabilities.
- Employ best practices for the language and framework in use.
- Ensure code is clean, well-structured, and maintainable.
- Provide clear, concise, and helpful explanations when necessary.
- If a user's request is unclear, ask targeted questions to clarify their intent.
- Your primary output should be code, with explanations only when they add significant value.
- You are a tool for professionals; your tone should be direct, efficient, and helpful.`;

const AssistantSystemPrompt = `You are the Crowe Logic Assistant, a brilliant AI partner for analysis, research, and creative problem-solving.

Core Functions:
- Analyze complex information and provide insightful summaries.
- Conduct thorough research and synthesize findings.
- Brainstorm creative solutions to challenging problems.
- Assist with writing, editing, and refining documents.
- Answer questions with accuracy and depth.

Interaction Style:
- Your tone is professional, yet approachable and collaborative.
- You provide clear, well-structured, and comprehensive responses.
- You are a partner in the user's work, anticipating their needs and offering proactive help.
- You are not a coder, but you can help users think through the logic and structure of their projects.`;

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json()
    const { messages, model = 'crowe-logic-assistant', temperature = 0.3, maxTokens = 4096 } = body

    if (!messages || messages.length === 0) {
      return new Response('Messages are required', { status: 400 })
    }

    const xaiKey = process.env.XAI_API_KEY
    const anthropicKey = process.env.ANTHROPIC_API_KEY

    let stream;

    if (model === 'crowe-logic-coder') {
      if (!anthropicKey) {
        return new Response('ANTHROPIC_API_KEY is not set', { status: 500 });
      }
      stream = await streamClaude(messages, anthropicKey, CoderSystemPrompt, temperature, maxTokens);
    } else {
      if (!xaiKey) {
        return new Response('XAI_API_KEY is not set', { status: 500 });
      }
      stream = await streamGrok(messages, xaiKey, AssistantSystemPrompt, temperature, maxTokens);
    }

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('AI API Error:', error)
    return new Response('Failed to process AI request', { status: 500 })
  }
}

async function streamGrok(
  messages: ChatMessage[],
  apiKey: string,
  systemPrompt: string,
  temperature: number,
  maxTokens: number
) {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'grok-1.5-sonata',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature,
      max_tokens: maxTokens,
      stream: true
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Grok API error: ${response.status} ${errorBody}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response stream from Grok');
  }

  return new ReadableStream({
    async start(controller) {
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));
        for (const line of lines) {
          const data = line.substring(6);
          if (data.trim() === '[DONE]') {
            controller.close();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          } catch (e) {
            console.error('Error parsing Grok stream data:', e);
          }
        }
      }
      controller.close();
    }
  });
}

async function streamClaude(
  messages: ChatMessage[],
  apiKey: string,
  systemPrompt: string,
  temperature: number,
  maxTokens: number
) {
  const anthropic = new Anthropic({ apiKey });

  const stream = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    system: systemPrompt,
    messages: messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: m.content })),
    temperature,
    max_tokens: maxTokens,
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          controller.enqueue(new TextEncoder().encode(event.delta.text));
        }
      }
      controller.close();
    }
  });
}
