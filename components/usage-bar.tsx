import React from 'react';
import { AlertTriangle, Zap, FileText, Crown } from 'lucide-react';

interface UsageBarProps {
  type: 'tokens' | 'files';
  used: number;
  limit: number;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  className?: string;
}

export const UsageBar: React.FC<UsageBarProps> = ({
  type,
  used,
  limit,
  plan,
  className = ''
}) => {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isNearLimit = percentage >= 80;
  const isOverLimit = percentage >= 100;
  const isUnlimited = limit === -1 || plan === 'ENTERPRISE';

  const getIcon = () => {
    if (type === 'tokens') return <Zap className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const getStatusColor = () => {
    if (isUnlimited) return 'text-purple-600';
    if (isOverLimit) return 'text-red-600';
    if (isNearLimit) return 'text-orange-600';
    return 'text-green-600';
  };

  const getBarColor = () => {
    if (isUnlimited) return 'bg-purple-500';
    if (isOverLimit) return 'bg-red-500';
    if (isNearLimit) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={`bg-white border rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={getStatusColor()}>
            {getIcon()}
          </div>
          <span className="font-medium text-gray-900">
            {type === 'tokens' ? 'AI Tokens' : 'File Uploads'}
          </span>
          {plan === 'ENTERPRISE' && (
            <Crown className="w-4 h-4 text-purple-600" />
          )}
        </div>
        {(isNearLimit || isOverLimit) && !isUnlimited && (
          <AlertTriangle className={`w-4 h-4 ${getStatusColor()}`} />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {isUnlimited ? 'Unlimited' : `${formatNumber(used)} / ${formatNumber(limit)}`}
          </span>
          <span className={`font-medium ${getStatusColor()}`}>
            {isUnlimited ? 'Enterprise' : `${percentage.toFixed(0)}%`}
          </span>
        </div>

        {!isUnlimited && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getBarColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        )}

        {isUnlimited && (
          <div className="w-full bg-purple-100 rounded-full h-2">
            <div className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 animate-pulse" />
          </div>
        )}

        {/* Status Messages */}
        {!isUnlimited && (
          <div className="text-xs">
            {isOverLimit && (
              <p className="text-red-600 font-medium">
                ⚠️ Limit exceeded! Upgrade your plan to continue.
              </p>
            )}
            {isNearLimit && !isOverLimit && (
              <p className="text-orange-600 font-medium">
                ⚡ Approaching limit. Consider upgrading soon.
              </p>
            )}
            {!isNearLimit && (
              <p className="text-green-600">
                ✅ Usage is within limits.
              </p>
            )}
          </div>
        )}

        {isUnlimited && (
          <p className="text-xs text-purple-600 font-medium">
            🚀 Unlimited usage with Enterprise plan
          </p>
        )}
      </div>
    </div>
  );
};

export default UsageBar;
