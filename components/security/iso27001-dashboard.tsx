'use client'

// ISO 27001 Information Security Management System
// Comprehensive security controls for Crowe Logic AI

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  Database,
  Network,
  Users,
  FileText,
  Activity,
  Settings
} from 'lucide-react'

// =============================================
// ISO 27001 Control Framework Types
// =============================================

export interface SecurityControl {
  id: string
  category: string
  name: string
  description: string
  status: 'implemented' | 'partial' | 'planned' | 'not-applicable'
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  lastAssessment: string
  nextReview: string
  evidence: string[]
  owner: string
  implementation: {
    technical: boolean
    organizational: boolean
    physical: boolean
  }
}

export interface SecurityIncident {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: string
  description: string
  detectedAt: string
  resolvedAt?: string
  status: 'open' | 'investigating' | 'resolved' | 'closed'
  affectedSystems: string[]
  mitigation: string[]
}

export interface ComplianceMetrics {
  overall: number
  byCategory: { [category: string]: number }
  controlsTotal: number
  controlsImplemented: number
  highRiskControls: number
  pendingActions: number
}

// =============================================
// ISO 27001 Controls Database
// =============================================

class ISO27001Framework {
  private static readonly CONTROLS: SecurityControl[] = [
    // A.5 - Information Security Policies
    {
      id: 'A.5.1.1',
      category: 'Information Security Policies',
      name: 'Policies for information security',
      description: 'Management direction and support for information security in accordance with business requirements',
      status: 'implemented',
      riskLevel: 'high',
      lastAssessment: '2024-01-15',
      nextReview: '2024-07-15',
      evidence: ['Security Policy Document v2.0', 'Management Approval Email'],
      owner: 'CISO',
      implementation: { technical: false, organizational: true, physical: false }
    },
    {
      id: 'A.5.1.2',
      category: 'Information Security Policies',
      name: 'Review of the policies for information security',
      description: 'Information security policies shall be reviewed at planned intervals',
      status: 'implemented',
      riskLevel: 'medium',
      lastAssessment: '2024-01-15',
      nextReview: '2024-04-15',
      evidence: ['Quarterly Review Schedule', 'Review Meeting Minutes'],
      owner: 'Security Team',
      implementation: { technical: false, organizational: true, physical: false }
    },

    // A.6 - Organization of Information Security
    {
      id: 'A.6.1.1',
      category: 'Organization of Information Security',
      name: 'Information security roles and responsibilities',
      description: 'All information security responsibilities shall be defined and allocated',
      status: 'implemented',
      riskLevel: 'high',
      lastAssessment: '2024-01-10',
      nextReview: '2024-07-10',
      evidence: ['RACI Matrix', 'Job Descriptions', 'Org Chart'],
      owner: 'HR/Security',
      implementation: { technical: false, organizational: true, physical: false }
    },

    // A.8 - Asset Management
    {
      id: 'A.8.1.1',
      category: 'Asset Management',
      name: 'Inventory of assets',
      description: 'Assets associated with information and information processing facilities shall be identified',
      status: 'partial',
      riskLevel: 'medium',
      lastAssessment: '2024-01-20',
      nextReview: '2024-03-20',
      evidence: ['Asset Register v1.0', 'Discovery Tool Reports'],
      owner: 'IT Operations',
      implementation: { technical: true, organizational: true, physical: true }
    },
    {
      id: 'A.8.2.1',
      category: 'Asset Management',
      name: 'Classification of information',
      description: 'Information shall be classified in terms of legal requirements, value, criticality and sensitivity',
      status: 'implemented',
      riskLevel: 'high',
      lastAssessment: '2024-01-18',
      nextReview: '2024-07-18',
      evidence: ['Data Classification Policy', 'Training Records'],
      owner: 'Data Protection Officer',
      implementation: { technical: true, organizational: true, physical: false }
    },

    // A.9 - Access Control
    {
      id: 'A.9.1.1',
      category: 'Access Control',
      name: 'Access control policy',
      description: 'An access control policy shall be established, documented and reviewed',
      status: 'implemented',
      riskLevel: 'critical',
      lastAssessment: '2024-01-12',
      nextReview: '2024-04-12',
      evidence: ['Access Control Policy v3.0', 'Implementation Guidelines'],
      owner: 'Security Team',
      implementation: { technical: true, organizational: true, physical: false }
    },
    {
      id: 'A.9.2.1',
      category: 'Access Control',
      name: 'User registration and de-registration',
      description: 'A formal user registration and de-registration process shall be implemented',
      status: 'implemented',
      riskLevel: 'high',
      lastAssessment: '2024-01-14',
      nextReview: '2024-07-14',
      evidence: ['HR Onboarding Process', 'Automated Provisioning Logs'],
      owner: 'Identity Management',
      implementation: { technical: true, organizational: true, physical: false }
    },
    {
      id: 'A.9.4.1',
      category: 'Access Control',
      name: 'Information access restriction',
      description: 'Access to information and application system functions shall be restricted',
      status: 'implemented',
      riskLevel: 'critical',
      lastAssessment: '2024-01-16',
      nextReview: '2024-04-16',
      evidence: ['RBAC Implementation', 'Access Reviews', 'Least Privilege Audit'],
      owner: 'Security Team',
      implementation: { technical: true, organizational: true, physical: false }
    },

    // A.10 - Cryptography
    {
      id: 'A.10.1.1',
      category: 'Cryptography',
      name: 'Policy on the use of cryptographic controls',
      description: 'A policy on the use of cryptographic controls for protection of information shall be developed',
      status: 'implemented',
      riskLevel: 'high',
      lastAssessment: '2024-01-22',
      nextReview: '2024-07-22',
      evidence: ['Cryptography Policy', 'Algorithm Standards', 'Key Management Procedures'],
      owner: 'Security Architecture',
      implementation: { technical: true, organizational: true, physical: false }
    },

    // A.12 - Operations Security
    {
      id: 'A.12.1.2',
      category: 'Operations Security',
      name: 'Change management',
      description: 'Changes to the organization, business processes, information processing facilities and systems',
      status: 'partial',
      riskLevel: 'medium',
      lastAssessment: '2024-01-25',
      nextReview: '2024-04-25',
      evidence: ['Change Control Process', 'JIRA Workflows'],
      owner: 'DevOps Team',
      implementation: { technical: true, organizational: true, physical: false }
    },
    {
      id: 'A.12.6.1',
      category: 'Operations Security',
      name: 'Management of technical vulnerabilities',
      description: 'Information about technical vulnerabilities shall be obtained in a timely fashion',
      status: 'implemented',
      riskLevel: 'high',
      lastAssessment: '2024-01-20',
      nextReview: '2024-04-20',
      evidence: ['Vulnerability Scanning Reports', 'Patch Management Process'],
      owner: 'Security Operations',
      implementation: { technical: true, organizational: true, physical: false }
    },

    // A.13 - Communications Security
    {
      id: 'A.13.1.1',
      category: 'Communications Security',
      name: 'Network controls',
      description: 'Networks shall be controlled and protected to safeguard information in systems and applications',
      status: 'implemented',
      riskLevel: 'high',
      lastAssessment: '2024-01-18',
      nextReview: '2024-07-18',
      evidence: ['Firewall Rules', 'Network Segmentation', 'IDS/IPS Logs'],
      owner: 'Network Security',
      implementation: { technical: true, organizational: false, physical: false }
    },

    // A.14 - System Acquisition, Development and Maintenance
    {
      id: 'A.14.2.1',
      category: 'System Development',
      name: 'Secure development policy',
      description: 'Rules for the development of software and systems shall be established and applied',
      status: 'partial',
      riskLevel: 'medium',
      lastAssessment: '2024-01-23',
      nextReview: '2024-04-23',
      evidence: ['SDLC Documentation', 'Security Training Records'],
      owner: 'Development Team',
      implementation: { technical: true, organizational: true, physical: false }
    },

    // A.16 - Information Security Incident Management
    {
      id: 'A.16.1.1',
      category: 'Incident Management',
      name: 'Responsibilities and procedures',
      description: 'Management responsibilities and procedures shall be established for effective response to incidents',
      status: 'implemented',
      riskLevel: 'critical',
      lastAssessment: '2024-01-17',
      nextReview: '2024-07-17',
      evidence: ['Incident Response Plan', 'Contact Lists', 'Escalation Procedures'],
      owner: 'Security Operations Center',
      implementation: { technical: true, organizational: true, physical: false }
    },

    // A.18 - Compliance
    {
      id: 'A.18.1.1',
      category: 'Compliance',
      name: 'Identification of applicable legislation and contractual requirements',
      description: 'All relevant legislative statutory, regulatory, contractual requirements shall be identified',
      status: 'implemented',
      riskLevel: 'high',
      lastAssessment: '2024-01-19',
      nextReview: '2024-07-19',
      evidence: ['Legal Register', 'Compliance Matrix', 'Contract Reviews'],
      owner: 'Legal/Compliance',
      implementation: { technical: false, organizational: true, physical: false }
    }
  ]

