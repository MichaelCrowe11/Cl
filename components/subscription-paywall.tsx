'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Star, Crown } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  limits: {
    apiCallsPerMonth: number;
    projectsLimit: number;
    storageGB: number;
  };
}

interface UserUsage {
  apiCallsThisMonth: number;
  projectsCreated: number;
  storageUsedGB: number;
  lastUpdated: string;
}

interface UserSubscription {
  plan: string;
  status: string;
  currentPeriodEnd: number | null;
  cancelAtPeriodEnd: boolean;
}

export default function SubscriptionPaywall() {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingData();
  }, [session]);

  const fetchBillingData = async () => {
    try {
      // Fetch plans
      const plansResponse = await fetch('/api/billing?action=plans');
      const plansData = await plansResponse.json();
      setPlans(plansData.plans || []);

      if (session?.user?.email) {
        // Fetch current subscription
        const subResponse = await fetch(`/api/billing?action=subscription&email=${encodeURIComponent(session.user.email)}`);
        const subData = await subResponse.json();
        setSubscription(subData.subscription);

        // Fetch usage data
        const usageResponse = await fetch(`/api/billing?action=usage&userId=${session.user.email || 'demo'}`);
        const usageData = await usageResponse.json();
        setUsage(usageData.usage);
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!session?.user?.email) {
      alert('Please sign in to subscribe');
      return;
    }

    setProcessingPlan(planId);

    try {
      const response = await fetch('/api/billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create-checkout-session',
          email: session.user.email,
          planId,
          userId: session.user.email,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start subscription process. Please try again.');
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch('/api/billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create-portal-session',
          email: session.user.email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      alert('Failed to open billing portal. Please try again.');
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Zap className="h-6 w-6 text-green-500" />;
      case 'pro': return <Star className="h-6 w-6 text-blue-500" />;
      case 'enterprise': return <Crown className="h-6 w-6 text-purple-500" />;
      default: return <Zap className="h-6 w-6" />;
    }
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your CroweOS Pro IDE Plan
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Unlock the full potential of AI-powered development
        </p>
        
        {subscription && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <p className="text-blue-800">
              Current Plan: <strong className="capitalize">{subscription.plan}</strong>
              {subscription.plan !== 'free' && (
                <Button
                  onClick={handleManageSubscription}
                  variant="link"
                  className="ml-2 text-blue-600 p-0 h-auto"
                >
                  Manage Subscription
                </Button>
              )}
            </p>
          </div>
        )}
      </div>

      {usage && subscription && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">API Calls This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usage.apiCallsThisMonth}</div>
              <div className="text-xs text-gray-500">
                {plans.find(p => p.id === subscription.plan)?.limits.apiCallsPerMonth === -1 
                  ? 'Unlimited' 
                  : `of ${plans.find(p => p.id === subscription.plan)?.limits.apiCallsPerMonth || 0}`}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usage.projectsCreated}</div>
              <div className="text-xs text-gray-500">
                {plans.find(p => p.id === subscription.plan)?.limits.projectsLimit === -1 
                  ? 'Unlimited' 
                  : `of ${plans.find(p => p.id === subscription.plan)?.limits.projectsLimit || 0}`}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usage.storageUsedGB.toFixed(1)}GB</div>
              <div className="text-xs text-gray-500">
                of {plans.find(p => p.id === subscription.plan)?.limits.storageGB || 0}GB
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${
              plan.id === 'pro' 
                ? 'border-blue-500 border-2 shadow-lg' 
                : 'border-gray-200'
            }`}
          >
            {plan.id === 'pro' && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                {getPlanIcon(plan.id)}
              </div>
              <CardTitle className="text-2xl capitalize">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">${plan.price}</span>
                {plan.price > 0 && <span className="text-gray-500">/month</span>}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="space-y-2 text-xs text-gray-500 mb-6">
                <div>API Calls: {plan.limits.apiCallsPerMonth === -1 ? 'Unlimited' : plan.limits.apiCallsPerMonth.toLocaleString()}/month</div>
                <div>Projects: {plan.limits.projectsLimit === -1 ? 'Unlimited' : plan.limits.projectsLimit}</div>
                <div>Storage: {plan.limits.storageGB}GB</div>
              </div>
              
              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={
                  plan.id === 'free' || 
                  subscription?.plan === plan.id ||
                  processingPlan === plan.id
                }
                className={`w-full ${
                  plan.id === 'pro' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
                variant={subscription?.plan === plan.id ? 'outline' : 'default'}
              >
                {processingPlan === plan.id ? (
                  'Processing...'
                ) : subscription?.plan === plan.id ? (
                  'Current Plan'
                ) : plan.id === 'free' ? (
                  'Free Forever'
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>All plans include SSL, 99.9% uptime, and email support.</p>
        <p>Cancel anytime. No setup fees.</p>
      </div>
    </div>
  );
}
