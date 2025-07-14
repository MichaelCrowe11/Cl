/**
 * React Hook for Crowe Logic AI Knowledge Base Integration
 * Provides easy access to mushroom cultivation knowledge within React components
 */

import { useState, useCallback, useEffect } from 'react';
import { croweLogicKB, SearchResult } from '@/lib/crowe-logic-knowledge-base';

interface UseKnowledgeBaseReturn {
  search: (query: string) => Promise<SearchResult[]>;
  getQuickReference: (topic: string) => Promise<string | null>;
  getCO2Guidance: (phase: string, co2Level: number) => any;
  getAlertInfo: (parameter: string, phase: string) => any;
  isLoading: boolean;
  error: string | null;
}

export function useCroweLogicKnowledge(): UseKnowledgeBaseReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string): Promise<SearchResult[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await croweLogicKB.search(query);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getQuickReference = useCallback(async (topic: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const content = await croweLogicKB.getQuickReference(topic);
      return content;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get reference');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCO2Guidance = useCallback((phase: string, co2Level: number) => {
    try {
      return croweLogicKB.getCO2DecisionTree(phase, co2Level);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get CO2 guidance');
      return null;
    }
  }, []);

  const getAlertInfo = useCallback((parameter: string, phase: string) => {
    try {
      return croweLogicKB.getAlertBands(parameter, phase);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get alert info');
      return null;
    }
  }, []);

  return {
    search,
    getQuickReference,
    getCO2Guidance,
    getAlertInfo,
    isLoading,
    error
  };
}

/**
 * Hook for enhanced chat responses with knowledge base integration
 */
export function useCroweLogicChat() {
  const knowledge = useCroweLogicKnowledge();
  const [chatHistory, setChatHistory] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    knowledgeUsed?: string[];
  }>>([]);

  const processUserMessage = useCallback(async (message: string) => {
    // Add user message to history
    setChatHistory(prev => [...prev, {
      role: 'user',
      content: message,
      timestamp: new Date()
    }]);

    try {
      // Search knowledge base for relevant information
      const searchResults = await knowledge.search(message);
      
      let response = '';
      const knowledgeUsed: string[] = [];

      if (searchResults.length > 0) {
        // Format response based on search results
        response = croweLogicKB.formatAIResponse(searchResults, message);
        knowledgeUsed.push(...searchResults.map(r => r.entry.id));
      } else {
        // Fallback response
        response = "I'd be happy to help with your mushroom cultivation question. Could you provide more specific details? I have extensive knowledge about environmental controls, substrate recipes, troubleshooting, and platform features.";
      }

      // Add assistant response to history
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        knowledgeUsed
      }]);

      return response;
    } catch (error) {
      const errorMessage = "I'm experiencing some difficulty accessing my knowledge base. Please try again or contact support if the issue persists.";
      
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      }]);

      return errorMessage;
    }
  }, [knowledge]);

  const clearHistory = useCallback(() => {
    setChatHistory([]);
  }, []);

  return {
    chatHistory,
    processUserMessage,
    clearHistory,
    isLoading: knowledge.isLoading,
    error: knowledge.error
  };
}
