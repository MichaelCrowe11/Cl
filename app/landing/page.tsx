'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Sparkles, Brain, FlaskConical, BarChart3, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  const router = useRouter()

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI models specialized in mycology research and substrate optimization'
    },
    {
      icon: FlaskConical,
      title: 'Lab Management',
      description: 'Track experiments, batches, and cultivation parameters in real-time'
    },
    {
      icon: BarChart3,
      title: 'Predictive Analytics',
      description: 'Forecast yields and optimize growing conditions with machine learning'
    },
    {
      icon: Shield,
      title: 'Contamination Detection',
      description: 'Early warning system for contamination risks and prevention strategies'
    },
    {
      icon: Zap,
      title: 'Real-time Monitoring',
      description: 'Live environmental data tracking and automated alerts'
    },
    {
      icon: Sparkles,
      title: 'Research Assistant',
      description: 'Get instant answers to complex mycology questions and research queries'
    }
  ]

  const pricingTiers = [
    {
      name: 'Researcher',
      price: 'Free',
      features: [
        '10 AI queries per day',
        'Basic cultivation tracking',
        'Community support',
        '1 active experiment'
      ],
      cta: 'Start Free',
      highlighted: false
    },
    {
      name: 'Professional',
      price: '$49',
      period: '/month',
      features: [
        'Unlimited AI queries',
        'Advanced analytics',
        'Priority support',
        'Unlimited experiments',
        'API access',
        'Custom reports'
      ],
      cta: 'Start Pro Trial',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: [
        'Everything in Pro',
        'Custom AI models',
        'Dedicated support',
        'On-premise deployment',
        'Team collaboration',
        'SLA guarantee'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-sm bg-background/80 z-50 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold">Crowe Logic AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-sm hover:text-primary">Documentation</Link>
            <Link href="/pricing" className="text-sm hover:text-primary">Pricing</Link>
            <Button variant="ghost" onClick={() => router.push('/auth/login')}>Sign In</Button>
            <Button onClick={() => router.push('/auth/register')}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Powered by Claude Opus & GPT-4</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Transform Your Mycology Research
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            The most advanced AI platform for mushroom cultivation, substrate optimization, 
            and fungal research. Accelerate your discoveries with intelligent automation.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => router.push('/auth/register')} className="gap-2">
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/demo')}>
              Watch Demo
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">10x</div>
              <div className="text-sm text-muted-foreground">Faster Research</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need for Mycology Excellence
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow"
              >
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Choose the plan that fits your research needs
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div 
                key={index}
                className={`rounded-xl p-8 ${
                  tier.highlighted 
                    ? 'border-2 border-primary bg-card shadow-xl scale-105' 
                    : 'border bg-card'
                }`}
              >
                {tier.highlighted && (
                  <div className="text-xs font-semibold text-primary mb-4">MOST POPULAR</div>
                )}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={tier.highlighted ? 'default' : 'outline'}
                  onClick={() => router.push('/auth/register')}
                >
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Revolutionize Your Research?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of researchers advancing mycology with AI
          </p>
          <Button size="lg" onClick={() => router.push('/auth/register')} className="gap-2">
            Start Your Free Trial <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
                <span className="font-bold">Crowe Logic AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Advanced AI for mycology research and cultivation optimization.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-primary">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-primary">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-primary">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary">About</Link></li>
                <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
                <li><Link href="/security" className="hover:text-primary">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 Crowe Logic AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
} 