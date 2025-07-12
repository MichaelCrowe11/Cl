/**
 * Quantum-Fractal Operating Loop (QFOL) Core Framework
 * Crowe Logic AI - Mycology Research Suite
 */

export interface QFOLMetrics {
  // Discovery Entropy Index - measures exploration of novel ideas
  dei: {
    entropyScore: number // 0-1, higher = more diverse exploration
    noveltyRate: number // % of queries that explore new domains
    divergenceIndex: number // How far queries deviate from common patterns
    lastUpdated: Date
  }
  
  // Holonic Intent Graph - maps work to user intents
  hig: {
    intentAlignment: number // 0-1, how well work maps to user goals
    contextualRelevance: number // Relevance to mycology domain
    actionableInsights: number // % of outputs that lead to action
    userSatisfaction: number // User feedback score
    lastUpdated: Date
  }
  
  // Ethical Equilibrium Gauge - bias and safety scoring
  eeg: {
    biasScore: number // 0-1, lower = less biased
    safetyScore: number // 0-1, higher = safer recommendations
    transparencyIndex: number // How explainable are the outputs
    ethicalCompliance: number // Compliance with ethical guidelines
    lastUpdated: Date
  }
}

export interface QFOLEvent {
  id: string
  timestamp: Date
  type: 'query' | 'response' | 'action' | 'feedback'
  userId?: string
  sessionId: string
  data: {
    input?: string
    output?: string
    model?: string
    tokensUsed?: number
    responseTime?: number
    userFeedback?: {
      helpful: boolean
      accurate: boolean
      actionable: boolean
      biased: boolean
    }
    metadata?: Record<string, any>
  }
  metrics?: Partial<QFOLMetrics>
}

export class QFOLAnalyzer {
  private events: QFOLEvent[] = []
  private readonly ENTROPY_THRESHOLD = 0.6
  private readonly ALIGNMENT_THRESHOLD = 0.7
  private readonly ETHICAL_THRESHOLD = 0.8

