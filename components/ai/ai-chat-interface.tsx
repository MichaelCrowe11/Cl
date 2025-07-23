"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useAIAssistant } from '@/hooks/use-ai-assistant'
import { 
  Brain, 
  Send, 
  FileText, 
  Download,
  Copy,
  Sparkles,
  Code,
  Bug,
  Zap,
  FileEdit,
  MessageSquare,
  User,
  Bot
} from 'lucide-react'
import Image from 'next/image'

// Simple markdown-like formatter
const formatMessage = (content: string) => {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code className="bg-gray-100 px-1 rounded">$1</code>')
    .replace(/```([\s\S]*?)```/g, '<pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto"><code>$1</code></pre>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/^### (.*$)/gm, '<h3 className="font-semibold mt-3 mb-1">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 className="font-bold mt-4 mb-2">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 className="font-bold text-lg mt-4 mb-2">$1</h1>')
}

interface AIChatInterfaceProps {
  ideType: 'pro' | 'farm' | 'lab'
  currentFileName?: string
  currentFileContent?: string
  selectedCode?: string
  language?: string
  className?: string
}

export default function AIChatInterface({ 
  ideType, 
  currentFileName,
  currentFileContent,
  selectedCode,
  language,
  className = '' 
}: AIChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [isVisible, setIsVisible] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    analyzeCode,
    explainCode,
    generateCode,
    debugCode,
    optimizeCode,
    generateFile,
    executeFileOperations,
    createSOPFromCode,
    generateBatchLog
  } = useAIAssistant()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const context = {
      fileName: currentFileName,
      fileContent: currentFileContent,
      selectedCode,
      language,
      ideType
    }

    await sendMessage(input, context)
    setInput('')
  }

  // Quick action buttons
  const quickActions = [
    {
      label: 'Analyze Code',
      icon: <Code className="h-4 w-4" />,
      action: () => selectedCode && language && analyzeCode(selectedCode, language, currentFileName),
      disabled: !selectedCode,
      description: 'Analyze selected code'
    },
    {
      label: 'Explain Code',
      icon: <MessageSquare className="h-4 w-4" />,
      action: () => selectedCode && language && explainCode(selectedCode, language),
      disabled: !selectedCode,
      description: 'Explain how code works'
    },
    {
      label: 'Debug Code',
      icon: <Bug className="h-4 w-4" />,
      action: () => setInput('Help me debug this code and find potential issues'),
      disabled: !selectedCode,
      description: 'Find and fix bugs'
    },
    {
      label: 'Optimize',
      icon: <Zap className="h-4 w-4" />,
      action: () => selectedCode && language && optimizeCode(selectedCode, language),
      disabled: !selectedCode,
      description: 'Improve performance'
    }
  ]

  // File generation quick actions based on IDE type
  const getFileActions = () => {
    switch (ideType) {
      case 'farm':
        return [
          {
            label: 'Create SOP',
            action: () => setInput('Generate a comprehensive SOP for mushroom substrate sterilization including safety protocols'),
            description: 'Standard Operating Procedure'
          },
          {
            label: 'Batch Log',
            action: () => setInput('Create a batch log template for mushroom production tracking'),
            description: 'Production batch tracking'
          },
          {
            label: 'Protocol',
            action: () => setInput('Generate a mycological growth protocol with environmental parameters'),
            description: 'Growth protocol'
          }
        ]
      case 'lab':
        return [
          {
            label: 'Lab Protocol',
            action: () => setInput('Create a laboratory protocol for spore viability testing'),
            description: 'Laboratory procedure'
          },
          {
            label: 'Experiment Log',
            action: () => setInput('Generate an experiment log template for research tracking'),
            description: 'Research logging'
          },
          {
            label: 'Safety SOP',
            action: () => setInput('Create a safety SOP for handling biological materials in the lab'),
            description: 'Safety procedures'
          }
        ]
      case 'pro':
      default:
        return [
          {
            label: 'Documentation',
            action: () => setInput('Create comprehensive documentation for this codebase'),
            description: 'Code documentation'
          },
          {
            label: 'API Docs',
            action: () => setInput('Generate API documentation with examples'),
            description: 'API reference'
          },
          {
            label: 'README',
            action: () => setInput('Create a professional README.md file for this project'),
            description: 'Project README'
          }
        ]
    }
  }

  // Handle file operations from AI responses
  const handleFileOperations = async (operations: any[]) => {
    if (operations && operations.length > 0) {
      await executeFileOperations(operations)
    }
  }

  return (
    <Card className={`flex flex-col h-full bg-white border-gray-200 ${className}`}>
      {/* Header */}
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Image 
                src="/crowelogic-avatar.png" 
                alt="Crowe Logic AI" 
                width={32} 
                height={32} 
                className="rounded-full"
              />
              <div>
                <CardTitle className="text-lg text-gray-900">Crowe Logic AI</CardTitle>
                <p className="text-sm text-gray-600">
                  {ideType === 'farm' ? 'Farm Management Assistant' : 
                   ideType === 'lab' ? 'Laboratory Assistant' : 
                   'Development Assistant'}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
              <Brain className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearMessages}
            className="text-gray-600 hover:text-gray-900"
          >
            Clear Chat
          </Button>
        </div>
      </CardHeader>

      {/* Quick Actions */}
      <div className="p-3 border-b bg-gray-50">
        <div className="space-y-3">
          {/* Code Actions */}
          {selectedCode && (
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">Code Actions</h4>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={action.action}
                    disabled={action.disabled || isLoading}
                    className="text-xs h-8"
                    title={action.description}
                  >
                    {action.icon}
                    <span className="ml-1">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* File Generation Actions */}
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Generate Files</h4>
            <div className="flex flex-wrap gap-2">
              {getFileActions().map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  disabled={isLoading}
                  className="text-xs h-8 bg-purple-50 hover:bg-purple-100 border-purple-200"
                  title={action.description}
                >
                  <FileEdit className="h-3 w-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                
                <div className={`flex-1 space-y-2 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {message.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                      />
                    )}
                  </div>
                  
                  {/* File Operations */}
                  {message.fileOperations && message.fileOperations.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFileOperations(message.fileOperations!)}
                        className="text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Create {message.fileOperations.length} File(s)
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.role === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(message.content)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-pulse text-purple-600" />
                      <span className="text-sm text-gray-600">Crowe Logic AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Input */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask Crowe Logic AI anything about ${ideType === 'farm' ? 'farm management' : ideType === 'lab' ? 'laboratory work' : 'development'}...`}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Context indicator */}
        {(currentFileName || selectedCode) && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <FileText className="h-3 w-3" />
            <span>
              Context: {currentFileName && `File: ${currentFileName}`}
              {selectedCode && ` • ${selectedCode.split('\n').length} lines selected`}
              {language && ` • Language: ${language}`}
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}