  static getControls(): SecurityControl[] {
    return this.CONTROLS
  }

  static getControlsByCategory(category: string): SecurityControl[] {
    return this.CONTROLS.filter(control => control.category === category)
  }

  static calculateComplianceMetrics(): ComplianceMetrics {
    const controls = this.getControls()
    const implemented = controls.filter(c => c.status === 'implemented').length
    const total = controls.length
    
    // Calculate by category
    const categories = [...new Set(controls.map(c => c.category))]
    const byCategory: { [category: string]: number } = {}
    
    categories.forEach(category => {
      const categoryControls = this.getControlsByCategory(category)
      const categoryImplemented = categoryControls.filter(c => c.status === 'implemented').length
      byCategory[category] = (categoryImplemented / categoryControls.length) * 100
    })

    return {
      overall: (implemented / total) * 100,
      byCategory,
      controlsTotal: total,
      controlsImplemented: implemented,
      highRiskControls: controls.filter(c => c.riskLevel === 'critical' || c.riskLevel === 'high').length,
      pendingActions: controls.filter(c => c.status === 'partial' || c.status === 'planned').length
    }
  }

  static getSecurityIncidents(): SecurityIncident[] {
    // Mock incidents - replace with actual incident data
    return [
      {
        id: 'INC-2024-001',
        severity: 'medium',
        category: 'Access Control',
        description: 'Failed login attempts detected from unusual location',
        detectedAt: '2024-01-20T10:30:00Z',
        resolvedAt: '2024-01-20T11:45:00Z',
        status: 'resolved',
        affectedSystems: ['Authentication Service'],
        mitigation: ['IP blocked', 'User notified', 'Additional MFA required']
      },
      {
        id: 'INC-2024-002',
        severity: 'low',
        category: 'Operations Security',
        description: 'Automated vulnerability scan detected outdated package',
        detectedAt: '2024-01-22T09:15:00Z',
        status: 'investigating',
        affectedSystems: ['Web Application'],
        mitigation: ['Package update scheduled', 'Risk assessment completed']
      }
    ]
  }
}

