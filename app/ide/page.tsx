'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { FileExplorer, FileNode } from '@/components/file-explorer'
import { MonacoEditor } from '@/components/monaco-editor'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Terminal, 
  Play, 
  Save, 
  Settings, 
  GitBranch,
  Cloud,
  Download,
  Upload,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface OpenFile {
  node: FileNode
  isDirty: boolean
}

// Sample file structure - In production, this would come from your backend
const initialFiles: FileNode[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    path: '/src',
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        path: '/src/components',
        children: [
          {
            id: '3',
            name: 'Button.tsx',
            type: 'file',
            path: '/src/components/Button.tsx',
            content: `import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}`
          },
          {
            id: '4',
            name: 'Card.tsx',
            type: 'file',
            path: '/src/components/Card.tsx',
            content: `import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={\`card \${className || ''}\`}>
      {children}
    </div>
  )
}`
          }
        ]
      },
      {
        id: '5',
        name: 'utils',
        type: 'folder',
        path: '/src/utils',
        children: [
          {
            id: '6',
            name: 'helpers.ts',
            type: 'file',
            path: '/src/utils/helpers.ts',
            content: `export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}`
          }
        ]
      },
      {
        id: '7',
        name: 'App.tsx',
        type: 'file',
        path: '/src/App.tsx',
        content: `import React from 'react'
import { Button } from './components/Button'
import { Card } from './components/Card'

function App() {
  return (
    <div className="app">
      <h1>Welcome to Crowe Logic IDE</h1>
      <Card>
        <p>Start coding your mycology research applications!</p>
        <Button onClick={() => console.log('Hello World!')}>
          Get Started
        </Button>
      </Card>
    </div>
  )
}

export default App`
      }
    ]
  },
  {
    id: '8',
    name: 'package.json',
    type: 'file',
    path: '/package.json',
    content: `{
  "name": "crowe-logic-project",
  "version": "1.0.0",
  "description": "Mycology research application",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "vite": "^4.3.0"
  }
}`
  },
  {
    id: '9',
    name: 'README.md',
    type: 'file',
    path: '/README.md',
    content: `# Crowe Logic Project

This is your mycology research application workspace.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

- TypeScript support
- React 18
- Vite for fast development
- Integrated with Crowe Logic AI

## Documentation

Visit [docs.crowelogic.ai](https://docs.crowelogic.ai) for more information.`
  }
]

