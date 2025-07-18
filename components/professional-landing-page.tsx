"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { CroweLogo } from "@/components/crowe-logo"
import Image from "next/image"
import { 
  Brain, 
  Code2, 
  FlaskConical, 
  Microscope, 
  ChevronRight,
  CheckCircle,
  Star,
  Users,
  Zap,
  Shield,
  Award,
  ArrowRight
} from "lucide-react"

export default function LandingPage() {
  const [email, setEmail] = useState('')

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Crowe Logic AI Assistant",
      description: "ChatGPT-style interface with advanced mycology AI, species identification, and research assistance",
      badge: "AI Chat",
      href: "/chat"
    },
    {
      icon: <Code2 className="h-8 w-8" />,
      title: "Crowe Logic IDE Pro", 
      description: "Professional IDE with AI coder, database integration, file management, and intelligent mycology development tools",
      badge: "IDE Pro",
      href: "/ide-pro"
    },
    {
      icon: <FlaskConical className="h-8 w-8" />,
      title: "Lab Management Suite",
      description: "Batch tracking, protocol management, and automated monitoring systems",
      badge: "Lab Tools",
      href: "/platform"
    },
    {
      icon: <Microscope className="h-8 w-8" />,
      title: "Research Analytics",
      description: "Yield optimization, contamination prediction, and harvest timing analysis",
      badge: "Analytics",
      href: "/platform"
    }
  ]

  const testimonials = [
    {
      quote: "CroweOS Systems has revolutionized our lab efficiency. The AI assistant saves hours of research time daily.",
      author: "Dr. Sarah Chen",
      role: "Lead Mycologist, BioLab Research",
      rating: 5
    },
    {
      quote: "The dual interface approach is brilliant. Chat for quick questions, IDE for complex analysis.",
      author: "Michael Rodriguez",
      role: "Research Director, FungiFarms",
      rating: 5
    }
  ]

  const stats = [
    { label: "Research Facilities", value: "500+" },
    { label: "Species Analyzed", value: "10K+" },
    { label: "Time Saved", value: "40%" },
    { label: "Accuracy Rate", value: "99.2%" }
  ]

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Navigation */}
      <nav className="border-b bg-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <CroweLogo 
                  variant="official-circle"
                  size={40}
                  systemBranding={true}
                  showText={false}
                />
                <span className="ml-2 text-white font-semibold">Systems</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-lg text-white">CroweOS</span>
                  <span className="text-sm font-medium text-zinc-300 tracking-wider">SYSTEMS</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-zinc-300 hover:text-white transition-colors">Features</Link>
              <Link href="#pricing" className="text-zinc-300 hover:text-white transition-colors">Pricing</Link>
              <Link href="#about" className="text-zinc-300 hover:text-white transition-colors">About</Link>
              <div className="flex items-center">
                <ThemeToggle />
              </div>
              <Button variant="outline" className="border-white text-white hover:bg-zinc-800" asChild>
                <Link href="/platform">View Platform</Link>
              </Button>
              <Button className="bg-white text-zinc-900 hover:bg-zinc-100" asChild>
                <Link href="/platform">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 border-white text-white bg-zinc-900">
            🚀 Now Available: Enterprise Mycology Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Professional Mycology
            <br />
            Intelligence Platform
          </h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
            <div className="w-1/2 md:w-1/4 animate-float">
              <Image 
                src="/crowe-avatar.svg" 
                alt="Crowe Avatar" 
                width={300} 
                height={300} 
                className="w-full h-auto max-w-xs"
              />
            </div>
            <div className="w-full md:w-2/3">
              <p className="text-xl text-zinc-200 mb-6 max-w-3xl leading-relaxed">
                Advanced AI-powered research platform combining intelligent chat assistance with complete lab management IDE. 
                Accelerate your mycology research with professional-grade tools designed for serious researchers.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="text-lg px-8 py-4 bg-white text-zinc-900 hover:bg-zinc-100" asChild>
              <Link href="/platform">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-zinc-800">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-zinc-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-zinc-900">
              Complete Mycology Research Suite
            </h2>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
              Everything you need for professional mycology research in one integrated platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href} className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full bg-zinc-900 text-white border-zinc-800">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-zinc-800">
                        {React.cloneElement(feature.icon, { className: 'h-8 w-8 text-white' })}
                      </div>
                      <Badge variant="outline" className="text-xs border-white text-white bg-zinc-900">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed text-zinc-200">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-zinc-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Trusted by Leading Research Facilities
            </h2>
            <p className="text-xl text-zinc-300">
              See what mycology professionals are saying about CroweOS Systems
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-zinc-800 text-white border-zinc-700">
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg italic mb-4 text-zinc-200">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-zinc-400 text-sm">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-zinc-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Mycology Research?
          </h2>
          <p className="text-xl mb-8 text-zinc-300">
            Join hundreds of research facilities using CroweOS Systems to accelerate discoveries
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-lg px-8 py-4 bg-white text-zinc-900 hover:bg-zinc-100" asChild>
              <Link href="/platform">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-zinc-800">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer with Purple Theme */}
      <footer className="py-16 px-6 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <CroweLogo 
                    variant="official-circle"
                    size={40}
                    systemBranding={true}
                    showText={false}
                  />
                  <Image 
                    src="/cos-logo.svg" 
                    alt="CoS Logo" 
                    width={32} 
                    height={32} 
                    className="ml-2 h-8 w-auto"
                  />
                </div>
                <div>
                  <div className="font-bold text-xl text-white">CroweOS</div>
                  <div className="text-zinc-300 text-sm tracking-wider">SYSTEMS</div>
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Professional mycology intelligence platform powered by advanced AI. 
                Accelerating research through innovative technology.
              </p>
              <div className="flex items-center gap-2 text-zinc-300">
                <Brain className="h-4 w-4" />
                <span className="text-sm">Powered by Crowe Logic AI</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <div className="space-y-2 text-sm">
                <Link href="/chat" className="text-zinc-300 hover:text-white block transition-colors">AI Chat Assistant</Link>
                <Link href="/ide-pro" className="text-zinc-300 hover:text-white block transition-colors">IDE Pro</Link>
                <Link href="/platform" className="text-zinc-300 hover:text-white block transition-colors">Lab Management</Link>
                <Link href="/analytics" className="text-zinc-300 hover:text-white block transition-colors">Research Analytics</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <div className="space-y-2 text-sm">
                <Link href="/about" className="text-zinc-300 hover:text-white block transition-colors">About</Link>
                <Link href="/contact" className="text-zinc-300 hover:text-white block transition-colors">Contact</Link>
                <Link href="/careers" className="text-zinc-300 hover:text-white block transition-colors">Careers</Link>
                <Link href="/research" className="text-zinc-300 hover:text-white block transition-colors">Research</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <div className="space-y-2 text-sm">
                <Link href="/help" className="text-zinc-300 hover:text-white block transition-colors">Help Center</Link>
                <Link href="/documentation" className="text-zinc-300 hover:text-white block transition-colors">Documentation</Link>
                <Link href="/privacy" className="text-zinc-300 hover:text-white block transition-colors">Privacy</Link>
                <Link href="/terms" className="text-zinc-300 hover:text-white block transition-colors">Terms</Link>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-zinc-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-zinc-400 text-sm">
                © 2025 CroweOS Systems. All rights reserved. Professional mycology solutions.
              </div>
              <div className="flex items-center gap-4 text-zinc-400 text-sm">
                <span>Made with</span>
                <span className="text-red-400">♥</span>
                <span>for mycology researchers worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
