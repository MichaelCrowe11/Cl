// CroweOS RAG System - TypeScript Implementation
// Based on Google ADK RAG patterns, customized for Next.js

export interface RAGDocument {
  id: string;
  title: string;
  content: string;
  metadata: {
    source: string;
    type: 'documentation' | 'code' | 'tutorial' | 'api-ref';
    tags: string[];
    lastUpdated: string;
    url?: string;
  };
  embedding?: number[];
}

export interface RAGChunk {
  id: string;
  documentId: string;
  content: string;
  metadata: {
    title: string;
    source: string;
    chunkIndex: number;
    similarity?: number;
  };
}

export interface RAGConfig {
  similarityTopK: number;
  vectorDistanceThreshold: number;
  maxTokens: number;
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'gemini-pro';
}

export interface RAGResponse {
  answer: string;
  citations: Array<{
    title: string;
    source: string;
    url?: string;
    confidence: number;
  }>;
  chunks: RAGChunk[];
  metadata: {
    tokensUsed: number;
    retrievalTime: number;
    generationTime: number;
  };
}

export class CroweOSRAGEngine {
  private config: RAGConfig;
  private documents: Map<string, RAGDocument> = new Map();
  private chunks: Map<string, RAGChunk[]> = new Map();

  constructor(config: RAGConfig) {
    this.config = config;
  }

  // Core RAG functionality
  async query(question: string, userId?: string): Promise<RAGResponse> {
    const startTime = Date.now();
    
    // 1. Retrieve relevant chunks
    const retrievalStart = Date.now();
    const relevantChunks = await this.retrieveRelevantChunks(question);
    const retrievalTime = Date.now() - retrievalStart;

    // 2. Generate answer with citations
    const generationStart = Date.now();
    const { answer, citations, tokensUsed } = await this.generateAnswer(question, relevantChunks);
    const generationTime = Date.now() - generationStart;

    // 3. Track usage if userId provided
    if (userId) {
      await this.trackUsage(userId, tokensUsed);
    }

    return {
      answer,
      citations,
      chunks: relevantChunks,
      metadata: {
        tokensUsed,
        retrievalTime,
        generationTime,
      }
    };
  }

  // Document management
  async addDocument(document: RAGDocument): Promise<void> {
    this.documents.set(document.id, document);
    
    // Create chunks from document
    const chunks = await this.chunkDocument(document);
    this.chunks.set(document.id, chunks);
    
    console.log(`Added document: ${document.title} with ${chunks.length} chunks`);
  }

  async removeDocument(documentId: string): Promise<void> {
    this.documents.delete(documentId);
    this.chunks.delete(documentId);
    console.log(`Removed document: ${documentId}`);
  }

  // Chunk document into smaller pieces
  private async chunkDocument(document: RAGDocument): Promise<RAGChunk[]> {
    const chunks: RAGChunk[] = [];
    const chunkSize = 500; // words per chunk
    const overlap = 50; // word overlap between chunks
    
    const words = document.content.split(/\s+/);
    
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunkWords = words.slice(i, i + chunkSize);
      const chunkContent = chunkWords.join(' ');
      
      const chunk: RAGChunk = {
        id: `${document.id}_chunk_${Math.floor(i / (chunkSize - overlap))}`,
        documentId: document.id,
        content: chunkContent,
        metadata: {
          title: document.title,
          source: document.metadata.source,
          chunkIndex: Math.floor(i / (chunkSize - overlap))
        }
      };
      
      chunks.push(chunk);
    }
    
