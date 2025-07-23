import React, { useState, useEffect } from 'react'
import { toast as hotToast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  FileText,
  Download,
  Upload,
  Plus,
  Folder,
  Save,
  FileCode,
  FileSpreadsheet,
  BookOpen,
  Beaker,
  Sparkles,
  Eye,
  Trash2,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react'

interface FileItem {
  name: string
  path: string
  type: string
  size?: number
  lastModified?: string
  created?: string
}

interface FileMetadata {
  author?: string
  department?: string
  batchId?: string
  protocolVersion?: string
  tags?: string[]
}

// SSR-safe toast implementation using react-hot-toast
const toast = ({ title, description, variant }: { title: string; description: string; variant?: 'destructive' | 'default' }) => {
  const message = description;
  
  if (typeof window !== 'undefined') {
    // Client-side: use proper toast UI
    if (variant === 'destructive') {
      hotToast.error(`${title}: ${message}`);
    } else {
      hotToast.success(`${title}: ${message}`);
    }
  } else {
    // Server-side: use console logging
    if (variant === 'destructive') {
      console.error(`${title}: ${message}`);
    } else {
      console.log(`${title}: ${message}`);
    }
  }
};

export default function IDEFileManager() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedFileType, setSelectedFileType] = useState<string>('sop')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // File creation/generation state
  const [fileName, setFileName] = useState('')
  const [fileContent, setFileContent] = useState('')
  const [generatePrompt, setGeneratePrompt] = useState('')
  const [metadata, setMetadata] = useState<FileMetadata>({})

  const fileTypes = [
    { value: 'sop', label: 'Standard Operating Procedures', icon: BookOpen },
    { value: 'batch-log', label: 'Batch Logs', icon: FileSpreadsheet },
    { value: 'protocol', label: 'Research Protocols', icon: Beaker },
    { value: 'report', label: 'Reports & Analysis', icon: FileText },
    { value: 'code', label: 'Code & Scripts', icon: FileCode },
    { value: 'markdown', label: 'Documentation', icon: FileText },
  ]

  const currentFileType = fileTypes.find(ft => ft.value === selectedFileType)

  useEffect(() => {
    loadFiles()
  }, [selectedFileType])

  const loadFiles = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/files/write?type=${selectedFileType}`)
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || [])
      }
    } catch (error) {
      console.error('Failed to load files:', error)
      toast({
        title: "Error loading files",
        description: "Failed to load file list. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const generateFileContent = async () => {
    if (!generatePrompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please provide a description for the file to generate.",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/files/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: generatePrompt,
          fileType: selectedFileType,
          context: metadata
        })
      })

      if (response.ok) {
        const data = await response.json()
        setFileContent(data.content)
        setFileName(data.suggestedFilename)
        toast({
          title: "Content generated successfully",
          description: "AI has generated the file content. Review and save when ready.",
        })
      } else {
        throw new Error('Generation failed')
      }
    } catch (error) {
      console.error('Failed to generate content:', error)
      toast({
        title: "Generation failed",
        description: "Failed to generate file content. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const saveFile = async () => {
    if (!fileName.trim() || !fileContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both filename and content.",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/files/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: fileName,
          content: fileContent,
          operation: 'create',
          fileType: selectedFileType,
          metadata
        })
      })

      if (response.ok) {
        toast({
          title: "File saved successfully",
          description: `${fileName} has been saved to your workspace.`,
        })
        setIsCreateDialogOpen(false)
        setIsGenerateDialogOpen(false)
        setFileName('')
        setFileContent('')
        setGeneratePrompt('')
        setMetadata({})
        loadFiles()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Save failed')
      }
    } catch (error) {
      console.error('Failed to save file:', error)
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save file. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Folder className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">File Manager</h2>
          <Badge variant="outline">
            {currentFileType?.label}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={loadFiles}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Sparkles className="h-4 w-4 mr-1" />
                AI Generate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate File with Crowe Logic AI</DialogTitle>
                <DialogDescription>
                  Describe what you need and Crowe Logic will generate professional content for you.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">File Type</label>
                  <Select value={selectedFileType} onValueChange={setSelectedFileType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fileTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={generatePrompt}
                    onChange={(e) => setGeneratePrompt(e.target.value)}
                    placeholder="Describe what you want to generate... e.g., 'Create an SOP for sterilizing laboratory equipment' or 'Generate a batch log template for mushroom cultivation'"
                    rows={3}
                  />
                </div>

                {fileContent && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Generated Content</label>
                    <Textarea
                      value={fileContent}
                      onChange={(e) => setFileContent(e.target.value)}
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </div>
                )}

                {fileContent && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Filename</label>
                    <Input
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="Enter filename..."
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  {!fileContent ? (
                    <Button onClick={generateFileContent} disabled={loading}>
                      {loading ? 'Generating...' : 'Generate Content'}
                    </Button>
                  ) : (
                    <Button onClick={saveFile} disabled={loading}>
                      {loading ? 'Saving...' : 'Save File'}
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                New File
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New File</DialogTitle>
                <DialogDescription>
                  Create a new file manually in your workspace.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">File Type</label>
                  <Select value={selectedFileType} onValueChange={setSelectedFileType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fileTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Filename</label>
                  <Input
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Enter filename..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Textarea
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    placeholder="Enter file content..."
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button onClick={saveFile} disabled={loading}>
                    {loading ? 'Saving...' : 'Save File'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* File Type Selection */}
      <Tabs value={selectedFileType} onValueChange={setSelectedFileType} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {fileTypes.map(type => {
            const Icon = type.icon
            return (
              <TabsTrigger key={type.value} value={type.value} className="flex items-center space-x-1">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{type.label.split(' ')[0]}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {fileTypes.map(type => (
          <TabsContent key={type.value} value={type.value} className="mt-4">
            {/* Search */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${type.label.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* File List */}
            <div className="space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                  Loading files...
                </div>
              ) : filteredFiles.length === 0 ? (
                <Card className="py-8">
                  <CardContent className="text-center">
                    <type.icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {searchTerm ? 'No files match your search.' : `No ${type.label.toLowerCase()} found.`}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Create your first file using AI generation or manual creation.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredFiles.map((file, index) => (
                  <Card key={index} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <type.icon className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {file.lastModified && new Date(file.lastModified).toLocaleDateString()}
                              {file.size && ` • ${Math.round(file.size / 1024)}KB`}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
