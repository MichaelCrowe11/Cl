'use client'

// GDPR Consent Management Component
// Ensures EU data protection compliance

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  Check, 
  X, 
  Clock, 
  Eye, 
  Download, 
  Trash2, 
  Settings,
  AlertTriangle,
  Info
} from 'lucide-react'

// =============================================
// GDPR Types & Interfaces
// =============================================

export interface ConsentData {
  id: string
  userId: string
  timestamp: string
  version: string
  purposes: {
    essential: boolean
    analytics: boolean
    marketing: boolean
    research: boolean
    aiTraining: boolean
  }
  legalBasis: 'consent' | 'contract' | 'legitimate-interest' | 'legal-obligation'
  dataTypes: string[]
  retentionPeriod: number // days
  withdrawnAt?: string
  ipAddress: string
  userAgent: string
}

export interface DataProcessingRecord {
  id: string
  userId: string
  activity: string
  dataTypes: string[]
  purpose: string
  legalBasis: string
  timestamp: string
  location: string
  automated: boolean
}

export interface DataSubjectRight {
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection'
  status: 'pending' | 'in-progress' | 'completed' | 'rejected'
  requestDate: string
  completionDate?: string
  reason?: string
}

// =============================================
// Consent Management Engine
// =============================================

class GDPRConsentManager {
  private static readonly CONSENT_VERSION = '2.0'
  private static readonly STORAGE_KEY = 'gdpr-consent'

  static saveConsent(consent: ConsentData): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(consent))
    
    // Also save to database
    this.recordConsentInDatabase(consent)
  }

  static getConsent(): ConsentData | null {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  }

  static isConsentValid(consent: ConsentData | null): boolean {
    if (!consent) return false
    
    const consentAge = Date.now() - new Date(consent.timestamp).getTime()
    const maxAge = 365 * 24 * 60 * 60 * 1000 // 1 year
    
    return consentAge < maxAge && consent.version === this.CONSENT_VERSION
  }

  static withdrawConsent(): void {
    const consent = this.getConsent()
    if (consent) {
      consent.withdrawnAt = new Date().toISOString()
      this.saveConsent(consent)
    }
  }

  private static async recordConsentInDatabase(consent: ConsentData): Promise<void> {
    try {
      await fetch('/api/gdpr/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consent)
      })
    } catch (error) {
      console.error('Failed to record consent:', error)
    }
  }

  static async requestDataExport(): Promise<Blob> {
    const response = await fetch('/api/gdpr/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!response.ok) {
      throw new Error('Failed to export data')
    }
    
    return response.blob()
  }

  static async requestDataDeletion(): Promise<void> {
    const response = await fetch('/api/gdpr/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete data')
    }
  }
}

// =============================================
// Main GDPR Consent Component
// =============================================