export default function IDEPage() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [files, setFiles] = useState<FileNode[]>(initialFiles)
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([])
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'Welcome to Crowe Logic IDE Terminal',
    '> Ready for commands...'
  ])

  const activeFile = openFiles.find(f => f.node.id === activeFileId)

  const findFileNode = useCallback((files: FileNode[], id: string): FileNode | null => {
    for (const file of files) {
      if (file.id === id) return file
      if (file.children) {
        const found = findFileNode(file.children, id)
        if (found) return found
      }
    }
    return null
  }, [])

  const updateFileContent = useCallback((id: string, content: string) => {
    setFiles(prevFiles => {
      const updateNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.id === id) {
            return { ...node, content }
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) }
          }
          return node
        })
      }
      return updateNode(prevFiles)
    })

    setOpenFiles(prev => prev.map(file => 
      file.node.id === id 
        ? { ...file, isDirty: true }
        : file
    ))
  }, [])

  const handleFileSelect = useCallback((file: FileNode) => {
    if (file.type === 'file') {
      const existingFile = openFiles.find(f => f.node.id === file.id)
      if (!existingFile) {
        setOpenFiles(prev => [...prev, { node: file, isDirty: false }])
      }
      setActiveFileId(file.id)
    }
  }, [openFiles])

  const handleCloseFile = useCallback((fileId: string) => {
    setOpenFiles(prev => {
      const newOpenFiles = prev.filter(f => f.node.id !== fileId)
      if (activeFileId === fileId && newOpenFiles.length > 0) {
        setActiveFileId(newOpenFiles[newOpenFiles.length - 1].node.id)
      } else if (newOpenFiles.length === 0) {
        setActiveFileId(null)
      }
      return newOpenFiles
    })
  }, [activeFileId])

  const handleSaveFile = useCallback(async () => {
    if (!activeFile) return

    // In production, save to backend
    setOpenFiles(prev => prev.map(file => 
      file.node.id === activeFile.node.id 
        ? { ...file, isDirty: false }
        : file
    ))

    setTerminalOutput(prev => [
      ...prev,
      `> File saved: ${activeFile.node.path}`
    ])
  }, [activeFile])

  const handleRunCode = useCallback(() => {
    setTerminalOutput(prev => [
      ...prev,
      '> Running code...',
      '> Compilation successful',
      '> Application started on http://localhost:3000'
    ])
  }, [])

  const handleFileCreate = useCallback((parentPath: string, name: string, type: 'file' | 'folder') => {
    const newNode: FileNode = {
      id: `new-${Date.now()}`,
      name,
      type,
      path: `${parentPath}/${name}`,
      children: type === 'folder' ? [] : undefined,
      content: type === 'file' ? '// New file\n' : undefined
    }

    setFiles(prevFiles => {
      const addToFolder = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.path === parentPath && node.type === 'folder') {
            return {
              ...node,
              children: [...(node.children || []), newNode]
            }
          }
          if (node.children) {
            return { ...node, children: addToFolder(node.children) }
          }
          return node
        })
      }
      
      if (parentPath === '/') {
        return [...prevFiles, newNode]
      }
      return addToFolder(prevFiles)
    })

    if (type === 'file') {
      handleFileSelect(newNode)
    }
  }, [handleFileSelect])

  const handleFileDelete = useCallback((path: string) => {
    setFiles(prevFiles => {
      const removeNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.filter(node => {
          if (node.path === path) return false
          if (node.children) {
            node.children = removeNode(node.children)
          }
          return true
        })
      }
      return removeNode(prevFiles)
    })

    // Close file if it's open
    const fileToDelete = openFiles.find(f => f.node.path === path)
    if (fileToDelete) {
      handleCloseFile(fileToDelete.node.id)
    }
  }, [openFiles, handleCloseFile])

  const handleFileRename = useCallback((path: string, newName: string) => {
    setFiles(prevFiles => {
      const renameNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.path === path) {
            const newPath = path.substring(0, path.lastIndexOf('/') + 1) + newName
            return { ...node, name: newName, path: newPath }
          }
          if (node.children) {
            return { ...node, children: renameNode(node.children) }
          }
          return node
        })
      }
      return renameNode(prevFiles)
    })
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSaveFile()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSaveFile])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-12 border-b flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="h-8 w-8 p-0"
          >
            {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </Button>
          <h1 className="text-lg font-semibold">Crowe Logic IDE</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRunCode}
            className="h-8"
          >
            <Play className="h-4 w-4 mr-1" />
            Run
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSaveFile}
            disabled={!activeFile?.isDirty}
            className="h-8"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8"
          >
            <GitBranch className="h-4 w-4 mr-1" />
            main
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={cn(
          "border-r bg-card transition-all duration-200",
          isSidebarOpen ? "w-64" : "w-0"
        )}>
          {isSidebarOpen && (
            <FileExplorer
              files={files}
              onFileSelect={handleFileSelect}
              onFileCreate={handleFileCreate}
              onFileDelete={handleFileDelete}
              onFileRename={handleFileRename}
              selectedPath={activeFile?.node.path}
              className="h-full border-0 rounded-none"
            />
          )}
        </aside>

        {/* Editor Area */}
        <main className="flex-1 flex flex-col">
          {/* Tabs */}
          {openFiles.length > 0 && (
            <div className="h-10 border-b bg-muted/30 flex items-center px-2 gap-1 overflow-x-auto">
              {openFiles.map(file => (
                <div
                  key={file.node.id}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1 rounded-t cursor-pointer text-sm",
                    "hover:bg-muted/50 transition-colors",
                    activeFileId === file.node.id && "bg-background border-t border-l border-r"
                  )}
                  onClick={() => setActiveFileId(file.node.id)}
                >
                  {getFileIcon(file.node.name)}
                  <span className="truncate max-w-[120px]">
                    {file.node.name}
                  </span>
                  {file.isDirty && <span className="text-orange-500">●</span>}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCloseFile(file.node.id)
                    }}
                    className="h-4 w-4 p-0 ml-1 hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            {activeFile ? (
              <MonacoEditor
                value={activeFile.node.content || ''}
                onChange={(value) => {
                  if (value !== undefined) {
                    updateFileContent(activeFile.node.id, value)
                  }
                }}
                path={activeFile.node.path}
                onSave={handleSaveFile}
                height="100%"
                className="border-0 rounded-none"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg mb-2">No file open</p>
                  <p className="text-sm">Select a file from the explorer or create a new one</p>
                </div>
              </div>
            )}
          </div>

          {/* Terminal */}
          <div className="h-48 border-t bg-card">
            <Tabs defaultValue="terminal" className="h-full">
              <TabsList className="h-9 w-full justify-start rounded-none border-b bg-transparent">
                <TabsTrigger value="terminal" className="text-xs">
                  <Terminal className="h-3 w-3 mr-1" />
                  Terminal
                </TabsTrigger>
                <TabsTrigger value="output" className="text-xs">
                  Output
                </TabsTrigger>
                <TabsTrigger value="problems" className="text-xs">
                  Problems
                </TabsTrigger>
              </TabsList>
              <TabsContent value="terminal" className="h-[calc(100%-36px)] m-0">
                <ScrollArea className="h-full p-2">
                  <div className="font-mono text-xs space-y-1">
                    {terminalOutput.map((line, index) => (
                      <div key={index} className="text-muted-foreground">
                        {line}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="output" className="h-[calc(100%-36px)] m-0 p-2">
                <div className="text-xs text-muted-foreground">
                  No output yet. Run your code to see results.
                </div>
              </TabsContent>
              <TabsContent value="problems" className="h-[calc(100%-36px)] m-0 p-2">
                <div className="text-xs text-muted-foreground">
                  No problems detected.
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const iconClasses = "h-4 w-4"
  
  const iconMap: Record<string, JSX.Element> = {
    'ts': <FileCode className={`${iconClasses} text-blue-500`} />,
    'tsx': <FileCode className={`${iconClasses} text-blue-500`} />,
    'js': <FileCode className={`${iconClasses} text-yellow-500`} />,
    'jsx': <FileCode className={`${iconClasses} text-yellow-500`} />,
    'json': <FileJson className={`${iconClasses} text-green-500`} />,
    'md': <FileText className={`${iconClasses} text-gray-500`} />,
  }
  
  return iconMap[ext || ''] || <File className={iconClasses} />
}

// Import these from lucide-react at the top
import { FileCode, FileJson, FileText, File } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
