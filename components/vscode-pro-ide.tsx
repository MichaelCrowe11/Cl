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
  Beaker
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CroweLogo } from '@/components/crowe-logo';
import { useTheme } from 'next-themes';

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

interface Command {
  name: string;
  shortcut: string;
  action: () => void;
}

interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

export default function VSCodeProIDE() {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [leftSidebarTab, setLeftSidebarTab] = useState('explorer');
  const [rightSidebarTab, setRightSidebarTab] = useState('tools');
  const [activePanel, setActivePanel] = useState('terminal');
  const [panelHeight, setPanelHeight] = useState(250);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(280);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(280);
  const [explorerExpanded, setExplorerExpanded] = useState(true);
  const [croweAIExpanded, setCroweAIExpanded] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'info', message: 'CroweOS AI analysis complete', timestamp: new Date() },
    { id: 2, type: 'success', message: 'Build successful', timestamp: new Date() }
  ]);

  const commands: Command[] = [
    { name: 'File: New File', shortcut: 'Ctrl+N', action: () => {} },
    { name: 'File: Save', shortcut: 'Ctrl+S', action: () => {} },
    { name: 'Edit: Find', shortcut: 'Ctrl+F', action: () => {} },
    { name: 'View: Command Palette', shortcut: 'Ctrl+Shift+P', action: () => {} },
    { name: 'Terminal: New Terminal', shortcut: 'Ctrl+Shift+`', action: () => {} },
    { name: 'CroweAI: Analyze Code', shortcut: 'Ctrl+Shift+A', action: () => {} },
    { name: 'CroweAI: Generate Tests', shortcut: 'Ctrl+Shift+T', action: () => {} },
    { name: 'CroweAI: Optimize Code', shortcut: 'Ctrl+Shift+O', action: () => {} }
  ];

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
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
      content: 'Welcome to CroweOS Pro IDE! I\'m your AI coding assistant. I can help you analyze code, suggest improvements, debug issues, and generate mycology-specific algorithms.',
      timestamp: new Date()
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  
  const fileTree: FileTreeItem[] = [
    {
      id: 'workspace',
      name: 'MycoProject',
      type: 'folder',
      path: '/workspace',
      expanded: true,
      children: [
        {
          id: 'src',
          name: 'src',
          type: 'folder',
          path: '/workspace/src',
          expanded: true,
          children: [
            { id: 'main.py', name: 'main.py', type: 'file', path: '/workspace/main.py' },
            { id: 'analyzer.py', name: 'analyzer.py', type: 'file', path: '/workspace/src/analyzer.py' },
            { id: 'models.py', name: 'models.py', type: 'file', path: '/workspace/src/models.py' }
          ]
        },
        {
          id: 'data',
          name: 'data',
          type: 'folder',
          path: '/workspace/data',
          children: [
            { id: 'batch_001.csv', name: 'batch_001.csv', type: 'file', path: '/workspace/data/batch_001.csv' },
            { id: 'growth_data.json', name: 'growth_data.json', type: 'file', path: '/workspace/data/growth_data.json' }
          ]
        },
        {
          id: 'tests',
          name: 'tests',
          type: 'folder',
          path: '/workspace/tests',
          children: [
            { id: 'test_analyzer.py', name: 'test_analyzer.py', type: 'file', path: '/workspace/tests/test_analyzer.py' }
          ]
        },
        { id: 'requirements.txt', name: 'requirements.txt', type: 'file', path: '/workspace/requirements.txt' },
        { id: 'README.md', name: 'README.md', type: 'file', path: '/workspace/README.md' }
      ]
    }
  ];

  const getLanguageIcon = (type: string) => {
    switch (type) {
      case 'python': return '🐍';
      case 'typescript': return '📘';
      case 'javascript': return '📜';
      case 'json': return '📋';
      case 'markdown': return '📝';
      case 'csv': return '📊';
      default: return '📄';
    }
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.py')) return '🐍';
    if (name.endsWith('.ts') || name.endsWith('.tsx')) return '📘';
    if (name.endsWith('.js') || name.endsWith('.jsx')) return '📜';
    if (name.endsWith('.json')) return '📋';
    if (name.endsWith('.md')) return '📝';
    if (name.endsWith('.csv')) return '📊';
    if (name.endsWith('.txt')) return '📄';
    return '📄';
  };

  const closeFile = (fileId: string) => {
    const newFiles = activeFiles.filter(f => f.id !== fileId);
    setActiveFiles(newFiles);
    if (activeFileId === fileId && newFiles.length > 0) {
      setActiveFileId(newFiles[0].id);
    }
  };

  const sendToAI = async () => {
    if (!aiInput.trim()) return;
    
    const userMessage = {
      type: 'user',
      content: aiInput,
      timestamp: new Date()
    };
    
    setCroweAIMessages(prev => [...prev, userMessage]);
    setAiInput('');
    setIsLoading(true);

    // Simulate AI response
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

  const FileTreeNode = ({ item, level = 0 }: { item: FileTreeItem; level?: number }) => (
    <div key={item.id} className="select-none">
      <div 
        className={`flex items-center gap-1 px-2 py-1 text-sm hover:bg-accent cursor-pointer group ${
          item.type === 'file' && activeFileId === item.id ? 'bg-accent' : ''
        }`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={() => item.type === 'file' && setActiveFileId(item.id)}
      >
        {item.type === 'folder' && (
          <ChevronRight className={`h-3 w-3 transition-transform ${item.expanded ? 'rotate-90' : ''}`} />
        )}
        <div className="flex items-center gap-1">
          {item.type === 'folder' ? (
            <Folder className="h-4 w-4 text-blue-500" />
          ) : (
            <span className="text-xs">{getFileIcon(item.name)}</span>
          )}
          <span className="text-xs">{item.name}</span>
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

  const filteredCommands = commands.filter(cmd =>
    cmd.name.toLowerCase().includes(commandInput.toLowerCase())
  );

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden relative">
      {/* Command Palette */}
      {showCommandPalette && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className="bg-background border rounded-lg shadow-2xl w-96 max-h-96 overflow-hidden">
            <div className="p-3 border-b">
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Type a command..."
                className="w-full bg-transparent text-sm outline-none"
                autoFocus
              />
            </div>
            <ScrollArea className="max-h-80">
              {filteredCommands.map((cmd, idx) => (
                <div
                  key={idx}
                  className="p-2 hover:bg-accent cursor-pointer flex items-center justify-between text-sm"
                  onClick={() => {
                    cmd.action();
                    setShowCommandPalette(false);
                  }}
                >
                  <span>{cmd.name}</span>
                  <span className="text-xs text-muted-foreground">{cmd.shortcut}</span>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="absolute top-12 right-4 z-40 space-y-2">
        {notifications.map(notif => (
          <div key={notif.id} className="bg-background border rounded-lg p-3 shadow-lg max-w-sm animate-in slide-in-from-right">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {notif.type === 'info' && <Brain className="h-4 w-4 text-blue-500" />}
                {notif.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                <span className="text-sm">{notif.message}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Title Bar */}
      <div className="h-9 bg-accent border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <CroweLogo className="h-5 w-5" />
          <span className="text-sm font-medium">CroweOS Pro IDE</span>
          <Badge variant="secondary" className="text-xs">
            <Brain className="h-3 w-3 mr-1" />
            AI Enhanced
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Minimize2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Maximize2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="h-8 bg-muted border-b flex items-center px-4 text-xs">
        <div className="flex gap-4">
          <span className="hover:bg-accent px-2 py-1 rounded cursor-pointer">File</span>
          <span className="hover:bg-accent px-2 py-1 rounded cursor-pointer">Edit</span>
          <span className="hover:bg-accent px-2 py-1 rounded cursor-pointer">View</span>
          <span className="hover:bg-accent px-2 py-1 rounded cursor-pointer">Go</span>
          <span className="hover:bg-accent px-2 py-1 rounded cursor-pointer">Run</span>
          <span className="hover:bg-accent px-2 py-1 rounded cursor-pointer">Terminal</span>
          <span className="hover:bg-accent px-2 py-1 rounded cursor-pointer">Help</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-accent border-r flex flex-col items-center py-2 gap-1">
          <Button
            variant={leftSidebarTab === 'explorer' ? 'default' : 'ghost'}
            size="icon"
            className="h-10 w-10"
            onClick={() => setLeftSidebarTab('explorer')}
          >
            <FolderOpen className="h-5 w-5" />
          </Button>
          <Button
            variant={leftSidebarTab === 'search' ? 'default' : 'ghost'}
            size="icon"
            className="h-10 w-10"
            onClick={() => setLeftSidebarTab('search')}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant={leftSidebarTab === 'git' ? 'default' : 'ghost'}
            size="icon"
            className="h-10 w-10"
            onClick={() => setLeftSidebarTab('git')}
          >
            <GitBranch className="h-5 w-5" />
          </Button>
          <Button
            variant={leftSidebarTab === 'debug' ? 'default' : 'ghost'}
            size="icon"
            className="h-10 w-10"
            onClick={() => setLeftSidebarTab('debug')}
          >
            <Bug className="h-5 w-5" />
          </Button>
          <Button
            variant={leftSidebarTab === 'crowe-ai' ? 'default' : 'ghost'}
            size="icon"
            className="h-10 w-10"
            onClick={() => setLeftSidebarTab('crowe-ai')}
          >
            <Brain className="h-5 w-5" />
          </Button>
          
          <div className="flex-1" />
          
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-muted/30 border-r flex flex-col">
          <div className="h-9 border-b flex items-center justify-between px-3">
            <span className="text-sm font-medium">
              {leftSidebarTab === 'explorer' && 'Explorer'}
              {leftSidebarTab === 'search' && 'Search'}
              {leftSidebarTab === 'git' && 'Source Control'}
              {leftSidebarTab === 'debug' && 'Run and Debug'}
              {leftSidebarTab === 'crowe-ai' && 'Crowe Logic AI'}
            </span>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            {leftSidebarTab === 'explorer' && (
              <div className="p-2">
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      MycoProject
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </div>
                  {fileTree.map(item => (
                    <FileTreeNode key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {leftSidebarTab === 'crowe-ai' && (
              <div className="p-3 h-full flex flex-col">
                <div className="flex-1 mb-3">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {croweAIMessages.map((message, idx) => (
                      <div key={idx} className={`p-2 rounded text-xs ${
                        message.type === 'ai' 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500'
                          : 'bg-green-50 dark:bg-green-900/20 border-l-2 border-green-500'
                      }`}>
                        <div className="flex items-center gap-1 mb-1">
                          {message.type === 'ai' ? (
                            <Brain className="h-3 w-3 text-blue-500" />
                          ) : (
                            <Users className="h-3 w-3 text-green-500" />
                          )}
                          <span className="font-medium">
                            {message.type === 'ai' ? 'Crowe AI' : 'You'}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500">
                        <div className="flex items-center gap-2">
                          <Brain className="h-3 w-3 text-blue-500 animate-pulse" />
                          <span className="text-xs">Thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask Crowe AI anything about your code..."
                    className="min-h-16 text-xs resize-none"
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
                    className="w-full h-8 text-xs"
                  >
                    <Brain className="h-3 w-3 mr-1" />
                    Ask AI
                  </Button>
                </div>
              </div>
            )}

            {leftSidebarTab === 'git' && (
              <div className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Changes</span>
                    <Badge variant="secondary" className="text-xs">2</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs p-1 hover:bg-accent rounded">
                      <span className="text-green-500">M</span>
                      <span>main.py</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs p-1 hover:bg-accent rounded">
                      <span className="text-blue-500">A</span>
                      <span>analyzer.py</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <GitCommit className="h-3 w-3 mr-1" />
                    Commit Changes
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* File Tabs */}
          <div className="h-9 bg-muted border-b flex items-center overflow-x-auto">
            {activeFiles.map(file => (
              <div 
                key={file.id}
                className={`flex items-center gap-2 px-3 h-full border-r hover:bg-accent cursor-pointer group ${
                  activeFileId === file.id ? 'bg-background' : ''
                }`}
                onClick={() => setActiveFileId(file.id)}
              >
                <span className="text-xs">{getLanguageIcon(file.type)}</span>
                <span className="text-xs">{file.name}</span>
                {file.isDirty && <div className="w-1 h-1 bg-blue-500 rounded-full" />}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(file.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Editor */}
          <div className="flex-1 relative">
            {activeFile ? (
              <div className="h-full w-full bg-background">
                <ScrollArea className="h-full">
                  <div className="p-4 font-mono text-sm">
                    <pre className="whitespace-pre-wrap leading-relaxed">
                      {activeFile.content}
                    </pre>
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Code className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No file open</p>
                  <p className="text-xs">Open a file from the explorer to start coding</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Panel */}
          <div className="h-64 bg-muted border-t flex flex-col">
            <div className="h-8 border-b flex items-center justify-between px-3">
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
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-3 font-mono text-xs">
                {activePanel === 'terminal' && (
                  <div className="space-y-1">
                    <div className="text-green-400">$ python main.py</div>
                    <div>Project: ShiitakeFarm_2025</div>
                    <div>Started: 2025-07-15 09:45:23.123456</div>
                    <div className="text-green-400">$ </div>
                  </div>
                )}
                {activePanel === 'problems' && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-yellow-600">Warning: Unused import 'matplotlib.pyplot' in main.py:4</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-600">Info: Consider adding type hints to function parameters</span>
                    </div>
                  </div>
                )}
                {activePanel === 'output' && (
                  <div className="space-y-1">
                    <div>[09:45:23] Analysis complete: Growth rate optimal</div>
                    <div>[09:45:24] AI prediction: 87% accuracy on yield forecast</div>
                    <div>[09:45:25] CroweOS: Ready for next batch analysis</div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-blue-600 text-white flex items-center justify-between px-4 text-xs">
        <div className="flex items-center gap-4">
          <span>🐍 Python 3.11.0</span>
          <span>UTF-8</span>
          <span>LF</span>
          <span>Ln 15, Col 32</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <GitBranch className="h-3 w-3" />
            main
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            CroweOS Connected
          </span>
          <span className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            AI Ready
          </span>
        </div>
      </div>
    </div>
  );
}
