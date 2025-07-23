/**
 * Hook for AI-powered IDE features
 * Integrates code assistance, analysis, and suggestions
 */

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FileOperation {
  type: 'create' | 'update' | 'generate';
  fileName: string;
  fileType: string;
  content: string;
  metadata?: Record<string, any>;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  context?: {
    fileName?: string;
    fileContent?: string;
    selectedCode?: string;
    language?: string;
    ideType?: 'pro' | 'farm' | 'lab';
  };
  fileOperations?: FileOperation[];
}

interface AIRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface UseAIAssistantReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, context?: ChatMessage['context']) => Promise<void>;
  clearMessages: () => void;
  analyzeCode: (code: string, language: string, fileName?: string) => Promise<string>;
  explainCode: (code: string, language: string) => Promise<string>;
  generateCode: (prompt: string, language: string) => Promise<string>;
  debugCode: (code: string, error: string, language: string) => Promise<string>;
  optimizeCode: (code: string, language: string) => Promise<string>;
  // File operation methods
  generateFile: (fileType: string, prompt: string, fileName?: string) => Promise<any>;
  executeFileOperations: (operations: FileOperation[]) => Promise<any[]>;
  createSOPFromCode: (code: string, language: string, purpose: string) => Promise<string>;
  generateBatchLog: (processName: string, parameters: Record<string, any>) => Promise<string>;
}

