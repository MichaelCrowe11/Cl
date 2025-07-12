import { NextRequest, NextResponse } from 'next/server'
import { qfolAnalyzer } from '@/lib/qfol'

/**
 * QFOL Monitoring Dashboard API
 * Provides real-time metrics for Discovery Entropy Index (DEI),
 * Holonic Intent Graph (HIG), and Ethical Equilibrium Gauge (EEG²)
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'status'

    switch (action) {
      case 'status':
        const status = qfolAnalyzer.getCurrentStatus()
        return NextResponse.json({
          ...status,
          timestamp: new Date().toISOString(),
          system: 'Crowe Logic GPT - Mycology Research Suite',
          version: '1.0.0-alpha'
        })

      case 'gate-check':
        const gateCheck = qfolAnalyzer.shouldGateDeployment()
        return NextResponse.json({
          deployment: {
            allowed: !gateCheck.gate,
            reason: gateCheck.reason,
            timestamp: new Date().toISOString()
          }
        })

      case 'metrics-only':
        const { metrics } = qfolAnalyzer.getCurrentStatus()
        return NextResponse.json({
          metrics,
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: status, gate-check, or metrics-only' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('QFOL API Error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve QFOL metrics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, sessionId, data } = body

    if (!type || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: type, sessionId' },
        { status: 400 }
      )
    }

    // Log custom event
    const event = qfolAnalyzer.logEvent({
      type,
      sessionId,
      data: data || {},
      userId: body.userId
    })

    return NextResponse.json({
      success: true,
      eventId: event.id,
      metrics: event.metrics,
      timestamp: event.timestamp
    })
  } catch (error) {
    console.error('QFOL Event Logging Error:', error)
    return NextResponse.json(
      { error: 'Failed to log QFOL event' },
      { status: 500 }
    )
  }
}
