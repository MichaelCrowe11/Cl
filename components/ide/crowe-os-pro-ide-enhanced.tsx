"use client"
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CroweLogo } from '@/components/crowe-logo'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, Code2, FlaskConical, Shield, Terminal, Settings } from 'lucide-react'

export default function CroweOSProIDEEnhanced() {
  const [showConsole, setShowConsole] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [consoleInput, setConsoleInput] = useState('')
  const [consoleHistory, setConsoleHistory] = useState<string[]>([
    'CroweOS Pro IDE Console v2.0.0',
    'Ready for advanced mycology research development',
    'Type "help" for available commands',
    ''
  ])
  const consoleInputRef = useRef<HTMLInputElement>(null)

  const handleConsoleCommand = (command: string) => {
    const trimmedCommand = command.trim().toLowerCase()
    let response = ''

    switch (trimmedCommand) {
      case 'help':
        response = `Available commands:
  help - Show this help message
  clear - Clear console
  status - Show system status
  projects - List current projects
  build - Build current project
  test - Run tests
  deploy - Deploy to production
  version - Show version info`
        break
      case 'clear':
        setConsoleHistory(['CroweOS Pro IDE Console v2.0.0', 'Ready for advanced mycology research development', ''])
        setConsoleInput('')
        return
      case 'status':
        response = 'System Status: ✓ All systems operational\nMemory: 2.1GB / 8GB\nCPU: 15%\nActive Projects: 3'
        break
      case 'projects':
        response = `Current Projects:
  1. Mycological-Database-System (Active)
  2. Spore-Analysis-Tool (Development)
  3. Growth-Pattern-Predictor (Testing)`
        break
      case 'build':
        response = '🔨 Building project...\n✓ Compiling TypeScript\n✓ Bundling assets\n✓ Build completed successfully'
        break
      case 'test':
        response = '🧪 Running tests...\n✓ Unit tests: 45/45 passed\n✓ Integration tests: 12/12 passed\n✓ All tests passed'
        break
      case 'deploy':
        response = '🚀 Deploying to production...\n✓ Build verification\n✓ Security scan\n✓ Deployment successful'
        break
      case 'version':
        response = 'CroweOS Pro IDE v2.0.0\nNode.js v18.17.0\nTypeScript v5.2.0\nNext.js v15.2.4'
        break
      default:
        response = `Command not found: ${command}\nType "help" for available commands`
    }

    setConsoleHistory(prev => [...prev, `$ ${command}`, response, ''])
    setConsoleInput('')
  }

  const handleConsoleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && consoleInput.trim()) {
      handleConsoleCommand(consoleInput)
    }
  }

  useEffect(() => {
    if (showConsole && consoleInputRef.current) {
      consoleInputRef.current.focus()
    }
  }, [showConsole])
  const features = [
    {
      icon: <Code2 className="h-8 w-8" />,
      title: "Advanced Coding Environment",
      description: "Intelligent code completion, mycology-specific syntax highlighting, and real-time collaboration tools",
      badge: "IDE Pro"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Development",
      description: "Contextual AI suggestions, automated debugging, and research-oriented code generation",
      badge: "AI Assist"
    },
    {
      icon: <FlaskConical className="h-8 w-8" />,
      title: "Research Integration",
      description: "Direct database connections, data visualization, and research protocol management",
      badge: "Lab Tools"
    }
  ]

  const router = useRouter();
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
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-lg text-white">CroweOS</span>
                  <span className="text-sm font-medium text-zinc-300 tracking-wider">PRO IDE</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Button 
                variant="ghost" 
                className="text-zinc-300 hover:text-white"
                onClick={() => setShowConsole(!showConsole)}
              >
                <Terminal className="mr-2 h-4 w-4" /> Console
              </Button>
              <Button 
                variant="ghost" 
                className="text-zinc-300 hover:text-white"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
              <Button className="bg-white text-zinc-900 hover:bg-zinc-100" onClick={() => router.push('/ide')}>
                Start Coding
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
                src="/crowe-avatar.png" 
                alt="Crowe Avatar" 
                width={300} 
                height={300} 
                className="w-full h-auto max-w-xs"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Professional Development 
                <br />
                Reimagined for Research
              </h1>
              <p className="text-xl text-zinc-200 mb-6 max-w-3xl leading-relaxed">
                A next-generation IDE that combines advanced coding tools with research-specific AI assistance. 
                Designed to accelerate scientific software development.
              </p>
            </div>
          </div>
          <Button className="bg-white text-zinc-900 hover:bg-zinc-100" onClick={() => router.push('/ide')}>
            Start Coding
          </Button>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
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

      {/* Enhanced Console Overlay */}
      {showConsole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-lg w-full max-w-5xl h-[500px] flex flex-col border border-zinc-700">
            <div className="flex items-center justify-between p-4 border-b border-zinc-700 bg-zinc-800 rounded-t-lg">
              <h2 className="text-white text-lg font-semibold flex items-center">
                <Terminal className="mr-2 h-5 w-5 text-green-400" />
                CroweOS Pro IDE Console
                <Badge variant="outline" className="ml-2 text-green-400 border-green-400">
                  v2.0.0
                </Badge>
              </h2>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setConsoleHistory(prev => [...prev, '$ clear', ''])
                    setConsoleInput('')
                  }}
                  className="text-zinc-400 hover:text-white text-xs"
                >
                  Clear
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowConsole(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="flex-1 p-4 bg-black text-green-400 font-mono text-sm overflow-auto">
              <div className="space-y-1">
                {consoleHistory.map((line, index) => (
                  <div key={index} className={line.startsWith('$') ? 'text-cyan-400' : 'text-green-400'}>
                    {line}
                  </div>
                ))}
                <div className="flex items-center">
                  <span className="text-cyan-400">$</span>
                  <input 
                    ref={consoleInputRef}
                    type="text" 
                    value={consoleInput}
                    onChange={(e) => setConsoleInput(e.target.value)}
                    onKeyPress={handleConsoleKeyPress}
                    className="ml-2 bg-transparent border-none outline-none text-green-400 flex-1"
                    placeholder="Enter command..."
                  />
                </div>
              </div>
            </div>
            <div className="p-3 bg-zinc-800 border-t border-zinc-700 rounded-b-lg">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-4">
                  <span>System: Online</span>
                  <span>CPU: 15%</span>
                  <span>Memory: 2.1GB/8GB</span>
                </div>
                <div>Press Enter to execute • Type "help" for commands</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Overlay */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-96 overflow-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-zinc-900 text-lg font-semibold flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Pro IDE Settings
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSettings(false)}
                className="text-zinc-600 hover:text-zinc-900"
              >
                ✕
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Theme</label>
                <select className="w-full p-2 border border-zinc-300 rounded-md">
                  <option>Dark</option>
                  <option>Light</option>
                  <option>Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Font Size</label>
                <select className="w-full p-2 border border-zinc-300 rounded-md">
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Mycology Mode</label>
                <select className="w-full p-2 border border-zinc-300 rounded-md">
                  <option>Research</option>
                  <option>Production</option>
                  <option>Educational</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowSettings(false)}>
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
