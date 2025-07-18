"use client";

import React, { useState } from 'react';
import { 
  FolderOpen,
  Search,
  GitBranch,
  Package,
  Settings,
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  Code,
  FileText,
  Database,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileItem[];
  expanded?: boolean;
}

interface FileTab {
  id: string;
  name: string;
  type: 'python' | 'markdown' | 'json' | 'text' | 'yaml';
  content: string;
  isDirty: boolean;
}

interface EnhancedLeftSidebarProps {
  activePanel: string;
  setActivePanel: (panel: string) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  openFiles: FileTab[];
  activeFileId: string | null;
  onFileSelect: (fileId: string) => void;
  onFileCreate: (type: string) => void;
}

const getFileTypeConfig = (type: string) => {
  const configs = {
    python: { icon: <Code className="w-3 h-3" />, color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
    markdown: { icon: <FileText className="w-3 h-3" />, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
    json: { icon: <Layers className="w-3 h-3" />, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
    text: { icon: <FileText className="w-3 h-3" />, color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-800/30' },
    yaml: { icon: <FileText className="w-3 h-3" />, color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
  };
  return configs[type as keyof typeof configs] || configs.text;
};

const leftPanels = [
  { id: 'explorer', name: 'Explorer', icon: <FolderOpen className="w-4 h-4" /> },
  { id: 'search', name: 'Search', icon: <Search className="w-4 h-4" /> },
  { id: 'git', name: 'Source Control', icon: <GitBranch className="w-4 h-4" /> },
  { id: 'extensions', name: 'Extensions', icon: <Package className="w-4 h-4" /> },
];

export default function EnhancedLeftSidebar({
  activePanel,
  setActivePanel,
  isExpanded,
  setIsExpanded,
  openFiles,
  activeFileId,
  onFileSelect,
  onFileCreate
}: EnhancedLeftSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTree] = useState<FileItem[]>([
    {
      id: 'mycology-lab',
      name: 'Mycology Lab',
      type: 'folder',
      path: '/mycology-lab',
      expanded: true,
      children: [
        {
          id: 'cultivation',
          name: 'cultivation',
          type: 'folder',
          path: '/mycology-lab/cultivation',
          expanded: true,
          children: [
            { id: 'cultivation_log.py', name: 'cultivation_log.py', type: 'file', path: '/mycology-lab/cultivation/cultivation_log.py' },
            { id: 'batch_tracker.py', name: 'batch_tracker.py', type: 'file', path: '/mycology-lab/cultivation/batch_tracker.py' },
            { id: 'environment_monitor.py', name: 'environment_monitor.py', type: 'file', path: '/mycology-lab/cultivation/environment_monitor.py' }
          ]
        },
        {
          id: 'protocols',
          name: 'protocols',
          type: 'folder',
          path: '/mycology-lab/protocols',
          expanded: false,
          children: [
            { id: 'sop_protocol.md', name: 'sop_protocol.md', type: 'file', path: '/mycology-lab/protocols/sop_protocol.md' },
            { id: 'sterilization.md', name: 'sterilization.md', type: 'file', path: '/mycology-lab/protocols/sterilization.md' }
          ]
        },
        {
          id: 'data',
          name: 'data',
          type: 'folder',
          path: '/mycology-lab/data',
          expanded: false,
          children: [
            { id: 'batch_data.json', name: 'batch_data.json', type: 'file', path: '/mycology-lab/data/batch_data.json' },
            { id: 'environment_logs.csv', name: 'environment_logs.csv', type: 'file', path: '/mycology-lab/data/environment_logs.csv' }
          ]
        }
      ]
    }
  ]);

  const renderFileTree = (items: FileItem[], depth = 0) => {
    return items.map(item => (
      <div key={item.id} style={{ paddingLeft: depth * 16 }}>
        <div
          className="flex items-center gap-2 p-1 rounded text-sm cursor-pointer hover:bg-muted/50"
          onClick={() => {
            if (item.type === 'file') {
              onFileSelect(item.id);
            }
          }}
        >
          {item.type === 'folder' ? (
            item.expanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )
          ) : null}
          
          {item.type === 'folder' ? (
            <Folder className="w-4 h-4 text-blue-600" />
          ) : (
            <File className="w-4 h-4 text-gray-600" />
          )}
          
          <span className="flex-1 truncate">{item.name}</span>
        </div>
        
        {item.type === 'folder' && item.expanded && item.children && (
          <div>
            {renderFileTree(item.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  const renderPanelContent = () => {
    switch (activePanel) {
      case 'explorer':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FolderOpen className="w-4 h-4" />
                Open Files
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFileCreate('python')}
                className="h-6 w-6 p-0"
              >
                <Code className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="space-y-1">
              {openFiles.map(file => {
                const config = getFileTypeConfig(file.type);
                return (
                  <div
                    key={file.id}
                    className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer hover:bg-muted/50 ${
                      file.id === activeFileId ? 'bg-muted' : ''
                    }`}
                    onClick={() => onFileSelect(file.id)}
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

            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <Folder className="w-4 h-4" />
                Project Explorer
              </div>
              <div className="space-y-1">
                {renderFileTree(fileTree)}
              </div>
            </div>
          </div>
        );

      case 'search':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Search className="w-4 h-4" />
              Search
            </div>
            <Input 
              placeholder="Search files..." 
              className="text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="text-sm text-muted-foreground">
              {searchQuery ? `Searching for "${searchQuery}"...` : 'Enter search term'}
            </div>
          </div>
        );

      case 'git':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <GitBranch className="w-4 h-4" />
              Source Control
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                main
              </Badge>
              <span className="text-xs text-muted-foreground">
                No changes
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Working tree clean
            </div>
          </div>
        );

      case 'extensions':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Package className="w-4 h-4" />
              Extensions
            </div>
            <div className="space-y-2">
              <div className="p-2 rounded bg-muted/50">
                <div className="text-sm font-medium">Crowe Logic AI</div>
                <div className="text-xs text-muted-foreground">Mycology AI Assistant</div>
                <Badge variant="secondary" className="text-xs mt-1">Active</Badge>
              </div>
              <div className="p-2 rounded bg-muted/30">
                <div className="text-sm font-medium">Python IntelliSense</div>
                <div className="text-xs text-muted-foreground">Code completion</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar Content Panel */}
      {isExpanded && (
        <div className="w-72 bg-muted/30 border-r flex flex-col">
          <div className="p-3 border-b flex items-center justify-between">
            <h3 className="font-medium text-sm">
              {leftPanels.find(p => p.id === activePanel)?.name}
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 p-0"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-3 sidebar-scrollbar custom-scrollbar">
            {renderPanelContent()}
          </ScrollArea>
        </div>
      )}

      {/* Activity Bar */}
      <div className="w-12 bg-muted/30 border-r flex flex-col items-center py-2 gap-1">
        {leftPanels.map((panel) => (
          <Button
            key={panel.id}
            variant={activePanel === panel.id ? "default" : "ghost"}
            size="sm"
            className="w-10 h-10 p-0"
            onClick={() => {
              if (activePanel === panel.id) {
                setIsExpanded(!isExpanded);
              } else {
                setActivePanel(panel.id);
                setIsExpanded(true);
              }
            }}
            title={panel.name}
          >
            {panel.icon}
          </Button>
        ))}
        
        <div className="flex-1" />
        
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
