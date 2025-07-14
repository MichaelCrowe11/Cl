"use client";

import { useRef, useLayoutEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2, Mic, Paperclip, Smile } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { MessageRow } from "@/components/MessageRow";
import { useToast } from "@/hooks/use-toast";

export default function ChatInterface() {
  const { messages, send, isSending, abort, setModel, model } = useChat();
  const [input, setInput] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useLayoutEffect(() => {
    scrollerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const handleSubmit = () => {
    if (!input.trim() || isSending) return;
    send(input.trim());
    setInput("");
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

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
        duration: 2000
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Copy failed",
        description: "Could not copy message to clipboard",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-background">
      {/* Model Selector Header */}
      <div className="p-4 border-b bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">AI Model:</span>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-muted-foreground">
            {messages.length} messages
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <MessageRow
              key={message.id}
              msg={message}
              onCopy={handleCopy}
              onAbort={abort}
            />
          ))}
          <div ref={scrollerRef} />
        </div>
      </ScrollArea>

      {/* Input Composer */}
      <div className="p-4 border-t bg-muted/30">
        <div className="relative">
          <Textarea
            placeholder="Speak or type your lab notes, questions, or commands..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[52px] max-h-40 pr-28 pl-10 py-3.5 resize-none"
            disabled={isSending}
          />
          
          {/* Left side buttons */}
          <div className="absolute top-1/2 left-3 transform -translate-y-1/2 flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Right side buttons */}
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Smile className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
              <Mic className="h-5 w-5" />
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="h-9 w-9 p-0" 
              size="icon" 
              disabled={!input.trim() || isSending}
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Crowe Logic AI can respond to voice commands. Click the microphone or start typing.
        </p>
      </div>
    </div>
  );
}
