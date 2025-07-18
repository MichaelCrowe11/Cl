import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe only if the secret key is available
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil',
    })
  : null;

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  stripePriceId: string; // Add Stripe Price ID
  features: string[];
  limits: {
    apiCallsPerMonth: number;
    projectsLimit: number;
    storageGB: number;
  };
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    stripePriceId: '', // Free plan doesn't need Stripe price ID
    features: [
      '10 AI generations per day',
      '1 project',
      '100MB storage',
      'Community support'
    ],
    limits: {
      apiCallsPerMonth: 300,
      projectsLimit: 1,
      storageGB: 0.1
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29.99,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_placeholder',
    features: [
      'Unlimited AI generations',
      '10 projects',
      '5GB storage',
      'Priority support',
      'Advanced IDE features',
      'Export capabilities'
    ],
    limits: {
      apiCallsPerMonth: -1, // unlimited
      projectsLimit: 10,
      storageGB: 5
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99.99,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise_placeholder',
    features: [
      'Everything in Pro',
      'Unlimited projects',
      '50GB storage',
      'Custom integrations',
      'SSO support',
      'Dedicated support',
      'On-premise deployment'
    ],
    limits: {
      apiCallsPerMonth: -1,
      projectsLimit: -1,
      storageGB: 50
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'plans':
        return NextResponse.json({ plans: SUBSCRIPTION_PLANS });

      case 'usage':
        const userId = searchParams.get('userId');
        if (!userId) {
          return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }
        
        const usage = await getUserUsage(userId);
        return NextResponse.json({ usage });

      case 'subscription':
        const email = searchParams.get('email');
        if (!email) {
          return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }
        
        const subscription = await getUserSubscription(email);
        return NextResponse.json({ subscription });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Billing API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Billing system not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { action, userId, email, planId, successUrl, cancelUrl } = body;

    switch (action) {
      case 'create-checkout-session':
        if (!email || !planId) {
          return NextResponse.json(
            { error: 'Email and plan ID required' },
            { status: 400 }
          );
        }

        const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
        if (!plan || plan.id === 'free') {
          return NextResponse.json(
            { error: 'Invalid plan' },
            { status: 400 }
          );
        }

        const session = await stripe.checkout.sessions.create({
          mode: 'subscription',
          payment_method_types: ['card'],
          customer_email: email,
          line_items: [
            {
              price: plan.stripePriceId, // Use pre-defined Stripe price ID
              quantity: 1,
            },
          ],
          success_url: successUrl || `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/pricing`,
          metadata: {
            userId: userId || '',
            planId,
          },
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });

      case 'create-portal-session':
        if (!email) {
          return NextResponse.json(
            { error: 'Email required' },
            { status: 400 }
          );
        }

        // Find the customer by email
        const customers = await stripe.customers.list({
          email,
          limit: 1,
        });

        if (customers.data.length === 0) {
          return NextResponse.json(
            { error: 'No subscription found' },
            { status: 404 }
          );
        }

        const portalSession = await stripe.billingPortal.sessions.create({
          customer: customers.data[0].id,
          return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
        });

        return NextResponse.json({ url: portalSession.url });

      case 'track-usage':
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID required' },
            { status: 400 }
          );
        }

        await trackUsage(userId, body.usage);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Billing API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getUserSubscription(email: string) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return {
        plan: 'free',
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      };
    }

    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return {
        plan: 'free',
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      };
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return {
        plan: 'free',
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      };
    }

    const subscription = subscriptions.data[0];
    const planId = subscription.items.data[0].price.metadata?.planId || 'pro';

    return {
      plan: planId,
      status: subscription.status,
      currentPeriodEnd: (subscription as any).current_period_end ? (subscription as any).current_period_end * 1000 : null,
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end || false
    };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return {
      plan: 'free',
      status: 'active',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false
    };
  }
}

async function getUserUsage(userId: string) {
  // In a real app, this would query your database
  // For now, return mock data
  return {
    apiCallsThisMonth: 45,
    projectsCreated: 2,
    storageUsedGB: 0.8,
    lastUpdated: new Date().toISOString()
  };
}

async function trackUsage(userId: string, usage: any) {
  // In a real app, this would update your database
  console.log('Tracking usage for user:', userId, usage);
  return true;
}
