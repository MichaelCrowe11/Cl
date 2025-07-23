import { useState, useCallback } from 'react'
import { toast } from '@/hooks/use-toast'

interface FileOperation {
  type: 'create' | 'update' | 'append' | 'generate'
  filePath?: string
  content?: string
  fileType?: string
  metadata?: Record<string, any>
  prompt?: string
}

interface FileInfo {
  name: string
  path?: string
  size?: number
  modified?: string
  created?: string
  type?: string
}

interface UseIDEAssistantReturn {
  isLoading: boolean
  generateFile: (prompt: string, fileType: string, metadata?: Record<string, any>) => Promise<{ content: string; suggestedFilename: string } | null>
  saveFile: (operation: FileOperation) => Promise<boolean>
  readFile: (filePath: string) => Promise<{ content: string; metadata?: any } | null>
  listFiles: (fileType: string) => Promise<FileInfo[] | null>
  executeCommand: (command: string, context?: string) => Promise<string | null>
}

export const useIDEAssistant = (): UseIDEAssistantReturn => {
  const [isLoading, setIsLoading] = useState(false)

  const generateFile = useCallback(async (
    prompt: string, 
    fileType: string, 
    metadata?: Record<string, any>
  ) => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/files/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          fileType,
          context: metadata
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Generation failed')
      }

      const data = await response.json()
      return {
        content: data.content,
        suggestedFilename: data.suggestedFilename,
        metadata: data.metadata
      }
    } catch (error) {
      console.error('Generate file error:', error)
      console.warn("Generation failed:", error instanceof Error ? error.message : "Failed to generate file")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveFile = useCallback(async (operation: FileOperation) => {
    try {
      setIsLoading(true)

      const response = await fetch('/api/files/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: operation.filePath,
          content: operation.content,
          operation: operation.type === 'generate' ? 'create' : operation.type,
          fileType: operation.fileType,
          metadata: operation.metadata
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Save failed')
      }

      const result = await response.json()
      toast({
        title: "File saved successfully",
        description: `${operation.filePath} has been saved to your workspace.`,
      })
      
      return true
    } catch (error) {
      console.error('Save file error:', error)
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save file",
        variant: "destructive"
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const readFile = useCallback(async (filePath: string) => {
    try {
      setIsLoading(true)

      const response = await fetch(`/api/files/read?path=${encodeURIComponent(filePath)}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "File not found",
            description: `${filePath} does not exist.`,
            variant: "destructive"
          })
        } else {
          throw new Error('Failed to read file')
        }
        return null
      }

      const data = await response.json()
      return {
        content: data.content,
        metadata: {
          size: data.size,
          lastModified: data.modified,
          created: data.created,
          path: data.path,
          type: data.type
        }
      }
    } catch (error) {
      console.error('Read file error:', error)
      toast({
        title: "Read failed",
        description: error instanceof Error ? error.message : "Failed to read file",
        variant: "destructive"
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const listFiles = useCallback(async (fileType: string) => {
    try {
      setIsLoading(true)

      const response = await fetch(`/api/files/write?type=${encodeURIComponent(fileType)}`)
      
      if (!response.ok) {
        throw new Error('Failed to list files')
      }

      const data = await response.json()
      return data.files || []
    } catch (error) {
      console.error('List files error:', error)
      toast({
        title: "List files failed",
        description: error instanceof Error ? error.message : "Failed to list files",
        variant: "destructive"
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const executeCommand = useCallback(async (command: string, context?: string) => {
    try {
      setIsLoading(true)

      // Parse command to determine action
      const normalizedCommand = command.toLowerCase().trim()
      
      if (normalizedCommand.startsWith('generate ') || normalizedCommand.startsWith('create ')) {
        // Extract file type and description from command
        const parts = command.split(' ')
        const action = parts[0]
        const fileType = parts[1] || 'markdown'
        const description = parts.slice(2).join(' ')
        
        if (!description) {
          throw new Error('Please provide a description for the file to generate')
        }

        const result = await generateFile(description, fileType, { command, context })
        return result ? `Generated ${fileType} file with content:\n\n${result.content.slice(0, 200)}...` : null
      }
      
      if (normalizedCommand.startsWith('save ')) {
        // Handle save commands
        const filePath = command.split(' ')[1]
        if (!filePath) {
          throw new Error('Please specify a file path to save')
        }
        
        // This would need additional context about what to save
        throw new Error('Save command requires content. Use the file manager interface.')
      }
      
      if (normalizedCommand.startsWith('read ') || normalizedCommand.startsWith('open ')) {
        // Handle read commands
        const filePath = command.split(' ')[1]
        if (!filePath) {
          throw new Error('Please specify a file path to read')
        }
        
        const result = await readFile(filePath)
        return result ? `File content (${result.metadata?.size} bytes):\n\n${result.content.slice(0, 500)}...` : null
      }

      if (normalizedCommand.startsWith('list ')) {
        // Handle list commands
        const fileType = command.split(' ')[1] || 'sop'
        const files = await listFiles(fileType)
        return files ? `Found ${files.length} ${fileType} files:\n${files.map((f: FileInfo) => f.name).join('\n')}` : null
      }

      // If no specific command matched, treat as a general request
      const result = await generateFile(command, 'markdown', { context })
      return result ? `Generated response:\n\n${result.content}` : null

    } catch (error) {
      console.error('Execute command error:', error)
      toast({
        title: "Command failed",
        description: error instanceof Error ? error.message : "Failed to execute command",
        variant: "destructive"
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }, [generateFile, readFile, listFiles])

  return {
    isLoading,
    generateFile,
    saveFile,
    readFile,
    listFiles,
    executeCommand
  }
}
