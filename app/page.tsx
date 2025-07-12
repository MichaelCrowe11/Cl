"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { 
  Send, 
  Plus, 
  MoreHorizontal, 
  Bot,
  User,
  FileText,
  FlaskConical,
  Folder,
  FolderOpen,
  File,
  Search,
  Terminal,
  Download,
  QrCode,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Minimize2
} from "lucide-react"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface FileItem {
  name: string
  type: 'file' | 'folder'
  path?: string
  children?: FileItem[]
  isExpanded?: boolean
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Crowe Logic AI, your mycology lab assistant. I can help you with substrate optimization, environmental monitoring, contamination prevention, and protocol development. What can I help you with today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState<string>('')
  const [terminalInput, setTerminalInput] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeRightPanel, setActiveRightPanel] = useState<'sop' | 'batch' | 'qr' | 'export'>('sop')
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'Crowe Logic AI Terminal v1.0.0',
    'Type "help" for available commands',
    ''
  ])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const [openTabs, setOpenTabs] = useState<Array<{path: string, content: string, isDirty: boolean}>>([])
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [isLoadingFiles, setIsLoadingFiles] = useState(false)
  const [sopTemplates, setSopTemplates] = useState<Array<{id: string; name: string; description: string}>>([])
  const [generatedSop, setGeneratedSop] = useState<string | null>(null)
  const [isGeneratingSop, setIsGeneratingSop] = useState(false)
  const [showNewFileDialog, setShowNewFileDialog] = useState(false)
  const [newFileName, setNewFileName] = useState<string>('')
  const { toast } = useToast()

  // File system functions
  const loadFileStructure = async (dir = '') => {
    setIsLoadingFiles(true)
    try {
      const response = await fetch(`/api/files?dir=${encodeURIComponent(dir)}`)
      const data = await response.json()
      
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        })
        return
      }
      
      setFileStructure(data.files.map((file: { name: string; type: 'file' | 'folder'; path: string }) => ({
        name: file.name,
        type: file.type,
        path: file.path,
        children: file.type === 'folder' ? [] : undefined,
        isExpanded: false
      })))
    } catch (error) {
      console.error('Failed to load files:', error)
      toast({
        title: "Error",
        description: "Failed to load file structure",
        variant: "destructive"
      })
    } finally {
      setIsLoadingFiles(false)
    }
  }

  const createNewFile = async () => {
    if (!newFileName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a filename",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch('/api/files/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: newFileName,
          content: ''
        })
      })

      const data = await response.json()

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        })
        return
      }

      // Add to file structure
      const newFile: FileItem = {
        name: newFileName,
        type: 'file',
        path: newFileName
      }
      
      setFileStructure(prev => [...prev, newFile])
      
      // Open in tab
      openFileInTab(newFileName)
      
      // Reset dialog
      setNewFileName('')
      setShowNewFileDialog(false)
      
      toast({
        title: "Success",
        description: `File "${newFileName}" created successfully`,
      })
    } catch (error) {
      console.error('Failed to create file:', error)
      toast({
        title: "Error",
        description: "Failed to create file",
        variant: "destructive"
      })
    }
  }

  // Tab management functions
  const openFileInTab = async (filePath: string) => {
    // Check if file is already open
    const existingTabIndex = openTabs.findIndex(tab => tab.path === filePath);
    if (existingTabIndex !== -1) {
      setActiveTabIndex(existingTabIndex);
      setSelectedFile(filePath);
      setFileContent(openTabs[existingTabIndex].content);
      return;
    }

    try {
      // Load file content
      const response = await fetch(`/api/files/read?path=${encodeURIComponent(filePath)}`);
      if (response.ok) {
        const data = await response.json();
        const newTab = {
          path: filePath,
          content: data.content || '',
          isDirty: false
        };
        
        const newTabs = [...openTabs, newTab];
        setOpenTabs(newTabs);
        setActiveTabIndex(newTabs.length - 1);
        setSelectedFile(filePath);
        setFileContent(data.content || '');
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to open file.",
        variant: "destructive",
      });
    }
  };

  const closeTab = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const newTabs = openTabs.filter((_, i) => i !== index);
    setOpenTabs(newTabs);
    
    if (newTabs.length === 0) {
      setSelectedFile(null);
      setFileContent('');
      setActiveTabIndex(0);
    } else {
      const newActiveIndex = Math.min(activeTabIndex, newTabs.length - 1);
      setActiveTabIndex(newActiveIndex);
      setSelectedFile(newTabs[newActiveIndex].path);
      setFileContent(newTabs[newActiveIndex].content);
    }
  };

  const updateTabContent = (content: string) => {
    if (openTabs.length === 0) return;
    
    const updatedTabs = [...openTabs];
    updatedTabs[activeTabIndex] = {
      ...updatedTabs[activeTabIndex],
      content,
      isDirty: content !== updatedTabs[activeTabIndex].content
    };
    setOpenTabs(updatedTabs);
    setFileContent(content);
  };

  const loadFolderContents = async (folderPath: string) => {
    try {
      const response = await fetch(`/api/files?dir=${encodeURIComponent(folderPath)}`)
      const data = await response.json()
      
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        })
        return []
      }
      
      return data.files.map((file: { name: string; type: 'file' | 'folder'; path: string }) => ({
        name: file.name,
        type: file.type,
        path: file.path,
        children: file.type === 'folder' ? [] : undefined,
        isExpanded: false
      }))
    } catch (error) {
      console.error('Failed to load folder contents:', error)
      return []
    }
  }

  const saveFileContent = async () => {
    if (!selectedFile) return
    
    try {
      const response = await fetch('/api/files', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: selectedFile,
          content: fileContent
        })
      })
      
      const data = await response.json()
      
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        })
        return
      }
      
      toast({
        title: "Success",
        description: "File saved successfully"
      })
    } catch (error) {
      console.error('Failed to save file:', error)
      toast({
        title: "Error",
        description: "Failed to save file",
        variant: "destructive"
      })
    }
  }

  // SOP functions
  const loadSopTemplates = async () => {
    try {
      const response = await fetch('/api/sop')
      const data = await response.json()
      
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        })
        return
      }
      
      setSopTemplates(data.templates || [])
    } catch (error) {
      console.error('Failed to load SOP templates:', error)
      toast({
        title: "Error",
        description: "Failed to load SOP templates",
        variant: "destructive"
      })
    }
  }

  const generateSop = async (templateId: string) => {
    setIsGeneratingSop(true)
    try {
      const response = await fetch('/api/sop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId })
      })
      
      const data = await response.json()
      
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        })
        return
      }
      
      setGeneratedSop(data.content)
      toast({
        title: "Success",
        description: `SOP "${data.title}" generated successfully`
      })
    } catch (error) {
      console.error('Failed to generate SOP:', error)
      toast({
        title: "Error",
        description: "Failed to generate SOP",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingSop(false)
    }
  }

  // Load initial data
  useEffect(() => {
    const initializeData = async () => {
      await loadFileStructure()
      await loadSopTemplates()
    }
    initializeData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Dependencies handled within the effect

  // File structure state (will be populated by API)
  const [fileStructure, setFileStructure] = useState<FileItem[]>([])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(m => ({
            role: m.role,
            content: m.content
          })),
          model: 'gpt-4',
          temperature: 0.3,
          maxTokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Sorry, I could not generate a response.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const executeTerminalCommand = async () => {
    if (!terminalInput.trim()) return
    
    const command = terminalInput.trim()
    setTerminalOutput(prev => [...prev, `$ ${command}`])
    setTerminalInput('')
    
    try {
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      })
      
      const data = await response.json()
      
      if (data.error) {
        setTerminalOutput(prev => [...prev, `Error: ${data.error}`, ''])
        return
      }
      
      if (command.trim().toLowerCase() === 'clear') {
        setTerminalOutput([''])
      } else {
        setTerminalOutput(prev => [...prev, ...data.output])
      }
    } catch (error) {
      console.error('Terminal command error:', error)
      setTerminalOutput(prev => [...prev, 'Terminal error: Command execution failed', ''])
    }
  }

  const toggleFolder = async (folderName: string, folderPath?: string) => {
    // Find the folder to toggle
    const folderIndex = fileStructure.findIndex(item => item.name === folderName && item.type === 'folder')
    if (folderIndex === -1) return
    
    const folder = fileStructure[folderIndex]
    const wasExpanded = folder.isExpanded
    const newExpanded = !wasExpanded
    
    let updatedFolder = { ...folder, isExpanded: newExpanded }
    
    // If expanding and no children loaded yet, load them
    if (newExpanded && (!folder.children || folder.children.length === 0) && folderPath) {
      const children = await loadFolderContents(folderPath)
      updatedFolder = { ...updatedFolder, children }
    }
    
    // Update the file structure
    const newFileStructure = [...fileStructure]
    newFileStructure[folderIndex] = updatedFolder
    setFileStructure(newFileStructure)
  }

  const FileExplorer = () => (
    <div className="w-80 border-r bg-muted/20 flex flex-col">
      <div className="h-12 border-b px-4 flex items-center justify-between">
        <h2 className="font-semibold text-sm">Lab Explorer</h2>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => setShowNewFileDialog(true)}
            title="Create new file"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => loadFileStructure()}
            disabled={isLoadingFiles}
            title="Refresh files"
          >
            <Search className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 p-2">
        {isLoadingFiles ? (
          <div className="text-center text-sm text-muted-foreground py-4">
            Loading files...
          </div>
        ) : (
          fileStructure.map((item, index) => (
            <div key={index} className="mb-1">
              <div 
                className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-accent cursor-pointer text-sm ${
                  selectedFile === item.path ? 'bg-accent' : ''
                }`}
                onClick={() => item.type === 'folder' ? toggleFolder(item.name, item.path) : (item.path && openFileInTab(item.path))}
              >
                {item.type === 'folder' ? (
                  <>
                    {item.isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    {item.isExpanded ? <FolderOpen className="h-3 w-3" /> : <Folder className="h-3 w-3" />}
                  </>
                ) : (
                  <>
                    <span className="w-3" />
                    <File className="h-3 w-3" />
                  </>
                )}
                <span className="truncate">{item.name}</span>
              </div>
              {item.type === 'folder' && item.isExpanded && item.children && (
                <div className="ml-4">
                  {item.children.map((child, childIndex) => (
                    <div 
                      key={childIndex} 
                      className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-accent cursor-pointer text-sm ${
                        selectedFile === `${item.path}/${child.name}` ? 'bg-accent' : ''
                      }`}
                      onClick={() => openFileInTab(`${item.path}/${child.name}`)}
                    >
                      <span className="w-3" />
                      <File className="h-3 w-3" />
                      <span className="truncate">{child.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  )

  const ChatPanel = () => (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="h-12 border-b px-4 flex items-center justify-between bg-background">
        <div className="flex items-center gap-2">
          {selectedFile ? (
            <>
              <File className="h-4 w-4" />
              <span className="font-semibold text-sm">{selectedFile.split('/').pop()}</span>
              <Badge variant="outline" className="text-xs">Editing</Badge>
            </>
          ) : (
            <>
              <Avatar className="h-6 w-6">
                <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
                <AvatarFallback><Bot className="h-3 w-3" /></AvatarFallback>
              </Avatar>
              <span className="font-semibold text-sm">Crowe Logic AI</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          {selectedFile && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={saveFileContent}
              className="text-xs"
            >
              Save File
            </Button>
          )}
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {openTabs.length > 0 ? (
        /* File Editor with Tabs */
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="bg-muted/20 border-b flex overflow-x-auto">
            {openTabs.map((tab, index) => (
              <div
                key={tab.path}
                className={`flex items-center px-3 py-2 text-xs border-r cursor-pointer min-w-0 max-w-48 ${
                  index === activeTabIndex 
                    ? 'bg-background border-b-2 border-b-primary' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  setActiveTabIndex(index);
                  setSelectedFile(tab.path);
                  setFileContent(tab.content);
                }}
              >
                <span className="truncate flex-1">
                  {tab.isDirty && '● '}
                  {tab.path.split('/').pop()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2 hover:bg-destructive/20"
                  onClick={(e) => closeTab(index, e)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>

          {/* Editor Content */}
          <textarea
            className="flex-1 w-full p-4 font-mono text-sm resize-none border-none outline-none bg-background"
            value={fileContent}
            onChange={(e) => updateTabContent(e.target.value)}
            placeholder="File content will appear here..."
          />

          {/* Editor Footer */}
          <div className="border-t p-2 bg-muted/20">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>
                Lines: {fileContent.split('\n').length} | 
                {openTabs[activeTabIndex]?.isDirty ? ' Unsaved changes' : ' Saved'}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={saveFileContent}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => closeTab(activeTabIndex)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Chat Interface */
        <div className="flex-1 flex flex-col">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4" role="log" aria-live="polite">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Avatar className="h-6 w-6 flex-shrink-0">
                {message.role === 'user' ? (
                  <>
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
                    <AvatarFallback><Bot className="h-3 w-3" /></AvatarFallback>
                  </>
                )}
              </Avatar>
              <div
                className={`rounded px-3 py-2 max-w-[80%] text-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
                <div className="text-xs opacity-50 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
                <AvatarFallback><Bot className="h-3 w-3" /></AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded px-3 py-2">
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="border-t p-3">
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
          <Input
            value={input}
            onChange={(e) => {
              console.log('Input change:', e.target.value);
              setInput(e.target.value);
            }}
            placeholder="Ask about cultivation, contamination, protocols..."
            className="text-sm"
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-3 w-3" />
          </Button>
        </form>
      </div>

      {/* Terminal Section */}
      <div className="border-t bg-black text-green-400 font-mono">
        <div className="h-8 border-b border-gray-700 px-3 flex items-center justify-between bg-gray-800">
          <div className="flex items-center gap-2 text-xs">
            <Terminal className="h-3 w-3" />
            <span>Crowe Logic Terminal</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 hover:text-white">
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 hover:text-white">
              <Maximize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-32 p-3">
          <div className="space-y-1 text-xs">
            {terminalOutput.map((line, index) => (
              <div key={index} className="font-mono">
                {line}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t border-gray-700 p-2">
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); executeTerminalCommand(); }}>
            <span className="text-green-400 text-xs">$</span>
            <Input
              value={terminalInput}
              onChange={(e) => {
                console.log('Terminal input change:', e.target.value);
                setTerminalInput(e.target.value);
              }}
              placeholder="Enter command..."
              className="bg-transparent border-none text-green-400 text-xs p-0 h-auto focus-visible:ring-0"
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </div>
      </div>
        </div>
      )}
    </div>
  )

  const RightPanel = () => (
    <div className="w-96 border-l bg-muted/20 flex flex-col">
      {/* Panel Tabs */}
      <div className="h-12 border-b flex">
        {[
          { key: 'sop', label: 'SOPs', icon: FileText },
          { key: 'batch', label: 'Batches', icon: FlaskConical },
          { key: 'qr', label: 'QR Codes', icon: QrCode },
          { key: 'export', label: 'Exports', icon: Download }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={activeRightPanel === key ? 'secondary' : 'ghost'}
            size="sm"
            className="flex-1 h-full rounded-none text-xs"
            onClick={() => setActiveRightPanel(key as 'sop' | 'batch' | 'qr' | 'export')}
          >
            <Icon className="h-3 w-3 mr-1" />
            {label}
          </Button>
        ))}
      </div>

      {/* Panel Content */}
      <ScrollArea className="flex-1 p-4">
        {activeRightPanel === 'sop' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">SOP Generation</h3>
            {generatedSop ? (
              <div className="space-y-3">
                <div className="bg-muted/20 rounded p-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">Generated SOP</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setGeneratedSop(null)}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                  <textarea
                    className="w-full h-40 text-xs font-mono bg-background border rounded p-2 resize-none"
                    value={generatedSop}
                    readOnly
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="w-full text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedSop)
                    toast({ title: "Copied", description: "SOP copied to clipboard" })
                  }}
                >
                  <Download className="h-3 w-3 mr-2" />
                  Copy to Clipboard
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {sopTemplates.map((template) => (
                  <Button 
                    key={template.id}
                    variant="outline" 
                    className="w-full justify-start text-xs"
                    onClick={() => generateSop(template.id)}
                    disabled={isGeneratingSop}
                  >
                    <FileText className="h-3 w-3 mr-2" />
                    {template.name}
                  </Button>
                ))}
                {sopTemplates.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-4">
                    Loading templates...
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeRightPanel === 'batch' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Batch Management</h3>
            <div className="space-y-3">
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-xs">Lions Mane #001</span>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Started: Jan 8, 2025</div>
                  <div>Substrate: HWFP/Soy</div>
                  <div>Day 12 of 16</div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-xs">Oyster #012</span>
                  <Badge variant="outline" className="text-xs">Harvested</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Completed: Jan 5, 2025</div>
                  <div>Yield: 2.3kg</div>
                  <div>Success Rate: 96%</div>
                </div>
              </Card>
            </div>
            <Button className="w-full text-xs">
              <Plus className="h-3 w-3 mr-2" />
              Start New Batch
            </Button>
          </div>
        )}

        {activeRightPanel === 'qr' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">QR Code Generation</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-xs">
                <QrCode className="h-3 w-3 mr-2" />
                Batch Tracking QR
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs">
                <QrCode className="h-3 w-3 mr-2" />
                Equipment QR
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs">
                <QrCode className="h-3 w-3 mr-2" />
                SOP Access QR
              </Button>
            </div>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-32 flex items-center justify-center">
              <div className="text-center text-xs text-muted-foreground">
                <QrCode className="h-8 w-8 mx-auto mb-2" />
                Generate QR Code
              </div>
            </div>
          </div>
        )}

        {activeRightPanel === 'export' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Data Exports</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-xs">
                <Download className="h-3 w-3 mr-2" />
                Batch Reports (CSV)
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs">
                <Download className="h-3 w-3 mr-2" />
                Yield Analysis (Excel)
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs">
                <Download className="h-3 w-3 mr-2" />
                Lab Logs (PDF)
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs">
                <Download className="h-3 w-3 mr-2" />
                Full Database Backup
              </Button>
            </div>
            <div className="border rounded-lg p-3 bg-muted/50">
              <div className="text-xs text-muted-foreground mb-2">Last Export</div>
              <div className="text-xs">batch-logs-2025-01-12.csv</div>
              <div className="text-xs text-muted-foreground">2 hours ago</div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Menu Bar */}
      <div className="h-8 bg-muted/50 border-b flex items-center px-4 text-xs">
        <span className="font-semibold">Crowe Logic AI</span>
        <div className="ml-auto flex items-center gap-4">
          <span>Lab Assistant v1.0.0</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        <FileExplorer />
        <ChatPanel />
        <RightPanel />
      </div>

      {/* New File Dialog */}
      <Dialog open={showNewFileDialog} onOpenChange={setShowNewFileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
            <DialogDescription>
              Enter a filename to create a new file in your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="filename.txt"
              value={newFileName}
              onChange={(e) => {
                console.log('New file input change:', e.target.value);
                setNewFileName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  createNewFile()
                }
              }}
              autoFocus
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFileDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createNewFile} disabled={!newFileName.trim()}>
              Create File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