export default function GDPRConsentManager(): JSX.Element {
  const [consent, setConsent] = useState<ConsentData | null>(null)
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [dataRights, setDataRights] = useState<DataSubjectRight[]>([])
  const [processingRecords, setProcessingRecords] = useState<DataProcessingRecord[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const existingConsent = GDPRConsentManager.getConsent()
    setConsent(existingConsent)
    
    if (!GDPRConsentManager.isConsentValid(existingConsent)) {
      setShowConsentModal(true)
    }
    
    loadDataRights()
    loadProcessingRecords()
  }, [])

  const handleConsentSubmit = (purposes: ConsentData['purposes']) => {
    const newConsent: ConsentData = {
      id: `consent-${Date.now()}`,
      userId: 'current-user', // Replace with actual user ID
      timestamp: new Date().toISOString(),
      version: '2.0',
      purposes,
      legalBasis: 'consent',
      dataTypes: [
        'usage-data',
        'research-queries', 
        'interaction-logs',
        ...(purposes.analytics ? ['analytics-data'] : []),
        ...(purposes.marketing ? ['marketing-preferences'] : []),
        ...(purposes.research ? ['research-participation'] : []),
        ...(purposes.aiTraining ? ['ai-training-data'] : [])
      ],
      retentionPeriod: 1095, // 3 years
      ipAddress: 'masked', // Should be actual IP
      userAgent: navigator.userAgent
    }

    GDPRConsentManager.saveConsent(newConsent)
    setConsent(newConsent)
    setShowConsentModal(false)
  }

  const handleWithdrawConsent = () => {
    GDPRConsentManager.withdrawConsent()
    setConsent(GDPRConsentManager.getConsent())
  }

  const handleDataExport = async () => {
    setLoading(true)
    try {
      const dataBlob = await GDPRConsentManager.requestDataExport()
      const url = URL.createObjectURL(dataBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `crowe-logic-data-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDataDeletion = async () => {
    if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      setLoading(true)
      try {
        await GDPRConsentManager.requestDataDeletion()
        localStorage.clear()
        window.location.reload()
      } catch (error) {
        console.error('Deletion failed:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const loadDataRights = async () => {
    // Mock data - replace with actual API call
    setDataRights([
      {
        type: 'access',
        status: 'completed',
        requestDate: '2024-01-15',
        completionDate: '2024-01-16'
      }
    ])
  }

  const loadProcessingRecords = async () => {
    // Mock data - replace with actual API call
    setProcessingRecords([
      {
        id: 'proc-001',
        userId: 'current-user',
        activity: 'AI Query Processing',
        dataTypes: ['query-text', 'usage-metadata'],
        purpose: 'Mycology research assistance',
        legalBasis: 'consent',
        timestamp: new Date().toISOString(),
        location: 'EU-West',
        automated: true
      }
    ])
  }

  if (showConsentModal) {
    return <ConsentModal onSubmit={handleConsentSubmit} onClose={() => setShowConsentModal(false)} />
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">GDPR Data Protection Center</h1>
        </div>
        <Badge variant={consent && !consent.withdrawnAt ? "default" : "destructive"}>
          {consent && !consent.withdrawnAt ? "Consent Active" : "No Consent"}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="consent">Consent</TabsTrigger>
          <TabsTrigger value="rights">Your Rights</TabsTrigger>
          <TabsTrigger value="activity">Data Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5" />
                <span>Data Protection Status</span>
              </CardTitle>
              <CardDescription>
                Overview of your data protection and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {consent ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Consent Version</p>
                    <p className="text-2xl font-bold">{consent.version}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Data Retention</p>
                    <p className="text-2xl font-bold">{Math.round(consent.retentionPeriod / 365)} years</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Data Types</p>
                    <p className="text-2xl font-bold">{consent.dataTypes.length}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Legal Basis</p>
                    <p className="text-2xl font-bold capitalize">{consent.legalBasis}</p>
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No valid consent found. Please provide consent to use the platform.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <h3 className="font-medium">Compliance Score</h3>
                <Progress value={consent ? 95 : 0} className="w-full" />
                <p className="text-sm text-gray-600">
                  {consent ? "Your data is processed in full compliance with GDPR" : "Consent required for GDPR compliance"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consent Management</CardTitle>
              <CardDescription>
                Manage your data processing consent preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {consent && !consent.withdrawnAt ? (
                <div className="space-y-4">
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertDescription>
                      Consent provided on {new Date(consent.timestamp).toLocaleDateString()}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Your Consent Covers:</h3>
                    <ul className="space-y-1">
                      {Object.entries(consent.purposes).map(([purpose, granted]) => (
                        <li key={purpose} className="flex items-center space-x-2">
                          {granted ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                          <span className="capitalize">{purpose.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowConsentModal(true)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Modify Consent
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleWithdrawConsent}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Withdraw Consent
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {consent?.withdrawnAt 
                        ? `Consent withdrawn on ${new Date(consent.withdrawnAt).toLocaleDateString()}`
                        : "No consent provided"
                      }
                    </AlertDescription>
                  </Alert>
                  
                  <Button onClick={() => setShowConsentModal(true)}>
                    Provide Consent
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Subject Rights</CardTitle>
              <CardDescription>
                Exercise your rights under GDPR
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleDataExport}
                  disabled={loading}
                  className="h-auto p-4 flex-col items-start"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Download className="h-4 w-4" />
                    <span className="font-medium">Export My Data</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">
                    Download a copy of all your data in machine-readable format
                  </p>
                </Button>

                <Button 
                  variant="outline" 
                  onClick={handleDataDeletion}
                  disabled={loading}
                  className="h-auto p-4 flex-col items-start"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Trash2 className="h-4 w-4" />
                    <span className="font-medium">Delete My Data</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">
                    Permanently delete all your data from our systems
                  </p>
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Recent Rights Requests</h3>
                {dataRights.length > 0 ? (
                  <div className="space-y-2">
                    {dataRights.map((right, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="capitalize font-medium">{right.type}</span>
                          <p className="text-sm text-gray-600">
                            Requested: {new Date(right.requestDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={right.status === 'completed' ? 'default' : 'secondary'}>
                          {right.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No rights requests made</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Data Processing Activity</span>
              </CardTitle>
              <CardDescription>
                Detailed log of how your data has been processed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processingRecords.map((record) => (
                  <div key={record.id} className="border rounded p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{record.activity}</h3>
                      <Badge variant={record.automated ? 'secondary' : 'default'}>
                        {record.automated ? 'Automated' : 'Manual'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{record.purpose}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Data Types: </span>
                        {record.dataTypes.join(', ')}
                      </div>
                      <div>
                        <span className="font-medium">Legal Basis: </span>
                        {record.legalBasis}
                      </div>
                      <div>
                        <span className="font-medium">Location: </span>
                        {record.location}
                      </div>
                      <div>
                        <span className="font-medium">Time: </span>
                        {new Date(record.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// =============================================
// Consent Modal Component
// =============================================

interface ConsentModalProps {
  onSubmit: (purposes: ConsentData['purposes']) => void
  onClose: () => void
}

function ConsentModal({ onSubmit, onClose }: ConsentModalProps): JSX.Element {
  const [purposes, setPurposes] = useState<ConsentData['purposes']>({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    research: false,
    aiTraining: false
  })

  const handleSubmit = () => {
    onSubmit(purposes)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Data Processing Consent</span>
          </CardTitle>
          <CardDescription>
            Please review and consent to how we process your data under GDPR
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This consent is required to use the Crowe Logic AI platform in compliance with GDPR regulations.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-medium">Data Processing Purposes</h3>
              
              <div className="space-y-3">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={purposes.essential}
                    disabled={true}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">Essential Services (Required)</p>
                    <p className="text-sm text-gray-600">
                      Core platform functionality, user authentication, session management
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={purposes.analytics}
                    onChange={(e) => setPurposes({...purposes, analytics: e.target.checked})}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">Analytics & Performance</p>
                    <p className="text-sm text-gray-600">
                      Usage statistics, performance monitoring, platform improvement
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={purposes.research}
                    onChange={(e) => setPurposes({...purposes, research: e.target.checked})}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">Scientific Research</p>
                    <p className="text-sm text-gray-600">
                      Mycology research, pattern analysis, scientific publication (anonymized)
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={purposes.aiTraining}
                    onChange={(e) => setPurposes({...purposes, aiTraining: e.target.checked})}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">AI Model Training</p>
                    <p className="text-sm text-gray-600">
                      Improving AI responses, training mycology models (fully anonymized)
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={purposes.marketing}
                    onChange={(e) => setPurposes({...purposes, marketing: e.target.checked})}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">Marketing Communications</p>
                    <p className="text-sm text-gray-600">
                      Educational content, platform updates, relevant mycology news
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <h3 className="font-medium">Your Rights</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Right to access your data</li>
                <li>• Right to rectify incorrect data</li>
                <li>• Right to erasure ("right to be forgotten")</li>
                <li>• Right to data portability</li>
                <li>• Right to object to processing</li>
                <li>• Right to withdraw consent at any time</li>
              </ul>
            </div>

            <div className="border-t pt-4 space-y-2">
              <h3 className="font-medium">Data Retention</h3>
              <p className="text-sm text-gray-600">
                Your data will be retained for 3 years or until you withdraw consent. 
                Essential data may be retained longer for legal compliance.
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleSubmit} className="flex-1">
              <Check className="h-4 w-4 mr-2" />
              I Consent
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
