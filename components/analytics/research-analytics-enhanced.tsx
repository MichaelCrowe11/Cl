import React from 'react';
import { CroweLogo } from '@/components/crowe-logo';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BarChart, Microscope, Shield, Zap } from 'lucide-react';

export default function ResearchAnalyticsEnhanced() {
  const analyticsFeatures = [
    {
      icon: <BarChart className="h-8 w-8" />,
      title: "Yield Optimization",
      description: "Maximize crop yields with AI-driven analytics and predictive modeling.",
      badge: "Optimization"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Contamination Prediction",
      description: "Identify and mitigate contamination risks with advanced AI insights.",
      badge: "Prediction"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Harvest Timing",
      description: "Optimize harvest schedules for peak quality and efficiency.",
      badge: "Timing"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Navigation */}
      <nav className="border-b bg-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-1">
                  <span className="font-bold text-lg text-white">CroweOS</span>
                  <span className="text-sm font-medium text-zinc-300 tracking-wider">ANALYTICS</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="text-zinc-300 hover:text-white">
                <Microscope className="mr-2 h-4 w-4" /> Insights
              </Button>
              <Button className="bg-white text-zinc-900 hover:bg-zinc-100">
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
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
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Advanced Research 
                <br />
                Analytics Platform
              </h1>
              <p className="text-xl text-zinc-200 mb-6 max-w-3xl leading-relaxed">
                Unlock the power of AI-driven analytics for yield optimization, contamination prediction, and harvest timing.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {analyticsFeatures.map((feature, index) => (
              <div key={index} className="bg-zinc-800 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-zinc-700">
                    {React.cloneElement(feature.icon, { className: 'h-8 w-8 text-white' })}
                  </div>
                  <span className="text-xs text-white bg-zinc-900 px-2 py-1 rounded">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
