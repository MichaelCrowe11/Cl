'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileText, Clock, CheckCircle } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
  retrievalTime?: number;
}

interface RAGChatInterfaceProps {
  className?: string;
  maxHeight?: string;
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const RAGChatInterface: React.FC<RAGChatInterfaceProps> = ({
  className,
  maxHeight = '60vh'
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your CroweOS RAG assistant. I can help you find information from the documentation. What would you like to know?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateRAGResponse = async (query: string): Promise<Message> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const mockSources = [
      'CroweOS Getting Started Guide - Section 2.1',
      'API Documentation - Authentication',
      'Usage Tracking Guide - Chapter 3',
      'AI Features Documentation - Chat Integration',
      'CroweOS Plans and Pricing - Enterprise Features'
    ];

    const mockResponses = [
      'Based on the CroweOS documentation, here\'s what I found about your question. The system supports multiple authentication methods including API keys and OAuth 2.0.',
      'According to the usage tracking documentation, CroweOS monitors API calls, feature usage, and system performance in real-time with detailed analytics.',
      'The CroweOS platform offers three main plans: Starter (limited features), Professional (full access), and Enterprise (custom solutions with dedicated support).',
      'For AI chat features, CroweOS integrates with multiple LLM providers and supports custom model configurations through the admin panel.',
      'The API reference shows that CroweOS provides RESTful endpoints for user management, chat interactions, usage tracking, and system configuration.'
    ];

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
      timestamp: new Date(),
      sources: mockSources.slice(0, Math.floor(Math.random() * 3) + 1),
      retrievalTime: Math.floor(Math.random() * 500) + 100
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const assistantMessage = await simulateRAGResponse(input.trim());
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className={cn('flex flex-col bg-white border rounded-lg shadow-sm', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center">
          <Bot className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="font-semibold text-gray-900">RAG Assistant</h3>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
          Online
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ maxHeight }}
        role="log"
        aria-live="polite"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex items-start space-x-3',
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            )}
          >
            <div className={cn(
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            )}>
              {message.type === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            
            <div className={cn(
              'flex-1 max-w-[80%]',
              message.type === 'user' ? 'text-right' : ''
            )}>
              <div className={cn(
                'inline-block p-3 rounded-lg text-sm',
                message.type === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              )}>
                {message.content}
              </div>
              
              {/* Sources and metadata for assistant messages */}
              {message.type === 'assistant' && (message.sources || message.retrievalTime) && (
                <div className="mt-2 space-y-2">
                  {message.sources && (
                    <div className="flex flex-wrap gap-1">
                      {message.sources.map((source, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          {source}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {message.timestamp.toLocaleTimeString()}
                    {message.retrievalTime && (
                      <span className="ml-2">• Retrieved in {message.retrievalTime}ms</span>
                    )}
                  </div>
                </div>
              )}
              
              {message.type === 'user' && (
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="inline-block p-3 bg-gray-100 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Searching knowledge base...
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
        <div className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about CroweOS..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={isLoading}
            aria-label="Enter your question"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