// =============================================
// Main ISO 27001 Dashboard Component
// =============================================

export default function ISO27001Dashboard(): JSX.Element {
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null)
  const [controls, setControls] = useState<SecurityControl[]>([])
  const [incidents, setIncidents] = useState<SecurityIncident[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const controlsData = ISO27001Framework.getControls()
      const metricsData = ISO27001Framework.calculateComplianceMetrics()
      const incidentsData = ISO27001Framework.getSecurityIncidents()
      
      setControls(controlsData)
      setMetrics(metricsData)
      setIncidents(incidentsData)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: SecurityControl['status']) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'partial':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'planned':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'not-applicable':
        return <XCircle className="h-4 w-4 text-gray-400" />
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />
    }
  }

  const getRiskBadgeVariant = (risk: SecurityControl['riskLevel']) => {
    switch (risk) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      case 'low':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const filteredControls = selectedCategory === 'all' 
    ? controls 
    : controls.filter(c => c.category === selectedCategory)

  const categories = ['all', ...new Set(controls.map(c => c.category))]

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">ISO 27001 Security Management</h1>
        </div>
        <Badge variant="default">
          {metrics ? `${metrics.controlsImplemented}/${metrics.controlsTotal} Controls` : 'Loading...'}
        </Badge>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Overall Compliance</p>
                  <p className="text-2xl font-bold">{metrics.overall.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium">High Risk Controls</p>
                  <p className="text-2xl font-bold">{metrics.highRiskControls}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Pending Actions</p>
                  <p className="text-2xl font-bold">{metrics.pendingActions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Active Incidents</p>
                  <p className="text-2xl font-bold">{incidents.filter(i => i.status !== 'closed').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="controls" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="controls">Security Controls</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
          <TabsTrigger value="incidents">Incident Management</TabsTrigger>
          <TabsTrigger value="reports">Reports & Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="controls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Controls Management</CardTitle>
              <CardDescription>
                ISO 27001 Annex A controls implementation status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </Button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredControls.map(control => (
                  <Card key={control.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between space-x-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(control.status)}
                            <h3 className="font-medium">{control.id} - {control.name}</h3>
                            <Badge variant={getRiskBadgeVariant(control.riskLevel)}>
                              {control.riskLevel}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600">{control.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <span>Owner: {control.owner}</span>
                            <span>Last Review: {new Date(control.lastAssessment).toLocaleDateString()}</span>
                            <span>Next Review: {new Date(control.nextReview).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex space-x-2">
                            {control.implementation.technical && (
                              <Badge variant="outline" className="text-xs">Technical</Badge>
                            )}
                            {control.implementation.organizational && (
                              <Badge variant="outline" className="text-xs">Organizational</Badge>
                            )}
                            {control.implementation.physical && (
                              <Badge variant="outline" className="text-xs">Physical</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge 
                            variant={control.status === 'implemented' ? 'default' : 'secondary'}
                          >
                            {control.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Dashboard</CardTitle>
              <CardDescription>
                Real-time compliance status across all control categories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {metrics && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Overall Compliance</span>
                      <span className="font-bold">{metrics.overall.toFixed(1)}%</span>
                    </div>
                    <Progress value={metrics.overall} className="w-full" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Compliance by Category</h3>
                    {Object.entries(metrics.byCategory).map(([category, percentage]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">{category}</span>
                          <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={percentage} className="w-full h-2" />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Security Incident Management</span>
              </CardTitle>
              <CardDescription>
                Track and manage security incidents and responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {incidents.map(incident => (
                <Card key={incident.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between space-x-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{incident.id}</h3>
                          <Badge variant={incident.severity === 'critical' ? 'destructive' : 'default'}>
                            {incident.severity}
                          </Badge>
                          <Badge variant="outline">{incident.category}</Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600">{incident.description}</p>
                        
                        <div className="text-sm space-y-1">
                          <div>Detected: {new Date(incident.detectedAt).toLocaleString()}</div>
                          {incident.resolvedAt && (
                            <div>Resolved: {new Date(incident.resolvedAt).toLocaleString()}</div>
                          )}
                          <div>Affected Systems: {incident.affectedSystems.join(', ')}</div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Mitigation Actions:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {incident.mitigation.map((action, index) => (
                              <li key={index}>• {action}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <Badge variant={incident.status === 'resolved' ? 'default' : 'secondary'}>
                        {incident.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Security Reports & Analytics</span>
              </CardTitle>
              <CardDescription>
                Comprehensive security posture analysis and reporting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Security reports are generated monthly and include compliance status, 
                  risk assessment, and improvement recommendations.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">Compliance Report</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">
                    Detailed ISO 27001 compliance status and gap analysis
                  </p>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="h-4 w-4" />
                    <span className="font-medium">Risk Assessment</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">
                    Current risk posture and mitigation strategies
                  </p>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">Audit Trail</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">
                    Complete audit log of security events and changes
                  </p>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <div className="flex items-center space-x-2 mb-2">
                    <Settings className="h-4 w-4" />
                    <span className="font-medium">Control Effectiveness</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">
                    Analysis of security control performance and gaps
                  </p>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
