import { NextResponse } from 'next/server'

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Crowe Logic AI',
    environment: process.env.NODE_ENV || 'development',
    features: {
      aiIntegration: Boolean(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY),
      openai: Boolean(process.env.OPENAI_API_KEY),
      anthropic: Boolean(process.env.ANTHROPIC_API_KEY)
    }
  }

  return NextResponse.json(health)
}
