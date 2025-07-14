"use client";

import React, { useState, useRef, useLayoutEffect } from 'react';
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
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import CroweLogicChatInterface from '@/components/crowe-logic-chat-interface';
import { CroweLogo } from '@/components/crowe-logo';
import { CroweLogicAvatar } from '@/components/crowe-logic-avatar';

interface FileTab {
  id: string;
  name: string;
  type: 'python' | 'markdown' | 'json' | 'text' | 'yaml';
  content: string;
  isDirty: boolean;
  isActive: boolean;
}

interface TerminalLine {
  id: string;
  content: string;
  type: 'input' | 'output' | 'error';
  timestamp: Date;
}

export default function CroweLogicIDE() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openFiles, setOpenFiles] = useState<FileTab[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [splitView, setSplitView] = useState(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    {
      id: '1',
      content: 'CroweOS Systems Terminal v1.0.0',
      type: 'output',
      timestamp: new Date()
    },
    {
      id: '2', 
      content: 'Type "help" for available commands',
      type: 'output',
      timestamp: new Date()
    }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  // File type colors and icons
  const getFileTypeConfig = (type: FileTab['type']) => {
    switch (type) {
      case 'python':
        return { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: <Code className="w-3 h-3" /> };
      case 'markdown':
        return { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: <FileText className="w-3 h-3" /> };
      case 'json':
        return { color: 'text-green-600', bgColor: 'bg-green-100', icon: <Settings className="w-3 h-3" /> };
      case 'yaml':
        return { color: 'text-purple-600', bgColor: 'bg-purple-100', icon: <Settings className="w-3 h-3" /> };
      default:
        return { color: 'text-gray-600', bgColor: 'bg-gray-100', icon: <FileText className="w-3 h-3" /> };
    }
  };

  const createNewFile = (type: FileTab['type'] = 'python') => {
    const newFile: FileTab = {
      id: `file_${Date.now()}`,
      name: `untitled.${type === 'python' ? 'py' : type === 'markdown' ? 'md' : type}`,
      type,
      content: type === 'python' ? '# New Python script\n\n' : type === 'markdown' ? '# New Document\n\n' : '',
      isDirty: false,
      isActive: true
    };

    setOpenFiles(prev => prev.map(f => ({ ...f, isActive: false })).concat(newFile));
    setActiveFileId(newFile.id);
  };

  const closeFile = (fileId: string) => {
    setOpenFiles(prev => {
      const filtered = prev.filter(f => f.id !== fileId);
      if (fileId === activeFileId && filtered.length > 0) {
        setActiveFileId(filtered[filtered.length - 1].id);
      } else if (filtered.length === 0) {
        setActiveFileId(null);
      }
      return filtered;
    });
  };

  const updateFileContent = (fileId: string, content: string) => {
    setOpenFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, content, isDirty: true } : f
    ));
  };

  const executeTerminalCommand = () => {
    if (!terminalInput.trim()) return;

    const newInputLine: TerminalLine = {
      id: `input_${Date.now()}`,
      content: `$ ${terminalInput}`,
      type: 'input',
      timestamp: new Date()
    };

    const outputLine: TerminalLine = {
      id: `output_${Date.now()}`,
      content: 'Command executed successfully',
      type: 'output',
      timestamp: new Date()
    };

    // Simple command simulation
    if (terminalInput === 'help') {
      outputLine.content = 'Available commands: help, clear, ls, python, analyze, status';
    } else if (terminalInput === 'clear') {
      setTerminalLines([]);
      setTerminalInput('');
      return;
    } else if (terminalInput === 'ls') {
      outputLine.content = 'batch_reports/  protocols/  data/  scripts/';
    } else if (terminalInput.startsWith('python')) {
      outputLine.content = 'Python 3.11.0 ready for mycology analysis';
    } else if (terminalInput === 'analyze') {
      outputLine.content = 'Crowe Logic Analysis Engine initialized';
    }

    setTerminalLines(prev => [...prev, newInputLine, outputLine]);
    setTerminalInput('');
  };

  const activeFile = openFiles.find(f => f.id === activeFileId);

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      {/* Top Header - Always Visible */}
      <header className="h-12 bg-background border-b flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CroweLogo 
              variant="official-minimal"
              size={32}
              systemBranding={true}
            />
            <h1 className="font-semibold text-lg text-foreground">
              Crowe Logic™ IDE
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search files and commands..."
              className="w-64 h-8 text-sm"
            />
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - File Explorer */}
        <div className="w-64 bg-muted/30 border-r flex flex-col">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm">Explorer</h3>
              <Button variant="ghost" size="sm" onClick={() => createNewFile()}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => createNewFile('python')}>
                .py
              </Button>
              <Button variant="ghost" size="sm" onClick={() => createNewFile('markdown')}>
                .md
              </Button>
              <Button variant="ghost" size="sm" onClick={() => createNewFile('json')}>
                .json
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-3 ide-scrollbar">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <FolderOpen className="w-4 h-4" />
                Open Files
              </div>
              {openFiles.map(file => {
                const config = getFileTypeConfig(file.type);
                return (
                  <div
                    key={file.id}
                    className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer hover:bg-muted/50 ${
                      file.id === activeFileId ? 'bg-muted' : ''
                    }`}
                    onClick={() => setActiveFileId(file.id)}
                  >
                    <div className={`p-1 rounded ${config.bgColor}`}>
                      {config.icon}
                    </div>
                    <span className="flex-1 truncate">{file.name}</span>
                    {file.isDirty && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Center Panel - Editor/Chat/Terminal */}
        <div className="flex-1 flex flex-col">
          {/* File Tabs */}
          {openFiles.length > 0 && (
            <div className="h-10 bg-muted/20 border-b flex items-center overflow-x-auto">
              <div className="flex items-center gap-0">
                {openFiles.map(file => {
                  const config = getFileTypeConfig(file.type);
                  return (
                    <div
                      key={file.id}
                      className={`flex items-center gap-2 px-3 h-10 border-r cursor-pointer hover:bg-muted/50 ${
                        file.id === activeFileId ? 'bg-background border-b-2 border-purple-500' : ''
                      }`}
                      onClick={() => setActiveFileId(file.id)}
                    >
                      <div className={`${config.color}`}>
                        {config.icon}
                      </div>
                      <span className="text-sm">{file.name}</span>
                      {file.isDirty && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-4 h-4 p-0 hover:bg-destructive/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeFile(file.id);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center gap-2 ml-auto mr-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSplitView(!splitView)}
                  title="Toggle split view"
                >
                  <Split className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Save">
                  <Save className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Run">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className={`flex-1 flex ${splitView ? 'flex-row' : 'flex-col'} overflow-hidden`}>
            {/* Editor/Chat Area */}
            <div className={`${splitView ? 'w-1/2' : 'flex-1'} flex flex-col`}>
              {activeFile ? (
                <div className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 p-4 ide-scrollbar">
                    <Textarea
                      value={activeFile.content}
                      onChange={(e) => updateFileContent(activeFile.id, e.target.value)}
                      className="min-h-[400px] font-mono text-sm resize-none border-none focus:ring-0"
                      placeholder={`Start coding in ${activeFile.name}...`}
                    />
                  </ScrollArea>
                  
                  {/* Chat Panel - Below Editor when file is open */}
                  {!isChatMinimized && (
                    <div className="h-64 border-t">
                      <div className="h-8 bg-muted/20 flex items-center justify-between px-3 border-b">
                        <div className="flex items-center gap-2">
                          <CroweLogicAvatar size={20} variant="circle" />
                          <span className="text-sm font-medium">Crowe Logic Assistant</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsChatMinimized(!isChatMinimized)}
                        >
                          <Minimize2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="h-56 overflow-hidden">
                        <CroweLogicChatInterface />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Default Chat View when no files open */
                <div className="flex-1">
                  <div className="h-8 bg-muted/20 flex items-center px-3 border-b">
                    <div className="flex items-center gap-2">
                      <CroweLogicAvatar size={20} variant="circle" />
                      <span className="text-sm font-medium">Crowe Logic AI Assistant</span>
                      <Badge variant="secondary" className="text-xs">Default View</Badge>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <CroweLogicChatInterface />
                  </div>
                </div>
              )}
            </div>

            {/* Split View Chat Panel */}
            {splitView && (
              <div className="w-1/2 border-l">
                <div className="h-8 bg-muted/20 flex items-center px-3 border-b">
                  <div className="flex items-center gap-2">
                    <CroweLogicAvatar size={20} variant="circle" />
                    <span className="text-sm font-medium">AI Assistant</span>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <CroweLogicChatInterface />
                </div>
              </div>
            )}
          </div>

          {/* Terminal Panel */}
          <div className={`border-t ${isTerminalExpanded ? 'h-80' : 'h-32'} flex flex-col`}>
            <div className="h-8 bg-muted/20 flex items-center justify-between px-3 border-b">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Terminal</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}
              >
                {isTerminalExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
            
            <ScrollArea className="flex-1 p-2 font-mono text-sm bg-gray-900 text-green-400 ide-scrollbar">
              <div ref={terminalScrollRef} className="space-y-1">
                {terminalLines.map(line => (
                  <div
                    key={line.id}
                    className={`${
                      line.type === 'input' ? 'text-white' :
                      line.type === 'error' ? 'text-red-400' : 'text-green-400'
                    }`}
                  >
                    {line.content}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="h-8 bg-gray-800 flex items-center px-2">
              <span className="text-green-400 text-sm mr-2">$</span>
              <Input
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeTerminalCommand()}
                className="flex-1 bg-transparent border-none text-green-400 text-sm h-6 focus:ring-0"
                placeholder="Enter command..."
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Tools */}
        <div className="w-64 bg-muted/30 border-l flex flex-col">
          <div className="p-3 border-b">
            <h3 className="font-medium text-sm">Tools & Analysis</h3>
          </div>
          
          <ScrollArea className="flex-1 p-3 ide-scrollbar">
            <div className="space-y-3">
              <Card className="p-3">
                <h4 className="font-medium text-sm mb-2">Environment Status</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>CO₂ Level:</span>
                    <Badge variant="secondary">520 ppm</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Temperature:</span>
                    <Badge variant="secondary">22°C</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Humidity:</span>
                    <Badge variant="secondary">65%</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <h4 className="font-medium text-sm mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                    <Brain className="w-3 h-3 mr-2" />
                    Analyze Sample
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                    <FileText className="w-3 h-3 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                    <Settings className="w-3 h-3 mr-2" />
                    Configure Setup
                  </Button>
                </div>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Chat Minimized Indicator */}
      {isChatMinimized && activeFile && (
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={() => setIsChatMinimized(false)}
            className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
