"use client";

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Zap, 
  Code, 
  CheckCircle, 
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Copy,
  Wand2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CodeSuggestion {
  id: string;
  type: 'completion' | 'optimization' | 'fix' | 'enhancement';
  title: string;
  description: string;
  code: string;
  confidence: number;
  language: string;
}

interface CroweLogicCodeCompletionProps {
  activeFile?: {
    name: string;
    content: string;
    language: string;
  };
  selectedCode?: string;
  onCodeInsert?: (code: string) => void;
}

export default function CroweLogicCodeCompletion({
  activeFile,
  selectedCode,
  onCodeInsert
}: CroweLogicCodeCompletionProps) {
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock suggestions based on file content
  useEffect(() => {
    if (activeFile && activeFile.content) {
      generateSuggestions();
    }
  }, [activeFile?.content, selectedCode]);

  // Generate suggestions using xAI Grok-4 API
  const generateSuggestions = async () => {
    if (!activeFile) return;
    
    setIsGenerating(true);
    setSuggestions([]);
    
    try {
      const response = await fetch('/api/ai/code-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: activeFile.content,
          language: activeFile.language,
          fileName: activeFile.name,
          selectedCode: selectedCode,
          completionType: 'completion' // Default type, could be made dynamic
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } else {
        console.error('Failed to get code suggestions:', response.statusText);
        // Fall back to mock suggestions
        generateMockSuggestions();
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      // Fall back to mock suggestions
      generateMockSuggestions();
    } finally {
      setIsGenerating(false);
    }
  };

  // Mock suggestions for fallback
  const generateMockSuggestions = () => {
    setTimeout(() => {
      const mockSuggestions: CodeSuggestion[] = [];

      if (activeFile?.language === 'python') {
        if (activeFile.content.includes('class CultivationBatch')) {
          mockSuggestions.push({
            id: '1',
            type: 'enhancement',
            title: 'Add Data Validation',
            description: 'Add input validation for temperature and humidity values',
            code: `def validate_environment_data(self, temperature: float, humidity: float) -> bool:
    """Validate temperature and humidity readings"""
    if not (15.0 <= temperature <= 30.0):
        raise ValueError(f"Temperature {temperature}°C out of range (15-30°C)")
    if not (40.0 <= humidity <= 100.0):
        raise ValueError(f"Humidity {humidity}% out of range (40-100%)")
    return True`,
            confidence: 95,
            language: 'python'
          });

          mockSuggestions.push({
            id: '2',
            type: 'completion',
            title: 'Export to CSV Method',
            description: 'Add method to export cultivation data to CSV format',
            code: `def export_to_csv(self, filename: str) -> None:
    """Export cultivation log to CSV file"""
    import csv
    with open(filename, 'w', newline='') as csvfile:
        fieldnames = ['timestamp', 'observation', 'temperature', 'humidity']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for entry in self.log_entries:
            writer.writerow(entry)`,
            confidence: 88,
            language: 'python'
          });

          mockSuggestions.push({
            id: '3',
            type: 'optimization',
            title: 'Add Type Hints',
            description: 'Improve code with comprehensive type annotations',
            code: `from typing import Dict, List, Optional, Union
from datetime import datetime

class CultivationBatch:
    def __init__(self, batch_id: str, species: str, substrate: str) -> None:
        self.batch_id: str = batch_id
        self.species: str = species
        self.substrate: str = substrate
        self.start_date: datetime = datetime.now()
        self.log_entries: List[Dict[str, Union[datetime, str, float]]] = []`,
            confidence: 92,
            language: 'python'
          });
        }

        if (selectedCode && selectedCode.includes('add_log_entry')) {
          mockSuggestions.push({
            id: '4',
            type: 'fix',
            title: 'Add Error Handling',
            description: 'Add try-catch block for robust error handling',
            code: `def add_log_entry(self, observation: str, temperature: float, humidity: float):
    """Add a cultivation observation log entry with error handling"""
    try:
        self.validate_environment_data(temperature, humidity)
        entry = {
            'timestamp': datetime.datetime.now(),
            'observation': observation,
            'temperature': temperature,
            'humidity': humidity
        }
        self.log_entries.append(entry)
        print(f"[{self.batch_id}] Logged: {observation}")
    except ValueError as e:
        print(f"[{self.batch_id}] Error: {e}")
        raise`,
            confidence: 90,
            language: 'python'
          });
        }
      }

      setSuggestions(mockSuggestions);
      setIsGenerating(false);
    }, 1000);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'completion': return <Code className="w-4 h-4 text-blue-500" />;
      case 'optimization': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'fix': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'enhancement': return <Lightbulb className="w-4 h-4 text-green-500" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'completion': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
      case 'optimization': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
      case 'fix': return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      case 'enhancement': return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const handleInsertCode = (code: string) => {
    if (onCodeInsert) {
      onCodeInsert(code);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <img 
          src="/crowe-avatar.png" 
          alt="Crowe Logic AI" 
          className="w-6 h-6 rounded-full"
        />
        <div>
          <div className="font-medium text-sm">Code Completion</div>
          <div className="text-xs text-muted-foreground">Powered by xAI Grok-4</div>
        </div>
        <Badge variant="secondary" className="text-xs ml-auto">
          {isGenerating ? 'Analyzing...' : 'Ready'}
        </Badge>
      </div>

      {!activeFile && (
        <Card className="p-4 text-center">
          <Brain className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Open a file to get AI-powered code suggestions
          </p>
        </Card>
      )}

      {activeFile && suggestions.length === 0 && !isGenerating && (
        <Card className="p-4 text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <p className="text-sm text-muted-foreground">
            No suggestions needed - your code looks great!
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={generateSuggestions}
          >
            <Wand2 className="w-3 h-3 mr-1" />
            Analyze Again
          </Button>
        </Card>
      )}

      {isGenerating && (
        <Card className="p-4 text-center">
          <div className="animate-spin w-6 h-6 mx-auto mb-2">
            <Brain className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-sm text-muted-foreground">
            Analyzing code with Grok-4...
          </p>
        </Card>
      )}

      <ScrollArea className="max-h-96 sidebar-scrollbar custom-scrollbar">
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className={`p-3 border ${getSuggestionColor(suggestion.type)}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getSuggestionIcon(suggestion.type)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{suggestion.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.confidence}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {suggestion.description}
                    </p>
                  </div>

                  <div className="bg-gray-900 rounded p-2 text-xs text-gray-100 font-mono overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{suggestion.code}</pre>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleInsertCode(suggestion.code)}
                      className="h-7 text-xs"
                    >
                      <ArrowRight className="w-3 h-3 mr-1" />
                      Insert
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(suggestion.code)}
                      className="h-7 text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {suggestions.length > 0 && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateSuggestions} 
          className="w-full"
        >
          <Wand2 className="w-3 h-3 mr-2" />
          Generate More Suggestions
        </Button>
      )}
    </div>
  );
}
