"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { 
  FileText, 
  Plus, 
  Save, 
  FolderOpen, 
  Download,
  Trash2,
  Brain,
  Sparkles,
  FileEdit,
  Eye,
  Copy,
  RefreshCw
} from 'lucide-react'
import Image from 'next/image'

interface FileItem {
  name: string
  path: string
  type: string
  content?: string
  metadata?: any
}

interface FileManagerProps {
  ideType: 'pro' | 'farm' | 'lab'
  className?: string
}

export default function IDEFileManager({ ideType, className = '' }: FileManagerProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Form states
  const [fileName, setFileName] = useState('')
  const [fileType, setFileType] = useState<string>('sop')
  const [fileContent, setFileContent] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')

  // File type options based on IDE type
  const getFileTypes = () => {
    switch (ideType) {
      case 'farm':
        return [
          { value: 'sop', label: 'Standard Operating Procedure', description: 'Farm operation procedures' },
          { value: 'batch-log', label: 'Batch Log', description: 'Production batch tracking' },
          { value: 'protocol', label: 'Protocol', description: 'Mycological protocols' },
          { value: 'report', label: 'Report', description: 'Production reports' }
        ]
      case 'lab':
        return [
          { value: 'protocol', label: 'Lab Protocol', description: 'Laboratory procedures' },
          { value: 'batch-log', label: 'Lab Log', description: 'Experiment logs' },
          { value: 'report', label: 'Lab Report', description: 'Research findings' },
          { value: 'sop', label: 'Lab SOP', description: 'Safety procedures' }
        ]
      case 'pro':
      default:
        return [
          { value: 'code', label: 'Code File', description: 'Programming files' },
          { value: 'markdown', label: 'Documentation', description: 'Markdown docs' },
          { value: 'json', label: 'Configuration', description: 'JSON config files' },
          { value: 'sop', label: 'SOP', description: 'Standard procedures' }
        ]
    }
  }

  // Load files for current IDE
  const loadFiles = useCallback(async () => {
    setLoading(true)
    try {
      const fileTypes = getFileTypes()
      let allFiles: FileItem[] = []

      for (const type of fileTypes) {
        const response = await fetch(`/api/files/write?type=${type.value}`)
        if (response.ok) {
          const data = await response.json()
          allFiles = [...allFiles, ...data.files]
        }
      }

      setFiles(allFiles)
    } catch (error) {
      console.error('Failed to load files:', error)
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [ideType, toast])

  // Load file content
  const loadFileContent = async (file: FileItem) => {
    try {
      const response = await fetch(`/api/files/read?path=${encodeURIComponent(file.path)}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedFile({ ...file, content: data.content })
      }
    } catch (error) {
      console.error('Failed to load file content:', error)
      toast({
        title: "Error",
        description: "Failed to load file content",
        variant: "destructive"
      })
    }
  }

  // Save file
  const saveFile = async () => {
    if (!fileName || !fileContent) {
      toast({
        title: "Validation Error",
        description: "File name and content are required",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const extension = getExtensionForFileType(fileType)
      const fullFileName = fileName.endsWith(extension) ? fileName : `${fileName}${extension}`

      const response = await fetch('/api/files/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: fullFileName,
          content: fileContent,
          operation: 'create',
          fileType,
          metadata: {
            ideType,
            createdVia: 'IDE File Manager'
          }
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "File saved successfully"
        })
        setIsCreating(false)
        setFileName('')
        setFileContent('')
        await loadFiles()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save file",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to save file:', error)
      toast({
        title: "Error",
        description: "Failed to save file",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Generate file with AI
  const generateFileWithAI = async () => {
    if (!aiPrompt || !fileType) {
      toast({
        title: "Validation Error",
        description: "AI prompt and file type are required",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/files/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          fileType,
          context: `Generated for ${ideType} IDE`
        })
      })

      if (response.ok) {
        const data = await response.json()
        setFileContent(data.content)
        setFileName(data.suggestedName || `generated-${fileType}`)
        toast({
          title: "AI Generation Complete",
          description: "File content generated successfully"
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to generate file",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to generate file:', error)
      toast({
        title: "Error",
        description: "Failed to generate file",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Get file extension for file type
  const getExtensionForFileType = (type: string): string => {
    const extensions: Record<string, string> = {
      'sop': '.md',
      'batch-log': '.json',
      'protocol': '.md',
      'report': '.md',
      'code': '.ts',
      'markdown': '.md',
      'json': '.json',
      'csv': '.csv'
    }
    return extensions[type] || '.txt'
  }

  // Load files on mount
  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  return (
    <div className={`w-full h-full flex flex-col bg-white border rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Image 
              src="/crowelogic-avatar.png" 
              alt="Crowe Logic" 
              width={24} 
              height={24} 
              className="rounded-full"
            />
            <h3 className="font-semibold text-gray-900">Crowe Logic File Manager</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            {ideType.toUpperCase()} IDE
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={loadFiles}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            New File
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* File List Sidebar */}
        <div className="w-1/3 border-r bg-gray-50">
          <div className="p-3 border-b">
            <h4 className="text-sm font-medium text-gray-700">Project Files</h4>
          </div>
          <div className="p-2 space-y-1 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading...</div>
            ) : files.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No files yet. Create your first file!
              </div>
            ) : (
              files.map((file, index) => (
                <div
                  key={index}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    selectedFile?.path === file.path 
                      ? 'bg-blue-100 text-blue-900' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => loadFileContent(file)}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{file.name}</div>
                      <div className="text-xs text-gray-500">{file.type}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {isCreating ? (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Create New File</h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
              </div>

              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual Creation</TabsTrigger>
                  <TabsTrigger value="ai">
                    <Brain className="h-4 w-4 mr-1" />
                    AI Generation
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fileName">File Name</Label>
                      <Input
                        id="fileName"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="Enter file name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fileType">File Type</Label>
                      <Select value={fileType} onValueChange={setFileType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select file type" />
                        </SelectTrigger>
                        <SelectContent>
                          {getFileTypes().map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-gray-500">{type.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fileContent">Content</Label>
                    <Textarea
                      id="fileContent"
                      value={fileContent}
                      onChange={(e) => setFileContent(e.target.value)}
                      placeholder="Enter file content..."
                      className="min-h-[300px] font-mono"
                    />
                  </div>

                  <Button 
                    onClick={saveFile} 
                    disabled={loading}
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save File
                  </Button>
                </TabsContent>

                <TabsContent value="ai" className="space-y-4">
                  <div>
                    <Label htmlFor="aiPrompt">Describe what you want to generate</Label>
                    <Textarea
                      id="aiPrompt"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Example: Create an SOP for mushroom substrate sterilization including safety protocols and quality checkpoints..."
                      className="min-h-[120px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="aiFileType">File Type</Label>
                    <Select value={fileType} onValueChange={setFileType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select file type" />
                      </SelectTrigger>
                      <SelectContent>
                        {getFileTypes().map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={generateFileWithAI} 
                    disabled={isGenerating}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isGenerating ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Generate with Crowe Logic AI
                  </Button>

                  {fileContent && (
                    <div className="space-y-2">
                      <Label>Generated Content (Preview)</Label>
                      <Textarea
                        value={fileContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        className="min-h-[200px] font-mono"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={fileName}
                          onChange={(e) => setFileName(e.target.value)}
                          placeholder="File name"
                        />
                        <Button onClick={saveFile} disabled={loading}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Generated File
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          ) : selectedFile ? (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold">{selectedFile.name}</h4>
                  <p className="text-sm text-gray-500">Type: {selectedFile.type}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg">
                <Textarea
                  value={selectedFile.content || 'Loading...'}
                  readOnly
                  className="min-h-[400px] font-mono border-0 resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FolderOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">No file selected</p>
                <p className="text-sm">Select a file from the sidebar or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
