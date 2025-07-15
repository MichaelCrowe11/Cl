"use client";

import React, { useState, useRef, useLayoutEffect } from 'react';
import { 
  Brain, 
  Send, 
  Loader2, 
  MessageSquare, 
  Code, 
  Bug, 
  Zap, 
  FileText,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import { useToast } from '@/hooks/use-toast';
import { CroweLogicAvatar } from '@/components/crowe-logic-avatar';

interface IDEChatInterfaceProps {
  currentFile?: {
    name: string;
    content: string;
    language: string;
  };
  selectedCode?: string;
  onCodeGenerated?: (code: string) => void;
}

export default function IDEChatInterface({ 
  currentFile, 
  selectedCode, 
  onCodeGenerated 
}: IDEChatInterfaceProps) {
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
    optimizeCode
  } = useAIAssistant();

  const [input, setInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput('');
    
    const context = currentFile ? {
      fileName: currentFile.name,
      fileContent: selectedCode || currentFile.content,
      selectedCode,
      language: currentFile.language
    } : undefined;

    await sendMessage(message, context);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickAction = async (action: string) => {
    if (!currentFile) {
      toast({
        title: "No File Selected",
        description: "Please open a file first to use AI assistance features.",
        variant: "destructive"
      });
      return;
    }

    const codeToAnalyze = selectedCode || currentFile.content;

    switch (action) {
      case 'analyze':
        await analyzeCode(codeToAnalyze, currentFile.language, currentFile.name);
        break;
      case 'explain':
        await explainCode(codeToAnalyze, currentFile.language);
        break;
      case 'debug':
        await debugCode(codeToAnalyze, 'Please help identify potential issues', currentFile.language);
        break;
      case 'optimize':
        await optimizeCode(codeToAnalyze, currentFile.language);
        break;
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard"
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const extractCodeBlocks = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks = [];
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      blocks.push({
        language: match[1] || 'text',
        code: match[2].trim()
      });
    }
    
    return blocks;
  };

  const formatMessage = (content: string) => {
    // Split content by code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.split('\n');
        const language = lines[0].replace('```', '') || 'text';
        const code = lines.slice(1, -1).join('\n');
        
        return (
          <div key={index} className="my-4">
            <div className="flex items-center justify-between bg-muted/50 px-3 py-1 rounded-t-md">
              <Badge variant="outline" className="text-xs">
                {language}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(code, index)}
                className="h-6 w-6 p-0"
              >
                {copiedIndex === index ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <pre className="bg-muted/30 p-3 rounded-b-md overflow-x-auto text-sm">
              <code>{code}</code>
            </pre>
          </div>
        );
      } else {
        // Format regular text with markdown-like formatting
        return (
          <div 
            key={index} 
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: part
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
                .replace(/\n/g, '<br />')
            }}
          />
        );
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/20">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">AI Assistant</h3>
          {currentFile && (
            <Badge variant="outline" className="text-xs">
              {currentFile.name}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {error && (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearMessages}
            className="h-6 w-6 p-0"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('analyze')}
            disabled={!currentFile || isLoading}
            className="text-xs"
          >
            <Code className="h-3 w-3 mr-1" />
            Analyze
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('explain')}
            disabled={!currentFile || isLoading}
            className="text-xs"
          >
            <FileText className="h-3 w-3 mr-1" />
            Explain
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('debug')}
            disabled={!currentFile || isLoading}
            className="text-xs"
          >
            <Bug className="h-3 w-3 mr-1" />
            Debug
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('optimize')}
            disabled={!currentFile || isLoading}
            className="text-xs"
          >
            <Zap className="h-3 w-3 mr-1" />
            Optimize
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <CroweLogicAvatar size={32} variant="circle" />
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="text-sm">
                  {message.role === 'user' ? (
                    <div>{message.content}</div>
                  ) : (
                    formatMessage(message.content)
                  )}
                </div>
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold">YOU</span>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <CroweLogicAvatar size={32} variant="circle" />
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={scrollRef} />
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedCode 
                ? "Ask about the selected code..."
                : currentFile
                ? `Ask about ${currentFile.name}...`
                : "Ask me anything about your code..."
            }
            className="min-h-[60px] resize-none text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="self-end"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        {selectedCode && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              {selectedCode.split('\n').length} lines selected
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
