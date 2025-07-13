'use client'

import React, { useRef, useEffect } from 'react'
import Editor, { OnMount, OnChange } from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Save, 
  Copy, 
  Download, 
  Maximize2, 
  Minimize2,
  RotateCcw,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MonacoEditorProps {
  value: string
  onChange?: (value: string | undefined) => void
  language?: string
  path?: string
  onSave?: () => void
  readOnly?: boolean
  height?: string
  className?: string
}

export function MonacoEditor({
  value,
  onChange,
  language = 'typescript',
  path = 'file.ts',
  onSave,
  readOnly = false,
  height = '600px',
  className
}: MonacoEditorProps) {
  const { theme } = useTheme()
  const editorRef = useRef<any>(null)
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    // Configure TypeScript defaults
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    })

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
    })

    // Add keyboard shortcuts
    editor.addAction({
      id: 'save-file',
      label: 'Save File',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS
      ],
      precondition: undefined,
      keybindingContext: undefined,
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run: () => {
        if (onSave) onSave()
      }
    })
  }

  const handleEditorChange: OnChange = (value) => {
    if (onChange) onChange(value)
  }

  const copyToClipboard = () => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection()
      const text = selection ? editorRef.current.getModel().getValueInRange(selection) : value
      navigator.clipboard.writeText(text)
    }
  }

  const downloadFile = () => {
    const blob = new Blob([value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = path.split('/').pop() || 'file.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getLanguageFromPath = (filepath: string): string => {
    const ext = filepath.split('.').pop()?.toLowerCase()
    const languageMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'json': 'json',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'less': 'less',
      'md': 'markdown',
      'py': 'python',
      'sql': 'sql',
      'yaml': 'yaml',
      'yml': 'yaml',
      'xml': 'xml',
      'sh': 'shell',
      'bash': 'shell',
    }
    return languageMap[ext || ''] || 'plaintext'
  }

  const detectedLanguage = getLanguageFromPath(path)

  return (
    <Card className={cn(
      "relative overflow-hidden",
      isFullscreen && "fixed inset-4 z-50",
      className
    )}>
      <div className="flex items-center justify-between p-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {detectedLanguage}
          </Badge>
          <span className="text-sm text-muted-foreground truncate max-w-xs">
            {path}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onSave && !readOnly && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onSave}
              className="h-8"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={copyToClipboard}
            className="h-8"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={downloadFile}
            className="h-8"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <Editor
        height={isFullscreen ? 'calc(100vh - 120px)' : height}
        defaultLanguage={detectedLanguage}
        language={detectedLanguage}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        path={path}
        options={{
          readOnly,
          minimap: { enabled: true },
          fontSize: 14,
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontLigatures: true,
          automaticLayout: true,
          formatOnPaste: true,
          formatOnType: true,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
          snippetSuggestions: 'inline',
          showUnused: true,
          folding: true,
          foldingHighlight: true,
          renderWhitespace: 'selection',
          bracketPairColorization: {
            enabled: true,
          },
        }}
      />
    </Card>
  )
} 