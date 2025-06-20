import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Sparkles, BrainCircuit, FlaskConical, BarChart3, Shield } from "lucide-react"
import Image from "next/image"

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Analysis",
    description: "Advanced mycology expertise with real-time substrate optimization and contamination risk assessment.",
  },
  {
    icon: FlaskConical,
    title: "Protocol Generation",
    description:
      "Automatically generate SOPs, batch tracking sheets, and cultivation protocols tailored to your setup.",
  },
  {
    icon: BarChart3,
    title: "Yield Prediction",
    description: "Predict harvest yields and optimize growing conditions using machine learning algorithms.",
  },
  {
    icon: Shield,
    title: "Contamination Prevention",
    description: "Early detection and prevention strategies based on environmental monitoring and pattern recognition.",
  },
]

export default function LandingPage() {
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
            <Link href="/">
              <Button variant="ghost">Try Demo</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/pricing">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          <Sparkles className="h-3 w-3 mr-1" />
          Powered by Advanced AI
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Professional Mycology Lab Assistant
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Optimize your mushroom cultivation with AI-powered substrate analysis, yield predictions, and contamination
          prevention. Trusted by commercial growers and research labs worldwide.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="text-lg px-8">
              Try Demo Now
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Crown className="h-5 w-5 mr-2" />
              View Pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Mycology Intelligence</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Leverage cutting-edge AI to optimize every aspect of your mushroom cultivation process
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto text-center">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Lab?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of mycologists using Crowe Logic AI to increase yields and reduce contamination
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="text-lg px-8">
                  Start Free Demo
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Subscribe for $29/month
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Image src="/crowe-avatar.png" alt="Crowe Logic AI" width={24} height={24} className="rounded-full" />
              <span className="font-semibold">Crowe Logic AI</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
