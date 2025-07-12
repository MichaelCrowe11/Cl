'use client'

import { useState } from 'react'
import Link from 'next/link'

export function LandingPage() {
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="px-6 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor"/>
                <path d="M12 6v6l4 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-xl font-semibold text-black">CroweLogic</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="/features" className="text-gray-600 hover:text-black transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-black transition-colors">
              Pricing
            </Link>
            <Link href="/docs" className="text-gray-600 hover:text-black transition-colors">
              Docs
            </Link>
            <Link href="/signin" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-black mb-6 leading-tight">
            AI-Powered<br />
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Mycology Intelligence
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Advanced AI assistant for mushroom cultivation, research, and analysis. 
            Optimize yields, prevent contamination, and accelerate your mycology research.
          </p>

          <div className="flex items-center justify-center space-x-4 mb-12">
            <Link href="/" className="px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium">
              Start Free Trial
            </Link>
            <button className="px-8 py-4 border border-gray-200 text-black rounded-xl hover:bg-gray-50 transition-colors font-medium">
              Watch Demo
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-4 gap-8 mt-20">
            <div className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <circle cx="8.5" cy="12" r="1.5" fill="currentColor"/>
                  <circle cx="15.5" cy="12" r="1.5" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">AI Assistant</h3>
              <p className="text-gray-600 text-sm">
                24/7 intelligent consultation for all your mycology questions
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white">
                  <path d="M3 3h18v18H3V3z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Research Hub</h3>
              <p className="text-gray-600 text-sm">
                Access latest scientific literature and research findings
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white">
                  <path d="M3 20h18M5 20V10M9 20V4M13 20V12M17 20V8" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="5" cy="8" r="1" fill="currentColor"/>
                  <circle cx="9" cy="2" r="1" fill="currentColor"/>
                  <circle cx="13" cy="10" r="1" fill="currentColor"/>
                  <circle cx="17" cy="6" r="1" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">
                Track yields, optimize growth, and analyze performance
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white">
                  <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M8 6h8M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="6" cy="18" r="1" fill="currentColor"/>
                  <circle cx="10" cy="18" r="1" fill="currentColor"/>
                  <circle cx="14" cy="18" r="1" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Protocols</h3>
              <p className="text-gray-600 text-sm">
                Standardized procedures for reliable cultivation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-black mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-8">
            Get the latest mycology research insights and platform updates.
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <button className="px-6 py-3 bg-black text-white rounded-r-xl hover:bg-gray-800 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor"/>
                </svg>
              </div>
              <span className="font-medium text-black">CroweLogic</span>
            </div>
            
            <div className="flex space-x-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-black transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
