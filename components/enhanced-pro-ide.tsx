"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { 
  Brain, 
  FileText, 
  Terminal as TerminalIcon, 
  Settings, 
  Search, 
  Moon, 
  Sun, 
  Bell, 
  User, 
  X, 
  Plus,
  FolderOpen,
  Code,
  MessageSquare,
  Maximize2,
  Minimize2,
  Split,
  Save,
  Play,
  GitBranch,
  Database,
  Activity,
  Package,
  ChevronRight,
  ChevronLeft,
  Folder,
  CheckCircle,
  Cpu,
  Files,
  Layers,
  Bug,
  Zap,
  Lightbulb,
  Target,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CroweLogicAvatar } from '@/components/crowe-logic-avatar';
import IDEChatInterface from '@/components/ide-chat-interface';
import { useTheme } from 'next-themes';

interface FileTab {
  id: string;
  name: string;
  type: 'python' | 'markdown' | 'json' | 'text' | 'yaml' | 'typescript' | 'javascript';
  content: string;
  isDirty: boolean;
  isActive: boolean;
  path: string;
}

interface TerminalLine {
  id: string;
  content: string;
  type: 'input' | 'output' | 'error';
  timestamp: Date;
}

interface SidebarPanel {
  id: string;
  name: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function EnhancedProIDE() {
  const [openFiles, setOpenFiles] = useState<FileTab[]>([
    {
      id: '1',
      name: 'cultivation_log.py',
      type: 'python',
      path: '/src/cultivation_log.py',
      content: `# Mycology Cultivation Log System
# Crowe Logic™ Professional Lab Management

import datetime
from typing import Dict, List, Optional

class CultivationBatch:
    """Professional mushroom cultivation batch tracking"""
    
    def __init__(self, batch_id: str, species: str, substrate: str):
        self.batch_id = batch_id
        self.species = species
        self.substrate = substrate
        self.start_date = datetime.datetime.now()
        self.log_entries: List[Dict] = []
        
    def add_log_entry(self, observation: str, temperature: float, humidity: float):
        """Add a cultivation observation log entry"""
        entry = {
            'timestamp': datetime.datetime.now(),
            'observation': observation,
            'temperature': temperature,
            'humidity': humidity
        }
        self.log_entries.append(entry)
        print(f"[{self.batch_id}] Logged: {observation}")
        
    def get_growth_metrics(self) -> Dict:
        """Calculate growth progress metrics"""
        days_elapsed = (datetime.datetime.now() - self.start_date).days
        return {
            'days_elapsed': days_elapsed,
            'total_observations': len(self.log_entries),
            'average_temp': sum(e['temperature'] for e in self.log_entries) / len(self.log_entries) if self.log_entries else 0,
            'average_humidity': sum(e['humidity'] for e in self.log_entries) / len(self.log_entries) if self.log_entries else 0
        }

# Example usage:
batch_001 = CultivationBatch("LM-001", "Pleurotus ostreatus", "Straw pellets")
batch_001.add_log_entry("Mycelium colonization beginning", 22.5, 85.0)
`,
      isDirty: false,
      isActive: true
    }
  ]);

  const [activeFileId, setActiveFileId] = useState<string | null>('1');
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    {
      id: 'welcome_1',
      content: 'Crowe Logic™ Professional IDE Terminal v3.0.0',
      type: 'output',
      timestamp: new Date()
    },
    {
      id: 'welcome_2',
      content: 'Enhanced Mycology Lab Management System',
      type: 'output',
      timestamp: new Date()
    },
    {
      id: 'welcome_3',
      content: 'Type "help" for available cultivation commands.',
      type: 'output',
      timestamp: new Date()
    }
  ]);
  
  const [terminalInput, setTerminalInput] = useState('');
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);
  const [leftSidebarExpanded, setLeftSidebarExpanded] = useState(true);
  const [rightSidebarExpanded, setRightSidebarExpanded] = useState(true);
  const [activeLeftPanel, setActiveLeftPanel] = useState('explorer');
  const [activeRightPanel, setActiveRightPanel] = useState('ai-assistant');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  
  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  const getFileTypeConfig = (type: string) => {
    const configs = {
      python: { icon: <Code className="w-3 h-3" />, color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
      markdown: { icon: <FileText className="w-3 h-3" />, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
      json: { icon: <Layers className="w-3 h-3" />, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
      text: { icon: <FileText className="w-3 h-3" />, color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-800/30' },
      yaml: { icon: <FileText className="w-3 h-3" />, color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
      typescript: { icon: <Code className="w-3 h-3" />, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
      javascript: { icon: <Code className="w-3 h-3" />, color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
    };
    return configs[type as keyof typeof configs] || configs.text;
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced Professional Header with Crowe Logic Branding */}
      <header className="h-14 bg-gradient-to-r from-background via-muted/10 to-background border-b-2 border-primary/20 flex items-center justify-between px-6 sticky top-0 z-50 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <CroweLogicAvatar 
                size={36}
                variant="circle"
                pulse={false}
                className="ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                Crowe Logic™ Pro IDE
              </h1>
              <div className="text-xs text-muted-foreground font-medium">
                Enhanced Development Environment • v3.0.0
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-8">
            <div className="relative">
              <Input
                placeholder="Search files, commands, and code..."
                className="w-80 h-9 text-sm bg-muted/50 border-primary/20 focus:border-primary/40 focus:ring-primary/20 placeholder:text-muted-foreground/70"
              />
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              <Zap className="w-3 h-3 mr-1" />
              AI Ready
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCommandPalette(true)}
            className="hover:bg-primary/10 hover:text-primary"
            title="Command Palette (Ctrl+Shift+P)"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="hover:bg-primary/10 hover:text-primary"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="hover:bg-primary/10 hover:text-primary"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-2"></div>
          <Badge variant="outline" className="text-xs font-mono">
            CroweOS Pro
          </Badge>
        </div>
      </header>

      {/* Enhanced Main IDE Container */}
      <div className="flex-1 flex overflow-hidden bg-gradient-to-br from-background to-muted/10">
        {/* Enhanced Left Sidebar */}
        <div className="flex shadow-lg">
          {/* Professional Activity Bar */}
          <div className="w-14 bg-gradient-to-b from-muted/40 via-muted/30 to-muted/40 border-r border-border/50 flex flex-col items-center py-4 gap-2">
            <Button
              variant={activeLeftPanel === 'explorer' ? "default" : "ghost"}
              size="sm"
              className="w-11 h-11 p-0 transition-all duration-200 hover:scale-105"
              onClick={() => setActiveLeftPanel('explorer')}
              title="Explorer"
            >
              <FolderOpen className="w-5 h-5" />
            </Button>
            <Button
              variant={activeLeftPanel === 'search' ? "default" : "ghost"}
              size="sm"
              className="w-11 h-11 p-0 transition-all duration-200 hover:scale-105"
              onClick={() => setActiveLeftPanel('search')}
              title="Search"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant={activeLeftPanel === 'git' ? "default" : "ghost"}
              size="sm"
              className="w-11 h-11 p-0 transition-all duration-200 hover:scale-105"
              onClick={() => setActiveLeftPanel('git')}
              title="Source Control"
            >
              <GitBranch className="w-5 h-5" />
            </Button>
            <Button
              variant={activeLeftPanel === 'extensions' ? "default" : "ghost"}
              size="sm"
              className="w-11 h-11 p-0 transition-all duration-200 hover:scale-105"
              onClick={() => setActiveLeftPanel('extensions')}
              title="Extensions"
            >
              <Package className="w-5 h-5" />
            </Button>
            
            {/* Separator */}
            <div className="w-8 h-px bg-border/50 my-2"></div>
            
            {/* Tools */}
            <Button
              variant="ghost"
              size="sm"
              className="w-11 h-11 p-0 transition-all duration-200 hover:scale-105 hover:bg-emerald-500/10 hover:text-emerald-600"
              title="Cultivation Tools"
            >
              <Target className="w-5 h-5" />
            </Button>
          </div>

          {/* Enhanced Left Panel */}
          {leftSidebarExpanded && (
            <div className="w-80 bg-gradient-to-b from-muted/20 via-background/95 to-muted/20 border-r border-border/50 flex flex-col backdrop-blur-sm">
              <div className="p-4 border-b border-border/50 bg-muted/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-foreground">
                    {activeLeftPanel === 'explorer' ? 'File Explorer' : 
                     activeLeftPanel === 'search' ? 'Search' :
                     activeLeftPanel === 'git' ? 'Source Control' : 'Extensions'}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setLeftSidebarExpanded(false)}
                    className="w-6 h-6 p-0 hover:bg-muted/50"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                {activeLeftPanel === 'explorer' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold mb-3 text-muted-foreground">
                      <Files className="w-4 h-4" />
                      Open Files
                    </div>
                    {openFiles.map(file => {
                      const config = getFileTypeConfig(file.type);
                      return (
                        <div
                          key={file.id}
                          className={`group flex items-center gap-3 p-3 rounded-lg text-sm cursor-pointer transition-all duration-200 hover:bg-muted/50 hover:scale-[1.02] ${
                            file.id === activeFileId ? 'bg-primary/10 border border-primary/20 shadow-sm' : ''
                          }`}
                          onClick={() => setActiveFileId(file.id)}
                        >
                          <div className={`p-1.5 rounded-md ${config.bgColor} group-hover:scale-110 transition-transform`}>
                            {config.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium truncate">{file.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{file.path}</div>
                          </div>
                          {file.isDirty && (
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4 bg-primary/5 hover:bg-primary/10 border-primary/20"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New File
                    </Button>
                  </div>
                )}
                
                {activeLeftPanel === 'search' && (
                  <div className="space-y-4">
                    <Input 
                      placeholder="Search across files..." 
                      className="bg-muted/50 border-border/50 focus:border-primary/40"
                    />
                    <div className="text-sm text-muted-foreground">
                      <Search className="w-4 h-4 mr-2 inline" />
                      No results found
                    </div>
                  </div>
                )}
                
                {activeLeftPanel === 'git' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <GitBranch className="w-4 h-4" />
                      Source Control
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 mr-2 inline" />
                      No changes detected
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          )}

          {/* Sidebar Toggle */}
          {!leftSidebarExpanded && (
            <div className="w-1 bg-primary/20 hover:bg-primary/40 cursor-pointer transition-colors"
                 onClick={() => setLeftSidebarExpanded(true)}
                 title="Expand Sidebar">
            </div>
          )}
        </div>

        {/* Enhanced Main Content Area */}
        <div className="flex-1 flex flex-col bg-background">
          {/* Professional File Tabs */}
          <div className="h-12 bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20 border-b border-border/50 flex items-center shadow-sm">
            <div className="flex items-center overflow-x-auto">
              {openFiles.map(file => {
                const config = getFileTypeConfig(file.type);
                return (
                  <div
                    key={file.id}
                    className={`group flex items-center gap-3 px-4 h-12 border-r border-border/30 cursor-pointer transition-all duration-200 hover:bg-muted/30 ${
                      file.id === activeFileId ? 'bg-background border-b-2 border-primary' : ''
                    }`}
                    onClick={() => setActiveFileId(file.id)}
                  >
                    <div className={`p-1 rounded ${config.bgColor} group-hover:scale-110 transition-transform`}>
                      {config.icon}
                    </div>
                    <span className="text-sm font-medium">{file.name}</span>
                    {file.isDirty && (
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-5 h-5 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-500 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
              <Button 
                variant="ghost" 
                size="sm" 
                className="mx-2 h-8 w-8 p-0 hover:bg-primary/10"
                title="New File"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Enhanced Editor Area with Professional Features */}
          <div className="flex-1 relative bg-gradient-to-br from-background via-background to-muted/5">
            {/* Editor Toolbar */}
            <div className="absolute top-0 right-0 z-10 p-2">
              <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50 shadow-sm">
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0" title="Save (Ctrl+S)">
                  <Save className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0" title="Run Code">
                  <Play className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0" title="AI Assist">
                  <Lightbulb className="w-3 h-3" />
                </Button>
                <div className="w-px h-4 bg-border mx-1"></div>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0" title="Split View">
                  <Split className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Professional Code Editor */}
            <div className="w-full h-full p-6">
              <div className="w-full h-full bg-muted/10 rounded-xl border border-border/50 shadow-inner relative overflow-hidden">
                {/* Line Numbers */}
                <div className="absolute left-0 top-0 w-12 h-full bg-muted/20 border-r border-border/30 font-mono text-xs text-muted-foreground">
                  <div className="p-4 space-y-[1.4rem]">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div key={i} className="text-right pr-2">{i + 1}</div>
                    ))}
                  </div>
                </div>

                {/* Code Editor */}
                <div className="ml-12 h-full">
                  <Textarea
                    value={openFiles.find(f => f.id === activeFileId)?.content || ''}
                    className="w-full h-full bg-transparent border-none resize-none font-mono text-sm leading-relaxed p-4 focus:ring-0 focus:outline-none"
                    placeholder="Start coding with Crowe Logic AI assistance..."
                    style={{ 
                      fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
                      fontSize: '14px',
                      lineHeight: '1.6'
                    }}
                  />
                </div>

                {/* Custom Scrollbar */}
                <div className="absolute right-0 top-0 w-3 h-full bg-muted/30 border-l border-border/30">
                  <div className="w-full h-16 bg-primary/20 rounded-sm m-0.5 cursor-ns-resize hover:bg-primary/30 transition-colors"></div>
                </div>

                {/* AI Code Completion Indicator */}
                <div className="absolute bottom-4 right-16 bg-primary/10 text-primary text-xs px-2 py-1 rounded border border-primary/20">
                  <Brain className="w-3 h-3 mr-1 inline" />
                  AI Ready
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Panel */}
          <div className={`border-t bg-black text-white transition-all duration-200 ${
            isTerminalExpanded ? 'h-64' : 'h-8'
          }`}>
            <div className="flex items-center justify-between px-4 h-8 bg-gray-800 border-b border-gray-600">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Terminal</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}
                className="text-white hover:bg-gray-700 h-6 w-6 p-0"
              >
                {isTerminalExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </Button>
            </div>
            
            {isTerminalExpanded && (
              <div className="p-4 space-y-1">
                {terminalLines.map(line => (
                  <div key={line.id} className="text-sm font-mono">
                    {line.content}
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">$</span>
                  <Input
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="flex-1 bg-transparent border-none text-white focus:ring-0 p-0 h-auto"
                    placeholder="Type command..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex">
          {/* Right Panel */}
          {rightSidebarExpanded && (
            <div className="w-80 bg-muted/30 border-l flex flex-col">
              <div className="p-3 border-b">
                <h3 className="font-medium text-sm">AI Assistant</h3>
              </div>
              <div className="flex-1 p-3">
                <div className="flex items-center gap-2 mb-4">
                  <CroweLogicAvatar size="sm" />
                  <div>
                    <div className="text-sm font-medium">Crowe Logic AI</div>
                    <div className="text-xs text-muted-foreground">Ready to assist</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  AI Assistant panel - Phase 2 will add full chat interface
                </div>
              </div>
            </div>
          )}

          {/* Right Activity Bar */}
          <div className="w-12 bg-muted/30 border-l flex flex-col items-center py-2 gap-1">
            <Button
              variant="default"
              size="sm"
              className="w-10 h-10 p-0"
              title="AI Assistant"
            >
              <Brain className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 p-0"
              title="Tools"
            >
              <Activity className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 p-0"
              title="Database"
            >
              <Database className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Professional Status Bar */}
      <div className="h-6 bg-blue-600 dark:bg-blue-700 text-white flex items-center justify-between px-4 text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <GitBranch className="w-3 h-3" />
            <span>main</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>No problems</span>
          </div>
          <div className="flex items-center gap-1">
            <Code className="w-3 h-3" />
            <span>PYTHON</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Brain className="w-3 h-3" />
            <span>Crowe Logic AI Ready</span>
          </div>
          <div className="flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            <span>CroweOS Pro</span>
          </div>
        </div>
      </div>
    </div>
  );
}
