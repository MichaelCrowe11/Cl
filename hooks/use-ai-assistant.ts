/**
 * Hook for AI-powered IDE features
 * Integrates with the AI API for code assistance, analysis, and suggestions
 */

import { useState, useCallback } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  context?: {
    fileName?: string;
    fileContent?: string;
    selectedCode?: string;
    language?: string;
  };
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

What would you like to work on?`,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        model: 'gpt-4',
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

What would you like to work on?`,
      timestamp: new Date()
    }]);
    setError(null);
  }, []);

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
    optimizeCode
  };
}
