'use client'

import React, { useState, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle,
  Image as ImageIcon,
  FileImage,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDropzone } from 'react-dropzone'

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>
  accept?: Record<string, string[]>
  maxSize?: number
  className?: string
}

export function FileUpload({ 
  onUpload, 
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
  },
  maxSize = 10 * 1024 * 1024, // 10MB default
  className 
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'pending' | 'uploading' | 'success' | 'error'>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle accepted files
    const newFiles = acceptedFiles.filter(file => {
      // Check if file already exists
      return !files.some(f => f.name === file.name && f.size === file.size)
    })
    
    setFiles(prev => [...prev, ...newFiles])
    
    // Initialize status for new files
    newFiles.forEach(file => {
      setUploadStatus(prev => ({ ...prev, [file.name]: 'pending' }))
    })
    
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      const errorMessages = errors.map((e: any) => {
        if (e.code === 'file-too-large') {
          return `File is too large (max ${(maxSize / 1024 / 1024).toFixed(0)}MB)`
        }
        if (e.code === 'file-invalid-type') {
          return 'Invalid file type'
        }
        return e.message
      }).join(', ')
      
      setErrors(prev => ({ ...prev, [file.name]: errorMessages }))
    })
    
    // Auto-upload new files
    newFiles.forEach(uploadFile)
  }, [files, maxSize])

  const uploadFile = async (file: File) => {
    setUploadStatus(prev => ({ ...prev, [file.name]: 'uploading' }))
    setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))
    
    try {
      // Simulate progress (in real app, use XMLHttpRequest or fetch with progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[file.name] || 0
          if (current >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return { ...prev, [file.name]: current + 10 }
        })
      }, 200)
      
      await onUpload(file)
      
      clearInterval(progressInterval)
      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
      setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }))
    } catch (error) {
      setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }))
      setErrors(prev => ({ 
        ...prev, 
        [file.name]: error instanceof Error ? error.message : 'Upload failed' 
      }))
    }
  }

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName))
    setUploadStatus(prev => {
      const newStatus = { ...prev }
      delete newStatus[fileName]
      return newStatus
    })
    setUploadProgress(prev => {
      const newProgress = { ...prev }
      delete newProgress[fileName]
      return newProgress
    })
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[fileName]
      return newErrors
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: true
  })

  return (
    <div className={cn("space-y-4", className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center gap-4">
          <div className={cn(
            "p-4 rounded-full",
            isDragActive ? "bg-primary/10" : "bg-muted"
          )}>
            <Upload className={cn(
              "h-8 w-8",
              isDragActive ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragActive ? "Drop files here" : "Drag & drop images here"}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to select files
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: PNG, JPG, JPEG, GIF, WebP (max {(maxSize / 1024 / 1024).toFixed(0)}MB)
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3">Uploaded Files</h3>
          <div className="space-y-2">
            {files.map(file => {
              const status = uploadStatus[file.name] || 'pending'
              const progress = uploadProgress[file.name] || 0
              const error = errors[file.name]
              
              return (
                <div key={file.name} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  {/* File Icon */}
                  <div className="flex-shrink-0">
                    {file.type.startsWith('image/') ? (
                      <FileImage className="h-8 w-8 text-blue-500" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-500" />
                    )}
                  </div>
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    
                    {/* Progress or Error */}
                    {status === 'uploading' && (
                      <Progress value={progress} className="h-1 mt-1" />
                    )}
                    {error && (
                      <p className="text-xs text-destructive mt-1">{error}</p>
                    )}
                  </div>
                  
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {status === 'pending' && (
                      <Badge variant="secondary" className="text-xs">
                        Pending
                      </Badge>
                    )}
                    {status === 'uploading' && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                    {status === 'success' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {status === 'error' && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  
                  {/* Remove Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(file.name)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
} 