    return chunks;
  }

  // Retrieve relevant chunks using similarity search
  private async retrieveRelevantChunks(query: string): Promise<RAGChunk[]> {
    const allChunks: RAGChunk[] = [];
    
    // Collect all chunks from all documents
    for (const chunks of this.chunks.values()) {
      allChunks.push(...chunks);
    }

    // Simple keyword-based similarity (in production, use vector embeddings)
    const rankedChunks = allChunks
      .map(chunk => ({
        ...chunk,
        metadata: {
          ...chunk.metadata,
          similarity: this.calculateSimilarity(query, chunk.content)
        }
      }))
      .filter(chunk => chunk.metadata.similarity! >= this.config.vectorDistanceThreshold)
      .sort((a, b) => (b.metadata.similarity! - a.metadata.similarity!))
      .slice(0, this.config.similarityTopK);

    return rankedChunks;
  }

  // Simple similarity calculation (replace with vector similarity in production)
  private calculateSimilarity(query: string, content: string): number {
    const queryWords = query.toLowerCase().split(/\s+/);
    const contentWords = content.toLowerCase().split(/\s+/);
    
    const querySet = new Set(queryWords);
    const contentSet = new Set(contentWords);
    
    const intersection = new Set([...querySet].filter(x => contentSet.has(x)));
    const union = new Set([...querySet, ...contentSet]);
    
    return intersection.size / union.size; // Jaccard similarity
  }

  // Generate answer using LLM with retrieved context
  private async generateAnswer(question: string, chunks: RAGChunk[]): Promise<{
    answer: string;
    citations: Array<{
      title: string;
      source: string;
      url?: string;
      confidence: number;
    }>;
    tokensUsed: number;
  }> {
    const context = chunks.map(chunk => 
      `Source: ${chunk.metadata.title} (${chunk.metadata.source})\n${chunk.content}`
    ).join('\n\n---\n\n');

    const prompt = this.buildPrompt(question, context);
    
    // Call LLM API (OpenAI/Anthropic/etc.)
    const response = await this.callLLM(prompt);
    
    // Extract citations from response
    const citations = this.extractCitations(response, chunks);
    
    return {
      answer: response,
      citations,
      tokensUsed: this.estimateTokens(prompt + response),
    };
  }

  // Build prompt following Google ADK RAG patterns
  private buildPrompt(question: string, context: string): string {
    return `You are an AI assistant for CroweOS Pro IDE with access to specialized documentation and code references.

Your role is to provide accurate and concise answers based on the retrieved context below. 

CONTEXT:
${context}

QUESTION: ${question}

INSTRUCTIONS:
1. Answer the question using ONLY the information provided in the context above
2. If the context doesn't contain enough information, clearly state that
3. Include proper citations at the end of your answer
4. Use the format: [Source: Title (source)]
5. Be concise but comprehensive
6. Focus on practical, actionable information for developers

ANSWER:`;
  }

  // Call LLM API (placeholder - implement with actual API)
  private async callLLM(prompt: string): Promise<string> {
    // This would call OpenAI, Anthropic, or other LLM APIs
    // For now, return a placeholder
    return `Based on the provided documentation, I can help answer your question. [This would be replaced with actual LLM response]

Citations:
[Source: CroweOS Documentation (docs.croweos.com)]`;
  }

  // Extract citations from LLM response
  private extractCitations(response: string, chunks: RAGChunk[]): Array<{
    title: string;
    source: string;
    url?: string;
    confidence: number;
  }> {
    const citations: Array<{
      title: string;
      source: string;
      url?: string;
      confidence: number;
    }> = [];

    // Extract unique sources from chunks
    const uniqueSources = new Map<string, RAGChunk>();
    chunks.forEach(chunk => {
      const key = `${chunk.metadata.title}_${chunk.metadata.source}`;
      if (!uniqueSources.has(key)) {
        uniqueSources.set(key, chunk);
      }
    });

    // Create citations from unique sources
    uniqueSources.forEach(chunk => {
      const document = this.documents.get(chunk.documentId);
      citations.push({
        title: chunk.metadata.title,
        source: chunk.metadata.source,
        url: document?.metadata.url,
        confidence: chunk.metadata.similarity || 0.8
      });
    });

    return citations;
  }

  // Estimate token usage
  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  // Track usage (integrate with existing usage tracking)
  private async trackUsage(userId: string, tokens: number): Promise<void> {
    try {
      await fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'tokens', amount: tokens })
      });
    } catch (error) {
      console.error('Failed to track RAG usage:', error);
    }
  }
}

// Default configuration for CroweOS
export const defaultRAGConfig: RAGConfig = {
  similarityTopK: 5,
  vectorDistanceThreshold: 0.3,
  maxTokens: 4000,
  model: 'gpt-4'
};

// Factory function to create RAG engine
export function createCroweOSRAGEngine(config?: Partial<RAGConfig>): CroweOSRAGEngine {
  const finalConfig = { ...defaultRAGConfig, ...config };
  return new CroweOSRAGEngine(finalConfig);
}
