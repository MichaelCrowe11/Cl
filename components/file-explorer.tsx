'use client'

import React, { useState, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ChevronRight, 
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  FileText,
  FileCode,
  FileJson,
  FilePlus,
  FolderPlus,
  Search,
  MoreVertical,
  Trash2,
  Edit,
  Copy,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  path: string
  children?: FileNode[]
  content?: string
  language?: string
}

interface FileExplorerProps {
  files: FileNode[]
  onFileSelect?: (file: FileNode) => void
  onFileCreate?: (parentPath: string, name: string, type: 'file' | 'folder') => void
  onFileDelete?: (path: string) => void
  onFileRename?: (path: string, newName: string) => void
  selectedPath?: string
  className?: string
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const iconMap: Record<string, React.ReactNode> = {
    'ts': <FileCode className="h-4 w-4 text-blue-500" />,
    'tsx': <FileCode className="h-4 w-4 text-blue-500" />,
    'js': <FileCode className="h-4 w-4 text-yellow-500" />,
    'jsx': <FileCode className="h-4 w-4 text-yellow-500" />,
    'json': <FileJson className="h-4 w-4 text-green-500" />,
    'md': <FileText className="h-4 w-4 text-gray-500" />,
    'css': <FileCode className="h-4 w-4 text-purple-500" />,
    'scss': <FileCode className="h-4 w-4 text-purple-500" />,
    'html': <FileCode className="h-4 w-4 text-orange-500" />,
    'py': <FileCode className="h-4 w-4 text-blue-400" />,
    'sql': <FileCode className="h-4 w-4 text-pink-500" />,
  }
  return iconMap[ext || ''] || <File className="h-4 w-4" />
}

function FileTreeItem({ 
  node, 
  depth = 0, 
  onSelect,
  onDelete,
  onRename,
  selectedPath,
  expandedFolders,
  onToggleFolder
}: {
  node: FileNode
  depth?: number
  onSelect?: (file: FileNode) => void
  onDelete?: (path: string) => void
  onRename?: (path: string, newName: string) => void
  selectedPath?: string
  expandedFolders: Set<string>
  onToggleFolder: (path: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(node.name)
  const [showActions, setShowActions] = useState(false)
  
  const isExpanded = expandedFolders.has(node.path)
  const isSelected = selectedPath === node.path

  const handleClick = () => {
    if (node.type === 'folder') {
      onToggleFolder(node.path)
    } else {
      onSelect?.(node)
    }
  }

  const handleRename = () => {
    if (editName !== node.name && editName.trim()) {
      onRename?.(node.path, editName.trim())
    }
    setIsEditing(false)
  }

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 px-2 py-1 hover:bg-muted/50 cursor-pointer rounded-sm",
          isSelected && "bg-muted"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {node.type === 'folder' && (
          isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )
        )}
        {node.type === 'folder' ? (
          isExpanded ? (
            <FolderOpen className="h-4 w-4 text-blue-500" />
          ) : (
            <Folder className="h-4 w-4 text-blue-500" />
          )
        ) : (
          getFileIcon(node.name)
        )}
        
        {isEditing ? (
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename()
              if (e.key === 'Escape') {
                setEditName(node.name)
                setIsEditing(false)
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="h-5 px-1 text-xs"
            autoFocus
          />
        ) : (
          <span className="text-sm flex-1 truncate">
            {node.name}
          </span>
        )}
        
        {showActions && !isEditing && (
          <div className="flex items-center gap-0.5 ml-auto">
            <Button
              size="sm"
              variant="ghost"
              className="h-5 w-5 p-0"
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-5 w-5 p-0"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(node.path)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              onDelete={onDelete}
              onRename={onRename}
              selectedPath={selectedPath}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileExplorer({
  files,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  selectedPath,
  className
}: FileExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']))
  const [showNewItemDialog, setShowNewItemDialog] = useState(false)
  const [newItemType, setNewItemType] = useState<'file' | 'folder'>('file')
  const [newItemName, setNewItemName] = useState('')
  const [newItemPath, setNewItemPath] = useState('/')

  const toggleFolder = useCallback((path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }, [])

  const filterFiles = useCallback((nodes: FileNode[], query: string): FileNode[] => {
    if (!query) return nodes
    
    return nodes.reduce((acc, node) => {
      if (node.name.toLowerCase().includes(query.toLowerCase())) {
        return [...acc, node]
      }
      if (node.children) {
        const filteredChildren = filterFiles(node.children, query)
        if (filteredChildren.length > 0) {
          return [...acc, { ...node, children: filteredChildren }]
        }
      }
      return acc
    }, [] as FileNode[])
  }, [])

  const filteredFiles = filterFiles(files, searchQuery)

  const handleNewItem = () => {
    if (newItemName.trim()) {
      onFileCreate?.(newItemPath, newItemName.trim(), newItemType)
      setShowNewItemDialog(false)
      setNewItemName('')
    }
  }

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <div className="p-2 border-b space-y-2">
        <div className="flex items-center gap-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setNewItemType('file')
              setShowNewItemDialog(true)
            }}
            className="h-8 flex-1"
          >
            <FilePlus className="h-4 w-4 mr-1" />
            New File
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setNewItemType('folder')
              setShowNewItemDialog(true)
            }}
            className="h-8 flex-1"
          >
            <FolderPlus className="h-4 w-4 mr-1" />
            New Folder
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredFiles.map((file) => (
            <FileTreeItem
              key={file.id}
              node={file}
              onSelect={onFileSelect}
              onDelete={onFileDelete}
              onRename={onFileRename}
              selectedPath={selectedPath}
              expandedFolders={expandedFolders}
              onToggleFolder={toggleFolder}
            />
          ))}
        </div>
      </ScrollArea>

      {showNewItemDialog && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                New {newItemType === 'file' ? 'File' : 'Folder'}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowNewItemDialog(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder={`Enter ${newItemType} name...`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNewItem()
                if (e.key === 'Escape') setShowNewItemDialog(false)
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowNewItemDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleNewItem}
                className="flex-1"
              >
                Create
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  )
} 