/**
 * CroweLogic Knowledge Base Integration
 * Provides AI assistant access to structured mushroom cultivation knowledge
 */

interface KnowledgeBaseEntry {
  id: string;
  path: string;
  topics: string[];
  priority: 'high' | 'medium' | 'low';
  content?: string;
  lastAccessed?: Date;
}

export interface SearchResult {
  entry: KnowledgeBaseEntry;
  relevanceScore: number;
  matchedTopics: string[];
  excerpt: string;
}

export class CroweLogicKnowledgeBase {
  private knowledgeEntries: Map<string, KnowledgeBaseEntry> = new Map();
  private topicIndex: Map<string, string[]> = new Map();
  private config: any = null;

  constructor() {
    this.loadConfiguration();
  }

  /**
   * Load knowledge base configuration and build search indices
   */
  private async loadConfiguration() {
    try {
      const response = await fetch('/knowledge-base/knowledge-config.json');
      this.config = await response.json();
      
      // Build search indices
      this.config.knowledgeBase.sources.forEach((source: any) => {
        this.knowledgeEntries.set(source.id, source);
        
        // Index topics for fast lookup
        source.topics.forEach((topic: string) => {
          if (!this.topicIndex.has(topic)) {
            this.topicIndex.set(topic, []);
          }
          this.topicIndex.get(topic)!.push(source.id);
        });
      });
    } catch (error) {
      console.error('Failed to load knowledge base configuration:', error);
    }
  }

  /**
   * Search knowledge base for relevant information
   */
  async search(query: string, maxResults: number = 5): Promise<SearchResult[]> {
    const queryTerms = query.toLowerCase().split(/\s+/);
    const results: SearchResult[] = [];

    // Score each knowledge entry
    for (const [id, entry] of this.knowledgeEntries) {
      const score = this.calculateRelevanceScore(queryTerms, entry);
      if (score > 0) {
        const content = await this.loadEntryContent(entry);
        const excerpt = this.extractRelevantExcerpt(content, queryTerms);
        const matchedTopics = entry.topics.filter(topic => 
          queryTerms.some(term => topic.includes(term))
        );

        results.push({
          entry,
          relevanceScore: score,
          matchedTopics,
          excerpt
        });
      }
    }

    // Sort by relevance score and priority
    results.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const scoreA = a.relevanceScore * priorityWeight[a.entry.priority];
      const scoreB = b.relevanceScore * priorityWeight[b.entry.priority];
      return scoreB - scoreA;
    });

    return results.slice(0, maxResults);
  }

  /**
   * Get specific knowledge for common cultivation questions
   */
  async getQuickReference(topic: string): Promise<string | null> {
    const topicMap: Record<string, string> = {
      'co2-levels': 'environmental-controls',
      'contamination': 'troubleshooting', 
      'substrate-recipe': 'substrate-recipes',
      'alert-bands': 'environmental-controls',
      'platform-features': 'platform-features'
    };

    const entryId = topicMap[topic];
    if (!entryId) return null;

    const entry = this.knowledgeEntries.get(entryId);
    if (!entry) return null;

    return this.loadEntryContent(entry);
  }

  /**
   * Get CO₂ decision tree for specific conditions
   */
  getCO2DecisionTree(phase: string, co2Level: number): any {
    if (phase === 'Fruiting') {
      if (co2Level < 400 || co2Level > 600) {
        return {
          severity: 'HIGH',
          action: [
            'Verify fan/FAE cycle timer',
            'Run fresh-air exchange for +2 min now', 
            'Retest CO₂ after 10 min'
          ],
          escalate: 'If CO₂ not in 400-600 ppm after 3 cycles → open intake damper 10%'
        };
      } else if (co2Level >= 601 && co2Level <= 800) {
        return {
          severity: 'MEDIUM',
          action: ['Increase FAE by 10%', 'Schedule follow-up reading in 30 min']
        };
      } else if (co2Level >= 350 && co2Level <= 399) {
        return {
          severity: 'LOW', 
          action: ['Slightly reduce FAE (-5%) to avoid desiccation']
        };
      }
    }
    
    // Add other phases as needed
    return null;
  }

  /**
   * Calculate relevance score for search query
   */
  private calculateRelevanceScore(queryTerms: string[], entry: KnowledgeBaseEntry): number {
    let score = 0;
    
    // Check topic matches (high weight)
    entry.topics.forEach(topic => {
      queryTerms.forEach(term => {
        if (topic.includes(term)) score += 10;
      });
    });

    // Check ID matches (medium weight)
    queryTerms.forEach(term => {
      if (entry.id.includes(term)) score += 5;
    });

    return score;
  }

  /**
   * Load content from knowledge base file
   */
  private async loadEntryContent(entry: KnowledgeBaseEntry): Promise<string> {
    if (entry.content) return entry.content;

    try {
      const response = await fetch(`/knowledge-base/${entry.path.replace('./', '')}`);
      const content = await response.text();
      entry.content = content;
      entry.lastAccessed = new Date();
      return content;
    } catch (error) {
      console.error(`Failed to load content for ${entry.id}:`, error);
      return '';
    }
  }

  /**
   * Extract relevant excerpt from content
   */
  private extractRelevantExcerpt(content: string, queryTerms: string[]): string {
    const lines = content.split('\n');
    const relevantLines: string[] = [];

    lines.forEach(line => {
      if (queryTerms.some(term => line.toLowerCase().includes(term))) {
        relevantLines.push(line.trim());
      }
    });

    return relevantLines.slice(0, 3).join(' ').substring(0, 200) + '...';
  }

  /**
   * Get alert band information for environmental parameters
   */
  getAlertBands(parameter: string, phase: string): any {
    const alertBands = {
      co2: {
        Fruiting: { green: '400-600 ppm', yellow: '350-399 / 601-800 ppm', red: '<350 or >800 ppm' },
        Colonize: { green: '≤1000 ppm', yellow: '1001-1500 ppm', red: '>1500 ppm' },
        Incubate: { green: '≤1200 ppm', yellow: '1201-1800 ppm', red: '>1800 ppm' }
      }
    };

    const parameterData = alertBands[parameter as keyof typeof alertBands];
    if (!parameterData) return null;
    
    return parameterData[phase as keyof typeof parameterData];
  }

  /**
   * Format response for Crowe Logic AI
   */
  formatAIResponse(results: SearchResult[], query: string): string {
    if (results.length === 0) {
      return "I don't have specific information about that in my knowledge base. Could you provide more details or rephrase your question?";
    }

    let response = '';
    const topResult = results[0];

    // Priority-based response formatting
    if (topResult.entry.priority === 'high') {
      response += '🚨 **Important**: ';
    }

    response += topResult.excerpt;

    if (results.length > 1) {
      response += '\n\n**Related information:**\n';
      results.slice(1, 3).forEach(result => {
        response += `• ${result.entry.id}: ${result.excerpt.substring(0, 100)}...\n`;
      });
    }

    return response;
  }
}

// Export singleton instance
export const croweLogicKB = new CroweLogicKnowledgeBase();
