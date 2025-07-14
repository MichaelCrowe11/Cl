"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Save, 
  Play, 
  Code, 
  FileText, 
  Database,
  Eye,
  Split,
  Maximize2,
  MoreHorizontal
} from 'lucide-react';

interface EditorPanelProps {
  ideState: any;
}

export default function EditorPanel({ ideState }: EditorPanelProps) {
  const { state, closeTab, saveFile, openFile } = ideState;
  const [editorContent, setEditorContent] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const activeTab = state.tabs.find((tab: any) => tab.id === state.activeTabId);
  const activeFile = activeTab?.fileId ? state.files.find((file: any) => file.id === activeTab.fileId) : null;

  // Update editor content when active file changes
  useEffect(() => {
    if (activeFile && activeFile.content !== undefined) {
      setEditorContent(activeFile.content);
    } else {
      setEditorContent('');
    }
  }, [activeFile]);

  // Auto-save functionality
  useEffect(() => {
    if (activeFile && editorContent !== activeFile.content) {
      const timeoutId = setTimeout(() => {
        // Mark tab as dirty
        ideState.setState((prev: any) => ({
          ...prev,
          files: prev.files.map((file: any) => 
            file.id === activeFile.id 
              ? { ...file, content: editorContent, isDirty: true }
              : file
          ),
          tabs: prev.tabs.map((tab: any) =>
            tab.id === activeTab?.id
              ? { ...tab, isDirty: true }
              : tab
          )
        }));
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [editorContent, activeFile, activeTab, ideState]);

  const handleSave = () => {
    if (activeFile) {
      saveFile(activeFile.id, editorContent);
    }
  };

  const handleTabClose = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    closeTab(tabId);
  };

  const getFileIcon = (language?: string) => {
    switch (language) {
      case 'python':
        return <Code className="h-3 w-3 text-green-500" />;
      case 'markdown':
        return <FileText className="h-3 w-3 text-blue-500" />;
      case 'json':
        return <Database className="h-3 w-3 text-yellow-500" />;
      default:
        return <FileText className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getLanguageLabel = (language?: string) => {
    switch (language) {
      case 'python':
        return 'Python';
      case 'markdown':
        return 'Markdown';
      case 'json':
        return 'JSON';
      case 'typescript':
        return 'TypeScript';
      default:
        return 'Text';
    }
  };

  const renderMarkdownPreview = (content: string) => {
    // Simple markdown rendering - in production, use a proper markdown parser
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none p-4">
        {content.split('\n').map((line, index) => {
          if (line.startsWith('# ')) {
            return <h1 key={index} className="text-2xl font-bold mb-4">{line.slice(2)}</h1>;
          } else if (line.startsWith('## ')) {
            return <h2 key={index} className="text-xl font-semibold mb-3">{line.slice(3)}</h2>;
          } else if (line.startsWith('### ')) {
            return <h3 key={index} className="text-lg font-medium mb-2">{line.slice(4)}</h3>;
          } else if (line.startsWith('- ')) {
            return <li key={index} className="ml-4">{line.slice(2)}</li>;
          } else if (line.trim() === '') {
            return <br key={index} />;
          } else {
            return <p key={index} className="mb-2">{line}</p>;
          }
        })}
      </div>
    );
  };

  if (state.tabs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background text-muted-foreground">
        <div className="text-center space-y-4">
          <Code className="h-16 w-16 mx-auto opacity-20" />
          <div>
            <h3 className="text-lg font-medium mb-2">Welcome to Crowe Logic IDE</h3>
            <p className="text-sm">Open a file to start coding, or create a new file to begin your research.</p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const pythonFile = ideState.createFile('analysis.py', 'python');
                ideState.openFile(pythonFile);
              }}
            >
              <Code className="h-4 w-4 mr-2" />
              New Python File
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const mdFile = ideState.createFile('protocol.md', 'markdown');
                ideState.openFile(mdFile);
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              New Protocol
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Tab Bar */}
      <div className="h-10 bg-card border-b border-border flex items-center overflow-x-auto">
        <div className="flex">
          {state.tabs.map((tab: any) => {
            const file = tab.fileId ? state.files.find((f: any) => f.id === tab.fileId) : null;
            return (
              <div
                key={tab.id}
                className={`flex items-center gap-2 px-3 py-2 border-r border-border cursor-pointer hover:bg-accent/50 transition-colors min-w-0 ${
                  tab.id === state.activeTabId ? 'bg-background' : 'bg-card'
                }`}
                onClick={() => {
                  ideState.setState((prev: any) => ({
                    ...prev,
                    activeTabId: tab.id,
                    tabs: prev.tabs.map((t: any) => ({ ...t, isActive: t.id === tab.id }))
                  }));
                }}
              >
                {getFileIcon(file?.language)}
                <span className="text-sm truncate max-w-32">{tab.name}</span>
                {tab.isDirty && (
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 opacity-60 hover:opacity-100"
                  onClick={(e) => handleTabClose(tab.id, e)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor Toolbar */}
      {activeFile && (
        <div className="h-10 bg-card/50 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {getFileIcon(activeFile.language)}
            <span className="text-sm font-medium">{activeFile.name}</span>
            <Badge variant="secondary" className="text-xs">
              {getLanguageLabel(activeFile.language)}
            </Badge>
            {activeTab?.isDirty && (
              <Badge variant="outline" className="text-xs">
                Modified
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {activeFile.language === 'markdown' && (
              <Button
                variant={isPreviewMode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="h-7 px-2"
                title="Toggle Preview"
              >
                <Eye className="h-3 w-3" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-7 px-2"
              title="Save File (Ctrl+S)"
            >
              <Save className="h-3 w-3" />
            </Button>
            
            {activeFile.language === 'python' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                title="Run Python Script"
              >
                <Play className="h-3 w-3" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              title="Split View"
            >
              <Split className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              title="Maximize"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              title="More Options"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 flex">
        {activeFile && (
          <>
            {/* Line Numbers */}
            <div className="w-12 bg-card/30 border-r border-border flex flex-col text-xs text-muted-foreground font-mono">
              <div className="sticky top-0 bg-card/30 h-8 flex items-center justify-center text-xs border-b border-border">
                #
              </div>
              <div className="flex-1 p-1">
                {editorContent.split('\n').map((_, index) => (
                  <div key={index} className="h-5 flex items-center justify-end pr-2">
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex">
              {/* Code Editor */}
              {!isPreviewMode || activeFile.language !== 'markdown' ? (
                <div className={`${isPreviewMode && activeFile.language === 'markdown' ? 'w-1/2 border-r border-border' : 'flex-1'}`}>
                  <Textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    className="w-full h-full resize-none border-0 rounded-none font-mono text-sm leading-5 focus:ring-0 focus:border-0 bg-transparent"
                    placeholder={`Start coding in ${activeFile.name}...`}
                    spellCheck={false}
                    style={{
                      minHeight: '100%',
                      tabSize: 2,
                      fontFamily: '"Fira Code", "Consolas", "Monaco", "Courier New", monospace'
                    }}
                  />
                </div>
              ) : null}

              {/* Markdown Preview */}
              {isPreviewMode && activeFile.language === 'markdown' && (
                <div className={`${!isPreviewMode ? 'w-1/2 border-l border-border' : 'flex-1'} bg-background`}>
                  <ScrollArea className="h-full">
                    {renderMarkdownPreview(editorContent)}
                  </ScrollArea>
                </div>
              )}
            </div>

            {/* Minimap */}
            <div className="w-20 bg-card/20 border-l border-border">
              <div className="sticky top-0 bg-card/30 h-8 flex items-center justify-center text-xs border-b border-border">
                Map
              </div>
              <div className="h-32 bg-gradient-to-b from-blue-500/10 to-green-500/10 m-1 rounded"></div>
            </div>
          </>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-card border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          {activeFile && (
            <>
              <span>Line {editorContent.split('\n').length}</span>
              <span>UTF-8</span>
              <span>{getLanguageLabel(activeFile.language)}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>Spaces: 2</span>
          <span>Auto Save: On</span>
          {state.dbStatus.connected && (
            <span className="text-green-500">● Connected</span>
          )}
        </div>
      </div>
    </div>
  );
}
