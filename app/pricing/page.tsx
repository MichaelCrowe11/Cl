"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "7 days",
    description: "Perfect for getting started",
    features: [
      "Full access to Crowe Logic AI",
      "Up to 100 AI interactions",
      "Basic batch tracking",
      "Standard support",
      "All core features",
    ],
    cta: "Start Free Trial",
    popular: false,
    icon: Sparkles,
  },
  {
    name: "Professional",
    price: "$29",
    period: "month",
    description: "For serious mycology professionals",
    features: [
      "Unlimited AI interactions",
      "Advanced batch analytics",
      "Custom protocol generation",
      "Priority support",
      "Data export capabilities",
      "Advanced reporting",
      "API access",
      "Custom integrations",
    ],
    cta: "Subscribe Now",
    popular: true,
    icon: Crown,
  },
]

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (planName: string) => {
    setIsLoading(planName)

    if (planName === "Free Trial") {
      // Redirect to registration
      window.location.href = "/auth/register"
      return
    }

    try {
      // For paid plans, create Stripe checkout
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "temp-user-id", // This would come from auth context
          priceId: "price_1234567890", // Replace with actual Stripe price ID
        }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Subscription error:", error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/crowe-avatar.png" alt="Crowe Logic AI" width={32} height={32} className="rounded-full" />
            <span className="font-semibold text-lg">Crowe Logic AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with a free trial, then upgrade to unlock the full power of AI-driven mycology lab management
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <Card key={plan.name} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">Most Popular</Badge>
                )}

                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${plan.popular ? "bg-primary/10" : "bg-muted"}`}>
                      <Icon className={`h-8 w-8 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.name)}
                    disabled={isLoading === plan.name}
                  >
                    {isLoading === plan.name ? "Processing..." : plan.cta}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">What happens after my free trial?</h3>
              <p className="text-muted-foreground">
                After your 7-day free trial, you can choose to subscribe to our Professional plan for $29/month or
                continue with limited access.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your
                billing period.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Is my data secure?</h3>
              <p className="text-muted-foreground">
                Absolutely. We use enterprise-grade security measures and never share your lab data with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
