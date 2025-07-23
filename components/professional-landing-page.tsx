"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CroweLogo } from "./crowe-logo"
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
  ArrowRight,
  Terminal,
  Database,
  BarChart3,
  Beaker,
  Settings,
  BookOpen,
  Globe,
  Workflow,
  Target,
  TrendingUp,
  Leaf
} from "lucide-react"

export default function LandingPage() {
  const [email, setEmail] = useState('')

  const mainFeatures = [
    {
      icon: <Brain className="h-10 w-10 text-blue-600" />,
      title: "Crowe Logic AI Assistant",
      description: "Advanced conversational AI specialized in mycology research, species identification, and protocol optimization",
      features: ["Natural language queries", "Research assistance", "Species identification", "Protocol recommendations"],
      badge: "AI Chat",
      href: "/chat",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Code2 className="h-10 w-10 text-purple-600" />,
      title: "Professional IDE Suite", 
      description: "Full-featured development environment with AI-powered coding, database integration, and research tools",
      features: ["AI code completion", "Database connections", "Version control", "Collaborative editing"],
      badge: "IDE Pro",
      href: "/ide-pro",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <Microscope className="h-10 w-10 text-green-600" />,
      title: "Mycological Management IDE",
      description: "Comprehensive 52-week mushroom production system with departmental task management and environmental monitoring",
      features: ["52-week planning", "Department tracking", "Environmental alerts", "AI protocols"],
      badge: "Farm Management",
      href: "/farm-management",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <FlaskConical className="h-10 w-10 text-orange-600" />,
      title: "Lab Management Platform",
      description: "Complete laboratory workflow management with batch tracking, protocol automation, and quality control",
      features: ["Batch tracking", "Protocol management", "Quality control", "Compliance tools"],
      badge: "Lab Tools",
      href: "/platform",
      color: "bg-orange-50 border-orange-200"
    }
  ]

  const additionalTools = [
    {
      icon: <Database className="h-6 w-6" />,
      title: "MycoIDE Wizard",
      description: "Project scaffolding and setup assistant",
      href: "/mycoide-wizard"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics Dashboard",
      description: "Research metrics and performance insights",
      href: "/analytics"
    },
    {
      icon: <Workflow className="h-6 w-6" />,
      title: "Crowe Logic Suite",
      description: "Complete platform overview and tools",
      href: "/crowe-logic"
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
      quote: "The Mycological Management IDE is incredible. 52 weeks of planning with AI-powered protocols - game changing!",
      author: "Michael Rodriguez",
      role: "Production Director, FungiFarms",
      rating: 5
    },
    {
      quote: "From basic chat to advanced IDE - the platform grows with our research needs.",
      author: "Dr. Emily Watson",
      role: "Research Scientist, MycoBiotech",
      rating: 5
    }
  ]

  const stats = [
    { label: "Research Facilities", value: "500+" },
    { label: "Species Analyzed", value: "10K+" },
    { label: "Time Saved", value: "40%" },
    { label: "Success Rate", value: "99.2%" }
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CroweLogo size="sm" variant="official-circle" />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-900">CroweOS Systems</span>
                <span className="text-xs text-gray-500">Professional Mycology Platform</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/chat" className="text-gray-600 hover:text-gray-900 transition-colors">AI Chat</Link>
              <Link href="/ide-pro" className="text-gray-600 hover:text-gray-900 transition-colors">IDE Pro</Link>
              <Link href="/farm-management" className="text-gray-600 hover:text-gray-900 transition-colors">Farm IDE</Link>
              <Link href="/platform" className="text-gray-600 hover:text-gray-900 transition-colors">Lab Tools</Link>
              <Link href="/analytics" className="text-gray-600 hover:text-gray-900 transition-colors">Analytics</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline">Sign In</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 bg-blue-50 text-blue-700 border-blue-200">
            🚀 Complete Mycology Intelligence Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
            Professional Mycology
            <br />
            <span className="text-blue-600">Intelligence Platform</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            From AI-powered research assistance to comprehensive farm management - everything you need for professional mycology operations in one unified platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/chat">
                <Brain className="mr-2 h-5 w-5" />
                Start with AI Chat
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/farm-management">
                <Microscope className="mr-2 h-5 w-5" />
                Explore Farm IDE
              </Link>
            </Button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Complete Mycology Research Suite
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Everything you need for professional mycology research in one integrated platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainFeatures.map((feature, index) => (
              <Link key={index} href={feature.href} className="block">
                <Card className={`hover:shadow-lg transition-shadow cursor-pointer h-full ${feature.color}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-white/80">
                        {feature.icon}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed text-gray-600 mb-3">
                      {feature.description}
                    </CardDescription>
                    <ul className="space-y-1">
                      {feature.features.map((item, i) => (
                        <li key={i} className="text-xs text-gray-500 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Tools Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Additional Tools & Platforms</h3>
            <p className="text-gray-600">Specialized tools for advanced mycology research</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {additionalTools.map((tool, index) => (
              <Link key={index} href={tool.href} className="block">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      {tool.icon}
                      <h4 className="font-semibold text-gray-900">{tool.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Banner with Crowe Logic Avatar */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3 flex justify-center mb-8 md:mb-0">
              <Image 
                src="/crowelogic-avatar.png" 
                alt="Crowe Logic AI Avatar" 
                width={300} 
                height={300} 
                className="w-full h-auto max-w-xs rounded-full border-4 border-white/20"
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
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Complete Mycology Research Suite
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Everything you need for professional mycology research in one integrated platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainFeatures.map((feature, index) => (
              <Link key={index} href={feature.href} className="block">
                <Card className={`hover:shadow-lg transition-shadow cursor-pointer h-full ${feature.color}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-white/80">
                        {feature.icon}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed text-gray-600 mb-3">
                      {feature.description}
                    </CardDescription>
                    <ul className="space-y-1">
                      {feature.features.map((item, i) => (
                        <li key={i} className="text-xs text-gray-500 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
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
