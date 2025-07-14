"use client";

import { useRef, useLayoutEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, Brain, Book, AlertTriangle, Info } from "lucide-react";
import { useCroweLogicChat } from "@/hooks/use-crowe-logic-knowledge";
import { useToast } from "@/hooks/use-toast";
import { CroweLogicAvatar, CroweLogicAvatarCompact } from "@/components/crowe-logic-avatar";

export default function CroweLogicChatInterface() {
  const { chatHistory, processUserMessage, clearHistory, isLoading, error } = useCroweLogicChat();
  const [input, setInput] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useLayoutEffect(() => {
    scrollerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatHistory]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput("");
    
    try {
      await processUserMessage(userMessage);
    } catch (err) {
      console.error('Chat error:', err);
      toast({
        title: "Error",
        description: "Failed to process message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setInput("");
    }
  };

  const formatMessageContent = (content: string) => {
    // Convert markdown-style formatting to JSX
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/🚨 \*\*Important\*\*:/g, '<span class="text-red-600 font-bold">🚨 Important:</span>');
  };

  const getQuickActions = () => [
    { label: "CO₂ Levels", query: "What are the correct CO2 levels for fruiting?" },
    { label: "Contamination Help", query: "How do I identify and prevent contamination?" },
    { label: "Substrate Recipe", query: "Show me substrate recipes for lion's mane" },
    { label: "Alert Meanings", query: "What do the different alert colors mean?" },
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/20">
        <div className="flex items-center gap-3">
          <CroweLogicAvatar size={40} variant="circle" />
          <div>
            <h2 className="font-semibold text-lg text-foreground">
              Crowe Logic AI Assistant
            </h2>
            <p className="text-sm text-muted-foreground">
              Powered by CroweOS Systems Knowledge Base
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Book className="w-3 h-3 mr-1" />
            Knowledge Base Active
          </Badge>
          {error && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Error
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {chatHistory.length === 0 && (
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="w-4 h-4" />
                Quick Start - Ask About:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {getQuickActions().map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-left justify-start h-auto p-3"
                    onClick={() => setInput(action.query)}
                  >
                    <div>
                      <div className="font-medium text-sm">{action.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {action.query}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Show Crowe Logic avatar for assistant messages */}
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 mt-1">
                  <CroweLogicAvatarCompact size={32} />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900 border'
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatMessageContent(message.content)
                  }}
                />
                
                {/* Show knowledge sources for assistant messages */}
                {message.role === 'assistant' && message.knowledgeUsed && message.knowledgeUsed.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Knowledge sources:</div>
                    <div className="flex flex-wrap gap-1">
                      {message.knowledgeUsed.map((source, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {source.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4 border">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Crowe Logic is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={scrollerRef} />
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4 bg-white">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Crowe Logic about mushroom cultivation, environmental controls, troubleshooting..."
              className="min-h-[60px] max-h-[120px] resize-none"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[60px] w-[60px] bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        
        {chatHistory.length > 0 && (
          <div className="flex justify-between items-center mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="text-sm text-muted-foreground"
            >
              Clear conversation
            </Button>
            <div className="text-xs text-muted-foreground">
              {chatHistory.length} messages • Knowledge base integrated
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
