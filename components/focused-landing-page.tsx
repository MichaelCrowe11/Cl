"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CroweLogo } from "./crowe-logo"
import { 
  Brain, 
  Code2, 
  Terminal,
  Microscope, 
  ChevronRight,
  CheckCircle,
  Star,
  Zap,
  Bot,
  ArrowRight,
  Database,
  Workflow,
  Target,
  TrendingUp,
  Leaf,
  Settings,
  MessageSquare,
  FileSpreadsheet,
  GitBranch,
  Cpu,
  Activity,
  Layers,
  Users,
  Calendar,
  BarChart3,
  Shield,
  Award
} from "lucide-react"

export default function FocusedLandingPage() {
  const [email, setEmail] = useState('')
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  // Core 3 specializations
  const coreFeatures = [
    {
      icon: <Terminal className="h-12 w-12 text-purple-600" />,
      title: "Crowe Logic Pro IDE", 
      description: "AI-powered development environment specialized for natural language coding and machine learning algorithm development",
      features: [
        "Natural language to code conversion", 
        "ML algorithm generation", 
        "AI-powered debugging",
        "Intelligent code completion",
        "Research data integration",
        "Advanced terminal with AI commands"
      ],
      badge: "Professional IDE",
      href: "/crowe-logic-pro",
      color: "bg-purple-50 border-purple-300",
      gradient: "from-purple-500 to-indigo-600",
      details: "Transform ideas into code with AI assistance. Generate ML algorithms, debug complex problems, and integrate research data seamlessly.",
      tech: ["Python", "R", "TypeScript", "AI/ML", "Data Science"]
    },
    {
      icon: <Brain className="h-12 w-12 text-blue-600" />,
      title: "AI Chat & Automation", 
      description: "Intelligent research assistant with Zapier integration, automated reporting, and application workflow automation",
      features: [
        "Real-time mycology research",
        "Zapier workflow integration", 
        "Automated report generation",
        "App automation & triggers",
        "Literature analysis",
        "Data export to external tools"
      ],
      badge: "AI Automation",
      href: "/chat",
      color: "bg-blue-50 border-blue-300",
      gradient: "from-blue-500 to-cyan-600",
      details: "Automate your research workflows. Connect to 5000+ apps via Zapier, generate reports automatically, and let AI handle routine tasks.",
      tech: ["Zapier", "API Integration", "NLP", "Automation", "Reporting"]
    },
    {
      icon: <Leaf className="h-12 w-12 text-green-600" />,
      title: "Farm Management IDE",
      description: "Comprehensive 52-week commercial mushroom farming platform with production optimization and environmental monitoring",
      features: [
        "52-week production planning",
        "7-department task management", 
        "Environmental monitoring",
        "Yield optimization algorithms",
        "Quality control protocols",
        "Commercial scale operations"
      ],
      badge: "Farm Management",
      href: "/analytics",
      color: "bg-green-50 border-green-300",
      gradient: "from-green-500 to-emerald-600",
      details: "Scale your mushroom farming operations. Professional-grade tools for commercial production with AI-driven optimization.",
      tech: ["IoT Sensors", "Production Planning", "Quality Control", "Analytics", "Monitoring"]
    }
  ]

  const testimonials = [
    {
      quote: "The Pro IDE's natural language coding feature has revolutionized how we develop ML models. What used to take hours now takes minutes.",
      author: "Dr. Sarah Chen",
      role: "Lead Data Scientist, MycoBiotech",
      rating: 5,
      specialty: "Crowe Logic Pro IDE"
    },
    {
      quote: "AI Chat automation with Zapier integration has streamlined our entire research workflow. Reports generate automatically!",
      author: "Michael Rodriguez",
      role: "Research Director, FungiFarms",
      rating: 5,
      specialty: "AI Automation"
    },
    {
      quote: "52-week planning with AI optimization increased our yield by 35%. The farm management tools are incredible.",
      author: "Dr. Emily Watson",
      role: "Production Manager, Commercial Mushrooms Inc",
      rating: 5,
      specialty: "Farm Management"
    }
  ]

  const stats = [
    { label: "Code Generation Speed", value: "10x Faster" },
    { label: "Workflow Automation", value: "5000+ Apps" },
    { label: "Yield Improvement", value: "35% Increase" },
    { label: "Professional Users", value: "500+" }
  ]

  const brandFeatures = [
    {
      icon: <Bot className="h-6 w-6 text-purple-600" />,
      title: "AI-First Approach",
      description: "Every tool enhanced with Crowe Logic AI technology"
    },
    {
      icon: <Workflow className="h-6 w-6 text-blue-600" />,
      title: "Seamless Integration", 
      description: "Connect with thousands of apps and services"
    },
    {
      icon: <Target className="h-6 w-6 text-green-600" />,
      title: "Commercial Focus",
      description: "Built for professional and commercial applications"
    },
    {
      icon: <Shield className="h-6 w-6 text-orange-600" />,
      title: "Enterprise Ready",
      description: "Secure, scalable, and reliable for production use"
    }
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center">
            {/* Logo with animation */}
            <div className="flex justify-center mb-8 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-2xl opacity-20 animate-pulse" />
                <img 
                  src="/crowelogic-avatar.png" 
                  alt="Crowe Logic"
                  className="w-28 h-28 rounded-full shadow-xl relative z-10 ring-4 ring-white"
                />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 animate-fade-in-up">
              Crowe Logic AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10 animate-fade-in-up animation-delay-200">
              Professional AI-powered development platform with specialized tools for coding, automation, and farm management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              <Link href="/crowe-logic-pro">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  <Code2 className="mr-2 h-5 w-5" />
                  Start Coding with AI
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-gray-400 px-10 py-6 text-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Try AI Chat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Three Powerful Specializations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each tool is crafted for specific professional needs, powered by Crowe Logic AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className={`relative overflow-hidden ${feature.color} hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient} transition-all duration-500 ${hoveredFeature === index ? 'h-2' : ''}`} />
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`transition-transform duration-300 ${hoveredFeature === index ? 'scale-110' : ''}`}>
                      {feature.icon}
                    </div>
                    <Badge variant="secondary" className="text-xs font-medium bg-white/80">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    {feature.details}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 mb-6">
                    {feature.features.map((item, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-6">
                    {feature.tech.map((tech, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <Link href={feature.href}>
                    <Button 
                      className={`w-full bg-gradient-to-r ${feature.gradient} text-white hover:opacity-90 transition-opacity`}
                    >
                      Launch {feature.title.split(' ')[0]} <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Features */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Crowe Logic?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for professionals who need reliable, powerful tools that scale with their ambitions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {brandFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transform transition-all duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%)`,
            backgroundSize: '20px 20px',
            animation: 'slide 20s linear infinite'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-white animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-white/80 text-sm font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Professionals
            </h2>
            <p className="text-lg text-gray-600">
              See how each specialization delivers results for our users
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {testimonial.specialty}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-200 to-blue-200 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-4xl mx-auto text-center px-6 relative">
          <div className="flex justify-center mb-8 animate-bounce-gentle">
            <img 
              src="/crowelogic-avatar.png" 
              alt="Crowe Logic"
              className="w-20 h-20 rounded-full shadow-xl ring-4 ring-white"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Experience Professional Tools?
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Choose your specialization and start building with Crowe Logic AI technology
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/crowe-logic-pro">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                <Terminal className="mr-2 h-5 w-5" />
                Try Pro IDE
              </Button>
            </Link>
            <Link href="/ai-chat-automation">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                <Brain className="mr-2 h-5 w-5" />
                Try AI Automation
              </Button>
            </Link>
            <Link href="/analytics">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                <Leaf className="mr-2 h-5 w-5" />
                Try Farm Management
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/crowelogic-avatar.png" 
                  alt="Crowe Logic"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-bold text-white">Crowe Logic</span>
              </div>
              <p className="text-sm text-gray-400">
                Professional development platform for the modern era
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Specializations</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/crowe-logic-pro" className="hover:text-white transition-colors">Pro IDE</Link></li>
                <li><Link href="/chat" className="hover:text-white transition-colors">AI Automation</Link></li>
                <li><Link href="/analytics" className="hover:text-white transition-colors">Farm Management</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API Reference</Link></li>
                <li><Link href="/tutorials" className="hover:text-white transition-colors">Tutorials</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2025 Crowe Logic. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Powered by CroweOS Systems Software Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
