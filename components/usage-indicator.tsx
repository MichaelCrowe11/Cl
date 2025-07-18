'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Zap, FileText, AlertCircle, ChevronDown, Crown } from 'lucide-react';

interface UsageIndicatorProps {
  compact?: boolean;
  showDetails?: boolean;
  className?: string;
}

interface UsageData {
  tokensUsed: number;
  tokenLimit: number;
  filesUploaded: number;
  fileLimit: number;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
}

export const UsageIndicator: React.FC<UsageIndicatorProps> = ({
  compact = false,
  showDetails = true,
  className = ''
}) => {
  const { data: session } = useSession();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUsage = async () => {
    if (!session || loading) return;

    try {
      setLoading(true);
      const response = await fetch('/api/usage');
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
    // Refresh every 2 minutes
    const interval = setInterval(fetchUsage, 120000);
    return () => clearInterval(interval);
  }, [session]);

  if (!session || !usage) return null;

  const tokenPercentage = usage.tokenLimit > 0 ? (usage.tokensUsed / usage.tokenLimit) * 100 : 0;
  const filePercentage = usage.fileLimit > 0 ? (usage.filesUploaded / usage.fileLimit) * 100 : 0;
  
  const isTokenNearLimit = tokenPercentage >= 80;
  const isFileNearLimit = filePercentage >= 80;
  const isTokenOverLimit = tokenPercentage >= 100;
  const isFileOverLimit = filePercentage >= 100;
  
  const hasAlert = isTokenNearLimit || isFileNearLimit || isTokenOverLimit || isFileOverLimit;
  const isUnlimited = usage.plan === 'ENTERPRISE';

  const getStatusColor = () => {
    if (isUnlimited) return 'text-purple-600 bg-purple-50 border-purple-200';
    if (isTokenOverLimit || isFileOverLimit) return 'text-red-600 bg-red-50 border-red-200';
    if (hasAlert) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const formatUsage = (used: number, limit: number) => {
    if (limit === -1 || isUnlimited) return '∞';
    return `${used}/${limit}`;
  };

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center space-x-2 px-3 py-1 rounded-lg border text-xs font-medium transition-colors ${getStatusColor()}`}
        >
          {isUnlimited && <Crown className="w-3 h-3" />}
          {hasAlert && !isUnlimited && <AlertCircle className="w-3 h-3" />}
          <span>{usage.plan}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>

        {expanded && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-blue-600" />
                  <span className="text-xs text-gray-600">Tokens</span>
                </div>
                <span className="text-xs font-medium">
                  {formatUsage(usage.tokensUsed, usage.tokenLimit)}
                </span>
              </div>
              
              {!isUnlimited && (
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full ${isTokenOverLimit ? 'bg-red-500' : isTokenNearLimit ? 'bg-orange-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(tokenPercentage, 100)}%` }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <FileText className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-gray-600">Files</span>
                </div>
                <span className="text-xs font-medium">
                  {formatUsage(usage.filesUploaded, usage.fileLimit)}
                </span>
              </div>
              
              {!isUnlimited && (
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full ${isFileOverLimit ? 'bg-red-500' : isFileNearLimit ? 'bg-orange-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(filePercentage, 100)}%` }}
                  />
                </div>
              )}

              {(isTokenOverLimit || isFileOverLimit) && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-red-600 font-medium">
                    ⚠️ Limits exceeded
                  </p>
                  {usage.plan === 'FREE' && (
                    <a href="/pricing" className="text-xs text-blue-600 underline">
                      Upgrade to continue
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()} ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isUnlimited && <Crown className="w-4 h-4" />}
          {hasAlert && !isUnlimited && <AlertCircle className="w-4 h-4" />}
          <span className="font-medium">{usage.plan} Plan</span>
        </div>
        {showDetails && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs underline"
          >
            {expanded ? 'Hide' : 'Show'} Details
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="flex items-center space-x-1 mb-1">
            <Zap className="w-3 h-3" />
            <span>Tokens</span>
          </div>
          <div className="font-medium">
            {formatUsage(usage.tokensUsed, usage.tokenLimit)}
          </div>
          {!isUnlimited && (
            <div className="w-full bg-white bg-opacity-50 rounded-full h-1 mt-1">
              <div
                className={`h-1 rounded-full ${isTokenOverLimit ? 'bg-red-600' : isTokenNearLimit ? 'bg-orange-600' : 'bg-current'}`}
                style={{ width: `${Math.min(tokenPercentage, 100)}%` }}
              />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center space-x-1 mb-1">
            <FileText className="w-3 h-3" />
            <span>Files</span>
          </div>
          <div className="font-medium">
            {formatUsage(usage.filesUploaded, usage.fileLimit)}
          </div>
          {!isUnlimited && (
            <div className="w-full bg-white bg-opacity-50 rounded-full h-1 mt-1">
              <div
                className={`h-1 rounded-full ${isFileOverLimit ? 'bg-red-600' : isFileNearLimit ? 'bg-orange-600' : 'bg-current'}`}
                style={{ width: `${Math.min(filePercentage, 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {expanded && showDetails && (
        <div className="mt-3 pt-3 border-t border-current border-opacity-20">
          <div className="text-xs space-y-1">
            {isUnlimited ? (
              <p>🚀 Unlimited usage with Enterprise plan</p>
            ) : (
              <>
                {(isTokenOverLimit || isFileOverLimit) && (
                  <p className="font-medium">⚠️ Usage limits exceeded</p>
                )}
                {hasAlert && !(isTokenOverLimit || isFileOverLimit) && (
                  <p className="font-medium">⚡ Approaching limits</p>
                )}
                <p>Limits reset daily at midnight UTC</p>
                {usage.plan === 'FREE' && (
                  <p>
                    <a href="/pricing" className="underline">Upgrade to Pro</a> for higher limits
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageIndicator;
