"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, 
  FileText, 
  Terminal as TerminalIcon, 
  Settings, 
  Code,
  MessageSquare,
  Save,
  Play,
  Wand2,
  RefreshCw,
  Bot,
  BarChart3,
  Workflow,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface ConsoleMessage {
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
  timestamp: Date;
}

export default function CroweLogicProIDE() {
  const [activeTab, setActiveTab] = useState('editor');
  const [selectedModel, setSelectedModel] = useState<'crowe-logic-assistant' | 'crowe-logic-coder'>('crowe-logic-coder');
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([
    {
      type: 'system',
      content: 'Crowe Logic Pro IDE v2.0 - AI-Powered Development Environment Ready!',
      timestamp: new Date()
    }
  ]);
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [currentCode, setCurrentCode] = useState(`# Welcome to Crowe Logic Pro IDE!
# Your AI-powered development environment is ready.

# To get started:
# 1. Describe what you want to build in the AI Code Generator above
# 2. Use the AI Terminal for command execution and assistance
# 3. Save and run your generated code

# Examples you can try:
# - "Create a machine learning model for yield prediction"
# - "Analyze environmental sensor data with visualizations"  
# - "Build automation workflow with Zapier integration"

print("🤖 Crowe Logic AI Ready - Let's build something amazing!")
`);
  const [aiModel, setAiModel] = useState<'crowe-logic-assistant' | 'crowe-logic-coder'>('crowe-logic-coder');
  const [isGenerating, setIsGenerating] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);

  // Auto-scroll console to bottom
  useEffect(() => {
// ... existing code ...
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleMessages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const generateCodeFromNaturalLanguage = async (description: string) => {
    if (!description.trim() || isGenerating) return;

    setIsGenerating(true);
    setCurrentCode(`// 🤖 Calling ${aiModel}...\n// Analyzing your request: "${description}"`);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: description }],
          model: aiModel,
        })
      });

      if (!response.ok || !response.body) {
        const errorText = await response.text();
        throw new Error(`AI API error: ${response.status} - ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      
      setCurrentCode(''); // Clear previous code

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        setCurrentCode(prev => prev + chunk);
      }

      const successMessage: ConsoleMessage = {
        type: 'system',
        content: `✅ ${aiModel} completed request: "${description}"`,
        timestamp: new Date()
      };
      setConsoleMessages(prev => [...prev, successMessage]);

    } catch (error) {
// ... existing code ...
      console.error('AI generation error:', error);
      
      const errorMessage: ConsoleMessage = {
        type: 'error',
        content: `❌ API Error: ${error instanceof Error ? error.message : 'Unknown error'}. Ensure API keys are set.`,
        timestamp: new Date()
      };
      setConsoleMessages(prev => [...prev, errorMessage]);
      
      setCurrentCode(`# Error: Could not connect to ${aiModel}.\nPlease check your API key configuration.`);
    }

    setIsGenerating(false);
    setNaturalLanguageInput('');
  };

  const executeConsoleCommand = (command: string) => {
// ... existing code ...
    const newMessage: ConsoleMessage = {
      type: 'input',
      content: `$ ${command}`,
      timestamp: new Date()
    };
    
    setConsoleMessages(prev => [...prev, newMessage]);

    // Simulate command execution
// ... existing code ...
    setTimeout(() => {
      let response = '';
      
      if (command.startsWith('help')) {
        response = `🤖 Crowe Logic AI Terminal:
- Model in use: ${aiModel}
- Use the dropdown to switch between 'Crowe Logic Coder' and 'Crowe Logic Assistant'.
- Type any natural language command to interact with the selected AI.`;
      } else {
        response = `Executing command with ${aiModel}: ${command}`;
        generateCodeFromNaturalLanguage(command);
      }

      const responseMessage: ConsoleMessage = {
        type: 'output',
        content: response,
        timestamp: new Date()
      };

      setConsoleMessages(prev => [...prev, responseMessage]);
    }, 200);

    setConsoleInput('');
  };

  return (
// ... existing code ...
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
// ... existing code ...
            <img src="/crowelogic-avatar.png" alt="Crowe Logic AI" className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Crowe Logic Pro IDE
            </h1>
            <Badge variant="outline" className="bg-purple-100 text-purple-700">
              <Brain className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Your intelligent development environment. Select your AI model and start creating.
          </p>
        </div>

        {/* Main IDE Interface */}
        <Card className="h-[700px] flex flex-col">
          {/* AI Code Generator Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value as any)}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm font-medium"
                >
                  <option value="crowe-logic-coder">Crowe Logic Coder</option>
                  <option value="crowe-logic-assistant">Crowe Logic Assistant</option>
                </select>
              </div>
              <div className="flex-1 relative">
                <Input
                  placeholder={`Chat with ${aiModel === 'crowe-logic-coder' ? 'the Coder' : 'the Assistant'}...`}
                  value={naturalLanguageInput}
// ... existing code ...
                  onChange={(e) => setNaturalLanguageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && naturalLanguageInput.trim()) {
                      generateCodeFromNaturalLanguage(naturalLanguageInput);
                    }
                  }}
                  className="pr-12"
                />
                <Button
                  size="sm"
                  onClick={() => naturalLanguageInput.trim() && generateCodeFromNaturalLanguage(naturalLanguageInput)}
                  disabled={isGenerating || !naturalLanguageInput.trim()}
                  className="absolute right-1 top-1 bg-purple-600 text-white hover:bg-purple-700"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Button variant="outline" size="sm" onClick={() => generateCodeFromNaturalLanguage("Create a Python script to analyze a CSV file and generate a summary report.")}>
                <Bot className="h-3 w-3 mr-1" />
                Analyze CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => generateCodeFromNaturalLanguage("Write a React component for a real-time chat interface.")}>
                <BarChart3 className="h-3 w-3 mr-1" />
                React Chat UI
              </Button>
              <Button variant="outline" size="sm" onClick={() => generateCodeFromNaturalLanguage("Generate a Dockerfile for a Node.js application.")}>
                <Workflow className="h-3 w-3 mr-1" />
                Node.js Dockerfile
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
// ... existing code ...
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'editor'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              <Code className="h-4 w-4 inline mr-2" />
              Editor
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'terminal'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              <TerminalIcon className="h-4 w-4 inline mr-2" />
              AI Terminal
            </button>
          </div>

          {/* Content Area */}
// ... existing code ...
          <div className="flex-1 overflow-hidden">
            {activeTab === 'editor' && (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <Code className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">
                      {isGenerating ? `Generating with ${aiModel}...` : `${aiModel} Output`}
                    </span>
                    {isGenerating && (
                      <Badge variant="outline" className="text-xs">
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Generating...
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
// ... existing code ...
                    <Button variant="ghost" size="sm">
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1 p-4 bg-white dark:bg-gray-900">
                  <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {currentCode}
                  </pre>
                </ScrollArea>
              </div>
            )}

            {activeTab === 'terminal' && (
// ... existing code ...
              <div className="h-full flex flex-col bg-gray-900 text-green-400 font-mono">
                <div className="p-3 border-b border-gray-700 bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <TerminalIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Crowe Logic AI Terminal</span>
                    <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                      {aiModel}
                    </Badge>
                  </div>
                </div>
                
                <ScrollArea ref={consoleRef} className="flex-1 p-4">
// ... existing code ...
                  <div className="space-y-2">
                    {consoleMessages.map((message, index) => (
                      <div key={index} className="text-sm">
                        <span className="text-gray-500">[{formatTime(message.timestamp)}]</span>{' '}
                        <span className={
                          message.type === 'input' ? 'text-white' :
                          message.type === 'error' ? 'text-red-400' :
                          message.type === 'system' ? 'text-blue-400' :
                          'text-green-400'
                        }>
                          {message.content}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t border-gray-700">
// ... existing code ...
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">$</span>
                    <Input
                      value={consoleInput}
                      onChange={(e) => setConsoleInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && consoleInput.trim()) {
                          executeConsoleCommand(consoleInput);
                        }
                      }}
                      placeholder={`Ask ${aiModel}...`}
                      className="bg-transparent border-none text-green-400 placeholder-gray-500 focus:ring-0"
                    />
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2">
// ... existing code ...
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConsoleInput("Refactor this Python code for clarity")}
                      className="text-xs text-left justify-start text-green-400 border-green-400 hover:bg-green-400/10"
                    >
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Refactor Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConsoleInput("Explain this database schema")}
                      className="text-xs text-left justify-start text-green-400 border-green-400 hover:bg-green-400/10"
                    >
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Explain Schema
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConsoleInput("Find bugs in this code snippet")}
                      className="text-xs text-left justify-start text-green-400 border-green-400 hover:bg-green-400/10"
                    >
                      <Code className="h-3 w-3 mr-1" />
                      Find Bugs
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConsoleInput("help")}
                      className="text-xs text-left justify-start text-green-400 border-green-400 hover:bg-green-400/10"
                    >
                      <Brain className="h-3 w-3 mr-1" />
                      Help
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
