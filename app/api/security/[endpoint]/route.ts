// Security API Routes for Crowe Logic AI
// Handles compliance, incident management, and security monitoring

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// =============================================
// Request/Response Schemas
// =============================================

const BiasAssessmentRequest = z.object({
  content: z.string(),
  context: z.string().optional(),
  userId: z.string().optional()
})

const ComplianceCheckRequest = z.object({
  content: z.string(),
  type: z.enum(['fda', 'bioethics', 'gdpr', 'iso27001'])
})

const IncidentReportRequest = z.object({
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  category: z.string(),
  description: z.string(),
  affectedSystems: z.array(z.string()),
  userId: z.string().optional()
})

const ConsentRequest = z.object({
  userId: z.string(),
  purposes: z.object({
    essential: z.boolean(),
    analytics: z.boolean(),
    marketing: z.boolean(),
    research: z.boolean(),
    aiTraining: z.boolean()
  }),
  dataTypes: z.array(z.string()),
  legalBasis: z.enum(['consent', 'contract', 'legitimate-interest', 'legal-obligation'])
})

// =============================================
// Security Monitoring Service
// =============================================

class SecurityMonitoringService {
  static async assessContentBias(content: string, context?: string, userId?: string) {
    try {
      // Import bias detection at runtime to avoid build issues
      const { BiasDetectionEngine } = await import('@/components/security/bias-detection-framework')
      
      const assessment = await BiasDetectionEngine.analyzeContent(content, {
        context: context || 'general',
        userId: userId || 'anonymous',
        timestamp: new Date().toISOString()
      })

      // Log high-risk assessments
      if (assessment.overallRisk === 'high' || assessment.overallRisk === 'critical') {
        await this.logSecurityEvent({
          type: 'bias-detection',
          severity: assessment.overallRisk === 'critical' ? 'high' : 'medium',
          details: {
            content: content.substring(0, 100) + '...',
            biasScore: assessment.biasAnalysis.overallScore,
            ethicalScore: assessment.ethicalAlignment.score,
            safetyViolations: assessment.safetyAnalysis.violations.length
          }
        })
      }

      return assessment
    } catch (error) {
      console.error('Bias assessment failed:', error)
      throw new Error('Failed to assess content bias')
    }
  }

  static async checkCompliance(content: string, type: string) {
    try {
      switch (type) {
        case 'fda':
          const { FDAComplianceChecker } = await import('@/lib/compliance')
          return await FDAComplianceChecker.assessContent(content, 'general')
          
        case 'bioethics':
          const { BioethicsFramework } = await import('@/lib/compliance')
          return await BioethicsFramework.assessResearchEthics(
            'ai-content-generation',
            ['text-content'],
            true,
            false
          )
          
        case 'gdpr':
          return this.assessGDPRCompliance(content)
          
        case 'iso27001':
          return this.assessISO27001Compliance(content)
          
        default:
          throw new Error(`Unknown compliance type: ${type}`)
      }
    } catch (error) {
      console.error(`Compliance check failed for ${type}:`, error)
      throw new Error(`Failed to check ${type} compliance`)
    }
  }

  static async recordConsent(consentData: any) {
    try {
      // In production, save to database
      console.log('Recording consent:', consentData)
      
      const record = {
        id: `consent-${Date.now()}`,
        ...consentData,
        timestamp: new Date().toISOString(),
        version: '2.0',
        ipAddress: 'masked', // Should get from request
        retentionPeriod: 1095 // 3 years
      }

      // Log consent event
      await this.logSecurityEvent({
        type: 'consent-recorded',
        severity: 'low',
        details: {
          userId: consentData.userId,
          purposes: Object.keys(consentData.purposes).filter(p => consentData.purposes[p])
        }
      })

      return record
    } catch (error) {
      console.error('Failed to record consent:', error)
      throw new Error('Failed to record consent')
    }
  }

  static async reportIncident(incident: any) {
    try {
      const incidentRecord = {
        id: `INC-${Date.now()}`,
        ...incident,
        detectedAt: new Date().toISOString(),
        status: 'open',
        automated: true
      }

      // Log to monitoring system
      console.log('Security incident reported:', incidentRecord)

      // In production, trigger alerts for high/critical incidents
      if (incident.severity === 'high' || incident.severity === 'critical') {
        await this.triggerSecurityAlert(incidentRecord)
      }

      return incidentRecord
    } catch (error) {
      console.error('Failed to report incident:', error)
      throw new Error('Failed to report security incident')
    }
  }

