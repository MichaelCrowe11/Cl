/**
 * Nightly RAG Reindex Edge Function
 * Scheduled to run at 02:00 UTC daily
 * [PHASE] Epic 2 - RAG Ops Stability
 */

export const config = {
  runtime: 'edge'
};

interface ScheduledEvent {
  type: 'scheduled';
  cron: string;
}

export default async function handler(request: Request) {
  // Verify this is a scheduled request
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'dev-secret';
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    console.log('[CRON_RAG]', 'Starting nightly RAG reindex', {
      timestamp: new Date().toISOString(),
      timezone: 'UTC'
    });

    // Call the reindex API
    const reindexUrl = new URL('/api/rag/reindex', request.url).href;
    const response = await fetch(reindexUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CroweOS-Cron/1.0'
      },
      body: JSON.stringify({
        trigger: 'scheduled'
      })
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(`Reindex failed: ${result.error}`);
    }

    const { job, sla } = result;

    // Log success metrics
    console.log('[CRON_RAG_SUCCESS]', {
      jobId: job.id,
      documentsProcessed: job.documentsProcessed,
      vectorsGenerated: job.vectorsGenerated,
      costEstimate: job.costEstimate,
      staleDocRate: job.staleDocRate,
      slaCompliant: sla.compliant,
      duration: job.endTime ? new Date(job.endTime).getTime() - new Date(job.startTime).getTime() : 0
    });

    // Alert if SLA violated
    if (!sla.compliant) {
      console.error('[CRON_RAG_SLA_VIOLATION]', {
        staleDocRate: job.staleDocRate,
        threshold: sla.threshold,
        jobId: job.id
      });

      // In production, this would send alerts to Slack/PagerDuty
      await sendSLAAlert(job, sla);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'RAG reindex completed successfully',
      job: {
        id: job.id,
        documentsProcessed: job.documentsProcessed,
        vectorsGenerated: job.vectorsGenerated,
        costEstimate: job.costEstimate,
        staleDocRate: job.staleDocRate
      },
      sla: sla
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('[CRON_RAG_ERROR]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined
    });

    // Send error alert
    await sendErrorAlert(error);

    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

async function sendSLAAlert(job: any, sla: any) {
  // Mock alert function - in production would integrate with Slack/PagerDuty
  console.log('[ALERT]', 'SLA Violation', {
    type: 'sla_violation',
    service: 'rag_reindex',
    severity: 'warning',
    details: {
      staleDocRate: job.staleDocRate,
      threshold: sla.threshold,
      jobId: job.id
    }
  });
}

async function sendErrorAlert(error: any) {
  // Mock error alert - in production would integrate with monitoring
  console.log('[ALERT]', 'RAG Reindex Failed', {
    type: 'service_error',
    service: 'rag_reindex',
    severity: 'critical',
    error: error instanceof Error ? error.message : 'Unknown error'
  });
}
