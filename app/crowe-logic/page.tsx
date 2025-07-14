import { Metadata } from 'next';
import CroweLogicChatInterface from '@/components/crowe-logic-chat-interface';

export const metadata: Metadata = {
  title: 'Crowe Logic AI Assistant | CroweOS Systems',
  description: 'Expert mushroom cultivation guidance powered by comprehensive knowledge base',
};

export default function CroweLogicPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Crowe Logic AI Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get expert guidance on mushroom cultivation with our AI assistant powered by 
            comprehensive knowledge base covering environmental controls, substrates, troubleshooting, and more.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">🌡️</span>
            </div>
            <h3 className="font-semibold text-purple-900 mb-2">Environmental Controls</h3>
            <p className="text-sm text-purple-700">CO₂ levels, temperature, humidity guidelines</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">🧪</span>
            </div>
            <h3 className="font-semibold text-green-900 mb-2">Substrate Recipes</h3>
            <p className="text-sm text-green-700">Species-specific growing medium formulations</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-amber-50 border border-amber-200">
            <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">🔧</span>
            </div>
            <h3 className="font-semibold text-amber-900 mb-2">Troubleshooting</h3>
            <p className="text-sm text-amber-700">Problem diagnosis and contamination prevention</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">📊</span>
            </div>
            <h3 className="font-semibold text-blue-900 mb-2">Platform Features</h3>
            <p className="text-sm text-blue-700">Complete system capabilities and workflows</p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-xl shadow-lg border h-[600px]">
          <CroweLogicChatInterface />
        </div>

        {/* Knowledge Base Info */}
        <div className="mt-8 p-6 bg-muted/30 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Powered by Comprehensive Knowledge Base
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Four Pillars Framework</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li><strong>Monitor:</strong> Real-time telemetry and alerts</li>
                <li><strong>Decide:</strong> AI-powered decision trees</li>
                <li><strong>Act:</strong> Clear, actionable guidance</li>
                <li><strong>Learn:</strong> Continuous improvement cycles</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Critical Parameters</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li><strong>Fruiting CO₂:</strong> 400-600 ppm optimal range</li>
                <li><strong>Alert Systems:</strong> Green/Yellow/Red thresholds</li>
                <li><strong>QR Traceability:</strong> Batch tracking and COAs</li>
                <li><strong>Species Specific:</strong> Tailored substrate recipes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
