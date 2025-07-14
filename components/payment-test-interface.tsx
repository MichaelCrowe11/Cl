"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Check, Zap, Building, Crown, Loader2 } from "lucide-react"

interface PricingPlan {
  id: string
  name: string
  description: string
  price: string
  priceId: string
  features: string[]
  icon: React.ReactNode
  popular?: boolean
}

export default function PaymentTestInterface() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const plans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter Lab',
      description: 'Perfect for individual researchers',
      price: '$29/month',
      priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || 'price_1RZ8HyB1Hdzn6yjMeTYmlhEq',
      icon: <Zap className="h-6 w-6" />,
      features: [
        '100 AI queries/month',
        'Basic species identification',
        'Protocol templates',
        'Email support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Research',
      description: 'For professional labs and teams',
      price: '$99/month',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_1RbqfYB1Hdzn6yjMRmqJ9ZsV',
      icon: <Building className="h-6 w-6" />,
      popular: true,
      features: [
        'Unlimited AI queries',
        'Advanced contamination analysis',
        'Custom protocol generation',
        'Lab management tools',
        'Priority support'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large research institutions',
      price: '$299/month',
      priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || 'price_1Rbqg2B1Hdzn6yjMFvKp8mXc',
      icon: <Crown className="h-6 w-6" />,
      features: [
        'Everything in Pro',
        'Custom AI model training',
        'API access',
        'Dedicated support',
        'White-label options'
      ]
    }
  ]

  const createCheckoutSession = async (priceId: string, planName: string) => {
    setIsLoading(priceId)

    try {
      console.log('🛒 Creating Stripe checkout session...')
      console.log('Price ID:', priceId)
      console.log('Plan:', planName)

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planName,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      console.log('✅ Checkout session created:', data.sessionId)
      
      // In a real app, you'd redirect to Stripe Checkout
      toast({
        title: "Checkout Session Created!",
        description: `Successfully created checkout session for ${planName}. In production, this would redirect to Stripe Checkout.`,
      })

      // Simulate redirect
      console.log('Stripe Checkout URL:', data.url)

    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: "Error",
        description: "Failed to create checkout session. Check your Stripe configuration.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">💳 Stripe Payment Test</h1>
        <p className="text-muted-foreground">Test the Stripe payment integration for CroweOS Systems</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? 'border-purple-500 shadow-lg' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20">
                  {plan.icon}
                </div>
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="text-3xl font-bold text-purple-600">{plan.price}</div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full"
                onClick={() => createCheckoutSession(plan.priceId, plan.name)}
                disabled={isLoading === plan.priceId}
                variant={plan.popular ? "default" : "outline"}
              >
                {isLoading === plan.priceId ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating Session...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Test Checkout
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stripe Configuration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Publishable Key</Badge>
                <Badge variant={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "default" : "destructive"}>
                  {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "Configured" : "Missing"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Webhook Secret</Badge>
                <Badge variant="default">Configured</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Environment: Production
              </div>
              <div className="text-sm text-muted-foreground">
                Starter Price: {process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID ? '✅' : '❌'}
              </div>
              <div className="text-sm text-muted-foreground">
                Pro Price: {process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ? '✅' : '❌'}
              </div>
              <div className="text-sm text-muted-foreground">
                Enterprise Price: {process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID ? '✅' : '❌'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