  /**
   * Log an event in the QFOL system
   */
  logEvent(event: Omit<QFOLEvent, 'id' | 'timestamp'>): QFOLEvent {
    const qfolEvent: QFOLEvent = {
      ...event,
      id: `qfol_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }
    
    this.events.push(qfolEvent)
    this.calculateMetrics(qfolEvent)
    
    return qfolEvent
  }

  /**
   * Calculate QFOL metrics for an event
   */
  private calculateMetrics(event: QFOLEvent): void {
    const recentEvents = this.getRecentEvents(24) // Last 24 hours
    
    // Discovery Entropy Index
    const dei = this.calculateDEI(recentEvents)
    
    // Holonic Intent Graph
    const hig = this.calculateHIG(event, recentEvents)
    
    // Ethical Equilibrium Gauge
    const eeg = this.calculateEEG(event, recentEvents)

    event.metrics = { dei, hig, eeg }
  }

  /**
   * Calculate Discovery Entropy Index
   */
  private calculateDEI(events: QFOLEvent[]): QFOLMetrics['dei'] {
    const queries = events.filter(e => e.type === 'query')
    
    if (queries.length === 0) {
      return {
        entropyScore: 0,
        noveltyRate: 0,
        divergenceIndex: 0,
        lastUpdated: new Date()
      }
    }

    // Calculate entropy based on query diversity
    const topics = this.extractTopics(queries)
    const topicCounts = this.countTopics(topics)
    const entropyScore = this.calculateEntropy(topicCounts)
    
    // Calculate novelty rate (new topics vs repeated)
    const uniqueTopics = new Set(topics)
    const noveltyRate = uniqueTopics.size / topics.length
    
    // Calculate divergence from common mycology patterns
    const divergenceIndex = this.calculateDivergence(queries)

    return {
      entropyScore: Math.min(entropyScore, 1),
      noveltyRate,
      divergenceIndex,
      lastUpdated: new Date()
    }
  }

  /**
   * Calculate Holonic Intent Graph metrics
   */
  private calculateHIG(event: QFOLEvent, recentEvents: QFOLEvent[]): QFOLMetrics['hig'] {
    // Analyze intent alignment based on query-response-action chains
    const queryResponsePairs = this.getQueryResponsePairs(recentEvents)
    const intentAlignment = this.analyzeIntentAlignment(queryResponsePairs)
    
    // Contextual relevance to mycology domain
    const contextualRelevance = this.calculateContextualRelevance(event)
    
    // Actionable insights rate
    const actionableInsights = this.calculateActionableRate(recentEvents)
    
    // User satisfaction from feedback
    const userSatisfaction = this.calculateUserSatisfaction(recentEvents)

    return {
      intentAlignment,
      contextualRelevance,
      actionableInsights,
      userSatisfaction,
      lastUpdated: new Date()
    }
  }

  /**
   * Calculate Ethical Equilibrium Gauge
   */
  private calculateEEG(event: QFOLEvent, recentEvents: QFOLEvent[]): QFOLMetrics['eeg'] {
    // Bias detection in responses
    const biasScore = this.detectBias(event)
    
    // Safety assessment for mycology advice
    const safetyScore = this.assessSafety(event)
    
    // Transparency of AI explanations
    const transparencyIndex = this.assessTransparency(event)
    
    // Ethical compliance check
    const ethicalCompliance = this.checkEthicalCompliance(event)

    return {
      biasScore: 1 - biasScore, // Invert so lower bias = higher score
      safetyScore,
      transparencyIndex,
      ethicalCompliance,
      lastUpdated: new Date()
    }
  }

  /**
   * Get current QFOL status
   */
  getCurrentStatus(): {
    status: 'optimal' | 'warning' | 'critical'
    metrics: QFOLMetrics
    recommendations: string[]
  } {
    const recentEvents = this.getRecentEvents(24)
    if (recentEvents.length === 0) {
      return {
        status: 'optimal',
        metrics: this.getDefaultMetrics(),
        recommendations: ['Start using the system to generate QFOL metrics']
      }
    }

    const latestMetrics = this.aggregateMetrics(recentEvents)
    const status = this.determineStatus(latestMetrics)
    const recommendations = this.generateRecommendations(latestMetrics)

    return { status, metrics: latestMetrics, recommendations }
  }

  /**
   * Check if deployment should be gated
   */
  shouldGateDeployment(): { gate: boolean; reason?: string } {
    const { metrics } = this.getCurrentStatus()
    
    if (metrics.eeg.ethicalCompliance < this.ETHICAL_THRESHOLD) {
      return {
        gate: true,
        reason: `Ethical compliance score ${metrics.eeg.ethicalCompliance} below threshold ${this.ETHICAL_THRESHOLD}`
      }
    }
    
    if (metrics.eeg.safetyScore < this.ETHICAL_THRESHOLD) {
      return {
        gate: true,
        reason: `Safety score ${metrics.eeg.safetyScore} below threshold ${this.ETHICAL_THRESHOLD}`
      }
    }
    
    return { gate: false }
  }

  // Helper methods (simplified implementations)
  private getRecentEvents(hours: number): QFOLEvent[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)
    return this.events.filter(e => e.timestamp > cutoff)
  }

  private extractTopics(events: QFOLEvent[]): string[] {
    // Simplified topic extraction - in production use NLP
    return events.map(e => {
      const text = e.data.input || e.data.output || ''
      // Basic keyword extraction for mycology topics
      const topics = []
      if (text.includes('cultivation') || text.includes('growing')) topics.push('cultivation')
      if (text.includes('identification') || text.includes('species')) topics.push('identification')
      if (text.includes('substrate') || text.includes('medium')) topics.push('substrates')
      if (text.includes('contamination') || text.includes('sterile')) topics.push('contamination')
      if (text.includes('harvest') || text.includes('yield')) topics.push('harvesting')
      return topics.length > 0 ? topics[0] : 'general'
    })
  }

  private countTopics(topics: string[]): Record<string, number> {
    return topics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  private calculateEntropy(counts: Record<string, number>): number {
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0)
    if (total === 0) return 0
    
    const probabilities = Object.values(counts).map(count => count / total)
    return -probabilities.reduce((entropy, p) => entropy + (p > 0 ? p * Math.log2(p) : 0), 0) / Math.log2(Object.keys(counts).length || 1)
  }

  private calculateDivergence(events: QFOLEvent[]): number {
    // Simplified - measure how much queries deviate from common mycology patterns
    return Math.random() * 0.8 + 0.1 // Placeholder
  }

  private getQueryResponsePairs(events: QFOLEvent[]): Array<{query: QFOLEvent, response: QFOLEvent}> {
    // Group queries with their responses
    return [] // Simplified implementation
  }

  private analyzeIntentAlignment(pairs: Array<{query: QFOLEvent, response: QFOLEvent}>): number {
    // Analyze if responses align with query intent
    return Math.random() * 0.4 + 0.6 // Placeholder
  }

  private calculateContextualRelevance(event: QFOLEvent): number {
    // Check if content is relevant to mycology
    const text = event.data.input || event.data.output || ''
    const mycologyKeywords = ['mushroom', 'fungi', 'mycelium', 'spore', 'cultivation', 'substrate', 'fruiting']
    const relevanceScore = mycologyKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    ).length / mycologyKeywords.length
    
    return Math.min(relevanceScore * 2, 1) // Scale up and cap at 1
  }

  private calculateActionableRate(events: QFOLEvent[]): number {
    // Measure % of responses that led to user actions
    return Math.random() * 0.5 + 0.4 // Placeholder
  }

  private calculateUserSatisfaction(events: QFOLEvent[]): number {
    const feedbackEvents = events.filter(e => e.data.userFeedback)
    if (feedbackEvents.length === 0) return 0.5 // Neutral default
    
    const positiveScore = feedbackEvents.reduce((score, event) => {
      const feedback = event.data.userFeedback!
      return score + (feedback.helpful ? 0.25 : 0) + (feedback.accurate ? 0.25 : 0) + 
             (feedback.actionable ? 0.25 : 0) + (feedback.biased ? 0 : 0.25)
    }, 0)
    
    return positiveScore / feedbackEvents.length
  }

  private detectBias(event: QFOLEvent): number {
    // Simplified bias detection
    const text = event.data.output || ''
    const biasIndicators = ['always', 'never', 'all', 'none', 'definitely', 'impossible']
    const biasCount = biasIndicators.filter(indicator => text.toLowerCase().includes(indicator)).length
    return Math.min(biasCount / biasIndicators.length, 1)
  }

  private assessSafety(event: QFOLEvent): number {
    // Safety assessment for mycology advice
    const text = event.data.output || ''
    const safetyFlags = ['poisonous', 'toxic', 'dangerous', 'harmful']
    const hasSafetyWarning = safetyFlags.some(flag => text.toLowerCase().includes(flag))
    const hasDisclaimer = text.toLowerCase().includes('disclaimer') || text.toLowerCase().includes('consult')
    
    if (hasSafetyWarning && hasDisclaimer) return 0.9
    if (hasSafetyWarning && !hasDisclaimer) return 0.3
    return 0.7 // Neutral safety score
  }

  private assessTransparency(event: QFOLEvent): number {
    // Measure how explainable the response is
    const text = event.data.output || ''
    const explanationWords = ['because', 'due to', 'research shows', 'studies indicate', 'evidence suggests']
    const explanationScore = explanationWords.filter(word => 
      text.toLowerCase().includes(word)
    ).length / explanationWords.length
    
    return Math.min(explanationScore * 2, 1)
  }

  private checkEthicalCompliance(event: QFOLEvent): number {
    // Check compliance with ethical guidelines
    return Math.random() * 0.3 + 0.7 // Placeholder - mostly compliant
  }

  private aggregateMetrics(events: QFOLEvent[]): QFOLMetrics {
    const metricsEvents = events.filter(e => e.metrics)
    if (metricsEvents.length === 0) return this.getDefaultMetrics()
    
    // Average the metrics
    const avgMetrics = metricsEvents.reduce((acc, event) => {
      const m = event.metrics!
      acc.dei.entropyScore += m.dei.entropyScore
      acc.dei.noveltyRate += m.dei.noveltyRate
      acc.dei.divergenceIndex += m.dei.divergenceIndex
      
      acc.hig.intentAlignment += m.hig.intentAlignment
      acc.hig.contextualRelevance += m.hig.contextualRelevance
      acc.hig.actionableInsights += m.hig.actionableInsights
      acc.hig.userSatisfaction += m.hig.userSatisfaction
      
      acc.eeg.biasScore += m.eeg.biasScore
      acc.eeg.safetyScore += m.eeg.safetyScore
      acc.eeg.transparencyIndex += m.eeg.transparencyIndex
      acc.eeg.ethicalCompliance += m.eeg.ethicalCompliance
      
      return acc
    }, this.getDefaultMetrics())
    
    const count = metricsEvents.length
    
    return {
      dei: {
        entropyScore: avgMetrics.dei.entropyScore / count,
        noveltyRate: avgMetrics.dei.noveltyRate / count,
        divergenceIndex: avgMetrics.dei.divergenceIndex / count,
        lastUpdated: new Date()
      },
      hig: {
        intentAlignment: avgMetrics.hig.intentAlignment / count,
        contextualRelevance: avgMetrics.hig.contextualRelevance / count,
        actionableInsights: avgMetrics.hig.actionableInsights / count,
        userSatisfaction: avgMetrics.hig.userSatisfaction / count,
        lastUpdated: new Date()
      },
      eeg: {
        biasScore: avgMetrics.eeg.biasScore / count,
        safetyScore: avgMetrics.eeg.safetyScore / count,
        transparencyIndex: avgMetrics.eeg.transparencyIndex / count,
        ethicalCompliance: avgMetrics.eeg.ethicalCompliance / count,
        lastUpdated: new Date()
      }
    }
  }

  private determineStatus(metrics: QFOLMetrics): 'optimal' | 'warning' | 'critical' {
    if (metrics.eeg.ethicalCompliance < this.ETHICAL_THRESHOLD ||
        metrics.eeg.safetyScore < this.ETHICAL_THRESHOLD) {
      return 'critical'
    }
    
    if (metrics.dei.entropyScore < this.ENTROPY_THRESHOLD ||
        metrics.hig.intentAlignment < this.ALIGNMENT_THRESHOLD) {
      return 'warning'
    }
    
    return 'optimal'
  }

  private generateRecommendations(metrics: QFOLMetrics): string[] {
    const recommendations: string[] = []
    
    if (metrics.dei.entropyScore < this.ENTROPY_THRESHOLD) {
      recommendations.push('Encourage more diverse query exploration')
    }
    
    if (metrics.hig.intentAlignment < this.ALIGNMENT_THRESHOLD) {
      recommendations.push('Improve response relevance to user intents')
    }
    
    if (metrics.eeg.ethicalCompliance < this.ETHICAL_THRESHOLD) {
      recommendations.push('Review and improve ethical compliance measures')
    }
    
    if (recommendations.length === 0) {
      recommendations.push('QFOL metrics are optimal - continue current practices')
    }
    
    return recommendations
  }

  private getDefaultMetrics(): QFOLMetrics {
    return {
      dei: {
        entropyScore: 0.5,
        noveltyRate: 0.5,
        divergenceIndex: 0.5,
        lastUpdated: new Date()
      },
      hig: {
        intentAlignment: 0.5,
        contextualRelevance: 0.5,
        actionableInsights: 0.5,
        userSatisfaction: 0.5,
        lastUpdated: new Date()
      },
      eeg: {
        biasScore: 0.5,
        safetyScore: 0.5,
        transparencyIndex: 0.5,
        ethicalCompliance: 0.5,
        lastUpdated: new Date()
      }
    }
  }
}

// Singleton instance
export const qfolAnalyzer = new QFOLAnalyzer();
