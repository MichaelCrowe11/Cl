'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { RefreshCw, TrendingUp, Calendar, Clock } from 'lucide-react';
import { UsageBar } from './usage-bar';

interface UsageData {
  tokensUsed: number;
  tokenLimit: number;
  filesUploaded: number;
  fileLimit: number;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  resetTime: string;
  dailyHistory: Array<{
    date: string;
    tokens: number;
    files: number;
  }>;
}

export const UsageDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = async () => {
    if (status === "loading") return;
    if (!session) {
      // Set demo data for unauthenticated users
      setUsage({
        tokensUsed: 2500,
        tokenLimit: 10000,
        filesUploaded: 12,
        fileLimit: 50,
        plan: 'FREE',
        resetTime: '2024-01-20T00:00:00Z',
        dailyHistory: [
          { date: '2024-01-14', tokens: 300, files: 2 },
          { date: '2024-01-15', tokens: 450, files: 3 },
          { date: '2024-01-16', tokens: 200, files: 1 },
          { date: '2024-01-17', tokens: 800, files: 4 },
          { date: '2024-01-18', tokens: 350, files: 1 },
          { date: '2024-01-19', tokens: 400, files: 1 }
        ]
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/usage');
      
      if (!response.ok) {
        throw new Error('Failed to fetch usage data');
      }

      const data = await response.json();
      setUsage(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load usage data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
    // Refresh usage data every 30 seconds
    const interval = setInterval(fetchUsage, 30000);
    return () => clearInterval(interval);
  }, [session]);

  const getTimeUntilReset = () => {
    if (!usage?.resetTime) return '';
    
    const resetTime = new Date(usage.resetTime);
    const now = new Date();
    const diff = resetTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Resets soon';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `Resets in ${hours}h ${minutes}m`;
    }
    return `Resets in ${minutes}m`;
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'ENTERPRISE': return 'text-purple-600 bg-purple-100';
      case 'PRO': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!session) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">Please sign in to view usage statistics.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading usage data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={fetchUsage}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!usage) {
    return (
      <div className="bg-gray-50 border rounded-lg p-4">
        <p className="text-gray-600">No usage data available.</p>
      </div>
    );
  }

  const isNearAnyLimit = 
    (usage.tokenLimit > 0 && usage.tokensUsed / usage.tokenLimit >= 0.8) ||
    (usage.fileLimit > 0 && usage.filesUploaded / usage.fileLimit >= 0.8);

  const isOverAnyLimit = 
    (usage.tokenLimit > 0 && usage.tokensUsed >= usage.tokenLimit) ||
    (usage.fileLimit > 0 && usage.filesUploaded >= usage.fileLimit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Usage Dashboard</h2>
            <p className="text-gray-600">Monitor your daily API usage and limits</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(usage.plan)}`}>
              {usage.plan} Plan
            </span>
            <button
              onClick={fetchUsage}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh usage data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reset Timer */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Clock className="w-4 h-4 mr-1" />
          {getTimeUntilReset()}
        </div>

        {/* Alert for limits */}
        {isOverAnyLimit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Usage Limit Exceeded
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  You&apos;ve reached your daily usage limits. 
                  {usage.plan === 'FREE' && (
                    <> <a href="/pricing" className="underline">Upgrade to Pro</a> for higher limits.</>
                  )}
                  {usage.plan === 'PRO' && (
                    <> <a href="/pricing" className="underline">Upgrade to Enterprise</a> for unlimited usage.</>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {isNearAnyLimit && !isOverAnyLimit && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-orange-800">
                  Approaching Usage Limits
                </h3>
                <p className="mt-1 text-sm text-orange-700">
                  You&apos;re approaching your daily limits. Consider upgrading to avoid interruptions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Usage Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UsageBar
          type="tokens"
          used={usage.tokensUsed}
          limit={usage.tokenLimit}
          plan={usage.plan}
        />
        
        <UsageBar
          type="files"
          used={usage.filesUploaded}
          limit={usage.fileLimit}
          plan={usage.plan}
        />
      </div>

      {/* Daily History Chart */}
      {usage.dailyHistory && usage.dailyHistory.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Usage History (Last 7 Days)</h3>
          </div>
          
          <div className="space-y-3">
            {usage.dailyHistory.slice(-7).map((day, index) => (
              <div key={day.date} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex space-x-4 text-sm">
                  <span className="text-blue-600">
                    {day.tokens.toLocaleString()} tokens
                  </span>
                  <span className="text-green-600">
                    {day.files} files
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageDashboard;
