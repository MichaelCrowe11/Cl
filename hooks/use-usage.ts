import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export interface UsageData {
  tokensUsed: number;
  tokenLimit: number;
  filesUploaded: number;
  fileLimit: number;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  resetTime: string;
  dailyHistory?: Array<{
    date: string;
    tokens: number;
    files: number;
  }>;
}

export interface UsageTracking {
  trackTokenUsage: (tokens: number) => Promise<boolean>;
  trackFileUpload: () => Promise<boolean>;
  checkCanUseTokens: (tokens: number) => boolean;
  checkCanUploadFile: () => boolean;
}

export const useUsage = () => {
  const { data: session } = useSession();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    if (!session) {
      setUsage(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/usage', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch usage: ${response.statusText}`);
      }

      const data = await response.json();
      setUsage(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load usage data';
      setError(errorMessage);
      console.error('Usage fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const trackTokenUsage = useCallback(async (tokens: number): Promise<boolean> => {
    if (!session) return false;

    try {
      const response = await fetch('/api/usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'tokens',
          amount: tokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Token tracking failed:', errorData);
        return false;
      }

      // Refresh usage data after tracking
      await fetchUsage();
      return true;
    } catch (err) {
      console.error('Error tracking token usage:', err);
      return false;
    }
  }, [session, fetchUsage]);

  const trackFileUpload = useCallback(async (): Promise<boolean> => {
    if (!session) return false;

    try {
      const response = await fetch('/api/usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'file',
          amount: 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('File tracking failed:', errorData);
        return false;
      }

      // Refresh usage data after tracking
      await fetchUsage();
      return true;
    } catch (err) {
      console.error('Error tracking file upload:', err);
      return false;
    }
  }, [session, fetchUsage]);

  const checkCanUseTokens = useCallback((tokens: number): boolean => {
    if (!usage) return false;
    if (usage.plan === 'ENTERPRISE' || usage.tokenLimit === -1) return true;
    return (usage.tokensUsed + tokens) <= usage.tokenLimit;
  }, [usage]);

  const checkCanUploadFile = useCallback((): boolean => {
    if (!usage) return false;
    if (usage.plan === 'ENTERPRISE' || usage.fileLimit === -1) return true;
    return (usage.filesUploaded + 1) <= usage.fileLimit;
  }, [usage]);

  // Auto-refresh usage data
  useEffect(() => {
    fetchUsage();
    
    // Refresh every 2 minutes when user is active
    const interval = setInterval(fetchUsage, 120000);
    
    return () => clearInterval(interval);
  }, [fetchUsage]);

  // Calculate derived states
  const isUnlimited = usage?.plan === 'ENTERPRISE';
  const tokenPercentage = usage?.tokenLimit ? (usage.tokensUsed / usage.tokenLimit) * 100 : 0;
  const filePercentage = usage?.fileLimit ? (usage.filesUploaded / usage.fileLimit) * 100 : 0;
  
  const isTokenNearLimit = tokenPercentage >= 80 && !isUnlimited;
  const isFileNearLimit = filePercentage >= 80 && !isUnlimited;
  const isTokenOverLimit = tokenPercentage >= 100 && !isUnlimited;
  const isFileOverLimit = filePercentage >= 100 && !isUnlimited;
  
  const hasWarning = isTokenNearLimit || isFileNearLimit;
  const hasError = isTokenOverLimit || isFileOverLimit;

  const tracking: UsageTracking = {
    trackTokenUsage,
    trackFileUpload,
    checkCanUseTokens,
    checkCanUploadFile,
  };

  return {
    usage,
    loading,
    error,
    tracking,
    refresh: fetchUsage,
    
    // Computed states
    isUnlimited,
    tokenPercentage,
    filePercentage,
    isTokenNearLimit,
    isFileNearLimit,
    isTokenOverLimit,
    isFileOverLimit,
    hasWarning,
    hasError,
    
    // Helper functions
    canUseTokens: checkCanUseTokens,
    canUploadFile: checkCanUploadFile,
  };
};

export default useUsage;
