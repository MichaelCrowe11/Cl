"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MessageSquare,
  Plus,
  Search,
  Settings,
  Menu,
  X,
  Microscope,
  Beaker,
  Database,
  FileText,
  BarChart3,
  Leaf,
  Shield,
  Activity,
  Brain,
  BookOpen,
  FlaskConical,
  Users,
  Clock,
  Star,
  Archive
} from 'lucide-react'

interface EnhancedLayoutProps {
  children: React.ReactNode
  currentSection: string
  onNavigate: (section: string) => void
}

interface ChatSession {
  id: string
  title: string
  timestamp: string
  type: 'mycology' | 'research' | 'protocol' | 'analysis'
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ElementType
  category: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'substrate-hydration',
    title: 'Substrate Hydration Protocol',
    description: 'Calculate optimal moisture content for growing media',
    icon: Beaker,
    category: 'protocols'
  },
  {
    id: 'sterilization-cycle',
    title: 'Sterilization Cycle',
    description: 'Standard autoclave parameters and timing',
    icon: FlaskConical,
    category: 'protocols'
  },
  {
    id: 'workflow-sawdust',
    title: 'Sawdust Substrate Workflow',
    description: 'Complete cultivation process visualization',
    icon: Leaf,
    category: 'workflows'
  },
  {
    id: 'protocol-deltas',
    title: 'Recent Protocol Updates',
    description: 'Latest changes in cultivation procedures',
    icon: Clock,
    category: 'updates'
  }
]

const RECENT_CHATS: ChatSession[] = [
  {
    id: '1',
    title: 'Oyster mushroom substrate optimization',
    timestamp: '2 hours ago',
    type: 'mycology'
  },
  {
    id: '2',
    title: 'Contamination prevention strategies',
    timestamp: '1 day ago',
    type: 'research'
  },
  {
    id: '3',
    title: 'Lion\'s mane cultivation protocol',
    timestamp: '2 days ago',
    type: 'protocol'
  },
  {
    id: '4',
    title: 'Yield analysis and optimization',
    timestamp: '3 days ago',
    type: 'analysis'
  }
]

const NAVIGATION_ITEMS = [
  { id: 'chat', label: 'AI Chat', icon: Brain },
  { id: 'research', label: 'Research Tools', icon: Microscope },
  { id: 'protocols', label: 'Protocols', icon: FileText },
  { id: 'data', label: 'Data Analysis', icon: BarChart3 },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'monitoring', label: 'Monitoring', icon: Activity },
]

export function EnhancedLayout({ children, currentSection, onNavigate }: EnhancedLayoutProps) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

  const getChatTypeIcon = (type: string) => {
    switch (type) {
      case 'mycology': return <Microscope className="h-3 w-3" />
      case 'research': return <BookOpen className="h-3 w-3" />
      case 'protocol': return <FileText className="h-3 w-3" />
      case 'analysis': return <BarChart3 className="h-3 w-3" />
      default: return <MessageSquare className="h-3 w-3" />
    }
  }

  const getChatTypeColor = (type: string) => {
    switch (type) {
      case 'mycology': return 'text-green-600'
      case 'research': return 'text-blue-600'
      case 'protocol': return 'text-purple-600'
      case 'analysis': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Sidebar - Chat History & Navigation */}
      <div className={`${leftSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-900 text-white flex flex-col overflow-hidden`}>
        {leftSidebarOpen && (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Microscope className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-sm font-semibold">Crowe Logic AI</h1>
                    <p className="text-xs text-gray-400">Mycology Research Suite</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLeftSidebarOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* New Chat Button */}
              <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600">
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>

            {/* Navigation */}
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Navigation</h3>
              <div className="space-y-1">
                {NAVIGATION_ITEMS.map((item) => {
                  const Icon = item.icon
                  const isActive = currentSection === item.id
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate(item.id)}
                      className={`w-full justify-start text-sm ${
                        isActive 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Recent Chats */}
            <div className="flex-1 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Recent Chats</h3>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                    <Search className="h-3 w-3" />
                  </Button>
                </div>
                <ScrollArea className="h-full">
                  <div className="space-y-2">
                    {RECENT_CHATS.map((chat) => (
                      <div
                        key={chat.id}
                        className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-start space-x-2">
                          <div className={`mt-1 ${getChatTypeColor(chat.type)}`}>
                            {getChatTypeIcon(chat.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-300 group-hover:text-white truncate">
                              {chat.title}
                            </p>
                            <p className="text-xs text-gray-500">{chat.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback className="bg-green-600 text-white text-sm">MC</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Michael Crowe</p>
                  <p className="text-xs text-gray-400">Mycologist</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          {!leftSidebarOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftSidebarOpen(true)}
              className="mr-4"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex-1 flex items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {NAVIGATION_ITEMS.find(item => item.id === currentSection)?.label || 'Dashboard'}
            </h2>
          </div>

          {!rightSidebarOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightSidebarOpen(true)}
              className="ml-4"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-4xl mx-auto p-6">
            {children}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Quick Actions & Tools */}
      <div className={`${rightSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-l border-gray-200 flex flex-col overflow-hidden`}>
        {rightSidebarOpen && (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRightSidebarOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon
                  return (
                    <div
                      key={action.id}
                      className="p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 cursor-pointer transition-all group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-green-100">
                          <Icon className="h-4 w-4 text-gray-600 group-hover:text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-green-700">
                            {action.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {action.description}
                          </p>
                          <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {action.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* System Status */}
                <div className="mt-6 p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <h4 className="text-sm font-medium text-green-900">System Status</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-700">AI Models</span>
                      <span className="text-green-600 font-medium">Online</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-700">Security Systems</span>
                      <span className="text-green-600 font-medium">Active</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-700">Database</span>
                      <span className="text-green-600 font-medium">Connected</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>Protocol updated 2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Star className="h-3 w-3" />
                      <span>New research paper added</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Archive className="h-3 w-3" />
                      <span>Data backup completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  )
}
