import React, { useLayoutEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { IDEHeader } from '@/components/ui/ide-components'
import { StreamingText, TypingIndicator, PulseIndicator, GradientText } from '@/components/ui/enhanced-ui'
import { useChat } from '@/hooks/useChat'
import { Send, User, Sparkles, Brain, MoreHorizontal } from 'lucide-react'
import type { Message } from '@/lib/chat-types'

interface EnhancedMessageRowProps {
  message: Message
  onCopy?: () => void
  onAbort?: () => void
}

function EnhancedMessageRow({ message, onCopy, onAbort }: EnhancedMessageRowProps) {
  const isUser = message.role === 'user'
  const isStreaming = message.loading || false
  
  return (
    <div className={`group flex gap-3 p-4 transition-colors hover:bg-muted/20 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        {isUser ? (
          <>
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600">
              <Brain className="h-4 w-4 text-white" />
            </AvatarFallback>
          </>
        )}
      </Avatar>
      
      <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className="flex items-center gap-2 mb-1">
          {!isUser && (
            <div className="flex items-center gap-2">
              <GradientText className="font-semibold text-sm">
                Crowe Logic AI
              </GradientText>
              <PulseIndicator 
                isActive={isStreaming} 
                color="blue" 
                size="sm"
              />
              {isStreaming && <Sparkles className="h-3 w-3 text-primary animate-pulse" />}
            </div>
          )}
          {isUser && (
            <span className="font-medium text-sm text-muted-foreground">You</span>
          )}
        </div>
        
        <div className={`
          rounded-2xl px-4 py-3 text-sm leading-relaxed
          ${isUser 
            ? 'bg-primary text-primary-foreground ml-8' 
            : 'bg-muted/50 mr-8 border border-border/50'
          }
        `}>
          {isStreaming ? (
            <StreamingText 
              text={message.content} 
              isComplete={false}
              className="font-medium"
            />
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>{message.timestamp}</span>
          
          {/* Action buttons for assistant messages */}
          {!isUser && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              {onCopy && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={onCopy}
                >
                  Copy
                </Button>
              )}
              {isStreaming && onAbort && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs text-destructive"
                  onClick={onAbort}
                >
                  Stop
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EnhancedChatInterface() {
  const { messages, isSending, send, setModel, abort } = useChat()
  const [input, setInput] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useLayoutEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSending) return
    send(input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    // Could add a toast here
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Enhanced Header */}
      <IDEHeader 
        title=""
        actions={
          <div className="flex items-center gap-2">
            <Select defaultValue="gpt-4" onValueChange={setModel}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
              </SelectContent>
            </Select>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        }
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600">
                <Brain className="h-4 w-4 text-white" />
              </AvatarFallback>
            </Avatar>
            <div>
              <GradientText className="font-semibold text-sm">
                Crowe Logic AI
              </GradientText>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <PulseIndicator isActive={true} color="green" size="sm" />
                <span>Mycology Expert Assistant</span>
              </div>
            </div>
          </div>
        </div>
      </IDEHeader>

      {/* Messages Area */}
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-1">
          {messages.map((message) => (
            <EnhancedMessageRow
              key={message.id}
              message={message}
              onCopy={() => handleCopy(message.content)}
              onAbort={message.loading ? abort : undefined}
            />
          ))}
          
          {/* Loading indicator */}
          {isSending && !messages.some(m => m.loading) && (
            <div className="flex gap-3 p-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600">
                  <Brain className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <GradientText className="font-semibold text-sm">
                    Crowe Logic AI
                  </GradientText>
                  <PulseIndicator isActive={true} color="blue" size="sm" />
                </div>
                <div className="bg-muted/50 rounded-2xl px-4 py-3 mr-8 border border-border/50">
                  <TypingIndicator />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Enhanced Input Area */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about cultivation, contamination, protocols, or any mycology question..."
                className="min-h-[60px] max-h-32 resize-none pr-12 focus:ring-2 focus:ring-primary/20"
                disabled={isSending}
              />
              <Button
                type="submit"
                size="sm"
                className="absolute bottom-2 right-2 h-8 w-8 p-0 rounded-full"
                disabled={!input.trim() || isSending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Press Enter to send, Shift+Enter for new line</span>
              {isSending && (
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs text-destructive"
                  onClick={abort}
                >
                  Stop Generation
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span>{input.length}/2000</span>
              <div className="flex items-center gap-1">
                <PulseIndicator isActive={true} color="green" size="sm" />
                <span>Connected</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