  private static async assessGDPRCompliance(content: string) {
    const violations = []
    const lowercaseContent = content.toLowerCase()

    // Check for PII patterns
    const piiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b\d{1,5}\s\w+\s(?:street|st|avenue|ave|road|rd|boulevard|blvd)\b/i // Address
    ]

    const hasPII = piiPatterns.some(pattern => pattern.test(content))
    
    if (hasPII) {
      violations.push({
        type: 'potential-pii',
        description: 'Content may contain personally identifiable information',
        severity: 'medium'
      })
    }

    return {
      compliant: violations.length === 0,
      violations,
      recommendations: violations.length > 0 ? ['Remove or anonymize PII', 'Obtain explicit consent'] : []
    }
  }

  private static async assessISO27001Compliance(content: string) {
    const issues = []
    const lowercaseContent = content.toLowerCase()

    // Check for security-sensitive information
    const sensitivePatterns = [
      'password', 'secret', 'api key', 'token', 'credential',
      'private key', 'certificate', 'config', 'database'
    ]

    const hasSensitiveInfo = sensitivePatterns.some(pattern => 
      lowercaseContent.includes(pattern)
    )

    if (hasSensitiveInfo) {
      issues.push({
        control: 'A.8.2.1',
        description: 'Content may contain sensitive information requiring classification',
        severity: 'medium'
      })
    }

    return {
      compliant: issues.length === 0,
      issues,
      controlsAffected: issues.map(i => i.control)
    }
  }

  private static async logSecurityEvent(event: any) {
    console.log('Security event logged:', {
      timestamp: new Date().toISOString(),
      ...event
    })
  }

  private static async triggerSecurityAlert(incident: any) {
    console.log('SECURITY ALERT TRIGGERED:', incident)
    // In production: send to SIEM, notify SOC, create tickets
  }
}

// =============================================
// API Route Handlers
// =============================================

export async function POST(request: NextRequest) {
  const url = new URL(request.url)
  const endpoint = url.pathname.split('/').pop()

  try {
    const body = await request.json()

    switch (endpoint) {
      case 'bias-assessment':
        const biasRequest = BiasAssessmentRequest.parse(body)
        const assessment = await SecurityMonitoringService.assessContentBias(
          biasRequest.content,
          biasRequest.context,
          biasRequest.userId
        )
        return NextResponse.json({ success: true, data: assessment })

      case 'compliance-check':
        const complianceRequest = ComplianceCheckRequest.parse(body)
        const complianceResult = await SecurityMonitoringService.checkCompliance(
          complianceRequest.content,
          complianceRequest.type
        )
        return NextResponse.json({ success: true, data: complianceResult })

      case 'consent':
        const consentRequest = ConsentRequest.parse(body)
        const consentRecord = await SecurityMonitoringService.recordConsent(consentRequest)
        return NextResponse.json({ success: true, data: consentRecord })

      case 'incident':
        const incidentRequest = IncidentReportRequest.parse(body)
        const incidentRecord = await SecurityMonitoringService.reportIncident(incidentRequest)
        return NextResponse.json({ success: true, data: incidentRecord })

      case 'health':
        return NextResponse.json({ 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          services: {
            biasDetection: 'operational',
            complianceChecking: 'operational',
            incidentManagement: 'operational',
            consentManagement: 'operational'
          }
        })

      default:
        return NextResponse.json(
          { error: 'Unknown endpoint', endpoint },
          { status: 404 }
        )
    }
  } catch (error) {
    console.error('Security API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET endpoint for status checks and reports
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const endpoint = url.pathname.split('/').pop()

  try {
    switch (endpoint) {
      case 'health':
        return NextResponse.json({ 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          version: '1.0.0'
        })

      case 'compliance-status':
        const { ComplianceDashboard } = await import('@/lib/compliance')
        const report = await ComplianceDashboard.generateFullReport()
        return NextResponse.json({ 
          success: true, 
          data: { report, timestamp: new Date().toISOString() }
        })

      case 'security-metrics':
        const { ISO27001Framework } = await import('@/lib/compliance')
        const metrics = ISO27001Framework.calculateComplianceMetrics()
        const incidents = ISO27001Framework.getSecurityIncidents()
        
        return NextResponse.json({
          success: true,
          data: {
            compliance: metrics,
            incidents: incidents.filter(i => i.status !== 'closed'),
            timestamp: new Date().toISOString()
          }
        })

      default:
        return NextResponse.json(
          { error: 'Unknown endpoint', endpoint },
          { status: 404 }
        )
    }
  } catch (error) {
    console.error('Security API GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
