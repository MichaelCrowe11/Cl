"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  File, 
  Folder, 
  ChevronRight, 
  ChevronDown,
  ChevronLeft,
  Plus,
  Search,
  MoreHorizontal,
  Brain,
  CheckSquare,
  Send,
  Loader2,
  Code,
  FileText,
  Database
} from 'lucide-react';

interface SidebarProps {
  ideState: any;
}

export default function Sidebar({ ideState }: SidebarProps) {
  const { state, openFile, createFile, sendAIMessage } = ideState;
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['folder-1']));
  const [newFileName, setNewFileName] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(false);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      const extension = newFileName.split('.').pop()?.toLowerCase();
      let fileType: 'python' | 'markdown' | 'json' | 'typescript' | 'text' = 'text';
      
      if (extension === 'py') fileType = 'python';
      else if (extension === 'md') fileType = 'markdown';
      else if (extension === 'json') fileType = 'json';
      else if (extension === 'ts' || extension === 'tsx') fileType = 'typescript';
      
      createFile(newFileName, fileType);
      setNewFileName('');
      setShowNewFileInput(false);
    }
  };

  const handleAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.aiInput.trim() && !state.isAILoading) {
      sendAIMessage(state.aiInput);
    }
  };

  const renderFileTree = (files: any[], level = 0) => {
    return files.map((file) => (
      <div key={file.id} className="select-none">
        <div 
          className={`flex items-center gap-2 px-2 py-1 hover:bg-accent/50 rounded cursor-pointer group ${
            level > 0 ? 'ml-' + (level * 4) : ''
          }`}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => {
            if (file.type === 'folder') {
              toggleFolder(file.id);
            } else {
              openFile(file.id);
            }
          }}
        >
          {file.type === 'folder' ? (
            <>
              {expandedFolders.has(file.id) ? (
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              )}
              <Folder className="h-4 w-4 text-blue-500" />
            </>
          ) : (
            <>
              <div className="w-3" /> {/* Spacer for alignment */}
              {file.language === 'python' && <Code className="h-4 w-4 text-green-500" />}
              {file.language === 'markdown' && <FileText className="h-4 w-4 text-blue-500" />}
              {file.language === 'json' && <Database className="h-4 w-4 text-yellow-500" />}
              {!['python', 'markdown', 'json'].includes(file.language) && <File className="h-4 w-4 text-muted-foreground" />}
            </>
          )}
          <span className="text-sm truncate flex-1">{file.name}</span>
          {file.isDirty && <div className="w-2 h-2 rounded-full bg-orange-500" />}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              // Handle file options
            }}
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
        
        {file.type === 'folder' && expandedFolders.has(file.id) && file.children && 
          renderFileTree(file.children, level + 1)
        }
      </div>
    ));
  };

  if (state.leftPanel.isCollapsed) {
    return (
      <div className="w-12 bg-card border-r border-border flex flex-col items-center py-2 gap-1">
        <Button
          variant={state.leftPanel.activeTab === 'files' ? 'default' : 'ghost'}
          size="sm"
          className="w-10 h-10 p-0"
          onClick={() => ideState.togglePanel('left')}
          title="Explorer"
        >
          <FolderOpen className="h-4 w-4" />
        </Button>
        <Button
          variant={state.leftPanel.activeTab === 'ai' ? 'default' : 'ghost'}
          size="sm"
          className="w-10 h-10 p-0"
          onClick={() => {
            ideState.setPanelTab('left', 'ai');
            ideState.togglePanel('left');
          }}
          title="AI Coder"
        >
          <Brain className="h-4 w-4" />
        </Button>
        <Button
          variant={state.leftPanel.activeTab === 'tasks' ? 'default' : 'ghost'}
          size="sm"
          className="w-10 h-10 p-0"
          onClick={() => {
            ideState.setPanelTab('left', 'tasks');
            ideState.togglePanel('left');
          }}
          title="Tasks"
        >
          <CheckSquare className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="bg-card border-r border-border flex flex-col transition-all duration-300"
      style={{ width: state.leftPanel.width }}
    >
      {/* Sidebar Header */}
      <div className="h-10 border-b border-border flex items-center justify-between px-3">
        <h2 className="font-medium text-sm">Explorer</h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => ideState.togglePanel('left')}
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs 
        value={state.leftPanel.activeTab} 
        onValueChange={(value) => ideState.setPanelTab('left', value)}
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full rounded-none border-b border-border bg-transparent h-10">
          <TabsTrigger value="files" className="flex-1 rounded-none text-xs">
            <FolderOpen className="h-3 w-3 mr-1" />
            Files
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex-1 rounded-none text-xs">
            <Brain className="h-3 w-3 mr-1" />
            AI
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex-1 rounded-none text-xs">
            <CheckSquare className="h-3 w-3 mr-1" />
            Tasks
          </TabsTrigger>
        </TabsList>

        {/* Files Tab */}
        <TabsContent value="files" className="flex-1 flex flex-col m-0 p-0">
          <div className="p-2 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Project Files
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowNewFileInput(true)}
                title="New File"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            {showNewFileInput && (
              <div className="flex gap-1 mb-2">
                <Input
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="filename.py"
                  className="h-6 text-xs"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateFile();
                    if (e.key === 'Escape') setShowNewFileInput(false);
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={handleCreateFile}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                className="h-6 pl-7 text-xs bg-background/50"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-1">
              {renderFileTree(state.files)}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* AI Coder Tab */}
        <TabsContent value="ai" className="flex-1 flex flex-col m-0 p-0">
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
                <AvatarFallback className="text-xs">AI</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Crowe Logic AI Coder</p>
                <p className="text-xs text-muted-foreground">Mycology Research Assistant</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              Research Mode
            </Badge>
          </div>
          
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {state.aiMessages.map((message: any) => (
                <div key={message.id} className="space-y-1">
                  <div className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'assistant' && (
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarImage src="/crowe-avatar.png" alt="AI" />
                        <AvatarFallback className="text-xs">AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[200px] p-2 rounded text-xs ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground ml-8' 
                        : 'bg-muted'
                    }`}>
                      <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                        {message.content}
                      </pre>
                      <div className="text-xs opacity-50 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {state.isAILoading && (
                <div className="flex gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/crowe-avatar.png" alt="AI" />
                    <AvatarFallback className="text-xs">AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-2 rounded">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t border-border">
            <form onSubmit={handleAISubmit} className="flex gap-1">
              <Input
                value={state.aiInput}
                onChange={(e) => ideState.setState((prev: any) => ({ ...prev, aiInput: e.target.value }))}
                placeholder="Ask AI for help..."
                className="flex-1 h-8 text-xs"
                disabled={state.isAILoading}
              />
              <Button 
                type="submit" 
                size="sm" 
                className="h-8 w-8 p-0"
                disabled={state.isAILoading || !state.aiInput.trim()}
              >
                <Send className="h-3 w-3" />
              </Button>
            </form>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="flex-1 flex flex-col m-0 p-0">
          <div className="p-3">
            <h3 className="text-sm font-medium mb-3">Active Tasks</h3>
            <div className="space-y-2">
              <div className="p-2 bg-muted/50 rounded text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <CheckSquare className="h-3 w-3" />
                  <span className="font-medium">Protocol Review</span>
                </div>
                <p className="text-muted-foreground">Review sterilization SOP</p>
              </div>
              
              <div className="p-2 bg-muted/50 rounded text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <CheckSquare className="h-3 w-3" />
                  <span className="font-medium">Data Analysis</span>
                </div>
                <p className="text-muted-foreground">Analyze batch CL-001 results</p>
              </div>
              
              <div className="p-2 bg-muted/50 rounded text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <CheckSquare className="h-3 w-3" />
                  <span className="font-medium">Code Optimization</span>
                </div>
                <p className="text-muted-foreground">Optimize cultivation algorithms</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
