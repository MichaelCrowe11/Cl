import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Crown, Zap, Book, ArrowRight, X, Sparkles } from 'lucide-react';

interface SubscriptionNotificationProps {
  className?: string;
  showRAGFeatures?: boolean;
}

export const SubscriptionNotification: React.FC<SubscriptionNotificationProps> = ({
  className = '',
  showRAGFeatures = true
}) => {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const [plan, setPlan] = useState<'FREE' | 'PRO' | 'ENTERPRISE'>('FREE');

  useEffect(() => {
    // Fetch user's current plan
    fetchUserPlan();
  }, [session]);

  const fetchUserPlan = async () => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch('/api/usage');
      if (response.ok) {
        const data = await response.json();
        setPlan(data.plan || 'FREE');
      }
    } catch (error) {
      console.error('Failed to fetch user plan:', error);
    }
  };

  if (!isVisible || !session) return null;

  const getNotificationContent = () => {
    switch (plan) {
      case 'FREE':
        return {
          title: 'Unlock AI-Powered Development',
          subtitle: 'Upgrade to Pro for enhanced AI features and RAG-powered knowledge assistance',
          features: [
            '10,000 daily AI tokens (10x more)',
            '25 daily file uploads',
            'Advanced RAG knowledge search',
            'Priority AI model access',
            'Enhanced code completion'
          ],
          cta: 'Upgrade to Pro - $29.99/month',
          ctaLink: '/pricing',
          bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          borderColor: 'border-blue-200',
          icon: <Zap className="w-6 h-6 text-blue-600" />
        };
      
      case 'PRO':
        return {
          title: 'Go Unlimited with Enterprise',
          subtitle: 'Unlock unlimited AI usage and advanced RAG capabilities for your team',
          features: [
            'Unlimited AI tokens and uploads',
            'Custom knowledge base integration',
            'Advanced RAG document processing',
            'Team collaboration features',
            'Priority support'
          ],
          cta: 'Upgrade to Enterprise - $99.99/month',
          ctaLink: '/pricing',
          bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50',
          borderColor: 'border-purple-200',
          icon: <Crown className="w-6 h-6 text-purple-600" />
        };
      
      case 'ENTERPRISE':
        return {
          title: 'Welcome to Enterprise',
          subtitle: 'You have access to all CroweOS features including unlimited RAG capabilities',
          features: [
            'Unlimited AI tokens and uploads',
            'Full RAG knowledge base access',
            'Custom document processing',
            'Advanced team features',
            'Dedicated support'
          ],
          cta: 'Explore RAG Features',
          ctaLink: '/test/rag',
          bgColor: 'bg-gradient-to-r from-emerald-50 to-teal-50',
          borderColor: 'border-emerald-200',
          icon: <Sparkles className="w-6 h-6 text-emerald-600" />
        };
    }
  };

  const content = getNotificationContent();

  return (
    <div className={`${content.bgColor} border ${content.borderColor} rounded-lg p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            {content.icon}
            <div className="ml-3">
              <h3 className="font-semibold text-gray-900">{content.title}</h3>
              <p className="text-sm text-gray-600">{content.subtitle}</p>
            </div>
          </div>

          {showRAGFeatures && (
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Book className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {plan === 'ENTERPRISE' ? 'Active RAG Features:' : 'Available RAG Features:'}
                </span>
              </div>
              <ul className="space-y-1">
                {content.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-current rounded-full mr-3 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <a
              href={content.ctaLink}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                plan === 'ENTERPRISE'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : plan === 'PRO'
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {content.cta}
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            
            {plan !== 'ENTERPRISE' && (
              <a
                href="/test/rag"
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Book className="w-4 h-4 mr-2" />
                Try RAG Demo
              </a>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SubscriptionNotification;