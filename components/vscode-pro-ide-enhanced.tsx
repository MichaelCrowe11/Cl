"use client";

import React, { useState, useRef, useCallback } from 'react';
import { 
  Brain, 
  FileText, 
  Settings, 
  Moon, 
  Sun, 
  X, 
  Plus,
  Code,
  MessageSquare,
  Save,
  Play,
  GitBranch,
  Activity,
  ChevronRight,
  ChevronLeft,
  Bug,
  Zap,
  Target,
  Monitor,
  TestTube,
  Microscope,
  TrendingUp,
  CheckCircle,
  Clock,
  Lightbulb,
  BarChart3,
  Users,
  Rocket,
  FolderOpen,
  Search,
  GitCommit,
  Terminal,
  Database,
  Layers,
  Command,
  Copy,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  RotateCcw,
  Split,
  Eye,
  ChevronDown,
  File,
  Folder,
  Package,
  Beaker,
  Cpu,
  Palette,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CroweLogo } from '@/components/crowe-logo';

interface FileTab {
  id: string;
  name: string;
  type: 'python' | 'typescript' | 'javascript' | 'markdown' | 'json' | 'yaml' | 'csv';
  content: string;
  language: string;
  path: string;
  isDirty: boolean;
}

interface FileTreeItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileTreeItem[];
  expanded?: boolean;
}

export default function VSCodeProIDEEnhanced() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [leftSidebarTab, setLeftSidebarTab] = useState('explorer');
  const [rightSidebarTab, setRightSidebarTab] = useState('tools');
  const [activePanel, setActivePanel] = useState('terminal');
  const [panelHeight, setPanelHeight] = useState(250);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(280);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(280);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  
  const [activeFiles, setActiveFiles] = useState<FileTab[]>([
    {
      id: 'main.py',
      name: 'main.py',
      type: 'python',
      content: `# CroweOS Mycology Research Platform
import numpy as np
import pandas as pd
from datetime import datetime
import matplotlib.pyplot as plt

class MycoAnalyzer:
    """Advanced mycology data analysis with AI insights"""
    
    def __init__(self, project_name: str):
        self.project_name = project_name
        self.created_at = datetime.now()
        self.batches = []
        
    def analyze_growth_pattern(self, data: pd.DataFrame):
        """Analyze mushroom growth patterns with statistical modeling"""
        # Growth rate calculation
        growth_rate = data['weight'].diff() / data['time'].diff()
        
        # Predict optimal harvest time
        optimal_time = self.predict_harvest_window(growth_rate)
        
        return {
            'growth_rate': growth_rate.mean(),
            'optimal_harvest': optimal_time,
            'yield_prediction': self.calculate_yield(data)
        }
    
    def predict_harvest_window(self, growth_rate):
        """AI-powered harvest time prediction"""
        # Advanced algorithm here
        return "5-7 days"
    
    def calculate_yield(self, data):
        """Calculate expected yield based on current growth"""
        return data['weight'].iloc[-1] * 1.2

# Initialize analyzer
analyzer = MycoAnalyzer("ShiitakeFarm_2025")
print(f"Project: {analyzer.project_name}")
print(f"Started: {analyzer.created_at}")`,
      language: 'python',
      path: '/workspace/main.py',
      isDirty: false
    }
  ]);
  
  const [activeFileId, setActiveFileId] = useState('main.py');
  const [croweAIMessages, setCroweAIMessages] = useState([
    {
      type: 'ai',
      content: 'Welcome to CroweOS Pro IDE! I\'m your AI coding assistant specialized in mycology research and development.',
      timestamp: new Date()
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState(`CroweOS Terminal v3.0.0
╔══════════════════════════════════════════════════════════════════════════════╗
║                        🍄 CROWE LOGIC MYCOLOGY IDE 🍄                        ║
╚══════════════════════════════════════════════════════════════════════════════╝

Ready for advanced mycological analysis...
$ `);
  const [terminalInput, setTerminalInput] = useState('');

  const fileTree: FileTreeItem[] = [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      path: '/workspace/src',
      expanded: true,
      children: [
        { id: 'main.py', name: 'main.py', type: 'file', path: '/workspace/src/main.py' },
        { id: 'analyzer.py', name: 'analyzer.py', type: 'file', path: '/workspace/src/analyzer.py' },
        { id: 'models.py', name: 'models.py', type: 'file', path: '/workspace/src/models.py' }
      ]
    },
    {
      id: 'data',
      name: 'data',
      type: 'folder',
      path: '/workspace/data',
      expanded: false,
      children: [
        { id: 'batch1.csv', name: 'batch1.csv', type: 'file', path: '/workspace/data/batch1.csv' },
        { id: 'results.json', name: 'results.json', type: 'file', path: '/workspace/data/results.json' }
      ]
    }
  ];

  const getLanguageIcon = (type: string) => {
    switch(type) {
      case 'python': return '🐍';
      case 'javascript': return '📄';
      case 'typescript': return '📘';
      case 'json': return '📋';
      default: return '📄';
    }
  };

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch(ext) {
      case 'py': return '🐍';
      case 'js': return '📄';
      case 'ts': return '📘';
      case 'json': return '📋';
      case 'csv': return '📊';
      case 'md': return '📝';
      default: return '📄';
    }
  };

  const closeFile = (fileId: string) => {
    setActiveFiles(prev => prev.filter(f => f.id !== fileId));
    if (activeFileId === fileId) {
      const remaining = activeFiles.filter(f => f.id !== fileId);
      setActiveFileId(remaining.length > 0 ? remaining[0].id : '');
    }
  };

  const sendToAI = () => {
    if (!aiInput.trim()) return;
    
    const userMessage = {
      type: 'user',
      content: aiInput,
      timestamp: new Date()
    };
    
    setCroweAIMessages(prev => [...prev, userMessage]);
    setAiInput('');
    setIsLoading(true);
    
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        content: `I can help you with that! Based on your current Python code, I notice you're working on mycology analysis. Here are some suggestions:

1. **Code Enhancement**: Add error handling to your \`analyze_growth_pattern\` method
2. **Performance**: Consider using vectorized operations for large datasets
3. **AI Integration**: I can help implement machine learning models for yield prediction

Would you like me to help implement any of these improvements?`,
        timestamp: new Date()
      };
      setCroweAIMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const executeTerminalCommand = () => {
    if (!terminalInput.trim()) return;
    
    const command = terminalInput.trim();
    const newOutput = terminalOutput + command + '\n';
    
    // Simulate command execution
    let result = '';
    switch(command) {
      case 'python main.py':
        result = 'Project: ShiitakeFarm_2025\nStarted: 2025-07-15 09:45:23.123456\nAnalysis complete: Growth rate optimal\n';
        break;
      case 'ls':
        result = 'main.py  analyzer.py  models.py  data/\n';
        break;
      case 'help':
        result = 'Available commands: python, ls, pwd, help, clear, lab-tools\n';
        break;
      case 'lab-tools':
        result = '🔬 CroweOS Lab Tools:\n- microscope: Computer vision analysis\n- batch-tracker: Batch management\n- yield-predictor: AI-powered predictions\n';
        break;
      case 'clear':
        setTerminalOutput('$ ');
        setTerminalInput('');
        return;
      default:
        result = `Command not found: ${command}\nType 'help' for available commands.\n`;
    }
    
    setTerminalOutput(newOutput + result + '$ ');
    setTerminalInput('');
  };

  const FileTreeNode = ({ item, level = 0 }: { item: FileTreeItem; level?: number }) => (
    <div key={item.id} className="select-none">
      <div 
        className={`flex items-center gap-1 px-2 py-1 text-sm hover:bg-gray-700 cursor-pointer group ${
          item.type === 'file' && activeFileId === item.id ? 'bg-gray-700' : ''
        }`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={() => item.type === 'file' && setActiveFileId(item.id)}
      >
        {item.type === 'folder' && (
          <ChevronRight className={`h-3 w-3 transition-transform ${item.expanded ? 'rotate-90' : ''}`} />
        )}
        <div className="flex items-center gap-1">
          {item.type === 'folder' ? (
            <Folder className="h-4 w-4 text-blue-400" />
          ) : (
            <span className="text-xs">{getFileIcon(item.name)}</span>
          )}
          <span className="text-xs text-gray-200">{item.name}</span>
        </div>
      </div>
      {item.type === 'folder' && item.expanded && item.children && (
        <div>
          {item.children.map(child => (
            <FileTreeNode key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );

  const activeFile = activeFiles.find(f => f.id === activeFileId);

  // Theme classes for black and white design
  const themeClasses = {
    bg: isDarkMode ? 'bg-black' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-black',
    border: isDarkMode ? 'border-gray-800' : 'border-gray-200',
    sidebar: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    terminal: isDarkMode ? 'bg-black' : 'bg-gray-900',
    terminalText: isDarkMode ? 'text-green-400' : 'text-green-300',
    header: isDarkMode ? 'bg-gray-800' : 'bg-white',
    tab: isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
    tabActive: isDarkMode ? 'bg-gray-600' : 'bg-white',
    accent: isDarkMode ? 'bg-gray-800' : 'bg-gray-100',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200',
    input: isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black',
    button: isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
  };

  return (
    <div className={`flex h-screen w-screen ${themeClasses.bg} ${themeClasses.text} font-mono`}>
      {/* Command Palette */}
      {showCommandPalette && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className={`${themeClasses.bg} ${themeClasses.border} border rounded-lg shadow-2xl w-96 max-h-96 overflow-hidden`}>
            <div className={`p-3 ${themeClasses.border} border-b`}>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Type a command..."
                className="w-full bg-transparent text-sm outline-none"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className={`absolute top-0 left-0 right-0 h-12 ${themeClasses.header} ${themeClasses.border} border-b flex items-center justify-between px-4 z-50`}>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <h1 className="text-lg font-bold">CroweOS Pro IDE</h1>
          <span className="text-sm opacity-70">Professional Development Environment</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-xs opacity-60">v3.0.0</span>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg ${themeClasses.tab} ${themeClasses.hover} transition-colors`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 pt-12">
        
        {/* Left Sidebar */}
        <div 
          className={`${themeClasses.sidebar} ${themeClasses.border} border-r flex flex-col`}
          style={{ width: leftSidebarWidth }}
        >
          {/* Sidebar Tabs */}
          <div className={`flex ${themeClasses.border} border-b`}>
            <button
              onClick={() => setLeftSidebarTab('explorer')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                leftSidebarTab === 'explorer' ? themeClasses.tabActive : themeClasses.tab
              } flex items-center gap-2`}
            >
              <FolderOpen className="w-4 h-4" />
              Files
            </button>
            <button
              onClick={() => setLeftSidebarTab('search')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                leftSidebarTab === 'search' ? themeClasses.tabActive : themeClasses.tab
              } flex items-center gap-2`}
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {leftSidebarTab === 'explorer' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">WORKSPACE</h3>
                  <button className="p-1 rounded hover:bg-gray-600 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-1">
                  {fileTree.map(item => (
                    <FileTreeNode key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
            
            {leftSidebarTab === 'search' && (
              <div>
                <input
                  type="text"
                  placeholder="Search files..."
                  className={`w-full px-3 py-2 rounded ${themeClasses.input} text-sm`}
                />
                <div className="mt-4 text-sm opacity-60">
                  Search results will appear here...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col">
          
          {/* Chat Interface */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className={`${themeClasses.header} ${themeClasses.border} border-b px-4 py-2 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                <span className="font-medium">CroweOS AI Assistant</span>
                <Badge className="bg-green-500 text-white text-xs">
                  Online
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  <Save className="w-3 h-3 mr-1" />
                  Save Chat
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Clear
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {croweAIMessages.map((message, idx) => (
                <div key={idx} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-lg ${message.type === 'user' ? 'order-1' : ''}`}>
                    <div className="text-sm text-gray-500 mb-1">
                      {message.type === 'ai' ? 'CroweOS AI' : 'You'}
                    </div>
                    <div className={`p-3 rounded-lg text-sm ${
                      message.type === 'ai' 
                        ? 'bg-gray-100 dark:bg-gray-800' 
                        : 'bg-purple-600 text-white'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse">Thinking...</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className={`${themeClasses.border} border-t p-4`}>
              <div className="flex gap-2">
                <Textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask CroweOS AI about mycology, code analysis, or anything else..."
                  className="flex-1 min-h-12 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendToAI();
                    }
                  }}
                />
                <Button 
                  onClick={sendToAI} 
                  disabled={!aiInput.trim() || isLoading}
                  className={themeClasses.button}
                >
                  <Brain className="w-4 h-4 mr-1" />
                  Send
                </Button>
              </div>
            </div>
          </div>

          {/* Terminal Panel */}
          <div className={`h-64 ${themeClasses.terminal} ${themeClasses.border} border-t flex flex-col`}>
            <div className={`h-8 ${themeClasses.border} border-b flex items-center justify-between px-3`}>
              <div className="flex gap-1">
                <Button
                  variant={activePanel === 'terminal' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setActivePanel('terminal')}
                >
                  <Terminal className="h-3 w-3 mr-1" />
                  Terminal
                </Button>
                <Button
                  variant={activePanel === 'problems' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setActivePanel('problems')}
                >
                  <Bug className="h-3 w-3 mr-1" />
                  Problems
                </Button>
                <Button
                  variant={activePanel === 'output' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setActivePanel('output')}
                >
                  <Monitor className="h-3 w-3 mr-1" />
                  Output
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3">
              {activePanel === 'terminal' && (
                <div className="font-mono text-sm">
                  <pre className={`${themeClasses.terminalText} whitespace-pre-wrap`}>
                    {terminalOutput}
                  </pre>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-green-400">$</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && executeTerminalCommand()}
                      className="bg-transparent border-none outline-none text-green-400 flex-1 font-mono"
                      placeholder="Enter command..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div 
          className={`${themeClasses.sidebar} ${themeClasses.border} border-l flex flex-col`}
          style={{ width: rightSidebarWidth }}
        >
          {/* Sidebar Tabs */}
          <div className={`flex ${themeClasses.border} border-b`}>
            <button
              onClick={() => setRightSidebarTab('tools')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                rightSidebarTab === 'tools' ? themeClasses.tabActive : themeClasses.tab
              } flex items-center gap-2`}
            >
              <Zap className="w-4 h-4" />
              Tools
            </button>
            <button
              onClick={() => setRightSidebarTab('settings')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                rightSidebarTab === 'settings' ? themeClasses.tabActive : themeClasses.tab
              } flex items-center gap-2`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* Right Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {rightSidebarTab === 'tools' && (
              <div>
                <h3 className="text-sm font-semibold mb-4">MYCOLOGY TOOLS</h3>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-xs" size="sm">
                    <Microscope className="w-4 h-4 mr-2" />
                    Computer Vision
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs" size="sm">
                    <Beaker className="w-4 h-4 mr-2" />
                    Lab Protocols
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Data Analysis
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs" size="sm">
                    <Archive className="w-4 h-4 mr-2" />
                    Batch Tracking
                  </Button>
                </div>

                <h3 className="text-sm font-semibold mb-4 mt-6">AI FEATURES</h3>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-xs" size="sm">
                    <Brain className="w-4 h-4 mr-2" />
                    Code Generation
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs" size="sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Yield Prediction
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs" size="sm">
                    <Target className="w-4 h-4 mr-2" />
                    Quality Control
                  </Button>
                </div>
              </div>
            )}
            
            {rightSidebarTab === 'settings' && (
              <div>
                <h3 className="text-sm font-semibold mb-4">SETTINGS</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-wide opacity-70">Theme</label>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => setIsDarkMode(true)}
                        className={`px-3 py-2 rounded text-sm ${isDarkMode ? 'bg-purple-600 text-white' : 'bg-gray-600'}`}
                      >
                        Dark
                      </button>
                      <button
                        onClick={() => setIsDarkMode(false)}
                        className={`px-3 py-2 rounded text-sm ${!isDarkMode ? 'bg-purple-600 text-white' : 'bg-gray-600'}`}
                      >
                        Light
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs uppercase tracking-wide opacity-70">AI Model</label>
                    <select className={`w-full mt-2 px-3 py-2 rounded ${themeClasses.input} text-sm`}>
                      <option>GPT-4 (Recommended)</option>
                      <option>Claude 3</option>
                      <option>Gemini Pro</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wide opacity-70">Code Completion</label>
                    <div className="mt-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Enable AI code completion</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
