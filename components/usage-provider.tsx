'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface UsageData {
  tokensUsed: number;
  filesUploaded: number;
  tokenLimit: number;
  fileLimit: number;
  lastUpdate: Date;
}

interface UsageContextType {
  usage: UsageData;
  trackTokenUsage: (tokens: number) => Promise<void>;
  trackFileUpload: () => Promise<void>;
  checkCanUseTokens: (tokens: number) => boolean;
  checkCanUploadFile: () => boolean;
  resetUsage: () => void;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

interface UsageProviderProps {
  children: ReactNode;
}

export const UsageProvider: React.FC<UsageProviderProps> = ({ children }) => {
  const [usage, setUsage] = useState<UsageData>({
    tokensUsed: 0,
    filesUploaded: 0,
    tokenLimit: 10000, // Default limits
    fileLimit: 50,
    lastUpdate: new Date(),
  });

  const trackTokenUsage = useCallback(async (tokens: number) => {
    setUsage(prev => ({
      ...prev,
      tokensUsed: prev.tokensUsed + tokens,
      lastUpdate: new Date(),
    }));
  }, []);

  const trackFileUpload = useCallback(async () => {
    setUsage(prev => ({
      ...prev,
      filesUploaded: prev.filesUploaded + 1,
      lastUpdate: new Date(),
    }));
  }, []);

  const checkCanUseTokens = useCallback((tokens: number) => {
    return usage.tokensUsed + tokens <= usage.tokenLimit;
  }, [usage.tokensUsed, usage.tokenLimit]);

  const checkCanUploadFile = useCallback(() => {
    return usage.filesUploaded < usage.fileLimit;
  }, [usage.filesUploaded, usage.fileLimit]);

  const resetUsage = useCallback(() => {
    setUsage(prev => ({
      ...prev,
      tokensUsed: 0,
      filesUploaded: 0,
      lastUpdate: new Date(),
    }));
  }, []);

  const value: UsageContextType = {
    usage,
    trackTokenUsage,
    trackFileUpload,
    checkCanUseTokens,
    checkCanUploadFile,
    resetUsage,
  };

  return (
    <UsageContext.Provider value={value}>
      {children}
    </UsageContext.Provider>
  );
};

export const useUsageContext = (): UsageContextType => {
  const context = useContext(UsageContext);
  if (context === undefined) {
    throw new Error('useUsageContext must be used within a UsageProvider');
  }
  return context;
};
