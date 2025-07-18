import { NextRequest, NextResponse } from 'next/server';

interface CanaryResult {
  timestamp: string;
  endpoint: string;
  status: 'success' | 'error';
  responseTime: number;
  statusCode: number;
  error?: string;
}

interface SLOMetrics {
  errorRate: number;
  p95Latency: number;
  availability: number;
  period: string;
}

const MONITORED_ENDPOINTS = [
  '/api/health',
  '/ide-pro',
  '/mycoide-wizard',
  '/api/scaffold',
  '/api/ai'
];

export async function GET(request: NextRequest) {
  const results: CanaryResult[] = [];
  const baseUrl = new URL(request.url).origin;

  for (const endpoint of MONITORED_ENDPOINTS) {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'CroweOS-Canary/1.0',
          'Accept': 'application/json'
        },
        cache: 'no-cache'
      });

      const responseTime = Date.now() - startTime;
      
      results.push({
        timestamp: new Date().toISOString(),
        endpoint,
        status: response.ok ? 'success' : 'error',
        responseTime,
        statusCode: response.status,
        error: response.ok ? undefined : `HTTP ${response.status}`
      });

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      results.push({
        timestamp: new Date().toISOString(),
        endpoint,
        status: 'error',
        responseTime,
        statusCode: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Calculate SLO metrics
  const totalChecks = results.length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const errorRate = (errorCount / totalChecks) * 100;
  
  const latencies = results.map(r => r.responseTime).sort((a, b) => a - b);
  const p95Index = Math.ceil(latencies.length * 0.95) - 1;
  const p95Latency = latencies[p95Index] || 0;
  
  const availability = ((totalChecks - errorCount) / totalChecks) * 100;

  const sloMetrics: SLOMetrics = {
    errorRate,
    p95Latency,
    availability,
    period: '1m'
  };

  // Log results for monitoring (could be sent to external service)
  console.log('[CANARY]', {
    timestamp: new Date().toISOString(),
    sloMetrics,
    results: results.filter(r => r.status === 'error') // Only log errors
  });

  return NextResponse.json({
    canary: {
      status: errorRate < 0.1 ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      slo: sloMetrics,
      checks: results,
      summary: {
        total: totalChecks,
        success: totalChecks - errorCount,
        errors: errorCount,
        sloTarget: 'error_rate < 0.1%, p95_latency < 100ms'
      }
    }
  }, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Canary-Status': errorRate < 0.1 ? 'healthy' : 'degraded'
    }
  });
}

export async function POST(request: NextRequest) {
  // Manual trigger for canary checks
  return GET(request);
}