export function useAIAssistant(): UseAIAssistantReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `🧠 **Crowe Logic AI IDE Assistant Ready!**

I'm here to help you with:
- 🔍 **Code Analysis** - Understanding and reviewing your code
- 🐛 **Debugging** - Finding and fixing issues
- ⚡ **Optimization** - Improving performance and structure  
- 📝 **Code Generation** - Writing new functions and modules
- 🍄 **Mycology Focus** - Lab automation and data analysis
- 📄 **File Operations** - Generate SOPs, batch logs, protocols, and reports

What would you like to work on?`,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const callAI = useCallback(async (messages: ChatMessage[]): Promise<string> => {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        model: 'grok-beta',
        temperature: 0.1, // Lower temperature for more precise code assistance
        maxTokens: 3000
      } as AIRequest)
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    // Handle streaming response
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response stream available');
    }

    let result = '';
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      result += chunk;
    }

    return result.trim();
  }, []);

  const sendMessage = useCallback(async (content: string, context?: ChatMessage['context']) => {
    setIsLoading(true);
    setError(null);

    // Create user message with context
    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date(),
      context
    };

    // Add context information to the message if provided
    let enhancedContent = content;
    if (context) {
      if (context.fileName) {
        enhancedContent += `\n\n**File:** ${context.fileName}`;
      }
      if (context.language) {
        enhancedContent += `\n**Language:** ${context.language}`;
      }
      if (context.selectedCode) {
        enhancedContent += `\n\n**Selected Code:**\n\`\`\`${context.language || 'text'}\n${context.selectedCode}\n\`\`\``;
      }
      if (context.fileContent && !context.selectedCode) {
        enhancedContent += `\n\n**File Content:**\n\`\`\`${context.language || 'text'}\n${context.fileContent}\n\`\`\``;
      }
    }

    const messageForAI = { ...userMessage, content: enhancedContent };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await callAI([...messages, messageForAI]);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = `Sorry, I encountered an error: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(errorMessage);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, callAI]);

  const analyzeCode = useCallback(async (code: string, language: string, fileName?: string): Promise<string> => {
    const prompt = `Please analyze this ${language} code and provide insights on:
- Code structure and organization
- Potential issues or bugs
- Performance considerations
- Best practices recommendations
- Mycology/lab-specific improvements if applicable

${fileName ? `File: ${fileName}` : ''}

\`\`\`${language}
${code}
\`\`\``;

    await sendMessage(prompt, { fileContent: code, language, fileName });
    return 'Analysis sent to chat';
  }, [sendMessage]);

  const explainCode = useCallback(async (code: string, language: string): Promise<string> => {
    const prompt = `Please explain this ${language} code in detail:
- What does this code do?
- How does it work step by step?
- What are the key concepts involved?
- Any mycology/lab-specific functionality?

\`\`\`${language}
${code}
\`\`\``;

    await sendMessage(prompt, { selectedCode: code, language });
    return 'Explanation sent to chat';
  }, [sendMessage]);

  const generateCode = useCallback(async (prompt: string, language: string): Promise<string> => {
    const enhancedPrompt = `Generate ${language} code for: ${prompt}

Please provide:
- Clean, well-commented code
- Error handling where appropriate
- Mycology/lab best practices if relevant
- Brief explanation of the implementation

Focus on production-ready code that follows best practices.`;

    await sendMessage(enhancedPrompt, { language });
    return 'Code generation sent to chat';
  }, [sendMessage]);

  const debugCode = useCallback(async (code: string, error: string, language: string): Promise<string> => {
    const prompt = `Help me debug this ${language} code that's producing an error:

**Error:**
${error}

**Code:**
\`\`\`${language}
${code}
\`\`\`

Please:
- Identify the root cause of the error
- Provide a fixed version of the code
- Explain what went wrong
- Suggest ways to prevent similar issues`;

    await sendMessage(prompt, { fileContent: code, language });
    return 'Debug assistance sent to chat';
  }, [sendMessage]);

  const optimizeCode = useCallback(async (code: string, language: string): Promise<string> => {
    const prompt = `Please optimize this ${language} code for better performance and maintainability:

\`\`\`${language}
${code}
\`\`\`

Focus on:
- Performance improvements
- Code readability and maintainability
- Memory efficiency
- Mycology/lab-specific optimizations if applicable
- Modern language features and best practices`;

    await sendMessage(prompt, { fileContent: code, language });
    return 'Optimization suggestions sent to chat';
  }, [sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([{
      role: 'assistant',
      content: `🧠 **Crowe Logic AI IDE Assistant Ready!**

I'm here to help you with:
- 🔍 **Code Analysis** - Understanding and reviewing your code
- 🐛 **Debugging** - Finding and fixing issues
- ⚡ **Optimization** - Improving performance and structure  
- 📝 **Code Generation** - Writing new functions and modules
- 🍄 **Mycology Focus** - Lab automation and data analysis
- 📄 **File Operations** - Generate SOPs, batch logs, protocols, and reports

What would you like to work on?`,
      timestamp: new Date()
    }]);
    setError(null);
  }, []);

  // Generate file with AI
  const generateFile = useCallback(async (
    fileType: string,
    prompt: string,
    fileName?: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/files/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          fileType,
          context: 'Generated via AI Assistant',
          suggestedName: fileName
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data = await response.json();
      toast({
        title: "File Generated",
        description: `Successfully generated ${fileType} file`
      });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate file';
      setError(errorMessage);
      toast({
        title: "Generation Error",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Execute file operations from AI response
  const executeFileOperations = useCallback(async (operations: FileOperation[]) => {
    const results = [];

    for (const operation of operations) {
      try {
        const response = await fetch('/api/files/write', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filePath: operation.fileName,
            content: operation.content,
            operation: operation.type === 'create' ? 'create' : 'update',
            fileType: operation.fileType,
            metadata: {
              ...operation.metadata,
              generatedBy: 'AI Assistant'
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          results.push({ success: true, fileName: operation.fileName, data });
        } else {
          const error = await response.json();
          results.push({ success: false, fileName: operation.fileName, error: error.error });
        }
      } catch (error) {
        results.push({ 
          success: false, 
          fileName: operation.fileName, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    // Show results to user
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    if (successful.length > 0) {
      toast({
        title: "Files Created Successfully",
        description: `Created ${successful.length} file(s): ${successful.map(r => r.fileName).join(', ')}`
      });
    }

    if (failed.length > 0) {
      toast({
        title: "Some Files Failed",
        description: `Failed to create ${failed.length} file(s)`,
        variant: "destructive"
      });
    }

    return results;
  }, [toast]);

  // Create SOP from code
  const createSOPFromCode = useCallback(async (
    code: string, 
    language: string, 
    purpose: string
  ) => {
    const prompt = `Create a comprehensive Standard Operating Procedure (SOP) based on this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Purpose: ${purpose}

The SOP should include:
1. Overview and purpose
2. Prerequisites and setup
3. Step-by-step procedure
4. Safety considerations
5. Quality control checkpoints
6. Troubleshooting guide
7. Documentation requirements

Format as a professional markdown document.`;

    return generateFile('sop', prompt, `${purpose.toLowerCase().replace(/\s+/g, '-')}-sop.md`);
  }, [generateFile]);

  // Generate batch log
  const generateBatchLog = useCallback(async (
    processName: string,
    parameters: Record<string, any>
  ) => {
    const prompt = `Create a batch log template for the process: ${processName}

Parameters:
${Object.entries(parameters).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

The batch log should include:
1. Batch identification
2. Process parameters
3. Quality checkpoints
4. Environmental conditions
5. Equipment used
6. Personnel involved
7. Observations and notes
8. Final results and approval

Format as a structured JSON template that can be filled out during production.`;

    return generateFile('batch-log', prompt, `${processName.toLowerCase().replace(/\s+/g, '-')}-batch-log.json`);
  }, [generateFile]);

  return {
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
  };
}
